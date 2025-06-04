import { useContext } from 'react'
import { AuthContext } from "../context/AuthContext.tsx";
import Spinner from "./Spinner.tsx";
import type { JSX } from 'react'
import { Navigate } from 'react-router-dom'

function ProtectedRoute({ children }: { children: JSX.Element }) {
    const { isAuthenticated, loading } = useContext(AuthContext)

    if (loading) return <Spinner />

    return isAuthenticated ? children : <Navigate to="/login" replace />
}

export default ProtectedRoute
