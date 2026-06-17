import { useState, useEffect, useCallback, useRef } from 'react'
import Header from '../components/Header'
import CategoryNav from '../components/CategoryNav'
import ProductGrid from '../components/ProductGrid'
import CartFAB from '../components/CartFAB'
import CheckoutModal from '../components/CheckoutModal'
import InfoModal from '../components/InfoModal'
import SkeletonCard from '../components/SkeletonCard'

const API_URL = 'http://localhost:3001/api/products'

export default function Home() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeCategory, setActiveCategory] = useState(null)
  const [showCart, setShowCart] = useState(false)
  const [showInfo, setShowInfo] = useState(false)
  const [toast, setToast] = useState(null)
  const [fabBounce, setFabBounce] = useState(false)
  const categoryRefs = useRef({})
  const observerRef = useRef(null)

  useEffect(() => {
    fetch(API_URL)
      .then(res => {
        if (!res.ok) throw new Error('Error al cargar los datos')
        return res.json()
      })
      .then(json => {
        setData(json)
        setLoading(false)
        if (json.categorias && json.categorias.length > 0) {
          setActiveCategory(json.categorias[0].id)
        }
      })
      .catch(err => {
        console.error(err)
        setError(err.message)
        setLoading(false)
      })
  }, [])

  const showToast = useCallback((msg) => {
    setToast(msg)
    setTimeout(() => setToast(null), 3000)
  }, [])

  const scrollToCategory = useCallback((categoryId) => {
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

    observerRef.current = new IntersectionObserver((entries) => {
      const visible = entries.filter(e => e.isIntersecting)
      if (visible.length > 0) {
        const id = visible[0].target.dataset.categoryId
        setActiveCategory(id)
      }
    }, {
      rootMargin: '-80px 0px -60% 0px',
      threshold: 0
    })

    data.categorias.forEach(cat => {
      const el = document.getElementById(`category-${cat.id}`)
      if (el) observerRef.current.observe(el)
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
      <div className="error-state">
        <div className="error-state-icon">⚠️</div>
        <div className="error-state-title">Error al cargar el menu</div>
        <div className="error-state-desc">{error}</div>
        <button className="error-state-btn" onClick={() => window.location.reload()}>
          Intentar de nuevo
        </button>
      </div>
    )
  }

  return (
    <>
      <Header
        comercio={data?.comercio}
        onWhatsApp={() => {}}
        onInfoClick={() => setShowInfo(true)}
      />

      {!loading && data?.categorias && (
        <CategoryNav
          categorias={data.categorias}
          activeCategory={activeCategory}
          onSelectCategory={scrollToCategory}
        />
      )}

      {loading ? (
        <main className="main">
          <div className="category-section">
            <h2 className="category-title">
              <span style={{ width: 160, height: 24, background: '#F0EDE8', borderRadius: 4, display: 'inline-block' }} />
            </h2>
            <div className="product-grid">
              {Array.from({ length: 6 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          </div>
        </main>
      ) : (
        <ProductGrid
          categorias={data.categorias}
          productos={data.productos}
          onSelectCategory={scrollToCategory}
          onAddToCart={handleAddToCart}
        />
      )}

      <CartFAB
        onClick={() => setShowCart(true)}
        bounce={fabBounce}
      />

      <CheckoutModal
        show={showCart}
        onClose={() => setShowCart(false)}
        comercio={data?.comercio}
      />

      <InfoModal
        show={showInfo}
        onClose={() => setShowInfo(false)}
        comercio={data?.comercio}
      />

      <footer className="page-footer">
        <div className="page-footer-inner">
          <div className="page-footer-brand">{data?.comercio?.nombre || 'Dalalex'}</div>
          <p className="page-footer-desc">
            Tu tienda de confianza con los mejores productos y servicio rápido. 
            Hacemos entregas en Valledupar y área metropolitana.
          </p>
          <div className="page-footer-links">
            <a className="page-footer-link" href={data?.comercio?.instagram || 'https://www.instagram.com/dalalex_3'} target="_blank" rel="noopener noreferrer">Instagram</a>
            <a className="page-footer-link" href={data?.comercio?.facebook || 'https://www.facebook.com/profile.php?id=61576224881126&sk=about&locale=es_LA'} target="_blank" rel="noopener noreferrer">Facebook</a>
            <a className="page-footer-link" href={`https://wa.me/${data?.comercio?.telefono || '573001234567'}`} target="_blank" rel="noopener noreferrer">WhatsApp</a>
          </div>
          <div className="page-footer-copy">
            &copy; {new Date().getFullYear()} {data?.comercio?.nombre || 'Dalalex'}. Todos los derechos reservados.
          </div>
          <div className="page-footer-version">
            version 1.0.0
          </div>
        </div>
      </footer>

      {toast && <div className="toast">{toast}</div>}
    </>
  )
}
