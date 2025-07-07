import {useState, useEffect, useMemo} from 'react';
import {Plus, Edit2, X, Search, Filter, Calendar, Users, UserCheck, UserX, Mail} from 'lucide-react';
import {toast, ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Sidebar from '../components/Sidebar.tsx';
import {addMember, getMembers, updateMember, deactivateMember, activateMember, sendQRCodeEmail} from '../services/api';
import type {Member} from '../types';
import MemberForm from '../components/MemberForm.tsx';
import QRCode from 'qrcode';

// Confirmation Modal Component
const ConfirmationModal = ({
                               isOpen,
                               message,
                               onConfirm,
                               onCancel,
                           }: {
    isOpen: boolean;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div
                className="bg-white dark:bg-slate-800 border dark:border-slate-700 p-6 rounded-2xl shadow-2xl w-full max-w-md">
                <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-4">Confirm Action</h2>
                <p className="text-slate-600 dark:text-slate-300 mb-6">{message}</p>
                <div className="flex justify-end gap-3">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-all"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 bg-orange-500 text-white hover:bg-orange-600 rounded-lg transition-all"
                    >
                        Confirm
                    </button>
                </div>
            </div>
        </div>
    );
};

export default function Members() {
    const [members, setMembers] = useState<Member[]>([]);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState<Member | null>(null);
    const [openDropdown, setOpenDropdown] = useState<string | null>(null); // Fixed naming
    const [activeTab, setActiveTab] = useState<'active' | 'deactivated'>('active');
    // Confirmation modal state
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [confirmMessage, setConfirmMessage] = useState('');
    const [confirmAction, setConfirmAction] = useState<(() => void) | null>(null);

    // Filtering states
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
    const [dateFilter, setDateFilter] = useState({
        startDate: '',
        endDate: '',
    });
    const [showFilters, setShowFilters] = useState(false);

    useEffect(() => {
        (async () => {
            await fetchMembers();
        })();
    }, []);

    const fetchMembers = async () => {
        setLoading(true);
        try {
            const data = await getMembers();
            setMembers(data);
        } catch (err) {
            console.log(err);
            toast.error('Failed to fetch members', {position: 'top-right'});
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (data: Member) => {
        if (!data.name || !data.email || !data.nicNumber) {
            toast.error('Name, email, and NIC number are required', {position: 'top-right'});
            return;
        }
        try {
            setLoading(true);
            if (data.memberId) {
                await updateMember(data.memberId, data);
                toast.success('Member updated successfully', {position: 'top-right'});
            } else {
                await addMember(data);
                toast.success('Member added successfully', {position: 'top-right'});
            }
            setShowModal(false);
            setFormData(null);
            await fetchMembers();
        } catch (err) {
            console.log(err);
            toast.error('Failed to save member', {position: 'top-right'});
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (member: Member) => {
        setFormData(member);
        setShowModal(true);
        setOpenDropdown(null);
    };

    const handleStatusToggle = (member: Member) => {
        setConfirmMessage(
            `Are you sure you want to ${member.activeStatus ? 'deactivate' : 'activate'} ${member.name}?`
        );
        setConfirmAction(() => async () => {
            try {
                setLoading(true);
                if (member.activeStatus) {
                    await deactivateMember(member.memberId!);
                    toast.success('Member deactivated', {position: 'top-right'});
                } else {
                    await activateMember(member.memberId!);
                    toast.success('Member activated', {position: 'top-right'});
                }
                await fetchMembers();
            } catch (err) {
                console.log(err);
                toast.error('Failed to update member status', {position: 'top-right'});
            } finally {
                setLoading(false);
                setShowConfirmModal(false);
                setOpenDropdown(null);
            }
        });
        setShowConfirmModal(true);
    };

    const handleSendQRToEmail = (member: Member) => {
        if (!member.email) {
            toast.error('Email address not found for this member', {position: 'top-right'});
            return;
        }

        setConfirmMessage(`Are you sure you want to send the QR code to ${member.email}?`);
        setConfirmAction(() => async () => {
            try {
                setLoading(true);
                const qrData = `memberId: ${member.memberId}\nnic: ${member.nicNumber}\nmobileNumber: ${member.mobileNumber}\nemail: ${member.email}`;
                const qrCodeDataURL = await QRCode.toDataURL(qrData);

                await sendQRCodeEmail({
                    name: member.name,
                    email: member.email,
                    qrCode: qrCodeDataURL,
                });

                toast.success(`QR code sent to ${member.email}`, {position: 'top-right'});
            } catch (error) {
                console.error(error);
                toast.error('Failed to send QR code email', {position: 'top-right'});
            } finally {
                setLoading(false);
                setShowConfirmModal(false);
                setOpenDropdown(null);
            }
        });
        setShowConfirmModal(true);
    };

    const filteredMembers = useMemo(() => {
        let filtered = [...members];

        // Apply tab-based filtering first
        filtered = filtered.filter(member => activeTab === 'active' ? member.activeStatus : !member.activeStatus);

        // Search filter
        if (searchTerm) {
            filtered = filtered.filter(
                (member) =>
                    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    member.nicNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    (member.mobileNumber && member.mobileNumber.toLowerCase().includes(searchTerm.toLowerCase()))
            );
        }

        // Date range filter
        if (dateFilter.startDate || dateFilter.endDate) {
            filtered = filtered.filter((member) => {
                if (!member.membershipStartDate) return false;
                const memberDate = new Date(member.membershipStartDate);
                const startDate = dateFilter.startDate ? new Date(dateFilter.startDate) : null;
                const endDate = dateFilter.endDate ? new Date(dateFilter.endDate) : null;

                if (startDate && endDate) {
                    return memberDate >= startDate && memberDate <= endDate;
                } else if (startDate) {
                    return memberDate >= startDate;
                } else if (endDate) {
                    return memberDate <= endDate;
                }
                return true;
            });
        }

        return filtered;
    }, [members, searchTerm, dateFilter, activeTab]);

    const clearFilters = () => {
        setSearchTerm('');
        setStatusFilter('all');
        setDateFilter({startDate: '', endDate: ''});
    };

    const hasActiveFilters = searchTerm || statusFilter !== 'all' || dateFilter.startDate || dateFilter.endDate;

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = () => {
            setOpenDropdown(null);
        };
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    const renderTable = (membersToShow: Member[]) => (
        <div className="overflow-auto max-h-[70vh]">
            <table className="w-full min-w-[640px]">
                <thead>
                <tr className="bg-slate-50 dark:bg-slate-700/50 border-b dark:border-slate-600">
                    <th className="py-4 px-6 text-left text-sm font-semibold text-slate-700 dark:text-slate-200 uppercase tracking-wider">
                        Name
                    </th>
                    <th className="py-4 px-6 text-left text-sm font-semibold text-slate-700 dark:text-slate-200 uppercase tracking-wider hidden sm:table-cell">
                        Mobile Number
                    </th>
                    <th className="py-4 px-6 text-left text-sm font-semibold text-slate-700 dark:text-slate-200 uppercase tracking-wider">
                        Email
                    </th>
                    <th className="py-4 px-6 text-left text-sm font-semibold text-slate-700 dark:text-slate-200 uppercase tracking-wider hidden sm:table-cell">
                        NIC Number
                    </th>
                    <th className="py-4 px-6 text-left text-sm font-semibold text-slate-700 dark:text-slate-200 uppercase tracking-wider hidden md:table-cell">
                        Age
                    </th>
                    <th className="py-4 px-6 text-left text-sm font-semibold text-slate-700 dark:text-slate-200 uppercase tracking-wider hidden lg:table-cell">
                        Membership Start
                    </th>
                    <th className="py-4 px-6 text-left text-sm font-semibold text-slate-700 dark:text-slate-200 uppercase tracking-wider">
                        Status
                    </th>
                    <th className="py-4 px-6 text-left text-sm font-semibold text-slate-700 dark:text-slate-200 uppercase tracking-wider">
                        Actions
                    </th>
                </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                {membersToShow.map((member, index) => (
                    <tr
                        key={member.memberId}
                        className={`hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors ${
                            index % 2 === 0 ? 'bg-white dark:bg-slate-800' : 'bg-slate-50/50 dark:bg-slate-800/50'
                        }`}
                    >
                        <td className="py-4 px-6">
                            <div className="font-medium text-slate-900 dark:text-white">{member.name}</div>
                        </td>
                        <td className="py-4 px-6 hidden sm:table-cell">
                            <div className="text-slate-600 dark:text-slate-300 font-mono text-sm">
                                {member.mobileNumber || '-'}
                            </div>
                        </td>
                        <td className="py-4 px-6">
                            <div className="text-slate-600 dark:text-slate-300">{member.email}</div>
                        </td>
                        <td className="py-4 px-6 hidden sm:table-cell">
                            <div
                                className="text-slate-600 dark:text-slate-300 font-mono text-sm">{member.nicNumber}</div>
                        </td>
                        <td className="py-4 px-6 hidden md:table-cell">
                            <div className="text-slate-600 dark:text-slate-300">{member.age}</div>
                        </td>
                        <td className="py-4 px-6 hidden lg:table-cell">
                            <div className="text-slate-600 dark:text-slate-300">
                                {member.membershipStartDate
                                    ? new Date(member.membershipStartDate).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'short',
                                        day: 'numeric',
                                    })
                                    : '-'}
                            </div>
                        </td>
                        <td className="py-4 px-6">
                <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        member.activeStatus
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300 border border-green-200 dark:border-green-800'
                            : 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300 border border-red-200 dark:border-red-800'
                    }`}
                >
                  <div
                      className={`w-2 h-2 rounded-full mr-2 ${
                          member.activeStatus ? 'bg-green-500 dark:bg-green-400' : 'bg-red-500 dark:bg-red-400'
                      }`}
                  />
                    {member.activeStatus ? 'Active' : 'Inactive'}
                </span>
                        </td>
                        <td className="py-4 px-6">
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => handleEdit(member)}
                                    className="p-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/50 rounded-lg transition-all duration-200"
                                    title="Edit Member"
                                >
                                    <Edit2 className="w-4 h-4 sm:w-5 sm:h-5"/>
                                </button>
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => handleStatusToggle(member)}
                                        title={member.activeStatus ? 'Deactivate Member' : 'Activate Member'}
                                        className={`p-2 rounded-lg transition-all duration-200 hover:bg-slate-100 dark:hover:bg-slate-700 ${
                                            member.activeStatus
                                                ? 'text-red-600 dark:text-red-400'
                                                : 'text-green-600 dark:text-green-400'
                                        }`}
                                    >
                                        {member.activeStatus ? <UserX className="w-5 h-5"/> :
                                            <UserCheck className="w-5 h-5"/>}
                                    </button>
                                    <button
                                        onClick={() => handleSendQRToEmail(member)}
                                        title="Send QR to Email"
                                        className="p-2 text-blue-600 dark:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-all duration-200"
                                    >
                                        <Mail className="w-5 h-5"/>
                                    </button>
                                </div>
                            </div>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );

    return (
        <div
            className="flex flex-col md:flex-row min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900">
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                closeOnClick
                pauseOnHover
                theme="colored"
                toastClassName="dark:bg-slate-800 dark:text-white"
            />
            <Sidebar/>
            <div className="flex-1 p-4 sm:p-6 md:p-8">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl sm:text-4xl font-bold text-slate-800 dark:text-white mb-2">Members</h1>
                        <p className="text-slate-600 dark:text-slate-300 flex items-center gap-2">
                            <Users className="w-4 h-4"/>
                            {filteredMembers.length} of {members.length} members shown
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className={`px-4 py-2 rounded-xl flex items-center transition-all duration-200 ${
                                hasActiveFilters
                                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
                                    : 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                            }`}
                        >
                            <Filter className="w-4 h-4 mr-2"/>
                            Filters
                            {hasActiveFilters && (
                                <span
                                    className="ml-2 bg-blue-500 text-white text-xs rounded-full px-2 py-0.5">Active</span>
                            )}
                        </button>
                        <button
                            onClick={() => {
                                setFormData({
                                    name: '',
                                    age: 0,
                                    height: 0,
                                    weight: 0,
                                    nicNumber: '',
                                    email: '',
                                    address: '',
                                    qrCodeData: '',
                                    fingerprintData: '',
                                    faceImageData: '',
                                    membershipStartDate: '',
                                    activeStatus: true,
                                });
                                setShowModal(true);
                            }}
                            className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-6 py-3 rounded-xl flex items-center shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 dark:shadow-orange-500/25"
                        >
                            <Plus className="w-5 h-5 mr-2"/>
                            Add Member
                        </button>
                    </div>
                </div>

                {showFilters && (
                    <div
                        className="bg-white dark:bg-slate-800 border dark:border-slate-700 rounded-2xl shadow-lg p-6 mb-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div className="relative">
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Search Members
                                </label>
                                <div className="relative">
                                    <Search
                                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4"/>
                                    <input
                                        type="text"
                                        placeholder="Name, email, NIC, or mobile..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                    />
                                </div>
                            </div>
                            <div>
                                <label
                                    className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Status</label>
                                <select
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value as 'all' | 'active' | 'inactive')}
                                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                >
                                    <option value="all">All Members</option>
                                    <option value="active">Active Only</option>
                                    <option value="inactive">Inactive Only</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    <Calendar className="inline w-4 h-4 mr-1"/>
                                    From Date
                                </label>
                                <input
                                    type="date"
                                    value={dateFilter.startDate}
                                    onChange={(e) => setDateFilter((prev) => ({...prev, startDate: e.target.value}))}
                                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                />
                            </div>
                        </div>
                        {hasActiveFilters && (
                            <div className="flex justify-between items-center mt-4 pt-4 border-t dark:border-slate-700">
                <span className="text-sm text-slate-600 dark:text-slate-400">
                  Showing {filteredMembers.length} of {members.length} members
                </span>
                                <button
                                    onClick={clearFilters}
                                    className="text-sm text-orange-600 dark:text-orange-400 hover:text-orange-800 dark:hover:text-orange-300 font-medium"
                                >
                                    Clear All Filters
                                </button>
                            </div>
                        )}
                    </div>
                )}

                <ConfirmationModal
                    isOpen={showConfirmModal}
                    message={confirmMessage}
                    onConfirm={() => confirmAction && confirmAction()} // Added null check
                    onCancel={() => setShowConfirmModal(false)}
                />

                {showModal && formData && (
                    <div
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                        <div
                            className="bg-white dark:bg-slate-800 border dark:border-slate-700 p-6 rounded-2xl shadow-2xl w-full max-w-md sm:max-w-lg max-h-[90vh] overflow-y-auto">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
                                    {formData.memberId ? 'Edit Member' : 'Add New Member'}
                                </h2>
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                                >
                                    <X className="w-6 h-6"/>
                                </button>
                            </div>
                            <MemberForm
                                formData={formData}
                                onSubmit={handleSubmit}
                                onCancel={() => setShowModal(false)}
                                loading={loading}
                            />
                        </div>
                    </div>
                )}

                <div className="mb-6">
                    <div className="border-b border-slate-200 dark:border-slate-700">
                        <nav className="-mb-px flex space-x-8">
                            <button
                                className={`${
                                    activeTab === 'active'
                                        ? 'border-orange-500 text-orange-600 dark:text-orange-400'
                                        : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:border-slate-300 dark:hover:border-slate-600'
                                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                                onClick={() => setActiveTab('active')}
                            >
                                Active Members
                            </button>
                            <button
                                className={`${
                                    activeTab === 'deactivated'
                                        ? 'border-orange-500 text-orange-600 dark:text-orange-400'
                                        : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:border-slate-300 dark:hover:border-slate-600'
                                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                                onClick={() => setActiveTab('deactivated')}
                            >
                                Deactivated Members
                            </button>
                        </nav>
                    </div>
                </div>

                <div
                    className="bg-white dark:bg-slate-800 border dark:border-slate-700 rounded-2xl shadow-xl dark:shadow-slate-900/50 overflow-hidden">
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
                            <span className="ml-3 text-slate-600 dark:text-slate-300">Loading members...</span>
                        </div>
                    ) : filteredMembers.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="text-slate-400 dark:text-slate-500 mb-4">
                                {hasActiveFilters ? (
                                    <Filter className="w-16 h-16 mx-auto mb-4 opacity-50"/>
                                ) : (
                                    <Plus className="w-16 h-16 mx-auto mb-4 opacity-50"/>
                                )}
                            </div>
                            <h3 className="text-xl font-semibold text-slate-600 dark:text-slate-300 mb-2">
                                {hasActiveFilters ? 'No members match your filters' : `No ${activeTab} members found`}
                            </h3>
                            <p className="text-slate-500 dark:text-slate-400 mb- 4">
                                {hasActiveFilters
                                    ? 'Try adjusting your search criteria or clear filters'
                                    : `Get started by adding your first ${activeTab} member`}
                            </p>
                            {hasActiveFilters && (
                                <button
                                    onClick={clearFilters}
                                    className="text-orange-600 dark:text-orange-400 hover:text-orange-800 dark:hover:text-orange-300 font-medium"
                                >
                                    Clear Filters
                                </button>
                            )}
                        </div>
                    ) : (
                        renderTable(filteredMembers)
                    )}
                </div>
            </div>
        </div>
    );
}