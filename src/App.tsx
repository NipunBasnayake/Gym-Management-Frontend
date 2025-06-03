import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Dashboard from './pages/Dashboard'
import Members from './pages/Members'
import Attendance from './pages/Attendance'
import Notifications from './pages/Notifications'
import Payments from './pages/Payments'
import Login from './pages/Login'

function App() {
    return (
        <AuthProvider>
            <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/members" element={<Members />} />
                <Route path="/attendance" element={<Attendance />} />
                <Route path="/notifications" element={<Notifications />} />
                <Route path="/payments" element={<Payments />} />
                <Route path="/login" element={<Login />} />
            </Routes>
        </AuthProvider>
    )
}

export default App