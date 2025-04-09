
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useInventory } from "@/contexts/InventoryContext";
import { Product } from "@/types/inventory";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { ArrowLeft, Save } from "lucide-react";

type ProductFormData = Omit<Product, "id" | "createdAt" | "updatedAt">;

const emptyProduct: ProductFormData = {
  name: "",
  description: "",
  category: "",
  sku: "",
  quantity: 0,
  buyingPrice: 0,
  sellingPrice: 0,
  reorderLevel: 0,
  imageUrl: "/placeholder.svg",
};

const ProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getProductById, addProduct, updateProduct, categories } = useInventory();
  
  const [formData, setFormData] = useState<ProductFormData>(emptyProduct);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const isEditMode = id !== "new" && id !== undefined;

  useEffect(() => {
    if (isEditMode) {
      const product = getProductById(id as string);
      if (product) {
        setFormData({
          name: product.name,
          description: product.description,
          category: product.category,
          sku: product.sku,
          quantity: product.quantity,
          buyingPrice: product.buyingPrice,
          sellingPrice: product.sellingPrice,
          reorderLevel: product.reorderLevel,
          imageUrl: product.imageUrl,
        });
      } else {
        navigate("/products");
      }
    }
  }, [id, getProductById, isEditMode, navigate]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Product name is required";
    }

    if (!formData.category) {
      newErrors.category = "Category is required";
    }

    if (!formData.sku.trim()) {
      newErrors.sku = "SKU is required";
    }

    if (formData.quantity < 0) {
      newErrors.quantity = "Quantity cannot be negative";
    }

    if (formData.buyingPrice < 0) {
      newErrors.buyingPrice = "Buying price cannot be negative";
    }

    if (formData.sellingPrice < 0) {
      newErrors.sellingPrice = "Selling price cannot be negative";
    }

    if (formData.reorderLevel < 0) {
      newErrors.reorderLevel = "Reorder level cannot be negative";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    
    // Convert numeric fields
    if (["quantity", "buyingPrice", "sellingPrice", "reorderLevel"].includes(name)) {
      setFormData({
        ...formData,
        [name]: value === "" ? 0 : Number(value),
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSelectChange = (value: string, name: string) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    
    try {
      if (isEditMode) {
        updateProduct(id as string, formData);
      } else {
        addProduct(formData);
      }
      navigate("/products");
    } catch (error) {
      console.error("Error saving product:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div className="flex items-center mb-6 gap-4">
        <Button 
          variant="outline" 
          onClick={() => navigate("/products")}
          size="icon"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold">
          {isEditMode ? "Edit Product" : "Add New Product"}
        </h1>
      </div>

      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Product Information</CardTitle>
            <CardDescription>
              Enter the details of the product below.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Product Name */}
              <div className="space-y-2">
                <Label htmlFor="name">
                  Product Name <span className="text-inventory-danger">*</span>
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter product name"
                  className={errors.name ? "border-inventory-danger" : ""}
                />
                {errors.name && (
                  <p className="text-inventory-danger text-sm">{errors.name}</p>
                )}
              </div>

              {/* SKU */}
              <div className="space-y-2">
                <Label htmlFor="sku">
                  SKU <span className="text-inventory-danger">*</span>
                </Label>
                <Input
                  id="sku"
                  name="sku"
                  value={formData.sku}
                  onChange={handleChange}
                  placeholder="Enter product SKU"
                  className={errors.sku ? "border-inventory-danger" : ""}
                />
                {errors.sku && (
                  <p className="text-inventory-danger text-sm">{errors.sku}</p>
                )}
              </div>

              {/* Category */}
              <div className="space-y-2">
                <Label htmlFor="category">
                  Category <span className="text-inventory-danger">*</span>
                </Label>
                <Select 
                  value={formData.category} 
                  onValueChange={(value) => handleSelectChange(value, "category")}
                >
                  <SelectTrigger 
                    id="category"
                    className={errors.category ? "border-inventory-danger" : ""}
                  >
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.name}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.category && (
                  <p className="text-inventory-danger text-sm">{errors.category}</p>
                )}
              </div>

              {/* Quantity */}
              <div className="space-y-2">
                <Label htmlFor="quantity">
                  Quantity <span className="text-inventory-danger">*</span>
                </Label>
                <Input
                  id="quantity"
                  name="quantity"
                  type="number"
                  value={formData.quantity}
                  onChange={handleChange}
                  placeholder="0"
                  min="0"
                  className={errors.quantity ? "border-inventory-danger" : ""}
                />
                {errors.quantity && (
                  <p className="text-inventory-danger text-sm">{errors.quantity}</p>
                )}
              </div>

              {/* Buying Price */}
              <div className="space-y-2">
                <Label htmlFor="buyingPrice">
                  Buying Price (KES) <span className="text-inventory-danger">*</span>
                </Label>
                <Input
                  id="buyingPrice"
                  name="buyingPrice"
                  type="number"
                  value={formData.buyingPrice}
                  onChange={handleChange}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  className={errors.buyingPrice ? "border-inventory-danger" : ""}
                />
                {errors.buyingPrice && (
                  <p className="text-inventory-danger text-sm">{errors.buyingPrice}</p>
                )}
              </div>

              {/* Selling Price */}
              <div className="space-y-2">
                <Label htmlFor="sellingPrice">
                  Selling Price (KES) <span className="text-inventory-danger">*</span>
                </Label>
                <Input
                  id="sellingPrice"
                  name="sellingPrice"
                  type="number"
                  value={formData.sellingPrice}
                  onChange={handleChange}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  className={errors.sellingPrice ? "border-inventory-danger" : ""}
                />
                {errors.sellingPrice && (
                  <p className="text-inventory-danger text-sm">{errors.sellingPrice}</p>
                )}
              </div>

              {/* Reorder Level */}
              <div className="space-y-2">
                <Label htmlFor="reorderLevel">
                  Reorder Level <span className="text-inventory-danger">*</span>
                </Label>
                <Input
                  id="reorderLevel"
                  name="reorderLevel"
                  type="number"
                  value={formData.reorderLevel}
                  onChange={handleChange}
                  placeholder="0"
                  min="0"
                  className={errors.reorderLevel ? "border-inventory-danger" : ""}
                />
                {errors.reorderLevel && (
                  <p className="text-inventory-danger text-sm">{errors.reorderLevel}</p>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter product description"
                rows={3}
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/products")}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="bg-inventory-primary hover:bg-inventory-primary/90"
            >
              <Save className="h-4 w-4 mr-2" />
              {isSubmitting ? "Saving..." : "Save Product"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default ProductForm;
