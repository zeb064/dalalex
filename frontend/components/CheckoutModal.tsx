import { useState } from 'react'
import { useCart, formatPrice } from '../utils/cart'
import { Comercio } from '../types'
import CartItem from './CartItem'
import EmptyCart from './EmptyCart'

interface CheckoutModalProps {
  show: boolean
  onClose: () => void
  comercio: Comercio | null
}

export default function CheckoutModal({ show, onClose, comercio }: CheckoutModalProps) {
  const { items, totalItems, totalPrice, clearCart } = useCart()
  const [nombre, setNombre] = useState('')
  const [direccion, setDireccion] = useState('')
  const [pago, setPago] = useState('Efectivo')
  const [errors, setErrors] = useState<Record<string, string>>({})

  if (!show) return null

  const validate = () => {
    const errs: Record<string, string> = {}
    if (!nombre.trim()) errs.nombre = 'Ingresa tu nombre'
    if (!direccion.trim()) errs.direccion = 'Ingresa tu dirección'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleCheckout = () => {
    if (!validate()) return

    const telefono = comercio?.telefono || '573001234567'

    let mensaje = `🛵 *NUEVO PEDIDO - ${comercio?.nombre || 'Dalalex'}*\n\n`
    mensaje += `👤 *Cliente:* ${nombre.trim()}\n`
    mensaje += `📍 *Dirección:* ${direccion.trim()}\n`
    mensaje += `💳 *Pago:* ${pago}\n\n`
    mensaje += `📦 *PRODUCTOS:*\n`

    items.forEach(item => {
      const subtotal = item.precio * item.quantity
      const variant = item.opcionNombre && item.opcionNombre !== 'Única' ? ` (${item.opcionNombre})` : ''
      mensaje += `• ${item.nombre}${variant} x${item.quantity} = ${formatPrice(subtotal)}\n`
    })

    mensaje += `\n─────────────────\n`
    mensaje += `💰 *TOTAL:* ${formatPrice(totalPrice)}\n\n`
    mensaje += `✅ Gracias por tu pedido!`

    const encoded = encodeURIComponent(mensaje)
    window.open(`https://wa.me/${telefono}?text=${encoded}`, '_blank')
    clearCart()
    onClose()
  }

  return (
    <div
      className="fixed inset-0 bg-black/60 z-[100] flex items-end lg:items-center justify-center animate-[fadeIn_0.2s_ease]"
      onClick={onClose}
    >
      <div
        className="bg-night-700 border border-white/10 rounded-3xl rounded-b-none lg:rounded-3xl w-full lg:w-[480px] max-h-[88vh] lg:max-h-[80vh] flex flex-col overflow-hidden animate-[slideUp_0.35s_cubic-bezier(0.32,0.72,0,1)] lg:animate-[modalScale_0.3s_cubic-bezier(0.32,0.72,0,1)]"
        onClick={e => e.stopPropagation()}
      >
        <div className="w-10 h-1 rounded-full bg-white/20 mx-auto mt-2.5 mb-0 shrink-0 lg:hidden" />

        <div className="flex items-center justify-between px-5 pt-1 pb-4 shrink-0">
          <h2 className="text-xl font-bold text-white">🛵 Tu Pedido</h2>
          <button
            className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-sm text-white/80 hover:bg-white/20 transition-colors"
            onClick={onClose}
            aria-label="Cerrar"
          >
            ✕
          </button>
        </div>

        <div className="px-5 overflow-y-auto flex-1">
          {items.length === 0 ? (
            <EmptyCart onClose={onClose} />
          ) : (
            <>
              <div>
                {items.map(item => (
                  <CartItem key={item.id} item={item} />
                ))}
              </div>

              <div className="py-4 shrink-0">
                <div className="h-px bg-white/5 my-2" />

                <div className="flex justify-between items-center py-2">
                  <span className="text-sm font-semibold text-white">
                    TOTAL ({totalItems} {totalItems === 1 ? 'item' : 'items'})
                  </span>
                  <span className="text-xl font-extrabold text-desert-400">{formatPrice(totalPrice)}</span>
                </div>

                <div className="h-px bg-white/5 my-2" />

                <div className="mb-3.5">
                  <label className="block text-[11px] font-semibold text-white/40 uppercase tracking-wider mb-1.5" htmlFor="nombre">
                    Nombre
                  </label>
                  <input
                    id="nombre"
                    className={`w-full px-3.5 py-3 rounded-xl border-2 text-sm text-white bg-transparent transition-colors placeholder:text-white/20 ${
                      errors.nombre
                        ? 'border-red-500/50'
                        : 'border-white/10 focus:border-desert-500/50'
                    }`}
                    type="text"
                    placeholder="Tu nombre"
                    value={nombre}
                    onChange={e => { setNombre(e.target.value); setErrors(prev => ({ ...prev, nombre: '' })) }}
                  />
                  {errors.nombre && <div className="text-[11px] text-red-400 mt-1 font-medium">{errors.nombre}</div>}
                </div>

                <div className="mb-3.5">
                  <label className="block text-[11px] font-semibold text-white/40 uppercase tracking-wider mb-1.5" htmlFor="direccion">
                    Dirección de entrega
                  </label>
                  <input
                    id="direccion"
                    className={`w-full px-3.5 py-3 rounded-xl border-2 text-sm text-white bg-transparent transition-colors placeholder:text-white/20 ${
                      errors.direccion
                        ? 'border-red-500/50'
                        : 'border-white/10 focus:border-desert-500/50'
                    }`}
                    type="text"
                    placeholder="Cra 25 #10-20, Sincelejo"
                    value={direccion}
                    onChange={e => { setDireccion(e.target.value); setErrors(prev => ({ ...prev, direccion: '' })) }}
                  />
                  {errors.direccion && <div className="text-[11px] text-red-400 mt-1 font-medium">{errors.direccion}</div>}
                </div>

                <div className="mb-3.5">
                  <label className="block text-[11px] font-semibold text-white/40 uppercase tracking-wider mb-1.5" htmlFor="pago">
                    Método de pago
                  </label>
                  <select
                    id="pago"
                    className="w-full px-3.5 py-3 rounded-xl border-2 border-white/10 text-sm text-white bg-transparent transition-colors focus:border-desert-500/50"
                    value={pago}
                    onChange={e => setPago(e.target.value)}
                  >
                    <option value="Efectivo" className="bg-night-700">Efectivo</option>
                    <option value="Transferencia" className="bg-night-700">Transferencia</option>
                    <option value="Tarjeta" className="bg-night-700">Tarjeta</option>
                    <option value="Nequi" className="bg-night-700">Nequi</option>
                  </select>
                </div>

                <button
                  className="w-full py-3.5 bg-[#25D366] text-white font-bold text-sm flex items-center justify-center gap-2 rounded-xl hover:bg-[#1DA851] transition-colors active:scale-[0.98] mt-1"
                  onClick={handleCheckout}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  Enviar por WhatsApp
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
