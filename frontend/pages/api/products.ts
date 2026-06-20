import type { NextApiRequest, NextApiResponse } from 'next'
import type { ProductsData } from '../../types'
import productsData from '../../data/products.json'

export default function handler(
  _req: NextApiRequest,
  res: NextApiResponse<ProductsData>
) {
  res.status(200).json(productsData as ProductsData)
}
