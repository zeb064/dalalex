import { useState } from 'react'
import { useCart, formatPrice } from '../utils/cart'

export default function ProductCard({ product, onAddToCart }) {
  const { items, addItem, removeItem } = useCart()
  const [animating, setAnimating] = useState(false)

  const cartItem = items.find(item => item.id === product.id)
  const quantity = cartItem ? cartItem.quantity : 0

  const handleAdd = () => {
    addItem(product)
    setAnimating(true)
    if (onAddToCart) onAddToCart()
    setTimeout(() => setAnimating(false), 400)
  }

  const handleRemove = () => {
    removeItem(product.id)
  }

  return (
    <div className="product-card">
      <div className="product-card-image-wrap">
        <img
          className="product-card-image"
          src={product.imagen}
          alt={product.nombre}
          loading="lazy"
        />
        {product.destacado && (
          <span className="product-card-badge">Destacado</span>
        )}
      </div>
      <div className="product-card-body">
        <div className="product-card-name">{product.nombre}</div>
        <div className="product-card-desc">{product.descripcion}</div>
        <div className="product-card-footer">
          <span className="product-card-price">{formatPrice(product.precio)}</span>
          {quantity === 0 ? (
            <button
              className={`product-card-btn ${animating ? 'bounce' : ''}`}
              onClick={handleAdd}
              aria-label="Agregar producto"
            >
              +
            </button>
          ) : (
            <div className="product-card-qty">
              <button
                className="product-card-qty-btn minus"
                onClick={handleRemove}
                aria-label="Disminuir cantidad"
              >
                −
              </button>
              <span className="product-card-qty-num">{quantity}</span>
              <button
                className="product-card-qty-btn"
                onClick={handleAdd}
                aria-label="Aumentar cantidad"
              >
                +
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
