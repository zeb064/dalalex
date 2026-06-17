import { useState, useEffect } from 'react'
import { useCart, formatPrice } from '../utils/cart'

export default function CartFAB({ onClick }) {
  const { totalItems, totalPrice } = useCart()
  const [bounce, setBounce] = useState(false)

  useEffect(() => {
    if (totalItems > 0) {
      setBounce(true)
      const timer = setTimeout(() => setBounce(false), 400)
      return () => clearTimeout(timer)
    }
  }, [totalItems])

  if (totalItems === 0) return null

  return (
    <button
      className={`fab ${bounce ? 'bounce' : ''}`}
      onClick={onClick}
      aria-label="Abrir carrito"
    >
      <span className="fab-icon">🛒</span>
      <span className="fab-total">{formatPrice(totalPrice)}</span>
      <span className="fab-badge">{totalItems}</span>
    </button>
  )
}
