import productData from '../data/data.json'

interface ProductJson {
  name: string
  category: string
  price: number
  inStock: boolean
}

export interface Product {
  id: string
  name: string
  category: string
  price: number
  inStock: boolean
}

export interface ApiResponse<T> {
  data: T[]
  total: number
}

// simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export const fetchProducts = async (): Promise<ApiResponse<Product>> => {
  await delay(500)
  
  // convert JSON data to Product type with id
  const products = (productData as ProductJson[]).map((item, index) => ({
    ...item,
    id: `product-${index + 1}` // add unique id
  })) as Product[]
  
  return {
    data: products,
    total: products.length
  }
}

/**
 * get all categories
 */
export const fetchCategories = async (): Promise<string[]> => {
  await delay(300)
  
  // extract unique categories from data
  const products = productData as ProductJson[]
  const categories = [...new Set(products.map(product => product.category))]
  
  return categories.sort()
} 