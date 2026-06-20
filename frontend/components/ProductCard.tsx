import { useState } from 'react'
import { useCart, formatPrice } from '../utils/cart'
import { Producto } from '../types'
import ProductOptionModal from './ProductOptionModal'

interface ProductCardProps {
  product: Producto
  onAddToCart: () => void
}

export default function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const { items, addItem, removeItem } = useCart()
  const [animating, setAnimating] = useState(false)
  const [showOptions, setShowOptions] = useState(false)

  const hasOptions = product.opciones && product.opciones.length > 1

  const cartItems = items.filter(item =>
    item._cartKey && item._cartKey.startsWith(product.id)
  )
  const totalQty = cartItems.reduce((sum, item) => sum + item.quantity, 0)

  const handleAddClick = () => {
    if (hasOptions) {
      setShowOptions(true)
    } else {
      addDirect()
    }
  }

  const addDirect = () => {
    const op = product.opciones?.[0]
    addItem(product as any, 0, op?.nombre || null, op?.precio || 0)
    setAnimating(true)
    if (onAddToCart) onAddToCart()
    setTimeout(() => setAnimating(false), 400)
  }

  const handleOptionConfirm = (index: number, name: string, price: number) => {
    addItem(product as any, index, name, price)
    setShowOptions(false)
    setAnimating(true)
    if (onAddToCart) onAddToCart()
    setTimeout(() => setAnimating(false), 400)
  }

  const getDisplayPrice = () => {
    if (!product.opciones || product.opciones.length === 0) return '$0'
    if (product.opciones.length === 1) return formatPrice(product.opciones[0].precio)
    const prices = product.opciones.map(o => o.precio)
    const min = Math.min(...prices)
    const max = Math.max(...prices)
    if (min === max) return formatPrice(min)
    return `Desde ${formatPrice(min)}`
  }

  const firstCartItem = cartItems[0]
  const cartKey = firstCartItem ? firstCartItem._cartKey : null

  return (
    <>
      <div className="group rounded-2xl overflow-hidden bg-white/5 backdrop-blur-md border border-white/5 transition-all duration-200 hover:bg-white/[0.07] hover:border-white/10 hover:-translate-y-0.5 hover:shadow-xl">
        <div className="relative aspect-[4/3] overflow-hidden bg-white/5">
          {product.imagen && (
            <img
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              src={product.imagen}
              alt={product.nombre}
              loading="lazy"
            />
          )}
        </div>
        <div className="p-2.5 md:p-3 flex flex-col gap-1 flex-1">
          <div className="text-sm font-bold text-white leading-tight">{product.nombre}</div>
          {product.descripcion && (
            <div className="text-xs text-white/50 leading-tight line-clamp-2">{product.descripcion}</div>
          )}
          <div className="flex items-center justify-between mt-auto pt-1.5">
            <span className="text-lg font-extrabold text-white tracking-tight">{getDisplayPrice()}</span>
            {totalQty === 0 ? (
              <button
                className={`w-9 h-9 md:w-10 md:h-10 rounded-full bg-desert-500/40 text-white text-xl font-bold flex items-center justify-center shadow-lg shrink-0 active:scale-90 transition-all hover:bg-desert-500/60 ${animating ? 'scale-110' : ''}`}
                onClick={handleAddClick}
                aria-label="Agregar producto"
              >
                +
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  className="w-8 h-8 md:w-[34px] md:h-[34px] rounded-full bg-white/10 text-white/80 text-sm font-semibold flex items-center justify-center active:scale-90 transition-transform"
                  onClick={() => cartKey && removeItem(cartKey)}
                  aria-label="Disminuir cantidad"
                >
                  −
                </button>
                <span className="text-sm font-bold text-white min-w-[18px] text-center">{totalQty}</span>
                <button
                  className="w-8 h-8 md:w-[34px] md:h-[34px] rounded-full bg-desert-500/40 text-white text-sm font-semibold flex items-center justify-center active:scale-90 transition-transform"
                  onClick={handleAddClick}
                  aria-label="Aumentar cantidad"
                >
                  +
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {showOptions && (
        <ProductOptionModal
          product={product}
          onConfirm={handleOptionConfirm}
          onClose={() => setShowOptions(false)}
        />
      )}
    </>
  )
}
