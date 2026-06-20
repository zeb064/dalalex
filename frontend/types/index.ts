export interface ProductoOption {
  nombre: string
  precio: number
}

export interface Producto {
  id: string
  categoria_id: string
  nombre: string
  descripcion?: string
  imagen?: string
  precio?: number
  opciones?: ProductoOption[]
  _cartKey?: string
  _optionIndex?: number
  opcionNombre?: string
}

export interface Categoria {
  id: string
  nombre: string
  icono?: string
}

export interface Horario {
  dia: string
  apertura: string
  cierre: string
}

export interface Comercio {
  nombre: string
  estado: string
  horario: string
  telefono: string
  direccion: string
  instagram?: string
  facebook?: string
  servicio_domicilio?: {
    disponible: boolean
    costo: number
  }
  horarios?: Horario[]
}

export interface ProductsData {
  comercio: Comercio
  categorias: Categoria[]
  productos: Producto[]
}

export interface CartItem extends Producto {
  _cartKey: string
  _optionIndex?: number
  opcionNombre?: string
  precio: number
  quantity: number
}
