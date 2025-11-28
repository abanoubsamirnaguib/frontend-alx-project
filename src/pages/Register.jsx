import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../context/AuthContext'
import './Auth.css'

function Register() {
    const navigate = useNavigate()
    const { t } = useTranslation()
    const { register } = useAuth()
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        password2: '',
        first_name: '',
        last_name: ''
    })
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')

        if (formData.password !== formData.password2) {
            setError(t('passwords_no_match'))
            return
        }

        setLoading(true)
        const result = await register(formData)

        if (result.success) {
            navigate('/menu')
        } else {
            setError(result.error?.username?.[0] || result.error?.email?.[0] || t('registration_failed'))
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
                <h1>{t('create_account')}</h1>
                <p className="auth-subtitle">{t('register_subtitle')}</p>

                {error && (
                    <div className="error-message">{error}</div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="form-row">
                        <div className="form-group">
                            <label>{t('first_name')}</label>
                            <input
                                type="text"
                                required
                                value={formData.first_name}
                                onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                                placeholder={t('first_name_placeholder')}
                            />
                        </div>

                        <div className="form-group">
                            <label>{t('last_name')}</label>
                            <input
                                type="text"
                                required
                                value={formData.last_name}
                                onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                                placeholder={t('last_name_placeholder')}
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>{t('username')}</label>
                        <input
                            type="text"
                            required
                            value={formData.username}
                            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                            placeholder={t('username_placeholder')}
                        />
                    </div>

                    <div className="form-group">
                        <label>{t('email')}</label>
                        <input
                            type="email"
                            required
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            placeholder={t('email_placeholder')}
                        />
                    </div>

                    <div className="form-group">
                        <label>{t('password')}</label>
                        <input
                            type="password"
                            required
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            placeholder={t('password_placeholder')}
                        />
                    </div>

                    <div className="form-group">
                        <label>{t('confirm_password')}</label>
                        <input
                            type="password"
                            required
                            value={formData.password2}
                            onChange={(e) => setFormData({ ...formData, password2: e.target.value })}
                            placeholder={t('confirm_password_placeholder')}
                        />
                    </div>

                    <button type="submit" className="btn btn-primary" disabled={loading}>
                        {loading ? t('creating_account') : t('register')}
                    </button>
                </form>

                <div className="auth-links">
                    <p>{t('already_have_account')} <Link to="/login">{t('login')}</Link></p>
                </div>
            </motion.div>
        </div>
    )
}

export default Register
