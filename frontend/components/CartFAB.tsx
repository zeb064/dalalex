import { useState, useEffect } from 'react'
import { useCart, formatPrice } from '../utils/cart'

interface CartFABProps {
  onClick: () => void
}

export default function CartFAB({ onClick }: CartFABProps) {
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
      className={`fixed bottom-6 right-6 z-[60] w-14 h-14 md:w-12 md:h-12 rounded-full bg-desert-500 text-white shadow-lg shadow-desert-500/30 flex flex-col items-center justify-center gap-0.5 border-2 border-white/10 transition-transform active:scale-90 ${
        bounce ? 'animate-[fab-bounce_0.4s_ease]' : ''
      }`}
      onClick={onClick}
      aria-label="Abrir carrito"
      style={{ boxShadow: '0 6px 24px rgba(196, 149, 106, 0.4)' }}
    >
      <span className="text-xl leading-none">🛒</span>
      <span className="text-[10px] font-bold leading-none whitespace-nowrap">{formatPrice(totalPrice)}</span>
      <span className="absolute -top-1 -right-1 bg-desert-600 text-white text-[10px] font-bold min-w-[22px] h-[22px] rounded-full flex items-center justify-center px-1 border-2 border-[#0A0A08]">
        {totalItems}
      </span>
    </button>
  )
}
