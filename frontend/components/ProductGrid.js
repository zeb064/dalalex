import ProductCard from './ProductCard'

export default function ProductGrid({ categorias, productos, onSelectCategory, onAddToCart }) {
  return (
    <main className="main">
      {categorias.map(categoria => {
        const catProductos = productos.filter(p => p.categoria_id === categoria.id)
        if (catProductos.length === 0) return null

        return (
          <section
            key={categoria.id}
            id={`category-${categoria.id}`}
            className="category-section"
          >
            <h2 className="category-title">
              <span className="category-title-icon">{categoria.icono}</span>
              {categoria.nombre}
            </h2>
            <div className="product-grid">
              {catProductos.map(producto => (
                <ProductCard
                  key={producto.id}
                  product={producto}
                  onAddToCart={onAddToCart}
                />
              ))}
            </div>
          </section>
        )
      })}
    </main>
  )
}
