import { useCart, formatPrice } from '../utils/cart'

export default function CartItem({ item }) {
  const { addItem, removeItem, removeEntirely } = useCart()

  return (
    <div className="cart-item">
      <div className="cart-item-info">
        <div className="cart-item-name">{item.nombre}</div>
        <div className="cart-item-price">{formatPrice(item.precio)} c/u</div>
      </div>
      <div className="cart-item-actions">
        <button
          className="cart-item-qty-btn minus"
          onClick={() => removeItem(item.id)}
          aria-label="Disminuir"
        >
          −
        </button>
        <span className="cart-item-qty-num">{item.quantity}</span>
        <button
          className="cart-item-qty-btn plus"
          onClick={() => addItem({ ...item })}
          aria-label="Aumentar"
        >
          +
        </button>
        <button
          className="cart-item-delete"
          onClick={() => removeEntirely(item.id)}
          aria-label="Eliminar producto"
          title="Eliminar"
        >
          🗑
        </button>
      </div>
      <div className="cart-item-subtotal">
        {formatPrice(item.precio * item.quantity)}
      </div>
    </div>
  )
}
