import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { formatCurrency } from '../utils/currency'
import './Menu.css'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

function Menu() {
    const [categories, setCategories] = useState([])
    const [selectedCategory, setSelectedCategory] = useState(null)
    const [foodTypes, setFoodTypes] = useState([])
    const navigate = useNavigate()
    const { t, i18n } = useTranslation()

    useEffect(() => {
        fetch(`${API_URL}/categories/`)
            .then(res => res.json())
            .then(data => setCategories(data))
            .catch(err => console.error('Error fetching categories:', err))
    }, [])

    useEffect(() => {
        if (selectedCategory) {
            fetch(`${API_URL}/food-types/?category=${selectedCategory}`)
                .then(res => res.json())
                .then(data => setFoodTypes(data))
                .catch(err => console.error('Error fetching food types:', err))
        }
    }, [selectedCategory])

    const handleFoodSelect = (foodTypeId) => {
        navigate(`/builder/${foodTypeId}`)
    }

    return (
        <div className="menu-container">
            <motion.div
                className="menu-header"
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6 }}
            >
                <h1>{t('choose_meal')}</h1>
                <p>{t('select_category')}</p>
            </motion.div>

            {!selectedCategory ? (
                <div className="categories-grid">
                    {categories.map((category, index) => (
                        <motion.div
                            key={category.id}
                            className="category-card glass-card"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1 }}
                            onClick={() => setSelectedCategory(category.id)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            {category.image && (
                                <img src={category.image} alt={category.name} className="category-image" />
                            )}
                            <h3>{category.name}</h3>
                        </motion.div>
                    ))}
                </div>
            ) : (
                <>
                    <button
                        className="btn btn-secondary back-btn"
                        onClick={() => setSelectedCategory(null)}
                    >
                        {t('back_to_categories')}
                    </button>

                    <div className="food-types-grid">
                        {foodTypes.map((food, index) => (
                            <motion.div
                                key={food.id}
                                className="food-card glass-card"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                onClick={() => handleFoodSelect(food.id)}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                {food.image && (
                                    <img src={food.image} alt={food.name} className="food-image" />
                                )}
                                <h3>{food.name}</h3>
                                <p className="food-price">{formatCurrency(food.base_price, i18n.language)}</p>
                            </motion.div>
                        ))}
                    </div>
                </>
            )}
        </div>
    )
}

export default Menu
