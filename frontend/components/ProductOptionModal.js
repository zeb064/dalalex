import { useState } from 'react'
import { formatPrice } from '../utils/cart'

export default function ProductOptionModal({ product, onConfirm, onClose }) {
  const [selected, setSelected] = useState(0)
  const opcion = product.opciones[selected]

  const handleConfirm = () => {
    onConfirm(selected, opcion.nombre, opcion.precio)
  }

  return (
    <div className="option-modal-overlay" onClick={onClose}>
      <div className="option-modal" onClick={e => e.stopPropagation()}>
        <div className="option-modal-header">
          <h3 className="option-modal-title">{product.nombre}</h3>
          <button className="option-modal-close" onClick={onClose}>✕</button>
        </div>
        {product.imagen && (
          <img className="option-modal-img" src={product.imagen} alt={product.nombre} />
        )}
        <div className="option-modal-options">
          {product.opciones.map((op, i) => (
            <label
              key={i}
              className={`option-modal-option ${selected === i ? 'active' : ''}`}
            >
              <input
                type="radio"
                name={`option-${product.id}`}
                checked={selected === i}
                onChange={() => setSelected(i)}
              />
              <span className="option-modal-option-name">{op.nombre}</span>
              <span className="option-modal-option-price">{formatPrice(op.precio)}</span>
            </label>
          ))}
        </div>
        <button className="option-modal-btn" onClick={handleConfirm}>
          Agregar · {formatPrice(opcion.precio)}
        </button>
      </div>
    </div>
  )
}