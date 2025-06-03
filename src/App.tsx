import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Dashboard from './pages/Dashboard'
import Members from './pages/Members'
import Attendance from './pages/Attendance'
import Notifications from './pages/Notifications'
import Payments from './pages/Payments'
import Login from './pages/Login'
import ProtectedRoute from "./components/ProtectedRoute.tsx";
import { ToastContainer } from 'react-toastify'

function App() {
    return (
        <AuthProvider>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                <Route path="/members" element={<ProtectedRoute><Members /></ProtectedRoute>} />
                <Route path="/attendance" element={<ProtectedRoute><Attendance /></ProtectedRoute>} />
                <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
                <Route path="/payments" element={<ProtectedRoute><Payments /></ProtectedRoute>} />
            </Routes>
            <ToastContainer position="top-right" autoClose={3000} />
        </AuthProvider>
    )
}

export default App
