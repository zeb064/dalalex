import React, { createContext, useContext, useReducer, useEffect } from 'react'

const CartContext = createContext()

const STORAGE_KEY = 'dalalex-cart'

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existing = state.items.find(item => item.id === action.payload.id)
      if (existing) {
        return {
          ...state,
          items: state.items.map(item =>
            item.id === action.payload.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        }
      }
      return {
        ...state,
        items: [...state.items, { ...action.payload, quantity: 1 }]
      }
    }
    case 'REMOVE_ITEM': {
      const existing = state.items.find(item => item.id === action.payload)
      if (existing && existing.quantity > 1) {
        return {
          ...state,
          items: state.items.map(item =>
            item.id === action.payload
              ? { ...item, quantity: item.quantity - 1 }
              : item
          )
        }
      }
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload)
      }
    }
    case 'REMOVE_ENTIRELY':
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload)
      }
    case 'CLEAR':
      return { ...state, items: [] }
    case 'LOAD':
      return { ...state, items: action.payload }
    default:
      return state
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [] })

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed)) {
          dispatch({ type: 'LOAD', payload: parsed })
        }
      }
    } catch (e) {}
  }, [])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items))
  }, [state.items])

  const addItem = (product) => dispatch({ type: 'ADD_ITEM', payload: product })
  const removeItem = (productId) => dispatch({ type: 'REMOVE_ITEM', payload: productId })
  const removeEntirely = (productId) => dispatch({ type: 'REMOVE_ENTIRELY', payload: productId })
  const clearCart = () => dispatch({ type: 'CLEAR' })

  const totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0)
  const totalPrice = state.items.reduce((sum, item) => sum + (item.precio * item.quantity), 0)

  return (
    <CartContext.Provider value={{
      items: state.items,
      addItem,
      removeItem,
      removeEntirely,
      clearCart,
      totalItems,
      totalPrice
    }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart debe usarse dentro de un CartProvider')
  }
  return context
}

export function formatPrice(price) {
  return '$' + Number(price).toLocaleString('es-CO')
}
