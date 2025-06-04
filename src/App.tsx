import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, AuthContext } from './context/AuthContext'
import Dashboard from './pages/Dashboard'
import Members from './pages/Members'
import Attendance from './pages/Attendance'
import Notifications from './pages/Notifications'
import Payments from './pages/Payments'
import Login from './pages/Login'
import { useContext, type JSX } from 'react'

function ProtectedRoute({ children }: { children: JSX.Element }) {
    const { isAuthenticated } = useContext(AuthContext)
    return isAuthenticated ? children : <Navigate to="/login" replace />
}

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
        </AuthProvider>
    )
}

export default App