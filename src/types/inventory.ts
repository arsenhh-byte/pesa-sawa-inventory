
export type Product = {
  id: string;
  name: string;
  description: string;
  category: string;
  sku: string;
  quantity: number;
  buyingPrice: number;
  sellingPrice: number;
  reorderLevel: number;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
};

export type Category = {
  id: string;
  name: string;
  description: string;
};

export type InventorySummary = {
  totalProducts: number;
  totalValue: number;
  lowStockItems: number;
  categoryCounts: Record<string, number>;
};
