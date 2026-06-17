import { useRef, useEffect } from 'react'

export default function CategoryNav({ categorias, activeCategory, onSelectCategory }) {
  const scrollRef = useRef(null)

  useEffect(() => {
    if (activeCategory && scrollRef.current) {
      const activeEl = scrollRef.current.querySelector(`[data-id="${activeCategory}"]`)
      if (activeEl) {
        activeEl.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
      }
    }
  }, [activeCategory])

  return (
    <nav className="category-nav">
      <div className="category-nav-inner" ref={scrollRef}>
        {categorias.map(cat => (
          <button
            key={cat.id}
            data-id={cat.id}
            className={`category-pill ${activeCategory === cat.id ? 'active' : ''}`}
            onClick={() => onSelectCategory(cat.id)}
          >
            <span className="category-pill-icon">{cat.icono}</span>
            {cat.nombre}
          </button>
        ))}
      </div>
    </nav>
  )
}
