import { NavLink } from 'react-router-dom'
import { BarChart, Calendar, CreditCard, LogOut, MessageSquare, Users } from 'lucide-react'
import { useContext } from 'react'
import { AuthContext } from '../../context/AuthContext'
import { Button } from './button'

const navItems = [
    { path: '/', label: 'Dashboard', icon: BarChart },
    { path: '/members', label: 'Members', icon: Users },
    { path: '/attendance', label: 'Attendance', icon: Calendar },
    { path: '/notifications', label: 'Notifications', icon: MessageSquare },
    { path: '/payments', label: 'Payments', icon: CreditCard },
]

export default function Sidebar() {
    const { logoutUser } = useContext(AuthContext)

    return (
        <>
            {/* Desktop Sidebar */}
            <div className="hidden md:flex md:w-64 md:flex-col md:h-screen bg-background shadow-lg">
                <div className="p-6">
                    <h1 className="text-2xl font-bold text-foreground">Gym Management</h1>
                </div>
                <nav className="flex-1 px-4">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) =>
                                `flex items-center px-4 py-3 my-1 rounded-lg transition-colors ${
                                    isActive ? 'bg-primary/10 text-primary' : 'text-foreground hover:bg-muted'
                                }`
                            }
                        >
                            <item.icon className="w-5 h-5 mr-3" />
                            <span>{item.label}</span>
                        </NavLink>
                    ))}
                </nav>
                <div className="p-4">
                    <Button
                        variant="ghost"
                        className="w-full justify-start text-foreground hover:bg-muted"
                        onClick={logoutUser}
                    >
                        <LogOut className="w-5 h-5 mr-3" />
                        <span>Logout</span>
                    </Button>
                </div>
            </div>

            {/* Mobile Bottom Navigation */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 bg-background shadow-lg border-t border-border">
                <nav className="flex justify-around p-2">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) =>
                                `flex flex-col items-center p-2 ${
                                    isActive ? 'text-primary' : 'text-foreground'
                                }`
                            }
                        >
                            <item.icon className="w-6 h-6" />
                            <span className="text-xs">{item.label}</span>
                        </NavLink>
                    ))}
                </nav>
            </div>
        </>
    )
}