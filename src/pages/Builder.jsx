import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, Reorder } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { formatCurrency } from '../utils/currency'
import { useAuth } from '../context/AuthContext'
import './Builder.css'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

function Builder() {
    const { foodTypeId } = useParams()
    const navigate = useNavigate()
    const { t, i18n } = useTranslation()
    const { user, isAuthenticated, getAuthHeader } = useAuth()
    const [foodType, setFoodType] = useState(null)
    const [ingredients, setIngredients] = useState([])
    const [selectedIngredients, setSelectedIngredients] = useState([]) // Array of ingredient IDs in order
    const [showOrderForm, setShowOrderForm] = useState(false)
    const reorderProcessedRef = useRef(false)
    const [orderDetails, setOrderDetails] = useState({
        customer_name: user?.first_name && user?.last_name ? `${user.first_name} ${user.last_name}` : '',
        phone_number: '',
        address: '',
        notes: ''
    })

    useEffect(() => {
        if (reorderProcessedRef.current) return
        reorderProcessedRef.current = true

        const reorderDataRaw = sessionStorage.getItem('reorder_data')
        const hasReorder = !!reorderDataRaw
        const reorderIngredients = hasReorder ? JSON.parse(reorderDataRaw).selectedIngredients : null

        fetch(`${API_URL}/food-types/${foodTypeId}/`)
            .then(res => res.json())
            .then(data => {
                setFoodType(data)
                setIngredients(data.ingredients || [])
                if (hasReorder && Array.isArray(reorderIngredients)) {
                    setSelectedIngredients(reorderIngredients)
                    sessionStorage.removeItem('reorder_data')
                } else {
                    const defaults = data.ingredients?.filter(ing => ing.is_default) || []
                    setSelectedIngredients(defaults.map(ing => ing.id))
                }
            })
            .catch(err => console.error('Error fetching food type:', err))
    }, [foodTypeId])

    const calculateTotal = () => {
        if (!foodType) return 0
        const basePrice = parseFloat(foodType.base_price)
        const ingredientsPrice = ingredients
            .filter(ing => selectedIngredients.includes(ing.id) && !ing.is_default)
            .reduce((sum, ing) => sum + parseFloat(ing.price), 0)
        return basePrice + ingredientsPrice
    }

    const handleIngredientClick = (ingredientId, isDefault) => {
        if (isDefault) return // Can't remove default ingredients

        setSelectedIngredients(prev => {
            if (prev.includes(ingredientId)) {
                // Remove ingredient
                return prev.filter(id => id !== ingredientId)
            } else {
                // Add ingredient at the end
                return [...prev, ingredientId]
            }
        })
    }

    const handleReorder = (newOrder) => {
        setSelectedIngredients(newOrder)
    }

    const handleSubmitOrder = async (e) => {
        e.preventDefault()

        const orderData = {
            ...orderDetails,
            total_price: calculateTotal().toFixed(2),
            items: [{
                food_type: parseInt(foodTypeId),
                selected_ingredients: selectedIngredients,
                ingredients_order: selectedIngredients // Send the ordered list
            }]
        }

        try {
            const headers = {
                'Content-Type': 'application/json',
                ...getAuthHeader(),
            }

            const response = await fetch(`${API_URL}/orders/`, {
                method: 'POST',
                headers,
                body: JSON.stringify(orderData)
            })

            if (response.ok) {
                alert(t('order_success'))
                if (isAuthenticated) {
                    navigate('/orders')
                } else {
                    navigate('/')
                }
            } else {
                alert(t('order_fail'))
            }
        } catch (err) {
            console.error('Error placing order:', err)
            alert(t('order_fail'))
        }
    }

    if (!foodType) {
        return <div className="builder-container">{t('loading')}</div>
    }

    return (
        <div className="builder-container">
            <div className="builder-header">
                <button className="btn btn-secondary" onClick={() => navigate('/menu')}>
                    {t('back_to_menu')}
                </button>
                <h1>{foodType.name}</h1>
                <div className="total-price">
                    {t('total')}: {formatCurrency(calculateTotal(), i18n.language)}
                </div>
            </div>

            <div className="builder-workspace">
                {/* Center plate/base */}
                <div className="plate-container">
                    <motion.div
                        className="plate"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        {foodType.image && (
                            <img src={foodType.image} alt={foodType.name} className="base-image" />
                        )}
                    </motion.div>
                </div>

                {/* Available ingredients */}
                <div className="ingredients-panel">
                    <h2>{t('available_ingredients')}</h2>
                    
                    {/* Selected ingredients list - reorderable */}
                    {selectedIngredients.length > 0 && (
                        <div className="selected-ingredients-section">
                            <h3>{t('selected_ingredients')}</h3>
                            <Reorder.Group 
                                axis="y" 
                                values={selectedIngredients} 
                                onReorder={handleReorder}
                                className="selected-ingredients-list"
                            >
                                {selectedIngredients.map((ingId, index) => {
                                    const ing = ingredients.find(i => i.id === ingId)
                                    if (!ing) return null
                                    
                                    return (
                                        <Reorder.Item
                                            key={ing.id}
                                            value={ing.id}
                                            className="selected-ingredient-item"
                                        >
                                            <span className="drag-handle">⋮⋮</span>
                                            <img src={ing.image} alt={ing.name} />
                                            <span className="ingredient-name">{index + 1}. {ing.name}</span>
                                            {!ing.is_default && (
                                                <button 
                                                    className="remove-btn"
                                                    onClick={() => handleIngredientClick(ing.id, ing.is_default)}
                                                >
                                                    ×
                                                </button>
                                            )}
                                        </Reorder.Item>
                                    )
                                })}
                            </Reorder.Group>
                        </div>
                    )}
                    
                    <div className="ingredients-grid">
                        {ingredients.map((ingredient) => {
                            const isSelected = selectedIngredients.includes(ingredient.id)
                            const isDefault = ingredient.is_default

                            return (
                                <motion.div
                                    key={ingredient.id}
                                    className={`ingredient-card glass-card ${isSelected ? 'selected' : ''} ${isDefault ? 'default' : ''}`}
                                    onClick={() => handleIngredientClick(ingredient.id, isDefault)}
                                    whileHover={{ scale: isDefault ? 1 : 1.05 }}
                                    whileTap={{ scale: isDefault ? 1 : 0.95 }}
                                >
                                    <img src={ingredient.image} alt={ingredient.name} />
                                    <p className="ingredient-name">{ingredient.name}</p>
                                    {!isDefault && (
                                        <p className="ingredient-price">+{formatCurrency(ingredient.price, i18n.language)}</p>
                                    )}
                                    {isDefault && <span className="default-badge">{t('default')}</span>}
                                </motion.div>
                            )
                        })}
                    </div>
                </div>
            </div>

            <div className="builder-actions">
                <button
                    className="btn btn-primary order-btn"
                    onClick={() => setShowOrderForm(true)}
                >
                    {t('place_order')} - {formatCurrency(calculateTotal(), i18n.language)}
                </button>
            </div>

            {/* Order Form Modal */}
            {showOrderForm && (
                <motion.div
                    className="modal-overlay"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    onClick={() => setShowOrderForm(false)}
                >
                    <motion.div
                        className="modal-content glass-card"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h2>{t('complete_order')}</h2>
                        <form onSubmit={handleSubmitOrder}>
                            <div className="form-group">
                                <label>{t('name')}</label>
                                <input
                                    type="text"
                                    required={!isAuthenticated}
                                    value={orderDetails.customer_name}
                                    onChange={(e) => setOrderDetails({ ...orderDetails, customer_name: e.target.value })}
                                    placeholder={isAuthenticated ? user?.username : 'Your name'}
                                />
                            </div>

                            <div className="form-group">
                                <label>{t('phone_number')}</label>
                                <input
                                    type="tel"
                                    required
                                    value={orderDetails.phone_number}
                                    onChange={(e) => setOrderDetails({ ...orderDetails, phone_number: e.target.value })}
                                />
                            </div>

                            <div className="form-group">
                                <label>{t('address')}</label>
                                <textarea
                                    required
                                    value={orderDetails.address}
                                    onChange={(e) => setOrderDetails({ ...orderDetails, address: e.target.value })}
                                />
                            </div>

                            <div className="form-group">
                                <label>{t('notes')}</label>
                                <textarea
                                    value={orderDetails.notes}
                                    onChange={(e) => setOrderDetails({ ...orderDetails, notes: e.target.value })}
                                />
                            </div>

                            <div className="modal-actions">
                                <button type="button" className="btn btn-secondary" onClick={() => setShowOrderForm(false)}>
                                    {t('cancel')}
                                </button>
                                <button type="submit" className="btn btn-primary">
                                    {t('confirm_order')} - {formatCurrency(calculateTotal(), i18n.language)}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </motion.div>
            )}
        </div>
    )
}

export default Builder
