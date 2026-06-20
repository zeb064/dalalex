import { useState } from 'react'
import { createPortal } from 'react-dom'
import { formatPrice } from '../utils/cart'
import { Producto } from '../types'

interface ProductOptionModalProps {
  product: Producto
  onConfirm: (index: number, name: string, price: number) => void
  onClose: () => void
}

export default function ProductOptionModal({ product, onConfirm, onClose }: ProductOptionModalProps) {
  const [selected, setSelected] = useState(0)
  const opcion = product.opciones?.[selected]

  const handleConfirm = () => {
    if (opcion) onConfirm(selected, opcion.nombre, opcion.precio)
  }

  return createPortal(
    <div
      className="fixed inset-0 bg-black/60 z-[110] flex items-center justify-center animate-[fadeIn_0.2s_ease]"
      onClick={onClose}
    >
      <div
        className="bg-night-700 border border-white/10 rounded-2xl w-[92%] max-w-[360px] max-h-[80vh] overflow-y-auto animate-[modalScale_0.3s_cubic-bezier(0.32,0.72,0,1)]"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 pt-4 pb-2">
          <h3 className="text-lg font-bold text-white">{product.nombre}</h3>
          <button
            className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-sm text-white/80"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        {product.imagen && (
          <img
            className="w-full h-[180px] object-cover mb-2"
            src={product.imagen}
            alt={product.nombre}
          />
        )}

        <div className="px-5 py-2 flex flex-col gap-2">
          {product.opciones?.map((op, i) => (
            <label
              key={i}
              className={`flex items-center gap-2.5 p-3 rounded-xl border-2 cursor-pointer transition-all ${
                selected === i
                  ? 'border-desert-500/60 bg-desert-500/10'
                  : 'border-white/10 hover:border-desert-500/30'
              }`}
            >
              <input
                type="radio"
                name={`option-${product.id}`}
                checked={selected === i}
                onChange={() => setSelected(i)}
                className="accent-desert-500 w-[18px] h-[18px]"
              />
              <span className="flex-1 text-sm font-semibold text-white/90">{op.nombre}</span>
              <span className="text-sm font-bold text-desert-400">{formatPrice(op.precio)}</span>
            </label>
          ))}
        </div>

        <button
          className="w-full py-3.5 bg-desert-500/30 text-white font-bold text-base hover:bg-desert-500/50 transition-colors rounded-b-2xl"
          onClick={handleConfirm}
        >
          Agregar · {opcion ? formatPrice(opcion.precio) : ''}
        </button>
      </div>
    </div>,
    document.body
  )
}
