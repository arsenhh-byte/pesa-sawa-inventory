
import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { Product, Category, InventorySummary } from "@/types/inventory";
import { calculateInventoryValue } from "@/lib/formatters";
import { toast } from "sonner";

// Mock initial data
const initialProducts: Product[] = [
  {
    id: "1",
    name: "Maize Flour (2kg)",
    description: "Premium maize flour for ugali",
    category: "Food",
    sku: "FL-001",
    quantity: 45,
    buyingPrice: 120,
    sellingPrice: 150,
    reorderLevel: 10,
    imageUrl: "/placeholder.svg",
    createdAt: new Date('2023-01-15'),
    updatedAt: new Date('2023-01-15'),
  },
  {
    id: "2",
    name: "Sugar (1kg)",
    description: "Refined white sugar",
    category: "Food",
    sku: "SG-001",
    quantity: 32,
    buyingPrice: 130,
    sellingPrice: 160,
    reorderLevel: 15,
    imageUrl: "/placeholder.svg",
    createdAt: new Date('2023-01-20'),
    updatedAt: new Date('2023-01-20'),
  },
  {
    id: "3",
    name: "Cooking Oil (5L)",
    description: "Vegetable cooking oil",
    category: "Food",
    sku: "CO-001",
    quantity: 18,
    buyingPrice: 850,
    sellingPrice: 950,
    reorderLevel: 5,
    imageUrl: "/placeholder.svg",
    createdAt: new Date('2023-02-01'),
    updatedAt: new Date('2023-02-01'),
  },
  {
    id: "4",
    name: "Notebook (100 pages)",
    description: "Ruled notebook for students",
    category: "Stationery",
    sku: "ST-001",
    quantity: 120,
    buyingPrice: 50,
    sellingPrice: 80,
    reorderLevel: 30,
    imageUrl: "/placeholder.svg",
    createdAt: new Date('2023-02-10'),
    updatedAt: new Date('2023-02-10'),
  },
  {
    id: "5",
    name: "Ballpoint Pens (box)",
    description: "Box of 12 blue ballpoint pens",
    category: "Stationery",
    sku: "ST-002",
    quantity: 25,
    buyingPrice: 120,
    sellingPrice: 200,
    reorderLevel: 10,
    imageUrl: "/placeholder.svg",
    createdAt: new Date('2023-02-15'),
    updatedAt: new Date('2023-02-15'),
  },
  {
    id: "6",
    name: "Laundry Soap",
    description: "Multi-purpose laundry soap bar",
    category: "Household",
    sku: "HH-001",
    quantity: 80,
    buyingPrice: 35,
    sellingPrice: 50,
    reorderLevel: 20,
    imageUrl: "/placeholder.svg",
    createdAt: new Date('2023-02-20'),
    updatedAt: new Date('2023-02-20'),
  },
  {
    id: "7",
    name: "Toilet Paper (6 rolls)",
    description: "Soft toilet paper pack",
    category: "Household",
    sku: "HH-002",
    quantity: 40,
    buyingPrice: 250,
    sellingPrice: 320,
    reorderLevel: 15,
    imageUrl: "/placeholder.svg",
    createdAt: new Date('2023-03-01'),
    updatedAt: new Date('2023-03-01'),
  },
  {
    id: "8",
    name: "Bread",
    description: "Fresh sliced bread",
    category: "Food",
    sku: "FD-003",
    quantity: 5,
    buyingPrice: 45,
    sellingPrice: 55,
    reorderLevel: 10,
    imageUrl: "/placeholder.svg",
    createdAt: new Date('2023-03-10'),
    updatedAt: new Date('2023-03-10'),
  },
];

const initialCategories: Category[] = [
  { id: "1", name: "Food", description: "Edible products" },
  { id: "2", name: "Stationery", description: "Office and school supplies" },
  { id: "3", name: "Household", description: "Home and cleaning products" },
];

interface InventoryContextType {
  products: Product[];
  categories: Category[];
  summary: InventorySummary;
  addProduct: (product: Omit<Product, "id" | "createdAt" | "updatedAt">) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  addCategory: (category: Omit<Category, "id">) => void;
  getProductById: (id: string) => Product | undefined;
  filterProducts: (
    searchTerm: string,
    category?: string,
    lowStock?: boolean
  ) => Product[];
  updateStock: (id: string, quantity: number) => void;
}

const InventoryContext = createContext<InventoryContextType | undefined>(undefined);

export function InventoryProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [summary, setSummary] = useState<InventorySummary>({
    totalProducts: 0,
    totalValue: 0,
    lowStockItems: 0,
    categoryCounts: {},
  });

  // Update summary when products change
  useEffect(() => {
    const categoryCounts: Record<string, number> = {};
    let lowStockItems = 0;

    products.forEach((product) => {
      // Count by category
      if (categoryCounts[product.category]) {
        categoryCounts[product.category]++;
      } else {
        categoryCounts[product.category] = 1;
      }

      // Count low stock items
      if (product.quantity <= product.reorderLevel) {
        lowStockItems++;
      }
    });

    setSummary({
      totalProducts: products.length,
      totalValue: calculateInventoryValue(products),
      lowStockItems,
      categoryCounts,
    });
  }, [products]);

  const addProduct = (
    product: Omit<Product, "id" | "createdAt" | "updatedAt">
  ) => {
    const newProduct: Product = {
      ...product,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setProducts([...products, newProduct]);
    toast.success("Product added successfully");
  };

  const updateProduct = (id: string, updatedFields: Partial<Product>) => {
    setProducts(
      products.map((product) =>
        product.id === id
          ? { ...product, ...updatedFields, updatedAt: new Date() }
          : product
      )
    );
    toast.success("Product updated successfully");
  };

  const deleteProduct = (id: string) => {
    setProducts(products.filter((product) => product.id !== id));
    toast.success("Product deleted successfully");
  };

  const addCategory = (category: Omit<Category, "id">) => {
    const newCategory: Category = {
      ...category,
      id: Date.now().toString(),
    };
    setCategories([...categories, newCategory]);
    toast.success("Category added successfully");
  };

  const getProductById = (id: string) => {
    return products.find((product) => product.id === id);
  };

  const filterProducts = (
    searchTerm: string,
    category?: string,
    lowStock?: boolean
  ) => {
    return products.filter((product) => {
      // Filter by search term
      const matchesSearch =
        !searchTerm ||
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.sku.toLowerCase().includes(searchTerm.toLowerCase());

      // Filter by category - now handling the "all" value correctly
      const matchesCategory = !category || category === "all" || product.category === category;

      // Filter by low stock
      const matchesLowStock = !lowStock || product.quantity <= product.reorderLevel;

      return matchesSearch && matchesCategory && (lowStock ? matchesLowStock : true);
    });
  };

  const updateStock = (id: string, quantity: number) => {
    setProducts(
      products.map((product) =>
        product.id === id
          ? { ...product, quantity, updatedAt: new Date() }
          : product
      )
    );
    toast.success("Stock updated successfully");
  };

  return (
    <InventoryContext.Provider
      value={{
        products,
        categories,
        summary,
        addProduct,
        updateProduct,
        deleteProduct,
        addCategory,
        getProductById,
        filterProducts,
        updateStock,
      }}
    >
      {children}
    </InventoryContext.Provider>
  );
}

export const useInventory = () => {
  const context = useContext(InventoryContext);
  if (context === undefined) {
    throw new Error("useInventory must be used within an InventoryProvider");
  }
  return context;
};
