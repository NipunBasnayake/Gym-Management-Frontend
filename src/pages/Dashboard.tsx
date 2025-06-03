import {QrCode, Users, Calendar, CreditCard, Dumbbell, BarChart} from 'lucide-react'
import Sidebar from '../components/ui/Sidebar'
import { useState } from 'react'
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { CardContent } from "../components/ui/cardContent";


export default function Dashboard() {
    const [isScanning, setIsScanning] = useState(false)

    const handleScan = () => {
        setIsScanning(true)
        setTimeout(() => setIsScanning(false), 2000)
    }

    return (
        <div className="flex flex-col md:flex-row min-h-screen bg-gradient-to-br from-background to-muted">
            <Sidebar />
            <div className="flex-1 p-4 md:p-8 pb-20 md:pb-8">
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Dashboard</h1>
                            <p className="text-muted-foreground">Welcome back! Here's what's happening at your gym today.</p>
                        </div>
                        <div className="hidden md:block">
                            <Card>
                                <CardContent className="pt-2">
                                    <span className="text-sm text-muted-foreground">Today:</span>
                                    <span className="ml-2 font-semibold text-foreground">June 3, 2025</span>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
                    <div className="lg:col-span-1">
                        <Card className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground h-full min-h-[350px] relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-background/10 rounded-full -translate-y-16 translate-x-16"></div>
                            <div className="absolute bottom-0 left-0 w-24 h-24 bg-background/10 rounded-full translate-y-12 -translate-x-12"></div>
                            <CardContent className="flex flex-col items-center justify-center h-full relative z-10 text-center pt-6">
                                <div className="p-4 rounded-full bg-background/20 backdrop-blur-sm mb-6 mx-auto w-fit">
                                    <QrCode className="w-12 h-12 md:w-16 md:h-16" />
                                </div>
                                <h2 className="text-xl md:text-2xl font-bold mb-3">Quick Check-In</h2>
                                <p className="text-primary-foreground/80 mb-6 text-sm md:text-base">Scan QR code for instant attendance tracking</p>
                                <Button
                                    onClick={handleScan}
                                    disabled={isScanning}
                                    className="bg-background text-primary hover:bg-background/90"
                                >
                                    {isScanning ? 'Scanning...' : 'Start Scanning'}
                                </Button>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="lg:col-span-2">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                            <Card className="hover:shadow-xl transition-all duration-300">
                                <CardContent className="pt-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                                            <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                                        </div>
                                        <span className="text-sm font-medium text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-400 px-2 py-1 rounded-full">+12%</span>
                                    </div>
                                    <h3 className="text-muted-foreground font-medium mb-1">Active Members</h3>
                                    <p className="text-3xl font-bold text-foreground mb-1">1,248</p>
                                    <p className="text-sm text-muted-foreground">Currently checked in: 128</p>
                                </CardContent>
                            </Card>

                            <Card className="hover:shadow-xl transition-all duration-300">
                                <CardContent className="pt-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
                                            <Calendar className="w-6 h-6 text-green-600 dark:text-green-400" />
                                        </div>
                                        <span className="text-sm font-medium text-blue-600 bg-blue-100 dark:bg-blue-900 dark:text-blue-400 px-2 py-1 rounded-full">7 Active</span>
                                    </div>
                                    <h3 className="text-muted-foreground font-medium mb-1">Today's Classes</h3>
                                    <p className="text-3xl font-bold text-foreground mb-1">24</p>
                                    <p className="text-sm text-muted-foreground">Next: Yoga at 3:00 PM</p>
                                </CardContent>
                            </Card>

                            <Card className="hover:shadow-xl transition-all duration-300">
                                <CardContent className="pt-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
                                            <CreditCard className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                                        </div>
                                        <span className="text-sm font-medium text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-400 px-2 py-1 rounded-full">+8.2%</span>
                                    </div>
                                    <h3 className="text-muted-foreground font-medium mb-1">Monthly Revenue</h3>
                                    <p className="text-3xl font-bold text-foreground mb-1">$24,750</p>
                                    <p className="text-sm text-muted-foreground">Pending: $3,240</p>
                                </CardContent>
                            </Card>

                            <Card className="hover:shadow-xl transition-all duration-300">
                                <CardContent className="pt-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="p-3 bg-orange-100 dark:bg-orange-900 rounded-lg">
                                            <Dumbbell className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                                        </div>
                                        <span className="text-sm font-medium text-yellow-600 bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-400 px-2 py-1 rounded-full">2 Issues</span>
                                    </div>
                                    <h3 className="text-muted-foreground font-medium mb-1">Equipment Status</h3>
                                    <p className="text-3xl font-bold text-foreground mb-1">98%</p>
                                    <p className="text-sm text-muted-foreground">Operational equipment</p>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>

                <div className="mt-8">
                    <h2 className="text-xl font-bold text-foreground mb-4">Quick Actions</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <Button variant="outline" className="flex flex-col h-auto py-4">
                            <Users className="w-6 h-6 text-blue-600 dark:text-blue-400 mb-2" />
                            <span className="text-sm font-medium">Add Member</span>
                        </Button>
                        <Button variant="outline" className="flex flex-col h-auto py-4">
                            <Calendar className="w-6 h-6 text-green-600 dark:text-green-400 mb-2" />
                            <span className="text-sm font-medium">Schedule Class</span>
                        </Button>
                        <Button variant="outline" className="flex flex-col h-auto py-4">
                            <CreditCard className="w-6 h-6 text-purple-600 dark:text-purple-400 mb-2" />
                            <span className="text-sm font-medium">Process Payment</span>
                        </Button>
                        <Button variant="outline" className="flex flex-col h-auto py-4">
                            <BarChart className="w-6 h-6 text-orange-600 dark:text-orange-400 mb-2" />
                            <span className="text-sm font-medium">View Reports</span>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}