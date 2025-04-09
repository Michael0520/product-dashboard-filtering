export interface Product {
  id: string
  name: string
  category: string
  price: number
  inStock: boolean
}

/**
 * generate mock product data
 * @param count number of products to generate
 * @returns product data array
 */
export function generateProducts(count: number = 10000): Product[] {
  // mock categories
  const categories = ['A', 'B', 'C', 'D']
  
  return Array(count).fill(null).map((_, index) => ({
    id: `product-${index + 1}`,
    name: `商品 ${index + 1}`,
    category: categories[Math.floor(Math.random() * categories.length)],
    price: Math.floor(Math.random() * 9900 + 100), // 100-10000 random price
    inStock: Math.random() > 0.3, // random 70% have stock
  }))
}

export function filterProducts(
  products: Product[], 
  {
    categories = [] as string[],
    searchTerm = '',
    minPrice = '',
    maxPrice = '',
    onlyInStock = false,
    sortOrder = null as 'asc' | 'desc' | null
  }
) {
  let filteredProducts = [...products]
  
  if (categories.length > 0) {
    filteredProducts = filteredProducts.filter(product => 
      categories.includes(product.category)
    )
  }
  
  if (searchTerm) {
    const keyword = searchTerm.toLowerCase()
    filteredProducts = filteredProducts.filter(product =>
      product.name.toLowerCase().includes(keyword)
    )
  }
  
  if (minPrice) {
    const min = parseFloat(minPrice)
    if (!isNaN(min)) {
      filteredProducts = filteredProducts.filter(product => 
        product.price >= min
      )
    }
  }
  
  if (maxPrice) {
    const max = parseFloat(maxPrice)
    if (!isNaN(max)) {
      filteredProducts = filteredProducts.filter(product => 
        product.price <= max
      )
    }
  }
  
  if (onlyInStock) {
    filteredProducts = filteredProducts.filter(product => 
      product.inStock
    )
  }
  
  if (sortOrder === 'asc') {
    filteredProducts.sort((a, b) => a.price - b.price)
  } else if (sortOrder === 'desc') {
    filteredProducts.sort((a, b) => b.price - a.price)
  }
  
  return filteredProducts
}

export default generateProducts 