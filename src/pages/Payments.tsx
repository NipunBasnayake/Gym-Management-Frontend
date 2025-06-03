import { useState, useEffect } from 'react'
import { Plus } from 'lucide-react'
import Sidebar from '../components/ui/Sidebar'
import { addPayment, getPayments, updatePayment, deletePayment } from '../services/api'
import type {Payment} from '../types'

export default function Payments() {
    const [payments, setPayments] = useState<Payment[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [showForm, setShowForm] = useState(false)
    const [formData, setFormData] = useState<Payment>({
        memberId: 0,
        amount: 0,
        paymentDate: '',
        validUntilDate: '',
        paymentStatus: '',
    })

    useEffect(() => {
        fetchPayments()
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!formData.memberId || !formData.amount || !formData.paymentStatus) {
            setError('Member ID, amount, and payment status are required')
            return
        }
        try {
            setLoading(true)
            if (formData.paymentId) {
                await updatePayment(formData.paymentId, formData)
            } else {
                await addPayment(formData)
            }
            setShowForm(false)
            fetchPayments()
            setFormData({ memberId: 0, amount: 0, paymentDate: '', validUntilDate: '', paymentStatus: '' })
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
            fetchPayments()
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
            <div className="flex-1 p-4 md:p-8 pb-20 md:pb-8">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">Payments</h1>
                    <button
                        onClick={() => setShowForm(true)}
                        className="bg-orange-500 text-white px-4 py-2 rounded-lg flex items-center"
                    >
                        <Plus className="w-5 h-5 mr-2" />
                        Add Payment
                    </button>
                </div>

                {error && <div className="bg-red-100 text-red-600 p-3 rounded-lg mb-4">{error}</div>}

                {showForm && (
                    <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-lg mb-6">
                        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-4">
                            {formData.paymentId ? 'Edit Payment' : 'Add Payment'}
                        </h2>
                        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input
                                type="number"
                                placeholder="Member ID"
                                value={formData.memberId}
                                onChange={(e) => setFormData({ ...formData, memberId: parseInt(e.target.value) })}
                                className="p-2 border rounded-lg dark:bg-slate-700 dark:text-slate-200"
                            />
                            <input
                                type="number"
                                placeholder="Amount"
                                value={formData.amount}
                                onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) })}
                                className="p-2 border rounded-lg dark:bg-slate-700 dark:text-slate-200"
                            />
                            <input
                                type="date"
                                placeholder="Payment Date"
                                value={formData.paymentDate}
                                onChange={(e) => setFormData({ ...formData, paymentDate: e.target.value })}
                                className="p-2 border rounded-lg dark:bg-slate-700 dark:text-slate-200"
                            />
                            <input
                                type="date"
                                placeholder="Valid Until"
                                value={formData.validUntilDate}
                                onChange={(e) => setFormData({ ...formData, validUntilDate: e.target.value })}
                                className="p-2 border rounded-lg dark:bg-slate-700 dark:text-slate-200"
                            />
                            <select
                                value={formData.paymentStatus}
                                onChange={(e) => setFormData({ ...formData, paymentStatus: e.target.value })}
                                className="p-2 border rounded-lg dark:bg-slate-700 dark:text-slate-200"
                            >
                                <option value="">Select Status</option>
                                <option value="Completed">Completed</option>
                                <option value="Pending">Pending</option>
                                <option value="Failed">Failed</option>
                            </select>
                            <div className="md:col-span-2 flex justify-end gap-4">
                                <button
                                    type="button"
                                    onClick={() => setShowForm(false)}
                                    className="px-4 py-2 bg-gray-200 dark:bg-slate-600 rounded-lg"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="px-4 py-2 bg-orange-500 text-white rounded-lg disabled:opacity-50"
                                >
                                    {loading ? 'Saving...' : 'Save'}
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6">
                    {loading ? (
                        <div>Loading...</div>
                    ) : (
                        <table className="w-full">
                            <thead>
                            <tr className="text-left text-slate-600 dark:text-slate-400">
                                <th>Member ID</th>
                                <th>Amount</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {payments.map((payment) => (
                                <tr key={payment.paymentId} className="border-t dark:border-slate-700">
                                    <td className="py-2">{payment.memberId}</td>
                                    <td>${payment.amount.toFixed(2)}</td>
                                    <td>
                      <span
                          className={`px-2 py-1 rounded-full text-sm ${
                              payment.paymentStatus === 'Completed'
                                  ? 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400'
                                  : 'bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-400'
                          }`}
                      >
                        {payment.paymentStatus}
                      </span>
                                    </td>
                                    <td>
                                        <button
                                            onClick={() => handleEdit(payment)}
                                            className="text-blue-600 dark:text-blue-400 mr-2"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(payment.paymentId!)}
                                            className="text-red-600 dark:text-red-400"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    )
}