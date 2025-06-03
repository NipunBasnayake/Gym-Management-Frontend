import { QrCode, Users, Calendar, CreditCard, BarChart, Dumbbell } from 'lucide-react'
import Sidebar from '../components/ui/Sidebar'
import { useState } from 'react'

export default function Dashboard() {
    const [isScanning, setIsScanning] = useState(false)

    const handleScan = () => {
        setIsScanning(true)
        setTimeout(() => setIsScanning(false), 2000)
    }

    return (
        <div className="flex flex-col md:flex-row min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900">
            <Sidebar />
            <div className="flex-1 p-4 md:p-8 pb-20 md:pb-8">
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-slate-100 mb-2">Dashboard</h1>
                            <p className="text-slate-600 dark:text-slate-400">Welcome back! Here's what's happening at your gym today.</p>
                        </div>
                        <div className="hidden md:block">
                            <div className="bg-white dark:bg-slate-800 rounded-lg px-4 py-2 shadow-sm border border-slate-200 dark:border-slate-700">
                                <span className="text-sm text-slate-600 dark:text-slate-400">Today:</span>
                                <span className="ml-2 font-semibold text-slate-800 dark:text-slate-200">June 3, 2025</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
                    <div className="lg:col-span-1">
                        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl shadow-xl p-6 md:p-8 text-white h-full min-h-[350px] flex flex-col items-center justify-center relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
                            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>
                            <div className="relative z-10 text-center">
                                <div className="p-4 rounded-full bg-white/20 backdrop-blur-sm mb-6 mx-auto w-fit">
                                    <QrCode className="w-12 h-12 md:w-16 md:h-16" />
                                </div>
                                <h2 className="text-xl md:text-2xl font-bold mb-3">Quick Check-In</h2>
                                <p className="text-orange-100 mb-6 text-sm md:text-base">Scan QR code for instant attendance tracking</p>
                                <button
                                    onClick={handleScan}
                                    disabled={isScanning}
                                    className="bg-white text-orange-600 px-6 py-3 rounded-xl font-semibold hover:bg-orange-50 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50"
                                >
                                    {isScanning ? 'Scanning...' : 'Start Scanning'}
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-2">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-slate-200 dark:border-slate-700 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                                        <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <span className="text-sm font-medium text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-400 px-2 py-1 rounded-full">+12%</span>
                                </div>
                                <h3 className="text-slate-600 dark:text-slate-400 font-medium mb-1">Active Members</h3>
                                <p className="text-3xl font-bold text-slate-800 dark:text-slate-200 mb-1">1,248</p>
                                <p className="text-sm text-slate-500 dark:text-slate-400">Currently checked in: 128</p>
                            </div>

                            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-slate-200 dark:border-slate-700 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
                                        <Calendar className="w-6 h-6 text-green-600 dark:text-green-400" />
                                    </div>
                                    <span className="text-sm font-medium text-blue-600 bg-blue-100 dark:bg-blue-900 dark:text-blue-400 px-2 py-1 rounded-full">7 Active</span>
                                </div>
                                <h3 className="text-slate-600 dark:text-slate-400 font-medium mb-1">Today's Classes</h3>
                                <p className="text-3xl font-bold text-slate-800 dark:text-slate-200 mb-1">24</p>
                                <p className="text-sm text-slate-500 dark:text-slate-400">Next: Yoga at 3:00 PM</p>
                            </div>

                            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-slate-200 dark:border-slate-700 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
                                        <CreditCard className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                                    </div>
                                    <span className="text-sm font-medium text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-400 px-2 py-1 rounded-full">+8.2%</span>
                                </div>
                                <h3 className="text-slate-600 dark:text-slate-400 font-medium mb-1">Monthly Revenue</h3>
                                <p className="text-3xl font-bold text-slate-800 dark:text-slate-200 mb-1">$24,750</p>
                                <p className="text-sm text-slate-500 dark:text-slate-400">Pending: $3,240</p>
                            </div>

                            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-slate-200 dark:border-slate-700 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="p-3 bg-orange-100 dark:bg-orange-900 rounded-lg">
                                        <Dumbbell className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                                    </div>
                                    <span className="text-sm font-medium text-yellow-600 bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-400 px-2 py-1 rounded-full">2 Issues</span>
                                </div>
                                <h3 className="text-slate-600 dark:text-slate-400 font-medium mb-1">Equipment Status</h3>
                                <p className="text-3xl font-bold text-slate-800 dark:text-slate-200 mb-1">98%</p>
                                <p className="text-sm text-slate-500 dark:text-slate-400">Operational equipment</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-8">
                    <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-4">Quick Actions</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <button className="bg-white dark:bg-slate-800 rounded-lg p-4 shadow-md hover:shadow-lg transition-all duration-200 border border-slate-200 dark:border-slate-700 text-center hover:-translate-y-0.5">
                            <Users className="w-6 h-6 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
                            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Add Member</span>
                        </button>
                        <button className="bg-white dark:bg-slate-800 rounded-lg p-4 shadow-md hover:shadow-lg transition-all duration-200 border border-slate-200 dark:border-slate-700 text-center hover:-translate-y-0.5">
                            <Calendar className="w-6 h-6 text-green-600 dark:text-green-400 mx-auto mb-2" />
                            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Schedule Class</span>
                        </button>
                        <button className="bg-white dark:bg-slate-800 rounded-lg p-4 shadow-md hover:shadow-lg transition-all duration-200 border border-slate-200 dark:border-slate-700 text-center hover:-translate-y-0.5">
                            <CreditCard className="w-6 h-6 text-purple-600 dark:text-purple-400 mx-auto mb-2" />
                            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Process Payment</span>
                        </button>
                        <button className="bg-white dark:bg-slate-800 rounded-lg p-4 shadow-md hover:shadow-lg transition-all duration-200 border border-slate-200 dark:border-slate-700 text-center hover:-translate-y-0.5">
                            <BarChart className="w-6 h-6 text-orange-600 dark:text-orange-400 mx-auto mb-2" />
                            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">View Reports</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}