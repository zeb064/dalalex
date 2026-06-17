import { useState } from 'react'
import { useCart, formatPrice } from '../utils/cart'
import ProductOptionModal from './ProductOptionModal'

export default function ProductCard({ product, onAddToCart }) {
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
    addItem(product, 0, op?.nombre || null, op?.precio || 0)
    setAnimating(true)
    if (onAddToCart) onAddToCart()
    setTimeout(() => setAnimating(false), 400)
  }

  const handleOptionConfirm = (index, name, price) => {
    addItem(product, index, name, price)
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

  const handleRemove = (cartKey) => {
    removeItem(cartKey)
  }

  const firstCartItem = cartItems[0]
  const quantity = firstCartItem ? firstCartItem.quantity : 0
  const cartKey = firstCartItem ? firstCartItem._cartKey : null

  return (
    <>
      <div className="product-card">
        <div className="product-card-image-wrap">
          <img
            className="product-card-image"
            src={product.imagen}
            alt={product.nombre}
            loading="lazy"
          />
        </div>
        <div className="product-card-body">
          <div className="product-card-name">{product.nombre}</div>
          {product.descripcion && (
            <div className="product-card-desc">{product.descripcion}</div>
          )}
          <div className="product-card-footer">
            <span className="product-card-price">{getDisplayPrice()}</span>
            {totalQty === 0 ? (
              <button
                className={`product-card-btn ${animating ? 'bounce' : ''}`}
                onClick={handleAddClick}
                aria-label="Agregar producto"
              >
                +
              </button>
            ) : (
              <div className="product-card-qty">
                <button
                  className="product-card-qty-btn minus"
                  onClick={() => handleRemove(cartKey)}
                  aria-label="Disminuir cantidad"
                >
                  −
                </button>
                <span className="product-card-qty-num">{totalQty}</span>
                <button
                  className="product-card-qty-btn"
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
