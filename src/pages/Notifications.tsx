import {useState, useEffect, useMemo} from 'react';
import {Bell, Check, Trash2} from 'lucide-react';
import {toast, ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Sidebar from '../components/Sidebar.tsx';
import {getNotifications, markNotificationAsRead, deleteNotification} from '../services/api';
import type {Notification} from '../types';

export default function Notifications() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState<'unread' | 'read'>('unread');

    useEffect(() => {
        (async () => {
            await fetchNotifications();
        })();
    }, []);

    const fetchNotifications = async () => {
        setLoading(true);
        try {
            const data = await getNotifications();
            const normalizedData = data
                .map((notif: Notification) => ({
                    ...notif,
                    isRead: notif.read ?? notif.isRead ?? false,
                }))
                .sort((a: Notification, b: Notification) =>
                    new Date(b.dateCreated).getTime() - new Date(a.dateCreated).getTime()
                );
            setNotifications(normalizedData);
        } catch (err) {
            console.error('Fetch notifications error:', err);
            toast.error('Failed to fetch notifications', {position: 'top-right'});
        } finally {
            setLoading(false);
        }
    };

    const handleMarkAsRead = async (id: string) => {
        try {
            setLoading(true);
            await markNotificationAsRead(id);
            await fetchNotifications();
            toast.success('Notification marked as read', {position: 'top-right'});
        } catch (err) {
            console.error('Mark as read error:', err);
            toast.error('Failed to mark notification as read', {position: 'top-right'});
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            setLoading(true);
            await deleteNotification(id);
            await fetchNotifications();
            toast.success('Notification deleted successfully', {position: 'top-right'});
        } catch (err) {
            console.error('Delete notification error:', err);
            toast.error('Failed to delete notification', {position: 'top-right'});
        } finally {
            setLoading(false);
        }
    };

    const filteredNotifications = useMemo(() => {
        return notifications.filter((notification) =>
            activeTab === 'unread' ? !notification.isRead : notification.isRead
        );
    }, [notifications, activeTab]);

    const renderTable = (notificationsToShow: Notification[]) => (
        <div
            className="overflow-x-auto max-h-[70vh] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-600">

            <table className="w-full min-w-[640px] h-full">
                <thead>
                <tr className="bg-slate-50 dark:bg-slate-700/50 border-b dark:border-slate-600">
                    <th className="py-4 px-6 text-left text-sm font-semibold text-slate-700 dark:text-slate-200 uppercase tracking-wider">
                        Message
                    </th>
                    <th className="py-4 px-6 text-left text-sm font-semibold text-slate-700 dark:text-slate-200 uppercase tracking-wider">
                        Type
                    </th>
                    <th className="py-4 px-6 text-left text-sm font-semibold text-slate-700 dark:text-slate-200 uppercase tracking-wider hidden sm:table-cell">
                        Date Created
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
                {notificationsToShow.map((notification, index) => (
                    <tr
                        key={notification.notificationId}
                        className={`hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors ${
                            index % 2 === 0 ? 'bg-white dark:bg-slate-800' : 'bg-slate-50/50 dark:bg-slate-800/50'
                        }`}
                    >
                        <td className="py-4 px-6">
                            <div className="font-medium text-slate-900 dark:text-white">
                                {notification.message}
                            </div>
                        </td>
                        <td className="py-4 px-6">
                            <div className="text-slate-600 dark:text-slate-300">
                                {notification.type}
                            </div>
                        </td>
                        <td className="py-4 px-6 hidden sm:table-cell">
                            <div className="text-slate-600 dark:text-slate-300">
                                {notification.dateCreated
                                    ? new Date(notification.dateCreated).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'short',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                    })
                                    : '-'}
                            </div>
                        </td>
                        <td className="py-4 px-6">
                            <span
                                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                                    notification.isRead
                                        ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300 border border-green-200 dark:border-green-800'
                                        : 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300 border border-red-200 dark:border-red-800'
                                }`}
                            >
                                <div
                                    className={`w-2 h-2 rounded-full mr-2 ${
                                        notification.isRead ? 'bg-green-500 dark:bg-green-400' : 'bg-red-500 dark:bg-red-400'
                                    }`}
                                />
                                {notification.isRead ? 'Read' : 'Unread'}
                            </span>
                        </td>
                        <td className="py-4 px-6">
                            <div className="flex items-center gap-2">
                                {!notification.isRead && (
                                    <button
                                        onClick={() => handleMarkAsRead(notification.notificationId!)}
                                        className="p-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/50 rounded-lg transition-all duration-200"
                                        title="Mark as Read"
                                    >
                                        <Check className="w-4 h-4 sm:w-5 sm:h-5"/>
                                    </button>
                                )}
                                <button
                                    onClick={() => handleDelete(notification.notificationId!)}
                                    className="p-2 text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/50 rounded-lg transition-all duration-200"
                                    title="Delete Notification"
                                >
                                    <Trash2 className="w-4 h-4 sm:w-5 sm:h-5"/>
                                </button>
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
            className="flex flex-col md:flex-row min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 overflow-y-auto">
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
                            Notifications
                        </h1>
                        <p className="text-slate-600 dark:text-slate-300 flex items-center gap-2">
                            <Bell className="w-4 h-4"/>
                            {filteredNotifications.length} of {notifications.length} notifications shown
                        </p>
                    </div>
                </div>

                {/* Tabs */}
                <div className="mb-6">
                    <div className="border-b border-slate-200 dark:border-slate-700">
                        <nav className="-mb-px flex space-x-8">
                            <button
                                className={`${
                                    activeTab === 'unread'
                                        ? 'border-orange-500 text-orange-600 dark:text-orange-400'
                                        : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:border-slate-300 dark:hover:border-slate-600'
                                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                                onClick={() => setActiveTab('unread')}
                            >
                                Unread Notifications
                            </button>
                            <button
                                className={`${
                                    activeTab === 'read'
                                        ? 'border-orange-500 text-orange-600 dark:text-orange-400'
                                        : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:border-slate-300 dark:hover:border-slate-600'
                                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                                onClick={() => setActiveTab('read')}
                            >
                                Read Notifications
                            </button>
                        </nav>
                    </div>
                </div>

                {/* Notifications Table */}
                <div
                    className="bg-white dark:bg-slate-800 border dark:border-slate-700 rounded-2xl shadow-xl dark:shadow-slate-900/50 overflow-hidden">
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
                            <span className="ml-3 text-slate-600 dark:text-slate-300">Loading notifications...</span>
                        </div>
                    ) : filteredNotifications.length === 0 ? (
                        <div className="text-center py-12">
                            <Bell className="w-16 h-16 mx-auto mb-4 opacity-50"/>
                            <h3 className="text-xl font-semibold text-slate-600 dark:text-slate-300 mb-2">
                                No {activeTab} notifications found
                            </h3>
                            <p className="text-slate-500 dark:text-slate-400 mb-4">
                                {activeTab === 'unread'
                                    ? 'You have no unread notifications'
                                    : 'You have no read notifications'}
                            </p>
                        </div>
                    ) : (
                        renderTable(filteredNotifications)
                    )}
                </div>
            </div>
        </div>
    );
}