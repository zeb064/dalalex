export default function EmptyCart({ onClose }) {
  return (
    <div className="empty-cart">
      <div className="empty-cart-icon">🛒</div>
      <div className="empty-cart-title">Tu carrito esta vacio</div>
      <div className="empty-cart-desc">
        Agrega productos del menu para armar tu pedido
      </div>
      <button className="empty-cart-btn" onClick={onClose}>
        Explorar menu
      </button>
    </div>
  )
}
