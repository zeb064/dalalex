import { useState, useEffect, useCallback, useRef } from 'react'
import { motion } from 'framer-motion'
import dynamic from 'next/dynamic'
import Header from '../components/Header'
import ProductGrid from '../components/ProductGrid'
import CartFAB from '../components/CartFAB'
import CheckoutModal from '../components/CheckoutModal'
import InfoModal from '../components/InfoModal'
import SkeletonCard from '../components/SkeletonCard'
import type { ProductsData } from '../types'
import type { WaveSettings } from '../components/three/WaveBackground'

const Scene3D = dynamic(() => import('../components/three/Scene3D'), { ssr: false })

const API_URL = '/api/products'

export default function Home() {
  const [data, setData] = useState<ProductsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [showCart, setShowCart] = useState(false)
  const [showInfo, setShowInfo] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const [fabBounce, setFabBounce] = useState(false)
  const [waveSettings] = useState<WaveSettings>({
    intensityEnabled: false,
    speedEnabled: true,
    colorShiftEnabled: false,
    revealEnabled: true,
    rippleEnabled: false,
    auroraEnabled: true,
  })
  const categoryRefs = useRef<Record<string, HTMLElement | null>>({})
  const observerRef = useRef<IntersectionObserver | null>(null)
  const scrollRef = useRef(0)
  const gsapInit = useRef(false)

  useEffect(() => {
    fetch(API_URL)
      .then(res => {
        if (!res.ok) throw new Error('Error al cargar los datos')
        return res.json()
      })
      .then((json: ProductsData) => {
        setData(json)
        setLoading(false)
        if (json.categorias && json.categorias.length > 0) {
          setActiveCategory(json.categorias[0].id)
        }
      })
      .catch((err: Error) => {
        console.error(err)
        setError(err.message)
        setLoading(false)
      })
  }, [])

  useEffect(() => {
    if (gsapInit.current || typeof window === 'undefined') return
    gsapInit.current = true

    const initGSAP = async () => {
      const gsapModule = await import('gsap')
      const { ScrollTrigger } = await import('gsap/ScrollTrigger')
      const gsap = gsapModule.default
      gsap.registerPlugin(ScrollTrigger)

      ScrollTrigger.create({
        trigger: document.body,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.5,
        onUpdate: (self) => {
          scrollRef.current = self.progress
        },
      })
    }

    initGSAP()

    return () => {
      if (typeof window !== 'undefined') {
        import('gsap/ScrollTrigger').then(({ ScrollTrigger }) => {
          ScrollTrigger.getAll().forEach((t: any) => t.kill())
        })
      }
    }
  }, [])

  const showToast = useCallback((msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(null), 3000)
  }, [])

  const scrollToCategory = useCallback((categoryId: string) => {
    setActiveCategory(categoryId)
    const el = document.getElementById(`category-${categoryId}`)
    if (el) {
      const headerHeight = 130
      const top = el.getBoundingClientRect().top + window.pageYOffset - headerHeight
      window.scrollTo({ top, behavior: 'smooth' })
    }
  }, [])

  useEffect(() => {
    if (!data?.categorias || loading) return

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter(e => e.isIntersecting)
        if (visible.length > 0) {
          const id = visible[0].target.getAttribute('data-category-id')
          if (id) setActiveCategory(id)
        }
      },
      { rootMargin: '-110px 0px -55% 0px', threshold: 0 }
    )

    data.categorias.forEach(cat => {
      const el = document.getElementById(`category-${cat.id}`)
      if (el) observerRef.current?.observe(el)
    })

    return () => {
      if (observerRef.current) observerRef.current.disconnect()
    }
  }, [data, loading])

  const handleAddToCart = useCallback(() => {
    setFabBounce(true)
    setTimeout(() => setFabBounce(false), 400)
  }, [])

  if (error) {
    return (
      <div className="min-h-screen bg-night-900 flex flex-col items-center justify-center px-5 text-center gap-3">
        <div className="text-5xl">⚠️</div>
        <div className="text-lg font-bold text-white">Error al cargar el menú</div>
        <div className="text-sm text-white/50 max-w-xs">{error}</div>
        <button
          className="mt-2 px-7 py-3 bg-desert-500/30 text-white rounded-full text-sm font-semibold hover:bg-desert-500/50 transition-colors"
          onClick={() => window.location.reload()}
        >
          Intentar de nuevo
        </button>
      </div>
    )
  }

  return (
    <>
      <div className="fixed inset-0 -z-10">
        <Scene3D scrollRef={scrollRef} waveSettings={waveSettings} />
      </div>

      <div className="relative z-10 min-h-screen pb-24">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <Header
            comercio={data?.comercio || null}
            onWhatsApp={() => {}}
            onInfoClick={() => setShowInfo(true)}
            categorias={data?.categorias}
            activeCategory={activeCategory}
            onSelectCategory={scrollToCategory}
          />
        </motion.div>

        <div className="pt-[130px] px-0">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15, ease: 'easeOut' }}
          >
          {loading ? (
            <main className="max-w-[1200px] mx-auto px-4 md:px-6 lg:px-8">
              <div className="mb-8">
                <h2 className="flex items-center gap-2 text-xl font-bold mb-3.5 text-white">
                  <span className="w-40 h-6 rounded bg-white/10 animate-pulse inline-block" />
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 lg:gap-5">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <SkeletonCard key={i} />
                  ))}
                </div>
              </div>
            </main>
          ) : data ? (
            <ProductGrid
              categorias={data.categorias}
              productos={data.productos}
              onSelectCategory={scrollToCategory}
              onAddToCart={handleAddToCart}
            />
          ) : null}
          </motion.div>
        </div>

        <CartFAB onClick={() => setShowCart(true)} />

        <CheckoutModal
          show={showCart}
          onClose={() => setShowCart(false)}
          comercio={data?.comercio || null}
        />

        <InfoModal
          show={showInfo}
          onClose={() => setShowInfo(false)}
          comercio={data?.comercio || null}
        />

        <motion.footer
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35, ease: 'easeOut' }}
          className="mt-10 py-8 px-5 pb-20 border-t border-white/5 text-center"
        >
          <div className="max-w-[1200px] mx-auto flex flex-col items-center gap-4">
            <div className="text-lg font-extrabold text-desert-400 tracking-tight">
              {data?.comercio?.nombre || 'Dalalex'}
            </div>
            <p className="text-xs text-white/40 max-w-[400px] leading-relaxed">
              Tu tienda de confianza con los mejores productos y servicio rápido.
              Hacemos entregas en Valledupar y área metropolitana.
            </p>
            <div className="flex gap-5 flex-wrap justify-center">
              <a
                className="text-xs text-white/40 hover:text-desert-400 transition-colors"
                href={data?.comercio?.instagram || 'https://www.instagram.com/dalalex_3'}
                target="_blank"
                rel="noopener noreferrer"
              >
                Instagram
              </a>
              <a
                className="text-xs text-white/40 hover:text-desert-400 transition-colors"
                href={data?.comercio?.facebook || 'https://www.facebook.com/profile.php?id=61576224881126&sk=about&locale=es_LA'}
                target="_blank"
                rel="noopener noreferrer"
              >
                Facebook
              </a>
              <a
                className="text-xs text-white/40 hover:text-desert-400 transition-colors"
                href={`https://wa.me/${data?.comercio?.telefono || '573001234567'}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                WhatsApp
              </a>
            </div>
            <div className="text-[10px] text-white/20">
              &copy; {new Date().getFullYear()} {data?.comercio?.nombre || 'Dalalex'}. Todos los derechos reservados.
            </div>

          </div>
        </motion.footer>

        {toast && (
          <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[200] bg-white/10 backdrop-blur-xl text-white px-6 py-3 rounded-full text-sm font-medium shadow-lg animate-[toastIn_0.3s_ease,_toastOut_0.3s_ease_2.7s_forwards] pointer-events-none whitespace-nowrap border border-white/5">
            {toast}
          </div>
        )}
      </div>
    </>
  )
}
