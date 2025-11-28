import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import './Home.css'

function Home() {
    const { t } = useTranslation()
    return (
        <div className="home-container">
            <motion.div
                className="hero-section"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
            >
                <motion.h1
                    className="hero-title"
                    initial={{ y: -50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                >
                    {t('hero_title')}
                </motion.h1>

                <motion.p
                    className="hero-subtitle"
                    initial={{ y: -30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                >
                    {t('hero_subtitle')}
                </motion.p>

                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.6, duration: 0.6 }}
                >
                    <Link to="/menu" className="btn btn-primary hero-cta">
                        {t('start_building')}
                    </Link>
                </motion.div>

                <motion.div
                    className="floating-emoji"
                    animate={{
                        y: [0, -20, 0],
                        rotate: [0, 5, -5, 0]
                    }}
                    transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                >
                    🍔
                </motion.div>
            </motion.div>
        </div>
    )
}

export default Home
