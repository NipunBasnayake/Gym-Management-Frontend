import { useState, useEffect } from 'react'
import { Plus } from 'lucide-react'
import Sidebar from '../components/Sidebar.tsx'
import PaymentForm from '../components/PaymentForm.tsx'
import { addPayment, getPayments, updatePayment, deletePayment } from '../services/api'
import type { Payment } from '../types'

export default function Payments() {
    const [payments, setPayments] = useState<Payment[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [showForm, setShowForm] = useState(false)
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

    useEffect(() => {
        (async () => {
            await fetchPayments()
        })()
    }, [])

    const fetchPayments = async () => {
        setLoading(true)
        try {
            const data = await getPayments()
            setPayments(data)
        } catch (err) {
            console.log(err)
            setError('Failed to fetch payments')
        } finally {
            setLoading(false)
        }
    }

    const handleSubmit = async (data: Payment) => {
        try {
            setLoading(true)
            if (data.paymentId) {
                await updatePayment(data.paymentId, data)
            } else {
                await addPayment(data)
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
            setError('Failed to save payment')
        } finally {
            setLoading(false)
        }
    }

    const handleEdit = (payment: Payment) => {
        setFormData(payment)
        setShowForm(true)
    }

    const handleDelete = async (id: number) => {
        try {
            setLoading(true)
            await deletePayment(id)
            await fetchPayments()
        } catch (err) {
            console.log(err)
            setError('Failed to delete payment')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex flex-col md:flex-row min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900">
            <Sidebar />
            <div className="flex-1 p-4 sm:p-6 md:p-8">
                {/* Header Section */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl sm:text-4xl font-bold text-slate-800 dark:text-white mb-2">
                            Payments
                        </h1>
                        <p className="text-slate-600 dark:text-slate-300 flex items-center gap-2">
                            <span>{payments.length} payment records</span>
                        </p>
                    </div>
                    <button
                        onClick={() => setShowForm(true)}
                        className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-6 py-3 rounded-xl flex items-center shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 dark:shadow-orange-500/25"
                    >
                        <Plus className="w-5 h-5 mr-2" />
                        Add Payment
                    </button>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400 p-4 rounded-2xl mb-6 border border-red-200 dark:border-red-800">
                        {error}
                    </div>
                )}

                {/* Payment Form */}
                {showForm && (
                    <div className="bg-white dark:bg-slate-800 border dark:border-slate-700 rounded-2xl shadow-lg p-6 mb-6">
                        <PaymentForm
                            formData={formData}
                            onSubmit={handleSubmit}
                            onCancel={() => setShowForm(false)}
                            loading={loading}
                        />
                    </div>
                )}

                {/* Payments Table */}
                <div className="bg-white dark:bg-slate-800 border dark:border-slate-700 rounded-2xl shadow-xl dark:shadow-slate-900/50 overflow-hidden">
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
                            <span className="ml-3 text-slate-600 dark:text-slate-300">Loading payments...</span>
                        </div>
                    ) : payments.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="text-slate-400 dark:text-slate-500 mb-4">
                                <span className="w-16 h-16 mx-auto mb-4">💸</span>
                            </div>
                            <h3 className="text-xl font-semibold text-slate-600 dark:text-slate-300 mb-2">
                                No payment records found
                            </h3>
                            <p className="text-slate-500 dark:text-slate-400 mb-4">
                                Add a new payment to get started
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[640px]">
                                <thead>
                                <tr className="bg-slate-50 dark:bg-slate-700/50 border-b dark:border-slate-600">
                                    <th className="py-4 px-6 text-left text-sm font-semibold text-slate-700 dark:text-slate-200 uppercase tracking-wider">
                                        Member ID
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
                                        Status
                                    </th>
                                    <th className="py-4 px-6 text-left text-sm font-semibold text-slate-700 dark:text-slate-200 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                                {payments.map((payment, index) => (
                                    <tr
                                        key={payment.paymentId}
                                        className={`hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors ${
                                            index % 2 === 0 ? 'bg-white dark:bg-slate-800' : 'bg-slate-50/50 dark:bg-slate-800/50'
                                        }`}
                                    >
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-2 font-medium text-slate-900 dark:text-white">
                                                <div className="bg-orange-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold shadow">
                                                    {payment.memberId.toString().slice(-2)}
                                                </div>
                                                <span>{payment.memberId}</span>
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
                                        <td className="py-4 px-6">
                                            <button
                                                onClick={() => handleEdit(payment)}
                                                className="text-orange-600 dark:text-orange-400 hover:text-orange-800 dark:hover:text-orange-300 font-medium mr-4"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(payment.paymentId!)}
                                                className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 font-medium"
                                            >
                                                Delete
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