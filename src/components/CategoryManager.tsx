
import React, { useState } from "react";
import { useInventory } from "@/contexts/InventoryContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tag, Plus } from "lucide-react";

const CategoryManager = () => {
  const { categories, addCategory, summary } = useInventory();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [nameError, setNameError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate
    if (!name.trim()) {
      setNameError("Category name is required");
      return;
    }
    
    // Check for duplicates
    if (categories.some(category => 
      category.name.toLowerCase() === name.trim().toLowerCase()
    )) {
      setNameError("Category already exists");
      return;
    }
    
    setNameError("");
    
    // Add category
    addCategory({
      name: name.trim(),
      description: description.trim(),
    });
    
    // Reset form
    setName("");
    setDescription("");
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Categories</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Category Form */}
        <Card>
          <form onSubmit={handleSubmit}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Tag className="h-5 w-5" />
                Add New Category
              </CardTitle>
              <CardDescription>
                Create a new product category
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">
                  Category Name <span className="text-inventory-danger">*</span>
                </Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter category name"
                  className={nameError ? "border-inventory-danger" : ""}
                />
                {nameError && (
                  <p className="text-inventory-danger text-sm">{nameError}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter category description"
                  rows={3}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                type="submit" 
                className="w-full bg-inventory-primary hover:bg-inventory-primary/90"
              >
                <Plus className="h-4 w-4 mr-2" /> Add Category
              </Button>
            </CardFooter>
          </form>
        </Card>
        
        {/* Categories List */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Product Categories</CardTitle>
            <CardDescription>
              Manage your product categories
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Category Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Products</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-6 text-muted-foreground">
                      No categories yet
                    </TableCell>
                  </TableRow>
                ) : (
                  categories.map((category) => (
                    <TableRow key={category.id}>
                      <TableCell className="font-medium">{category.name}</TableCell>
                      <TableCell>{category.description}</TableCell>
                      <TableCell className="text-right">
                        {summary.categoryCounts[category.name] || 0}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CategoryManager;
