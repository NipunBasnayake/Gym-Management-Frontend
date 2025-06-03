import { useState, useEffect } from 'react'
import { Plus } from 'lucide-react'
import Sidebar from '../components/Sidebar.tsx'
import { addMember, getMembers, updateMember, deactivateMember, activateMember } from '../services/api'
import type {Member} from '../types'

export default function Members() {
    const [members, setMembers] = useState<Member[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [showForm, setShowForm] = useState(false)
    const [formData, setFormData] = useState<Member>({
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
    })

    useEffect(() => {
        fetchMembers()
    }, [])

    const fetchMembers = async () => {
        setLoading(true)
        try {
            const data = await getMembers()
            setMembers(data)
        } catch (err) {
            console.log(err)
            setError('Failed to fetch members')
        } finally {
            setLoading(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!formData.name || !formData.email || !formData.nicNumber) {
            setError('Name, email, and NIC number are required')
            return
        }
        try {
            setLoading(true)
            if (formData.memberId) {
                await updateMember(formData.memberId, formData)
            } else {
                await addMember(formData)
            }
            setShowForm(false)
            fetchMembers()
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
            })
        } catch (err) {
            console.log(err)
            setError('Failed to save member')
        } finally {
            setLoading(false)
        }
    }

    const handleEdit = (member: Member) => {
        setFormData(member)
        setShowForm(true)
    }

    const handleStatusToggle = async (member: Member) => {
        try {
            setLoading(true)
            if (member.activeStatus) {
                await deactivateMember(member.memberId!)
            } else {
                await activateMember(member.memberId!)
            }
            fetchMembers()
        } catch (err) {
            console.log(err)
            setError('Failed to update member status')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex flex-col md:flex-row min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900">
            <Sidebar />
            <div className="flex-1 p-4 md:p-8 pb-20 md:pb-8">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">Members</h1>
                    <button
                        onClick={() => setShowForm(true)}
                        className="bg-orange-500 text-white px-4 py-2 rounded-lg flex items-center"
                    >
                        <Plus className="w-5 h-5 mr-2" />
                        Add Member
                    </button>
                </div>

                {error && <div className="bg-red-100 text-red-600 p-3 rounded-lg mb-4">{error}</div>}

                {showForm && (
                    <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-lg mb-6">
                        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-4">
                            {formData.memberId ? 'Edit Member' : 'Add New Member'}
                        </h2>
                        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input
                                type="text"
                                placeholder="Name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="p-2 border rounded-lg dark:bg-slate-700 dark:text-slate-200"
                            />
                            <input
                                type="email"
                                placeholder="Email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="p-2 border rounded-lg dark:bg-slate-700 dark:text-slate-200"
                            />
                            <input
                                type="text"
                                placeholder="NIC Number"
                                value={formData.nicNumber}
                                onChange={(e) => setFormData({ ...formData, nicNumber: e.target.value })}
                                className="p-2 border rounded-lg dark:bg-slate-700 dark:text-slate-200"
                            />
                            <input
                                type="number"
                                placeholder="Age"
                                value={formData.age}
                                onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) })}
                                className="p-2 border rounded-lg dark:bg-slate-700 dark:text-slate-200"
                            />
                            <input
                                type="number"
                                placeholder="Height (cm)"
                                value={formData.height}
                                onChange={(e) => setFormData({ ...formData, height: parseFloat(e.target.value) })}
                                className="p-2 border rounded-lg dark:bg-slate-700 dark:text-slate-200"
                            />
                            <input
                                type="number"
                                placeholder="Weight (kg)"
                                value={formData.weight}
                                onChange={(e) => setFormData({ ...formData, weight: parseFloat(e.target.value) })}
                                className="p-2 border rounded-lg dark:bg-slate-700 dark:text-slate-200"
                            />
                            <input
                                type="text"
                                placeholder="Address"
                                value={formData.address}
                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                className="p-2 border rounded-lg dark:bg-slate-700 dark:text-slate-200"
                            />
                            <input
                                type="date"
                                placeholder="Membership Start Date"
                                value={formData.membershipStartDate}
                                onChange={(e) => setFormData({ ...formData, membershipStartDate: e.target.value })}
                                className="p-2 border rounded-lg dark:bg-slate-700 dark:text-slate-200"
                            />
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
                                <th>Name</th>
                                <th>Email</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {members.map((member) => (
                                <tr key={member.memberId} className="border-t dark:border-slate-700">
                                    <td className="py-2">{member.name}</td>
                                    <td>{member.email}</td>
                                    <td>
                      <span
                          className={`px-2 py-1 rounded-full text-sm ${
                              member.activeStatus
                                  ? 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400'
                                  : 'bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-400'
                          }`}
                      >
                        {member.activeStatus ? 'Active' : 'Inactive'}
                      </span>
                                    </td>
                                    <td>
                                        <button
                                            onClick={() => handleEdit(member)}
                                            className="text-blue-600 dark:text-blue-400 mr-2"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleStatusToggle(member)}
                                            className="text-orange-600 dark:text-orange-400"
                                        >
                                            {member.activeStatus ? 'Deactivate' : 'Activate'}
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