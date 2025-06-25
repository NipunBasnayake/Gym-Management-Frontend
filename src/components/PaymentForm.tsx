import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import type { Payment, Member } from '../types'
import { getMembers } from '../services/api'

interface PaymentFormProps {
    formData: Payment
    onSubmit: (data: Payment) => void
    onCancel: () => void
    loading: boolean
}

export default function PaymentForm({ formData, onSubmit, onCancel, loading }: PaymentFormProps) {
    const [data, setData] = useState<Payment>({ ...formData })
    const [members, setMembers] = useState<Member[]>([])
    const [searchTerm, setSearchTerm] = useState('')
    const [showDropdown, setShowDropdown] = useState(false)

    // Set default values for new payments
    useEffect(() => {
        if (!formData.paymentId) {
            const today = new Date().toISOString().split('T')[0]
            const validUntil = new Date()
            validUntil.setDate(validUntil.getDate() + 30)
            setData({
                ...data,
                amount: 2000,
                paymentDate: today,
                validUntilDate: validUntil.toISOString().split('T')[0],
                paymentStatus: 'Completed'
            })
        }
    }, [formData.paymentId])

    // Fetch members for dropdown
    useEffect(() => {
        (async () => {
            try {
                const response = await getMembers()
                setMembers(response)
            } catch (err) {
                console.error(err)
                toast.error('Failed to fetch members', { position: 'top-right' })
            }
        })()
    }, [])

    // Update validUntilDate when paymentDate changes
    useEffect(() => {
        if (data.paymentDate) {
            const paymentDate = new Date(data.paymentDate)
            const validUntil = new Date(paymentDate)
            validUntil.setDate(paymentDate.getDate() + 30)
            setData({ ...data, validUntilDate: validUntil.toISOString().split('T')[0] })
        }
    }, [data.paymentDate])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!data.memberId || !data.amount || !data.paymentStatus) {
            toast.error('Member ID, amount, and payment status are required', { position: 'top-right' })
            return
        }
        onSubmit(data)
    }

    const filteredMembers = members.filter(member =>
        `${member.memberId} - ${member.name}`.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const handleMemberSelect = (member: Member) => {
        if (!member.memberId) {
            toast.error('Selected member has no ID')
            return
        }

        const numericId = parseInt(member.memberId)
        if (isNaN(numericId)) {
            toast.error('Member ID is not a valid number')
            return
        }

        setSearchTerm(`${member.memberId} - ${member.name}`)
        setShowDropdown(false)
    }


    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-lg max-w-lg w-full">
                <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-4">
                    {formData.paymentId ? 'Edit Payment' : 'Add Payment'}
                </h2>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
                    <div className="flex flex-col gap-1 relative">
                        <label htmlFor="member" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Member
                        </label>
                        <input
                            id="member"
                            type="text"
                            placeholder="Search by ID or Name"
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value)
                                setShowDropdown(true)
                            }}
                            onFocus={() => setShowDropdown(true)}
                            className="p-2 border rounded-lg dark:bg-slate-700 dark:text-slate-200 w-full"
                        />
                        {showDropdown && searchTerm && (
                            <ul className="absolute z-20 top-16 w-full bg-white dark:bg-slate-700 border rounded-lg max-h-60 overflow-y-auto">
                                {filteredMembers.length > 0 ? (
                                    filteredMembers.map(member => (
                                        <li
                                            key={member.memberId}
                                            onClick={() => handleMemberSelect(member)}
                                            className="p-2 hover:bg-gray-100 dark:hover:bg-slate-600 cursor-pointer"
                                        >
                                            {member.memberId} - {member.name}
                                        </li>
                                    ))
                                ) : (
                                    <li className="p-2 text-gray-500 dark:text-gray-400">No members found</li>
                                )}
                            </ul>
                        )}
                    </div>

                    <div className="flex flex-col gap-1">
                        <label htmlFor="amount" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Amount (LKR)
                        </label>
                        <input
                            id="amount"
                            type="number"
                            step="0.01"
                            placeholder="Enter amount"
                            value={data.amount}
                            onChange={(e) => setData({ ...data, amount: parseFloat(e.target.value) })}
                            className="p-2 border rounded-lg dark:bg-slate-700 dark:text-slate-200 w-full"
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label htmlFor="paymentDate" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Payment Date
                        </label>
                        <input
                            id="paymentDate"
                            type="date"
                            value={data.paymentDate}
                            onChange={(e) => setData({ ...data, paymentDate: e.target.value })}
                            className="p-2 border rounded-lg dark:bg-slate-700 dark:text-slate-200 w-full"
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label htmlFor="validUntilDate" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Valid Until
                        </label>
                        <input
                            id="validUntilDate"
                            type="date"
                            value={data.validUntilDate}
                            readOnly
                            className="p-2 border rounded-lg dark:bg-slate-700 dark:text-slate-200 w-full opacity-75"
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label htmlFor="paymentStatus" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Payment Status
                        </label>
                        <select
                            id="paymentStatus"
                            value={data.paymentStatus}
                            onChange={(e) => setData({ ...data, paymentStatus: e.target.value })}
                            className="p-2 border rounded-lg dark:bg-slate-700 dark:text-slate-200 w-full"
                        >
                            <option value="">Select Status</option>
                            <option value="Completed">Completed</option>
                            <option value="Pending">Pending</option>
                            <option value="Failed">Failed</option>
                        </select>
                    </div>

                    <div className="flex justify-end gap-4">
                        <button
                            type="button"
                            onClick={onCancel}
                            className="px-4 py-2 bg-gray-200 dark:bg-slate-600 rounded-lg hover:bg-gray-300 dark:hover:bg-slate-500 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 bg-orange-500 text-white rounded-lg disabled:opacity-50 hover:bg-orange-600 transition-colors"
                        >
                            {loading ? 'Saving...' : 'Save'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}