import {useState, useEffect} from 'react'
import {Edit2, Plus, Filter, Calendar, Search} from 'lucide-react'
import Sidebar from '../components/Sidebar.tsx'
import PaymentForm from '../components/PaymentForm.tsx'
import {addPayment, getPayments, updatePayment, getMemberById} from '../services/api'
import type {Payment, Member} from '../types'
import {toast, ToastContainer} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

interface EnhancedPayment extends Payment {
    memberName?: string
}

export default function Payments() {
    const [payments, setPayments] = useState<EnhancedPayment[]>([])
    const [filteredPayments, setFilteredPayments] = useState<EnhancedPayment[]>([])
    const [memberCache, setMemberCache] = useState<Map<number, Member>>(new Map())
    const [loading, setLoading] = useState(false)
    const [error] = useState('')
    const [showForm, setShowForm] = useState(false)
    const [showFilters, setShowFilters] = useState(false)
    const [formData, setFormData] = useState<Payment>({
        memberId: 0,
        amount: 2000,
        paymentDate: new Date().toISOString().split('T')[0],
        validUntilDate: (() => {
            const date = new Date()
            date.setDate(date.getDate() + 30)
            return date.toISOString().split('T')[0]
        })(),
        paymentStatus: 'Completed'
    })
    const [filterMonth, setFilterMonth] = useState<string>(
        new Date().toISOString().slice(0, 7)
    )
    const [searchDate, setSearchDate] = useState<string>('')

    const fetchMemberData = async (memberId: number): Promise<Member> => {
        if (memberCache.has(memberId)) {
            return memberCache.get(memberId)!
        }
        try {
            const member = await getMemberById(memberId)
            setMemberCache(prev => new Map(prev).set(memberId, member))
            return member
        } catch (err) {
            console.error('Error fetching member data:', err)
            throw new Error(`memberId ${memberId} not found`)
        }
    }

    useEffect(() => {
        (async () => {
            await fetchPayments()
        })()
    }, [])

    useEffect(() => {
        const filtered = payments.filter(payment => {
            const paymentDate = new Date(payment.paymentDate)
            const matchesMonth = filterMonth
                ? paymentDate.toISOString().slice(0, 7) === filterMonth
                : true
            const matchesSearch = searchDate
                ? payment.paymentDate.startsWith(searchDate)
                : true
            return matchesMonth && matchesSearch
        })
        setFilteredPayments(filtered)
    }, [payments, filterMonth, searchDate])

    const fetchPayments = async () => {
        setLoading(true)
        try {
            const data = await getPayments()
            const enhancedData = await Promise.all(
                data.map(async (payment: Payment) => {
                    try {
                        const member = await fetchMemberData(payment.memberId)
                        return {
                            ...payment,
                            memberName: member.name
                        }
                    } catch (err) {
                        console.log(err)
                        return {
                            ...payment,
                            memberName: 'Unknown'
                        }
                    }
                })
            )
            setPayments(enhancedData)
        } catch (err) {
            console.log(err)
            toast.error('Failed to fetch payments', {position: 'top-right'})
        } finally {
            setLoading(false)
        }
    }

    const handleSubmit = async (data: Payment) => {
        try {
            setLoading(true)
            if (data.paymentId) {
                await updatePayment(data.paymentId, data)
                toast.success('Payment updated successfully', {position: 'top-right'})
            } else {
                await addPayment(data)
                toast.success('Payment added successfully', {position: 'top-right'})
            }
            setShowForm(false)
            await fetchPayments()
            setFormData({
                memberId: 0,
                amount: 2000,
                paymentDate: new Date().toISOString().split('T')[0],
                validUntilDate: (() => {
                    const date = new Date()
                    date.setDate(date.getDate() + 30)
                    return date.toISOString().split('T')[0]
                })(),
                paymentStatus: 'Completed'
            })
        } catch (err) {
            console.log(err)
            toast.error('Failed to save payment', {position: 'top-right'})
        } finally {
            setLoading(false)
        }
    }

    const handleEdit = (payment: Payment) => {
        setFormData(payment)
        setShowForm(true)
    }

    const clearFilters = () => {
        setFilterMonth(new Date().toISOString().slice(0, 7))
        setSearchDate('')
    }

    const hasActiveFilters = filterMonth !== new Date().toISOString().slice(0, 7) || searchDate

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
                        <h1 className="text-3xl sm:text-4xl font-bold text-slate-800 dark:text-white mb-2">
                            Payments
                        </h1>
                        <p className="text-slate-600 dark:text-slate-300 flex items-center gap-2">
                            <span>{filteredPayments.length} of {payments.length} payment records shown</span>
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
                                <span className="ml-2 bg-blue-500 text-white text-xs rounded-full px-2 py-0.5">
                                    Active
                                </span>
                            )}
                        </button>
                        <button
                            onClick={() => setShowForm(true)}
                            className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-6 py-3 rounded-xl flex items-center shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 dark:shadow-orange-500/25"
                        >
                            <Plus className="w-5 h-5 mr-2"/>
                            Add Payment
                        </button>
                    </div>
                </div>

                {/* Filters Section */}
                {showFilters && (
                    <div
                        className="bg-white dark:bg-slate-800 border dark:border-slate-700 rounded-2xl shadow-lg p-6 mb-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    <Calendar className="inline w-4 h-4 mr-1"/>
                                    Filter by Month
                                </label>
                                <input
                                    type="month"
                                    value={filterMonth}
                                    onChange={(e) => setFilterMonth(e.target.value)}
                                    className="w-full p-2 rounded-lg border dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                />
                            </div>
                            <div className="relative">
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    <Calendar className="inline w-4 h-4 mr-1"/>
                                    Search by Date
                                </label>
                                <div className="relative">
                                    <Search
                                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4"/>
                                    <input
                                        type="date"
                                        value={searchDate}
                                        onChange={(e) => setSearchDate(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                    />
                                </div>
                            </div>
                        </div>
                        {hasActiveFilters && (
                            <div className="flex justify-between items-center mt-4 pt-4 border-t dark:border-slate-700">
                                <span className="text-sm text-slate-600 dark:text-slate-400">
                                    Showing {filteredPayments.length} of {payments.length} payments
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

                {/* Error Message */}
                {error && (
                    <div
                        className="bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400 p-4 rounded-2xl mb-6 border border-red-200 dark:border-red-800">
                        {error}
                    </div>
                )}

                {/* Payment Form */}
                {showForm && (
                    <div
                        className="bg-white dark:bg-slate-800 border dark:border-slate-700 rounded-2xl shadow-lg p-6 mb-6">
                        <PaymentForm
                            formData={formData}
                            onSubmit={handleSubmit}
                            onCancel={() => setShowForm(false)}
                            loading={loading}
                        />
                    </div>
                )}

                {/* Payments Table */}
                <div
                    className="bg-white dark:bg-slate-800 border dark:border-slate-700 rounded-2xl shadow-xl dark:shadow-slate-900/50 overflow-hidden">
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
                            <span className="ml-3 text-slate-600 dark:text-slate-300">Loading payments...</span>
                        </div>
                    ) : filteredPayments.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="text-slate-400 dark:text-slate-500 mb-4">
                                {hasActiveFilters ? (
                                    <Filter className="w-16 h-16 mx-auto mb-4 opacity-50"/>
                                ) : (
                                    <span className="w-16 h-16 mx-auto mb-4">💸</span>
                                )}
                            </div>
                            <h3 className="text-xl font-semibold text-slate-600 dark:text-slate-300 mb-2">
                                {hasActiveFilters ? 'No payments match your filters' : 'No payment records found'}
                            </h3>
                            <p className="text-slate-500 dark:text-slate-400 mb-4">
                                {hasActiveFilters
                                    ? 'Try adjusting your search criteria or clear filters'
                                    : 'Add a new payment to get started'}
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
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[640px]">
                                <thead>
                                <tr className="bg-slate-50 dark:bg-slate-700/50 border-b dark:border-slate-600">
                                    <th className="py-4 px-6 text-left text-sm font-semibold text-slate-700 dark:text-slate-200 uppercase tracking-wider">
                                        Member
                                    </th>
                                    <th className="py-4 px-6 text-left text-sm font-semibold text-slate-700 dark:text-slate-200 uppercase tracking-wider">
                                        Amount
                                    </th>
                                    <th className="py-4 px-6 text-left text-sm font-semibold text-slate-700 dark:text-slate-200 uppercase tracking-wider">
                                        Payment Date
                                    </th>
                                    <th className="py-4 px-6 text-left text-sm font-semibold text-slate-700 dark:text-slate-200 uppercase tracking-wider">
                                        Valid Until
                                    </th>
                                    <th className="py-4 px-6 text-left text-sm font-semibold text-slate-700 dark:text-slate-200 uppercase tracking-wider">
                                        Payment Status
                                    </th>
                                    <th className="py-4 px-6 text-left text-sm font-semibold text-slate-700 dark:text-slate-200 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                                {filteredPayments.map((payment, index) => (
                                    <tr
                                        key={payment.paymentId}
                                        className={`hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors ${
                                            index % 2 === 0 ? 'bg-white dark:bg-slate-800' : 'bg-slate-50/50 dark:bg-slate-800/50'
                                        }`}
                                    >
                                        <td className="py-4 px-6">
                                            <div
                                                className="flex items-center gap-2 font-medium text-slate-900 dark:text-white">
                                                <div
                                                    className="bg-orange-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold shadow">
                                                    {payment.memberId.toString().slice(-2)}
                                                </div>
                                                <span>{`${payment.memberName || 'Unknown'}`}</span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6 text-slate-600 dark:text-slate-300">
                                            LKR {payment.amount.toFixed(2)}
                                        </td>
                                        <td className="py-4 px-6 text-slate-600 dark:text-slate-300">
                                            {new Date(payment.paymentDate).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric',
                                            })}
                                        </td>
                                        <td className="py-4 px-6 text-slate-600 dark:text-slate-300">
                                            {new Date(payment.validUntilDate).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric',
                                            })}
                                        </td>
                                        <td className="py-4 px-6">
                                                <span
                                                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                                                        payment.paymentStatus === 'Completed'
                                                            ? 'bg-green-100 text-green-600 dark:bg-green-900/50 dark:text-green-400'
                                                            : payment.paymentStatus === 'Pending'
                                                                ? 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/50 dark:text-yellow-400'
                                                                : 'bg-red-100 text-red-600 dark:bg-red-900/50 dark:text-red-400'
                                                    }`}
                                                >
                                                    {payment.paymentStatus}
                                                </span>
                                        </td>
                                        <td className="py-4 px-6 justify-center">
                                            <button
                                                onClick={() => handleEdit(payment)}
                                                className="text-orange-600 dark:text-orange-400 hover:text-orange-800 dark:hover:text-orange-300 font-medium mr-4"
                                            >
                                                <Edit2 className="w-4 h-4 sm:w-5 sm:h-5"/>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}