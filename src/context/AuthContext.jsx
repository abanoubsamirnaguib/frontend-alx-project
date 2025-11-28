import { createContext, useState, useContext, useEffect } from 'react'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

const AuthContext = createContext(null)

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider')
    }
    return context
}

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // Check for existing token on mount
        const token = localStorage.getItem('access_token')
        const userData = localStorage.getItem('user')

        if (token && userData) {
            setUser(JSON.parse(userData))
        }
        setLoading(false)
    }, [])

    const register = async (userData) => {
        try {
            const response = await fetch(`${API_URL}/auth/register/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            })

            if (response.ok) {
                const data = await response.json()
                localStorage.setItem('access_token', data.access)
                localStorage.setItem('refresh_token', data.refresh)
                localStorage.setItem('user', JSON.stringify(data.user))
                setUser(data.user)
                return { success: true }
            } else {
                const error = await response.json()
                return { success: false, error }
            }
        } catch (err) {
            return { success: false, error: 'Network error' }
        }
    }

    const login = async (username, password) => {
        try {
            const response = await fetch(`${API_URL}/auth/login/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            })

            if (response.ok) {
                const data = await response.json()
                localStorage.setItem('access_token', data.access)
                localStorage.setItem('refresh_token', data.refresh)
                localStorage.setItem('user', JSON.stringify(data.user))
                setUser(data.user)
                return { success: true }
            } else {
                return { success: false, error: 'Invalid credentials' }
            }
        } catch (err) {
            return { success: false, error: 'Network error' }
        }
    }

    const logout = () => {
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        localStorage.removeItem('user')
        setUser(null)
    }

    const getAuthHeader = () => {
        const token = localStorage.getItem('access_token')
        return token ? { 'Authorization': `Bearer ${token}` } : {}
    }

    const value = {
        user,
        loading,
        register,
        login,
        logout,
        getAuthHeader,
        isAuthenticated: !!user,
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
