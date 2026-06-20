import { useEffect, useState } from 'react'
import { Comercio } from '../types'
import { calcularEstado } from '../utils/status'

interface InfoModalProps {
  show: boolean
  onClose: () => void
  comercio: Comercio | null
}

export default function InfoModal({ show, onClose, comercio }: InfoModalProps) {
  const [hoy, setHoy] = useState(-1)
  const [estado, setEstado] = useState<string>('Cerrado')

  useEffect(() => {
    setEstado(calcularEstado(comercio?.horarios))
    const id = setInterval(() => {
      setEstado(calcularEstado(comercio?.horarios))
    }, 60000)
    return () => clearInterval(id)
  }, [comercio?.horarios])

  useEffect(() => {
    if (show) {
      setHoy(new Date().getDay())
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    setHoy(new Date().getDay())
    return () => { document.body.style.overflow = '' }
  }, [show])

  if (!show) return null

  const horarios = comercio?.horarios || []
  const abierto = estado === 'Abierto'

  return (
    <div
      className="fixed inset-0 bg-black/60 z-[100] flex items-end lg:items-center justify-center animate-[fadeIn_0.2s_ease]"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Información del comercio"
    >
      <div
        className="bg-night-700 border border-white/10 rounded-3xl rounded-b-none lg:rounded-3xl w-full lg:w-[480px] max-h-[88vh] lg:max-h-[80vh] flex flex-col overflow-hidden animate-[slideUp_0.35s_cubic-bezier(0.32,0.72,0,1)] lg:animate-[modalScale_0.3s_cubic-bezier(0.32,0.72,0,1)]"
        onClick={e => e.stopPropagation()}
      >
        <div className="w-10 h-1 rounded-full bg-white/20 mx-auto mt-2.5 mb-0 shrink-0 lg:hidden" />

        <div className="flex items-center justify-between px-5 pt-1 pb-4 shrink-0">
          <h2 className="text-xl font-bold text-white">Información</h2>
          <button
            className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-sm text-white/80 hover:bg-white/20 transition-colors"
            onClick={onClose}
            aria-label="Cerrar"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="px-5 overflow-y-auto flex-1">
          <div className="py-1 pb-3">
            <div className="flex items-start justify-between">
              <div className="flex flex-col gap-2">
                <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-semibold w-fit ${abierto ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                  <span className={`w-2 h-2 rounded-full inline-block animate-pulse ${abierto ? 'bg-emerald-400' : 'bg-red-400'}`} />
                  <span>{estado}</span>
                </div>
                <h3 className="text-2xl font-extrabold text-white tracking-tight">{comercio?.nombre || 'Dalalex'}</h3>
              </div>
              <div className="w-14 h-14 rounded-full bg-desert-500/20 text-desert-400 flex items-center justify-center text-2xl font-extrabold shrink-0">
                {comercio?.nombre?.charAt(0) || 'D'}
              </div>
            </div>

            <div className="flex gap-2.5 mt-3.5">
              <a
                href={comercio?.instagram || 'https://www.instagram.com/dalalex_3'}
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 rounded-xl border border-white/10 flex items-center justify-center text-white/40 hover:text-white/60 hover:border-white/20 hover:bg-white/5 transition-all"
                aria-label="Instagram"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
              <a
                href={comercio?.facebook || 'https://www.facebook.com/profile.php?id=61576224881126&sk=about&locale=es_LA'}
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 rounded-xl border border-white/10 flex items-center justify-center text-white/40 hover:text-white/60 hover:border-white/20 hover:bg-white/5 transition-all"
                aria-label="Facebook"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
              <a
                href={`https://wa.me/${comercio?.telefono || '573001234567'}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 rounded-xl border border-white/10 flex items-center justify-center text-white/40 hover:text-white/60 hover:border-white/20 hover:bg-white/5 transition-all"
                aria-label="WhatsApp"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              </a>
            </div>
          </div>

          <div className="h-px bg-white/5 my-1" />

          <section className="py-1 pb-3">
            <h4 className="text-sm font-bold text-white/80 mb-3">Dirección</h4>
            <a
              href={`https://www.google.com/maps/search/${encodeURIComponent(comercio?.direccion || 'Cl. 12 #15-50, Valledupar, Cesar, Colombia')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-2.5 hover:bg-white/5 rounded-xl p-1 -mx-1 transition-colors"
            >
              <svg className="shrink-0 mt-0.5" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#C4956A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <span className="text-sm text-white/60 leading-relaxed underline underline-offset-2 decoration-white/10">{comercio?.direccion || 'Cl. 12 #15-50, Valledupar, Cesar, Colombia'}</span>
            </a>
          </section>

          <div className="h-px bg-white/5 my-1" />

          <section className="py-1 pb-3">
            <h4 className="text-sm font-bold text-white/80 mb-3">Tipos de servicio</h4>
            <div className="flex items-center justify-between p-3.5 rounded-xl border border-desert-500/20 bg-desert-500/5 mb-2">
              <div className="flex items-center gap-3">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#C4956A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="1" y="3" width="15" height="13" rx="2" />
                  <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                  <circle cx="5.5" cy="18.5" r="2.5" />
                  <circle cx="18.5" cy="18.5" r="2.5" />
                </svg>
                <span className="text-sm font-bold text-white/80">A domicilio</span>
              </div>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4CAF50" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            {comercio?.servicio_domicilio?.disponible && (
              <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-red-500/5 mb-3 text-xs font-medium text-white/60">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#E53935" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <span>Entrega por tan solo $ {comercio.servicio_domicilio.costo.toLocaleString('es-CO')}</span>
              </div>
            )}
            <div className="flex items-center justify-between p-3.5 rounded-xl border border-desert-500/20 bg-desert-500/5">
              <div className="flex items-center gap-3">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#C4956A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <path d="M16 10a4 4 0 0 1-8 0" />
                </svg>
                <span className="text-sm font-bold text-white/80">Para llevar</span>
              </div>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4CAF50" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
          </section>

          <div className="h-px bg-white/5 my-1" />

          <section className="py-1 pb-3">
            <h4 className="text-sm font-bold text-white/80 mb-3">Horarios de atención</h4>
            <div className="flex flex-col gap-0.5">
              {horarios.map((item, index) => {
                const isToday = index === hoy
                return (
                  <div
                    key={item.dia}
                    className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all ${
                      isToday ? 'bg-desert-500/10' : ''
                    }`}
                    aria-current={isToday ? 'true' : undefined}
                  >
                    <span className={`text-sm font-medium ${
                      isToday ? 'text-desert-400 font-bold' : 'text-white/80'
                    }`}>
                      {item.dia}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={isToday ? '#C4956A' : '#ffffff40'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12 6 12 12 16 14" />
                      </svg>
                      <span className={`text-xs ${
                        isToday ? 'text-desert-400 font-semibold' : 'text-white/40'
                      }`}>
                        {item.apertura} - {item.cierre}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          </section>

          <div className="text-center text-[10px] text-white/20 py-5 tracking-wider">
            Dalalex © {new Date().getFullYear()}
          </div>
        </div>
      </div>
    </div>
  )
}
