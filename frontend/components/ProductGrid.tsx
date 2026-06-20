import { Categoria, Producto } from '../types'
import ProductCard from './ProductCard'

interface ProductGridProps {
  categorias: Categoria[]
  productos: Producto[]
  onSelectCategory: (id: string) => void
  onAddToCart: () => void
}

export default function ProductGrid({ categorias, productos, onAddToCart }: ProductGridProps) {
  return (
    <main className="max-w-[1200px] mx-auto px-4 md:px-6 lg:px-8 pb-8">
      {categorias.map(categoria => {
        const catProductos = productos.filter(p => p.categoria_id === categoria.id)
        if (catProductos.length === 0) return null

        return (
          <section
            key={categoria.id}
            id={`category-${categoria.id}`}
            className="section-fade mb-8 last:mb-6"
          >
            <h2 className="flex items-center gap-2 text-xl font-bold mb-3.5 text-white">
              {categoria.icono && <span className="text-2xl">{categoria.icono}</span>}
              {categoria.nombre}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 lg:gap-5">
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
