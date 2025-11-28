import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { formatCurrency } from '../utils/currency'
import { useAuth } from '../context/AuthContext'
import './OrderHistory.css'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

function OrderHistory() {
    const navigate = useNavigate()
    const { t, i18n } = useTranslation()
    const { getAuthHeader, isAuthenticated } = useAuth()
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login')
            return
        }

        fetchOrders()
    }, [isAuthenticated])

    const fetchOrders = async () => {
        try {
            const response = await fetch(`${API_URL}/orders/`, {
                headers: {
                    ...getAuthHeader(),
                },
            })

            if (response.ok) {
                const data = await response.json()
                setOrders(data)
            }
        } catch (err) {
            console.error('Error fetching orders:', err)
        } finally {
            setLoading(false)
        }
    }

    const handleReorder = (order) => {
        // Navigate to builder with the first item's food type
        if (order.items && order.items.length > 0) {
            const firstItem = order.items[0]
            // Use ingredients_order if available, otherwise fall back to selected_ingredients ids
            const selectedIngredients = firstItem.ingredients_order && firstItem.ingredients_order.length > 0
                ? firstItem.ingredients_order
                : firstItem.selected_ingredients.map(ing => ing.id)

            // Store reorder data in sessionStorage
            sessionStorage.setItem('reorder_data', JSON.stringify({
                foodTypeId: firstItem.food_type.id,
                selectedIngredients: selectedIngredients
            }))

            navigate(`/builder/${firstItem.food_type.id}`)
        }
    }

    if (loading) {
        return (
            <div className="order-history-container">
                <div className="loading">{t('loading_orders')}</div>
            </div>
        )
    }

    return (
        <div className="order-history-container">
            <motion.div
                className="order-history-header"
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
            >
                <h1>{t('order_history')}</h1>
                <p>{t('order_history_subtitle')}</p>
            </motion.div>

            {orders.length === 0 ? (
                <div className="no-orders">
                    <p>{t('no_orders')}</p>
                    <button className="btn btn-primary" onClick={() => navigate('/menu')}>
                        {t('start_building')}
                    </button>
                </div>
            ) : (
                <div className="orders-grid">
                    {orders.map((order, index) => (
                        <motion.div
                            key={order.id}
                            className="order-card glass-card"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <div className="order-header">
                                <h3>{t('order_number', { number: order.id })}</h3>
                                <span className="order-date">
                                    {new Date(order.created_at).toLocaleDateString()}
                                </span>
                            </div>

                            <div className="order-items">
                                {order.items.map((item) => (
                                    <div key={item.id} className="order-item">
                                        <div className="item-header">
                                            <img
                                                src={item.food_type.image}
                                                alt={item.food_type.name}
                                                className="item-image"
                                            />
                                            <h4>{item.food_type.name}</h4>
                                        </div>

                                        <div className="item-ingredients">
                                            <p className="ingredients-label">{t('ingredients')}:</p>
                                            <div className="ingredients-list">
                                                {/* Display in order if ingredients_order exists */}
                                                {(item.ingredients_order && item.ingredients_order.length > 0
                                                    ? item.ingredients_order.map(ingId => 
                                                        item.selected_ingredients.find(ing => ing.id === ingId)
                                                    ).filter(Boolean)
                                                    : item.selected_ingredients
                                                ).map((ing, idx) => (
                                                    <span key={ing.id} className="ingredient-tag">
                                                        {idx + 1}. {ing.name}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="order-footer">
                                <div className="order-total">
                                    {t('total')}: {formatCurrency(order.total_price, i18n.language)}
                                </div>
                                <button
                                    className="btn btn-primary"
                                    onClick={() => handleReorder(order)}
                                >
                                    {t('reorder')}
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default OrderHistory
