import { useQuery } from "@tanstack/react-query";
import { fetchProducts, fetchCategories, Product } from "../api/productApi";
import { useMemo } from "react";
import { useProductStore } from "../store/productStore";

// Pure filter functions
export const filterByCategoryFn = (products: Product[], categories: string[]) => {
  if (categories.length === 0) return products;
  return products.filter((product) => categories.includes(product.category));
};

export const filterBySearchFn = (products: Product[], searchTerm: string) => {
  if (!searchTerm) return products;
  const term = searchTerm.toLowerCase();
  return products.filter((product) =>
    product.name.toLowerCase().includes(term)
  );
};

export const filterByPriceRangeFn = (
  products: Product[],
  priceRange: { min: string; max: string }
) => {
  const { min, max } = priceRange;
  return products.filter((product) => {
    const price = product.price;
    const minPrice = min ? Number(min) : -Infinity;
    const maxPrice = max ? Number(max) : Infinity;
    return price >= minPrice && price <= maxPrice;
  });
};

export const filterByStockFn = (products: Product[], onlyInStock: boolean) => {
  if (!onlyInStock) return products;
  return products.filter((product) => product.inStock);
};

export const sortProductsFn = (
  products: Product[],
  sort: { field: "price" | null; order: "asc" | "desc" | null }
) => {
  const { field, order } = sort;
  if (!field || !order) return products;

  return [...products].sort((a, b) => {
    if (field === "price") {
      return order === "asc" ? a.price - b.price : b.price - a.price;
    }
    return 0;
  });
};

// Product list hook
export const useProductList = () => {
  // Get filter state and actions from store
  const {
    filterState,
    setFilterState,
    updateFilter,
    resetFilters,
    toggleCategory,
    setPriceRange,
    setSort
  } = useProductStore();
  
  // Fetch products data with React Query
  const productsQuery = useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  // Fetch categories data with React Query
  const categoriesQuery = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  // Get data from queries
  const products = useMemo(() => productsQuery.data?.data || [], [productsQuery.data]);
  const categories = useMemo(() => categoriesQuery.data || [], [categoriesQuery.data]);

  // Optimize filtered products with memoization
  const filteredProducts = useMemo(() => {
    let result = products;
    
    // Apply all filters in sequence
    result = filterByCategoryFn(result, filterState.categories);
    result = filterBySearchFn(result, filterState.searchTerm);
    result = filterByPriceRangeFn(result, filterState.priceRange);
    result = filterByStockFn(result, filterState.onlyInStock);
    result = sortProductsFn(result, filterState.sort);
    
    return result;
  }, [products, filterState]);

  // Handle search change
  const handleSearchChange = (searchTerm: string) => {
    updateFilter("searchTerm", searchTerm);
  };

  // Handle stock change
  const handleStockChange = (onlyInStock: boolean) => {
    updateFilter("onlyInStock", onlyInStock);
  };

  // Handle sort change
  const handleSortChange = (value: string) => {
    let field: "price" | null = null;
    let order: "asc" | "desc" | null = null;
    
    if (value === "asc") {
      field = "price";
      order = "asc";
    } else if (value === "desc") {
      field = "price";
      order = "desc";
    }
    
    setSort(field, order);
  };

  // Refresh data
  const refresh = () => {
    productsQuery.refetch();
    categoriesQuery.refetch();
  };

  return {
    // Data
    products: filteredProducts,
    allProducts: products,
    categories,
    
    // States
    isLoading: productsQuery.isPending || categoriesQuery.isPending,
    isError: productsQuery.isError || categoriesQuery.isError,
    
    // Filter state
    filterState,
    
    // Methods
    refresh,
    resetFilters,
    toggleCategory,
    setPriceRange,
    handleSearchChange,
    handleStockChange,
    handleSortChange,
    setFilterState,
    updateFilter,
  };
};
