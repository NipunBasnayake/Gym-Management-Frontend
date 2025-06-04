import React, { useState, useEffect } from 'react'
import { Plus } from 'lucide-react'
import Sidebar from '../components/Sidebar.tsx'
import { addAttendance, getAttendances } from '../services/api'
import type {Attendance} from '../types'

export default function Attendance() {
    const [attendances, setAttendances] = useState<Attendance[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [showForm, setShowForm] = useState(false)
    const [formData, setFormData] = useState<Attendance>({
        memberId: 0,
        date: '',
        timeIn: '',
    })

    useEffect(() => {
        (async () => {
            await fetchAttendances()
        })()
    }, [])


    const fetchAttendances = async () => {
        setLoading(true)
        try {
            const data = await getAttendances()
            setAttendances(data)
        } catch (err) {
            setError('Failed to fetch attendances')
            console.log(err)
        }
        finally {
            setLoading(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!formData.memberId || !formData.date || !formData.timeIn) {
            setError('Member ID, date, and time in are required')
            return
        }
        try {
            setLoading(true)
            await addAttendance(formData)
            setShowForm(false)
            await fetchAttendances()
            setFormData({ memberId: 0, date: '', timeIn: '' })
        } catch (err) {
            setError('Failed to add attendance')
            console.log(err)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex flex-col md:flex-row min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900">
            <Sidebar />
            <div className="flex-1 p-4 md:p-8 pb-20 md:pb-8">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">Attendance</h1>
                    <button
                        onClick={() => setShowForm(true)}
                        className="bg-orange-500 text-white px-4 py-2 rounded-lg flex items-center"
                    >
                        <Plus className="w-5 h-5 mr-2" />
                        Add Attendance
                    </button>
                </div>

                {error && <div className="bg-red-100 text-red-600 p-3 rounded-lg mb-4">{error}</div>}

                {showForm && (
                    <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-lg mb-6">
                        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-4">Add Attendance</h2>
                        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input
                                type="number"
                                placeholder="Member ID"
                                value={formData.memberId}
                                onChange={(e) => {
                                    const value = parseInt(e.target.value)
                                    setFormData({
                                        ...formData,
                                        memberId: isNaN(value) ? 0 : value,
                                    })
                                }}
                                className="p-2 border rounded-lg dark:bg-slate-700 dark:text-slate-200"
                            />
                            <input
                                type="date"
                                placeholder="Date"
                                value={formData.date}
                                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                className="p-2 border rounded-lg dark:bg-slate-700 dark:text-slate-200"
                            />
                            <input
                                type="time"
                                placeholder="Time In"
                                value={formData.timeIn}
                                onChange={(e) => setFormData({ ...formData, timeIn: e.target.value })}
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
                                <th>Member ID</th>
                                <th>Date</th>
                                <th>Time In</th>
                            </tr>
                            </thead>
                            <tbody>
                            {attendances.map((attendance) => (
                                <tr key={attendance.attendanceId} className="border-t dark:border-slate-700">
                                    <td className="py-2">{attendance.memberId}</td>
                                    <td>{attendance.date}</td>
                                    <td>{attendance.timeIn}</td>
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