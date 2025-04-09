import React,{ useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Checkbox } from "../components/ui/checkbox";
import { Card } from "../components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { Skeleton } from "../components/ui/skeleton";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../components/ui/select";
import { Product, fetchProducts, fetchCategories } from "../api/productApi";
import { useQuery } from "@tanstack/react-query";
import { Badge } from "../components/ui/badge";

const ProductList = () => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc" | null>(null);

  const productsQuery = useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });

  const categoriesQuery = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  const filterProducts = (products: Product[]) => {
    let filtered = [...products];

    if (selectedCategories.length > 0) {
      filtered = filtered.filter((product) =>
        selectedCategories.includes(product.category)
      );
    }

    if (searchTerm) {
      const keyword = searchTerm.toLowerCase();
      filtered = filtered.filter((product) =>
        product.name.toLowerCase().includes(keyword)
      );
    }

    if (minPrice) {
      const min = parseFloat(minPrice);
      if (!isNaN(min)) {
        filtered = filtered.filter((product) => product.price >= min);
      }
    }

    if (maxPrice) {
      const max = parseFloat(maxPrice);
      if (!isNaN(max)) {
        filtered = filtered.filter((product) => product.price <= max);
      }
    }

    if (onlyInStock) {
      filtered = filtered.filter((product) => product.inStock);
    }

    if (sortOrder === "asc") {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortOrder === "desc") {
      filtered.sort((a, b) => b.price - a.price);
    }

    return filtered;
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategories((prev) => {
      if (prev.includes(category)) {
        return prev.filter((c) => c !== category);
      } else {
        return [...prev, category];
      }
    });
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSortChange = (value: string) => {
    setSortOrder(value as "asc" | "desc" | null);
  };

  const resetFilters = () => {
    setSelectedCategories([]);
    setSearchTerm("");
    setMinPrice("");
    setMaxPrice("");
    setOnlyInStock(false);
    setSortOrder(null);
  };

  let filteredProducts: Product[] = [];

  if (productsQuery.data) {
    filteredProducts = filterProducts(productsQuery.data.data);
  }

  if (productsQuery.isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">商品列表</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <Card key={index} className="p-4">
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2 mb-4" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-3/4" />
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-50">商品列表</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="space-y-4">
          <h2 className="font-semibold">篩選條件</h2>

          {/* Category Filter */}
          <div>
            <h3 className="text-sm mb-2">分類</h3>
            {categoriesQuery.isLoading ? (
              <Skeleton className="h-[100px]" />
            ) : (
              <div className="space-y-1">
                {categoriesQuery.data?.map((category) => (
                  <div key={category} className="flex items-center">
                    <Checkbox
                      id={`category-${category}`}
                      checked={selectedCategories.includes(category)}
                      onCheckedChange={() => handleCategoryChange(category)}
                    />
                    <label
                      htmlFor={`category-${category}`}
                      className="ml-2 text-sm"
                    >
                      {category}
                    </label>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Keyword Search */}
          <div>
            <h3 className="text-sm mb-2">Search</h3>
            <Input
              type="text"
              placeholder="商品名稱"
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>

          {/* Price Range */}
          <div>
            <h3 className="text-sm mb-2">Price Range</h3>
            <div className="flex space-x-2">
              <Input
                type="number"
                placeholder="最低價"
                value={minPrice}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setMinPrice(e.target.value);
                }}
                className="w-1/2"
              />
              <Input
                type="number"
                placeholder="最高價"
                value={maxPrice}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setMaxPrice(e.target.value);
                }}
                className="w-1/2"
              />
            </div>
          </div>

          {/* Stock Filter */}
          <div className="flex items-center">
            <Checkbox
              id="stock-filter"
              checked={onlyInStock}
              onCheckedChange={(checked: boolean) => {
                setOnlyInStock(checked);
              }}
            />
            <label htmlFor="stock-filter" className="ml-2 text-sm">
              只顯示有庫存
            </label>
          </div>

          {/* Sort Options */}
          <div>
            <h3 className="text-sm mb-2">排序方式</h3>
            <Select
              value={sortOrder || "default"}
              onValueChange={handleSortChange}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="請選擇排序方式" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">預設排序</SelectItem>
                <SelectItem value="asc">價格由低到高</SelectItem>
                <SelectItem value="desc">價格由高到低</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Reset Filters */}
          <Button onClick={resetFilters} variant="outline" className="w-full">
            重置篩選
          </Button>
        </div>

        {/* Product List Area */}
        <div className="md:col-span-3">
          {productsQuery.isLoading ? (
            // Loading State
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <Card key={i} className="p-4">
                  <Skeleton className="h-[200px] mb-4" />
                  <Skeleton className="h-4 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2" />
                </Card>
              ))}
            </div>
          ) : productsQuery.isError ? (
            // Error State
            <div className="text-center p-8">
              <p className="text-red-500">載入數據時發生錯誤</p>
              <Button onClick={() => productsQuery.refetch()} className="mt-4">
                重試
              </Button>
            </div>
          ) : (
            // Data Length Display
            <>
              <div className="mb-4 flex justify-between items-center">
                <p className="text-sm text-gray-500">
                  共 {filteredProducts.length} 件商品
                </p>
              </div>

              {/* Desktop View: Table Display */}
              <div className="hidden md:block overflow-hidden rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>商品名稱</TableHead>
                      <TableHead>分類</TableHead>
                      <TableHead>價格</TableHead>
                      <TableHead>庫存</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProducts.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell>{product.name}</TableCell>
                        <TableCell>{product.category}</TableCell>
                        <TableCell>{product.price}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              product.inStock ? "default" : "destructive"
                            }
                          >
                            {product.inStock ? "有庫存" : "無庫存"}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Mobile View: Card Display */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:hidden">
                {filteredProducts.map((product) => (
                  <Card key={product.id} className="p-4">
                    <h3 className="font-semibold mb-2">{product.name}</h3>
                    <div className="space-y-1 text-sm">
                      <p className="text-gray-600">分類：{product.category}</p>
                      <p className="text-gray-600">價錢：{product.price}</p>
                      <div className="text-gray-600 flex items-center gap-2 mt-2">
                        狀態：
                        <Badge
                          variant={product.inStock ? "default" : "destructive"}
                        >
                          {product.inStock ? "有庫存" : "無庫存"}
                        </Badge>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductList;
