import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../context/AuthContext'
import LanguageSwitcher from './LanguageSwitcher'
import './Navbar.css'

function Navbar() {
    const { user, isAuthenticated, logout } = useAuth()
    const { t } = useTranslation()
    const [mobileOpen, setMobileOpen] = useState(false)

    const toggleMobile = () => setMobileOpen(prev => !prev)
    const closeMobile = () => setMobileOpen(false)

    useEffect(() => {
        const handleKey = (e) => {
            if (e.key === 'Escape') closeMobile()
        }
        window.addEventListener('keydown', handleKey)
        return () => window.removeEventListener('keydown', handleKey)
    }, [])

    // Lock body scroll & avoid width jump when toggling mobile menu
    useEffect(() => {
        const body = document.body
        if (mobileOpen) {
            const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth
            body.classList.add('mobile-menu-open')
            if (scrollBarWidth > 0) {
                body.style.paddingRight = scrollBarWidth + 'px'
            }
        } else {
            body.classList.remove('mobile-menu-open')
            body.style.paddingRight = ''
        }
        return () => {
            body.classList.remove('mobile-menu-open')
            body.style.paddingRight = ''
        }
    }, [mobileOpen])

    const authLinks = isAuthenticated ? (
        <>
            <Link to="/orders" className="navbar-link" onClick={closeMobile}>{t('my_orders')}</Link>
            <div className="navbar-user">
                <span>{t('welcome_user', { name: user?.first_name || user?.username })}</span>
                <button onClick={() => { logout(); closeMobile(); }} className="btn btn-secondary navbar-btn">
                    {t('logout')}
                </button>
            </div>
        </>
    ) : (
        <>
            <Link to="/login" className="navbar-link" onClick={closeMobile}>{t('login')}</Link>
            <Link to="/register" onClick={closeMobile}>
                <button className="btn btn-primary navbar-btn">{t('signup')}</button>
            </Link>
        </>
    )

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <Link to="/" className="navbar-logo" onClick={closeMobile}>
                    🍔 {t('app_title')}
                </Link>

                <button
                    className={"hamburger" + (mobileOpen ? " active" : "")}
                    aria-label={t('menu')}
                    aria-expanded={mobileOpen}
                    onClick={toggleMobile}
                >
                    <span></span><span></span><span></span>
                </button>

                <div className="navbar-menu">
                    <LanguageSwitcher />
                    <Link to="/menu" className="navbar-link">{t('menu')}</Link>
                    {authLinks}
                </div>
            </div>

            {mobileOpen && <div className="mobile-overlay" onClick={closeMobile}></div>}
            <div className={"mobile-menu" + (mobileOpen ? " open" : "")}>
                <div className="mobile-menu-header">
                    <Link to="/" className="navbar-logo" onClick={closeMobile}>🍔 {t('app_title')}</Link>
                    <button className="close-btn" aria-label={t('close')} onClick={closeMobile}>×</button>
                </div>
                <div className="mobile-menu-content">
                    <LanguageSwitcher />
                    <Link to="/menu" className="navbar-link" onClick={closeMobile}>{t('menu')}</Link>
                    {authLinks}
                </div>
            </div>
        </nav>
    )
}

export default Navbar
