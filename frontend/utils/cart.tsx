import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react'
import { CartItem } from '../types'

interface CartState {
  items: CartItem[]
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'REMOVE_ENTIRELY'; payload: string }
  | { type: 'CLEAR' }
  | { type: 'LOAD'; payload: CartItem[] }

interface CartContextValue {
  items: CartItem[]
  addItem: (
    product: CartItem,
    optionIndex?: number,
    optionNombre?: string | null,
    optionPrecio?: number
  ) => void
  removeItem: (cartKey: string) => void
  removeEntirely: (cartKey: string) => void
  clearCart: () => void
  totalItems: number
  totalPrice: number
}

const CartContext = createContext<CartContextValue | null>(null)

const STORAGE_KEY = 'dalalex-cart'

function generateCartKey(productId: string, optionIndex?: number): string {
  if (optionIndex === undefined || optionIndex === null) return productId
  return `${productId}-${optionIndex}`
}

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existing = state.items.find(item => item._cartKey === action.payload._cartKey)
      if (existing) {
        return {
          ...state,
          items: state.items.map(item =>
            item._cartKey === action.payload._cartKey
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        }
      }
      return {
        ...state,
        items: [...state.items, { ...action.payload, quantity: 1 }],
      }
    }
    case 'REMOVE_ITEM': {
      const existing = state.items.find(item => item._cartKey === action.payload)
      if (existing && existing.quantity > 1) {
        return {
          ...state,
          items: state.items.map(item =>
            item._cartKey === action.payload
              ? { ...item, quantity: item.quantity - 1 }
              : item
          ),
        }
      }
      return {
        ...state,
        items: state.items.filter(item => item._cartKey !== action.payload),
      }
    }
    case 'REMOVE_ENTIRELY':
      return {
        ...state,
        items: state.items.filter(item => item._cartKey !== action.payload),
      }
    case 'CLEAR':
      return { ...state, items: [] }
    case 'LOAD':
      return { ...state, items: action.payload }
    default:
      return state
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
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
    } catch (e) { /* ignore */ }
  }, [])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items))
  }, [state.items])

  const addItem = (
    product: CartItem,
    optionIndex?: number,
    optionNombre?: string | null,
    optionPrecio?: number
  ) => {
    const _cartKey = product._cartKey || generateCartKey(product.id, optionIndex)
    const item: CartItem = {
      ...product,
      _cartKey,
      _optionIndex: optionIndex,
      precio: optionPrecio ?? product.precio ?? product.opciones?.[0]?.precio ?? 0,
      opcionNombre: optionNombre || undefined,
      quantity: 1,
    }
    dispatch({ type: 'ADD_ITEM', payload: item })
  }

  const removeItem = (cartKey: string) => dispatch({ type: 'REMOVE_ITEM', payload: cartKey })
  const removeEntirely = (cartKey: string) => dispatch({ type: 'REMOVE_ENTIRELY', payload: cartKey })
  const clearCart = () => dispatch({ type: 'CLEAR' })

  const totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0)
  const totalPrice = state.items.reduce((sum, item) => sum + item.precio * item.quantity, 0)

  return (
    <CartContext.Provider
      value={{ items: state.items, addItem, removeItem, removeEntirely, clearCart, totalItems, totalPrice }}
    >
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

export function formatPrice(price: number) {
  return '$' + Number(price).toLocaleString('es-CO')
}
