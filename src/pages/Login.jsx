import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../context/AuthContext'
import './Auth.css'

function Login() {
    const navigate = useNavigate()
    const { t } = useTranslation()
    const { login } = useAuth()
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    })
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        const result = await login(formData.username, formData.password)

        if (result.success) {
            navigate('/menu')
        } else {
            setError(result.error || t('login_failed'))
        }
        setLoading(false)
    }

    return (
        <div className="auth-container">
            <motion.div
                className="auth-card glass-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <h1>{t('welcome_back')}</h1>
                <p className="auth-subtitle">{t('login_subtitle')}</p>

                {error && (
                    <div className="error-message">{error}</div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>{t('username')}</label>
                        <input
                            type="text"
                            required
                            value={formData.username}
                            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                            placeholder={t('enter_username')}
                        />
                    </div>

                    <div className="form-group">
                        <label>{t('password')}</label>
                        <input
                            type="password"
                            required
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            placeholder={t('enter_password')}
                        />
                    </div>

                    <button type="submit" className="btn btn-primary" disabled={loading}>
                        {loading ? t('logging_in') : t('login')}
                    </button>
                </form>

                <div className="auth-links">
                    <p>{t('dont_have_account')} <Link to="/register">{t('register')}</Link></p>
                    <p><Link to="/menu">{t('continue_as_guest')}</Link></p>
                </div>
            </motion.div>
        </div>
    )
}

export default Login
