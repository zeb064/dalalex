import { useCart, formatPrice } from '../utils/cart'
import { CartItem as CartItemType } from '../types'

interface CartItemProps {
  item: CartItemType
}

export default function CartItem({ item }: CartItemProps) {
  const { addItem, removeItem, removeEntirely } = useCart()

  return (
    <div className="flex items-center gap-3 py-3.5 border-b border-white/5 last:border-b-0">
      <div className="flex-1 min-w-0">
        <div className="text-sm font-semibold text-white truncate">{item.nombre}</div>
        {item.opcionNombre && (
          <div className="text-xs font-semibold text-desert-400 mt-0.5">{item.opcionNombre}</div>
        )}
        <div className="text-sm font-bold text-desert-300 mt-1">{formatPrice(item.precio)} c/u</div>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <button
          className="w-7 h-7 rounded-full bg-white/10 text-white/80 flex items-center justify-center text-sm font-semibold active:scale-90 transition-transform"
          onClick={() => removeItem(item._cartKey)}
          aria-label="Disminuir"
        >
          −
        </button>
        <span className="text-sm font-bold text-white min-w-[18px] text-center">{item.quantity}</span>
        <button
          className="w-7 h-7 rounded-full bg-desert-500/40 text-white flex items-center justify-center text-sm font-semibold active:scale-90 transition-transform"
          onClick={() => addItem(item, item._optionIndex, item.opcionNombre, item.precio)}
          aria-label="Aumentar"
        >
          +
        </button>
        <button
          className="w-7 h-7 rounded-full bg-transparent flex items-center justify-center text-sm text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-all ml-1"
          onClick={() => removeEntirely(item._cartKey)}
          aria-label="Eliminar producto"
        >
          🗑
        </button>
      </div>
      <div className="text-sm font-bold text-white min-w-[60px] text-right shrink-0">
        {formatPrice(item.precio * item.quantity)}
      </div>
    </div>
  )
}
