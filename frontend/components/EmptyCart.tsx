interface EmptyCartProps {
  onClose: () => void
}

export default function EmptyCart({ onClose }: EmptyCartProps) {
  return (
    <div className="flex flex-col items-center justify-center py-10 px-5 text-center gap-3">
      <div className="text-5xl opacity-40">🛒</div>
      <div className="text-lg font-bold text-white">Tu carrito está vacío</div>
      <div className="text-sm text-white/50 max-w-[260px]">
        Agrega productos del menú para armar tu pedido
      </div>
      <button
        className="mt-2 px-7 py-3 bg-desert-500/30 text-white rounded-full text-sm font-semibold hover:bg-desert-500/50 transition-colors"
        onClick={onClose}
      >
        Explorar menú
      </button>
    </div>
  )
}
