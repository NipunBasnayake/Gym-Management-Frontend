import React, { useState, useEffect } from 'react'
import { Plus } from 'lucide-react'
import Sidebar from '../components/Sidebar.tsx'
import { addNotification, getNotifications, markNotificationAsRead, deleteNotification } from '../services/api'
import type {Notification} from '../types'

export default function Notifications() {
    const [notifications, setNotifications] = useState<Notification[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [showForm, setShowForm] = useState(false)
    const [formData, setFormData] = useState<Notification>({
        message: '',
        dateCreated: '',
        isRead: false,
        type: '',
    })

    useEffect(() => {
        (async () => {
            await fetchNotifications()
        })()
    }, [])


    const fetchNotifications = async () => {
        setLoading(true)
        try {
            const data = await getNotifications()
            setNotifications(data)
        } catch (err) {
            console.log(err)
            setError('Failed to fetch notifications')
        } finally {
            setLoading(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!formData.message || !formData.type) {
            setError('Message and type are required')
            return
        }
        try {
            setLoading(true)
            await addNotification(formData)
            setShowForm(false)
            await fetchNotifications()
            setFormData({ message: '', dateCreated: '', isRead: false, type: '' })
        } catch (err) {
            console.log(err)
            setError('Failed to add notification')
        } finally {
            setLoading(false)
        }
    }

    const handleMarkAsRead = async (id: number) => {
        try {
            setLoading(true)
            await markNotificationAsRead(id)
            await fetchNotifications()
        } catch (err) {
            console.log(err)
            setError('Failed to mark notification as read')
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (id: number) => {
        try {
            setLoading(true)
            await deleteNotification(id)
            await fetchNotifications()
        } catch (err) {
            console.log(err)
            setError('Failed to delete notification')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex flex-col md:flex-row min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900">
            <Sidebar />
            <div className="flex-1 p-4 md:p-8 pb-20 md:pb-8">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">Notifications</h1>
                    <button
                        onClick={() => setShowForm(true)}
                        className="bg-orange-500 text-white px-4 py-2 rounded-lg flex items-center"
                    >
                        <Plus className="w-5 h-5 mr-2" />
                        Add Notification
                    </button>
                </div>

                {error && <div className="bg-red-100 text-red-600 p-3 rounded-lg mb-4">{error}</div>}

                {showForm && (
                    <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-lg mb-6">
                        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-4">Add Notification</h2>
                        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input
                                type="text"
                                placeholder="Message"
                                value={formData.message}
                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                className="p-2 border rounded-lg dark:bg-slate-700 dark:text-slate-200"
                            />
                            <input
                                type="text"
                                placeholder="Type"
                                value={formData.type}
                                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
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
                                <th>Message</th>
                                <th>Type</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {notifications.map((notification) => (
                                <tr key={notification.notificationId} className="border-t dark:border-slate-700">
                                    <td className="py-2">{notification.message}</td>
                                    <td>{notification.type}</td>
                                    <td>
                      <span
                          className={`px-2 py-1 rounded-full text-sm ${
                              notification.isRead
                                  ? 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400'
                                  : 'bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-400'
                          }`}
                      >
                        {notification.isRead ? 'Read' : 'Unread'}
                      </span>
                                    </td>
                                    <td>
                                        {!notification.isRead && (
                                            <button
                                                onClick={() => handleMarkAsRead(notification.notificationId!)}
                                                className="text-blue-600 dark:text-blue-400 mr-2"
                                            >
                                                Mark as Read
                                            </button>
                                        )}
                                        <button
                                            onClick={() => handleDelete(notification.notificationId!)}
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