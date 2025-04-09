import { useState, useEffect } from 'react'
import { 
  ChevronDown, 
  ChevronUp, 
  Search, 
  Filter, 
  X,
  SlidersHorizontal 
} from 'lucide-react'

// Import data generation and filtering functions
import { generateProducts, filterProducts, Product } from '../data/generateData'

import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Checkbox } from "../components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table"
import { Badge } from "../components/ui/badge"
import { ThemeToggle } from "../components/ThemeToggle"

const ProductList = () => {
  // Product data states
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  
  // Filter and sort states
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | null>(null)
  const [filters, setFilters] = useState({
    categories: [] as string[],
    searchTerm: '',
    minPrice: '',
    maxPrice: '',
    onlyInStock: false,
  })
  
  // Initialize product data
  useEffect(() => {
    const initialProducts = generateProducts(100)
    setProducts(initialProducts)
    setFilteredProducts(initialProducts)
  }, [])
  
  // Update filtered data when filters or sort order changes
  useEffect(() => {
    const filtered = filterProducts(products, {
      ...filters,
      sortOrder
    })
    setFilteredProducts(filtered)
  }, [filters, sortOrder, products])
  
  // Handle filter state changes
  const handleFilterChange = (
    filterType: keyof typeof filters,
    value: string | boolean | string[]
  ) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }))
  }
  
  // Handle category selection
  const handleCategoryChange = (category: string) => {
    setFilters((prev) => {
      const categories = [...prev.categories]
      if (categories.includes(category)) {
        return {
          ...prev,
          categories: categories.filter((c) => c !== category),
        }
      } else {
        return {
          ...prev,
          categories: [...categories, category],
        }
      }
    })
  }
  
  // Toggle sort order: asc -> desc -> none
  const toggleSortOrder = () => {
    if (sortOrder === 'asc') {
      setSortOrder('desc')
    } else if (sortOrder === 'desc') {
      setSortOrder(null)
    } else {
      setSortOrder('asc')
    }
  }
  
  // Reset all filters and sort order
  const resetFilters = () => {
    setFilters({
      categories: [],
      searchTerm: '',
      minPrice: '',
      maxPrice: '',
      onlyInStock: false,
    })
    setSortOrder(null)
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-50">商品列表</h1>
        <ThemeToggle />
      </div>
      
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative w-full md:w-1/3">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400" size={18} />
          <Input
            type="text"
            placeholder="搜尋商品名稱..."
            value={filters.searchTerm}
            onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Button
          variant="outline"
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className="flex items-center md:hidden"
        >
          <Filter size={18} className="mr-2" />
          篩選
        </Button>
        
        <Button
          variant="outline"
          onClick={toggleSortOrder}
          className="flex items-center"
        >
          <SlidersHorizontal size={18} className="mr-2" />
          價格排序
          {sortOrder === 'asc' && <ChevronUp className="ml-2" size={18} />}
          {sortOrder === 'desc' && <ChevronDown className="ml-2" size={18} />}
        </Button>
      </div>
      
      <div className={`mb-6 ${isFilterOpen ? 'block' : 'hidden md:block'}`}>
        <Card className="border dark:border-gray-800 dark:bg-gray-950/50">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg text-gray-900 dark:text-gray-100">進階篩選</CardTitle>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setIsFilterOpen(false)}
                className="md:hidden"
              >
                <X size={18} />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h3 className="font-medium mb-3 text-sm text-gray-600 dark:text-gray-400">類別</h3>
                <div className="space-y-2">
                  {['A', 'B', 'C', 'D'].map((category) => (
                    <div key={category} className="flex items-center space-x-2">
                      <Checkbox
                        id={`category-${category}`}
                        checked={filters.categories.includes(category)}
                        onCheckedChange={() => handleCategoryChange(category)}
                      />
                      <label 
                        htmlFor={`category-${category}`}
                        className="text-sm leading-none text-gray-700 dark:text-gray-300 peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        類別 {category}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="font-medium mb-3 text-sm text-gray-600 dark:text-gray-400">價格範圍</h3>
                <div className="flex items-center space-x-2">
                  <Input
                    type="number"
                    placeholder="最低價"
                    value={filters.minPrice}
                    onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                  />
                  <span className="text-gray-500 dark:text-gray-400">-</span>
                  <Input
                    type="number"
                    placeholder="最高價"
                    value={filters.maxPrice}
                    onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                  />
                </div>
              </div>
              
              <div>
                <h3 className="font-medium mb-3 text-sm text-gray-600 dark:text-gray-400">庫存狀態</h3>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="in-stock"
                    checked={filters.onlyInStock}
                    onCheckedChange={(checked) => 
                      handleFilterChange('onlyInStock', checked === true)
                    }
                  />
                  <label 
                    htmlFor="in-stock"
                    className="text-sm leading-none text-gray-700 dark:text-gray-300 peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    僅顯示有庫存商品
                  </label>
                </div>
              </div>
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={resetFilters}
              className="mt-6"
            >
              重置篩選條件
            </Button>
          </CardContent>
        </Card>
      </div>
      
      <div className="mb-4 text-sm text-gray-500 dark:text-gray-400">
        共找到 {filteredProducts.length} 個商品
      </div>
      
      {/* Desktop table view */}
      <div className="rounded-md border overflow-hidden hidden md:block border-gray-200 dark:border-gray-800">
        <Table>
          <TableHeader className="bg-gray-50 dark:bg-gray-900">
            <TableRow className="border-gray-200 dark:border-gray-800">
              <TableHead className="text-gray-700 dark:text-gray-200">商品名稱</TableHead>
              <TableHead className="text-gray-700 dark:text-gray-200">類別</TableHead>
              <TableHead className="text-gray-700 dark:text-gray-200">
                <div className="flex items-center">
                  價格
                  {sortOrder === 'asc' && <ChevronUp className="ml-1" size={16} />}
                  {sortOrder === 'desc' && <ChevronDown className="ml-1" size={16} />}
                </div>
              </TableHead>
              <TableHead className="text-gray-700 dark:text-gray-200">庫存狀態</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="bg-white dark:bg-gray-950">
            {filteredProducts.map((product) => (
              <TableRow key={product.id} className="border-gray-200 hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-900">
                <TableCell className="font-medium text-gray-900 dark:text-gray-100">{product.name}</TableCell>
                <TableCell className="text-gray-700 dark:text-gray-300">{product.category}</TableCell>
                <TableCell className="text-gray-700 dark:text-gray-300">${product.price}</TableCell>
                <TableCell>
                  <Badge variant={product.inStock ? "default" : "destructive"}>
                    {product.inStock ? '有庫存' : '無庫存'}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      {/* Mobile card view */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:hidden">
        {filteredProducts.map((product) => (
          <Card key={product.id} className="border dark:border-gray-800 dark:bg-gray-950/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg text-gray-900 dark:text-gray-100">{product.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500 dark:text-gray-400">類別</span>
                  <span className="text-gray-700 dark:text-gray-300">{product.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500 dark:text-gray-400">價格</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">${product.price}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500 dark:text-gray-400">庫存</span>
                  <Badge variant={product.inStock ? "default" : "destructive"}>
                    {product.inStock ? '有庫存' : '無庫存'}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default ProductList 