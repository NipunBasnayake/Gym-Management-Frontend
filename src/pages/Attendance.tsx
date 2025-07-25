import {useState, useEffect, useMemo} from 'react';
import {Search, Filter, Calendar, Clock, UserCheck} from 'lucide-react';
import {toast, ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {type IDetectedBarcode} from '@yudiel/react-qr-scanner';
import Sidebar from '../components/Sidebar.tsx';
import QRScannerModal from '../components/QRScannerModal.tsx';
import {addAttendance, getAttendances} from '../services/api';
import type {Attendance} from '../types';

export default function Attendance() {
    const [attendances, setAttendances] = useState<Attendance[]>([]);
    const [loading, setLoading] = useState(false);
    const [showFilters, setShowFilters] = useState(false);
    const [timeFilter, setTimeFilter] = useState<'today' | 'thisWeek' | 'thisMonth' | 'all'>('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [dateFilter, setDateFilter] = useState({startDate: '', endDate: ''});
    const [showCamera, setShowCamera] = useState(false);

    useEffect(() => {
        fetchAttendances();
    }, []);

    const fetchAttendances = async () => {
        setLoading(true);
        try {
            const attendanceData = await getAttendances();
            const formattedAttendances: Attendance[] = attendanceData.map((att: Attendance) => ({
                ...att,
                name: att.name || 'N/A',
                mobileNumber: att.mobileNumber || 'N/A',
                nicNumber: att.nicNumber || 'N/A',
                timeOut: att.timeOut || 'N/A',
            }));
            setAttendances(formattedAttendances);
        } catch (error) {
            console.error('Error fetching attendances:', error);
            toast.error('Failed to fetch attendance records', {position: 'top-right'});
        } finally {
            setLoading(false);
        }
    };

    const handleQRScan = async (detectedCodes: IDetectedBarcode[]) => {
        if (!detectedCodes || detectedCodes.length === 0) {
            toast.error('No QR code detected', {position: 'top-right'});
            return;
        }

        const data = detectedCodes[0].rawValue;
        if (!data) {
            toast.error('Invalid QR code data', {position: 'top-right'});
            return;
        }

        const memberIdMatch = data.match(/memberId:\s*([a-f0-9]{24})/i);
        if (memberIdMatch) {
            const memberId = memberIdMatch[1];
            try {
                await addAttendance(memberId, {
                    timeIn: new Date().toISOString(),
                    timeOut: null,
                    status: 'Present',
                });
                toast.success(`Attendance recorded for member ID ${memberId}`, { position: 'top-right' });
                fetchAttendances();
            } catch (error) {
                if (error instanceof Error && error.message === 'Already marked in and out') {
                    toast.info('Time in and out already recorded.', { position: 'top-right' });
                } else {
                    console.error('Unexpected error recording attendance:', error);
                    toast.error('Something went wrong');
                }
            }
        } else {
            toast.error('Member ID not found in QR code', { position: 'top-right' });
        }
        setShowCamera(false);

    };

    const handleScanButtonClick = () => {
        setShowCamera(true);
    };

    const filteredAttendances = useMemo(() => {
        let filtered = [...attendances];

        const now = new Date();
        if (timeFilter === 'today') {
            const today = now.toISOString().split('T')[0];
            filtered = filtered.filter((att) => att.date === today);
        } else if (timeFilter === 'thisWeek') {
            const weekStart = new Date(now);
            weekStart.setDate(now.getDate() - now.getDay());
            const weekEnd = new Date(now);
            weekEnd.setDate(now.getDate() - now.getDay() + 6);
            filtered = filtered.filter((att) => {
                const attDate = new Date(att.date);
                return attDate >= weekStart && attDate <= weekEnd;
            });
        } else if (timeFilter === 'thisMonth') {
            const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
            const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);
            filtered = filtered.filter((att) => {
                const attDate = new Date(att.date);
                return attDate >= monthStart && attDate <= monthEnd;
            });
        }

        if (searchTerm) {
            filtered = filtered.filter(
                (att) =>
                    att.memberId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    (att.nicNumber || 'N/A').toLowerCase().includes(searchTerm.toLowerCase()) ||
                    (att.mobileNumber || 'N/A').toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Date range filter
        if (dateFilter.startDate || dateFilter.endDate) {
            filtered = filtered.filter((att) => {
                const attDate = new Date(att.date);
                const startDate = dateFilter.startDate ? new Date(dateFilter.startDate) : null;
                const endDate = dateFilter.endDate ? new Date(dateFilter.endDate) : null;

                if (startDate && endDate) {
                    return attDate >= startDate && attDate <= endDate;
                } else if (startDate) {
                    return attDate >= startDate;
                } else if (endDate) {
                    return attDate <= endDate;
                }
                return true;
            });
        }

        return filtered;
    }, [attendances, searchTerm, dateFilter, timeFilter]);

    const clearFilters = () => {
        setSearchTerm('');
        setDateFilter({startDate: '', endDate: ''});
        setTimeFilter('all');
    };

    const hasActiveFilters = searchTerm || dateFilter.startDate || dateFilter.endDate || timeFilter !== 'all';

    const renderTable = (attendancesToShow: Attendance[]) => (
        <div className="overflow-x-auto h-full">
            <table className="w-full min-w-[640px] h-full">
                <thead>
                <tr className="bg-slate-50 dark:bg-slate-700/50 border-b dark:border-slate-600">
                    <th className="py-4 px-6 text-left text-sm font-semibold text-slate-700 dark:text-slate-200 uppercase tracking-wider">
                        Member
                    </th>
                    <th className="py-4 px-6 text-left text-sm font-semibold text-slate-700 dark:text-slate-200 uppercase tracking-wider hidden sm:table-cell">
                        NIC Number
                    </th>
                    <th className="py-4 px-6 text-left text-sm font-semibold text-slate-700 dark:text-slate-200 uppercase tracking-wider hidden sm:table-cell">
                        Mobile Number
                    </th>
                    <th className="py-4 px-6 text-left text-sm font-semibold text-slate-700 dark:text-slate-200 uppercase tracking-wider">
                        Date
                    </th>
                    <th className="py-4 px-6 text-left text-sm font-semibold text-slate-700 dark:text-slate-200 uppercase tracking-wider">
                        Time In
                    </th>
                    <th className="py-4 px-6 text-left text-sm font-semibold text-slate-700 dark:text-slate-200 uppercase tracking-wider">
                        Time Out
                    </th>
                </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                {attendancesToShow.map((att, index) => (
                    <tr
                        key={att.attendanceId}
                        className={`hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors ${
                            index % 2 === 0 ? 'bg-white dark:bg-slate-800' : 'bg-slate-50/50 dark:bg-slate-800/50'
                        }`}
                    >
                        <td className="py-4 px-6">
                            <div className="flex items-center gap-2 font-medium text-slate-900 dark:text-white">
                                {att.name || 'N/A'}
                            </div>
                        </td>
                        <td className="py-4 px-6 hidden sm:table-cell">
                            <div className="text-slate-600 dark:text-slate-300 font-mono text-sm">
                                {att.nicNumber || 'N/A'}
                            </div>
                        </td>
                        <td className="py-4 px-6 hidden sm:table-cell">
                            <div className="text-slate-600 dark:text-slate-300 font-mono text-sm">
                                {att.mobileNumber || 'N/A'}
                            </div>
                        </td>
                        <td className="py-4 px-6">
                            <div className="text-slate-600 dark:text-slate-300">
                                {new Date(att.date).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric',
                                })}
                            </div>
                        </td>
                        <td className="py-4 px-6">
                            <div className="text-slate-600 dark:text-slate-300">
                                {new Date(att.timeIn).toLocaleTimeString('en-US', {hour: '2-digit', minute: '2-digit'})}
                            </div>
                        </td>
                        <td className="py-4 px-6">
                            <div className="text-slate-600 dark:text-slate-300">
                                {att.timeOut && att.timeOut !== 'N/A' ? new Date(att.timeOut).toLocaleTimeString('en-US', {
                                    hour: '2-digit',
                                    minute: '2-digit'
                                }) : 'N/A'}
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
                {/* Header Section */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl sm:text-4xl font-bold text-slate-800 dark:text-white mb-2">Attendance</h1>
                        <p className="text-slate-600 dark:text-slate-300 flex items-center gap-2">
                            <Clock className="w-4 h-4"/>
                            {filteredAttendances.length} of {attendances.length} attendance records shown
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
                            onClick={handleScanButtonClick}
                            disabled={loading}
                            className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-6 py-3 rounded-xl flex items-center shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 dark:shadow-orange-500/25 disabled:opacity-50"
                        >
                            <UserCheck className="w-5 h-5 mr-2"/>
                            Scan Attendance
                        </button>
                    </div>
                </div>

                {/* QR Scanner Modal */}
                {showCamera && <QRScannerModal onScan={handleQRScan} onClose={() => setShowCamera(false)}/>}

                {/* Filters Section */}
                {showFilters && (
                    <div
                        className="bg-white dark:bg-slate-800 border dark:border-slate-700 rounded-2xl shadow-lg p-6 mb-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="relative">
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Search by Member
                                </label>
                                <div className="relative">
                                    <Search
                                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4"/>
                                    <input
                                        type="text"
                                        placeholder="Search by ID, name, NIC, or mobile..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Time Period
                                </label>
                                <select
                                    value={timeFilter}
                                    onChange={(e) => setTimeFilter(e.target.value as 'today' | 'thisWeek' | 'thisMonth' | 'all')}
                                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                >
                                    <option value="all">All Time</option>
                                    <option value="today">Today</option>
                                    <option value="thisWeek">This Week</option>
                                    <option value="thisMonth">This Month</option>
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
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    <Calendar className="inline w-4 h-4 mr-1"/>
                                    To Date
                                </label>
                                <input
                                    type="date"
                                    value={dateFilter.endDate}
                                    onChange={(e) => setDateFilter((prev) => ({...prev, endDate: e.target.value}))}
                                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                />
                            </div>
                        </div>
                        {hasActiveFilters && (
                            <div className="flex justify-between items-center mt-4 pt-4 border-t dark:border-slate-700">
                                <span className="text-sm text-slate-600 dark:text-slate-400">
                                    Showing {filteredAttendances.length} of {attendances.length} attendance records
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

                {/* Attendance Table */}
                <div
                    className="bg-white dark:bg-slate-800 border dark:border-slate-700 rounded-2xl shadow-xl dark:shadow-slate-900/50 overflow-hidden">
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
                            <span className="ml-3 text-slate-600 dark:text-slate-300">Loading attendance...</span>
                        </div>
                    ) : filteredAttendances.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="text-slate-400 dark:text-slate-500 mb-4">
                                {hasActiveFilters ? (
                                    <Filter className="w-16 h-16 mx-auto mb-4 opacity-50"/>
                                ) : (
                                    <Clock className="w-16 h-16 mx-auto mb-4 opacity-50"/>
                                )}
                            </div>
                            <h3 className="text-xl font-semibold text-slate-600 dark:text-slate-300 mb-2">
                                {hasActiveFilters ? 'No attendance records match your filters' : 'No attendance records found'}
                            </h3>
                            <p className="text-slate-500 dark:text-slate-400 mb-4">
                                {hasActiveFilters ? 'Try adjusting your search criteria or clear filters' : 'Scan a QR code to record attendance'}
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
                        renderTable(filteredAttendances)
                    )}
                </div>
            </div>
        </div>
    );
}