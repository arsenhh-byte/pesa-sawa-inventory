
import React from "react";
import { useInventory } from "@/contexts/InventoryContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { formatCurrency } from "@/lib/formatters";
import { Download, FileText, Settings as SettingsIcon } from "lucide-react";

const Settings = () => {
  const { products, summary } = useInventory();
  
  // We're just mocking this functionality for now
  const handleExportInventory = () => {
    alert("This would export your inventory data as CSV or Excel");
  };
  
  const handleExportReport = () => {
    alert("This would generate a detailed inventory report");
  };

  // Mock low stock items
  const lowStockItems = products.filter(
    (product) => product.quantity <= product.reorderLevel
  );

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Settings & Reports</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Export Options */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="h-5 w-5" />
              Export Data
            </CardTitle>
            <CardDescription>
              Export your inventory data for backup or analysis
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Button 
                onClick={handleExportInventory}
                className="w-full"
                variant="outline"
              >
                <FileText className="h-4 w-4 mr-2" />
                Export Inventory
              </Button>
              
              <Button 
                onClick={handleExportReport}
                className="w-full"
                variant="outline"
              >
                <FileText className="h-4 w-4 mr-2" />
                Generate Report
              </Button>
            </div>
          </CardContent>
        </Card>
        
        {/* System Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <SettingsIcon className="h-5 w-5" />
              System Settings
            </CardTitle>
            <CardDescription>
              Configure your inventory settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currency">Currency Display</Label>
              <Input
                id="currency"
                value="KES (Kenya Shillings)"
                disabled
              />
              <p className="text-sm text-muted-foreground">
                The system uses Kenya Shillings (KES) as the base currency
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Low Stock Alert */}
      <Card className="bg-white">
        <CardHeader>
          <CardTitle>Low Stock Alerts</CardTitle>
          <CardDescription>
            Products that need to be restocked soon
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Current Stock</TableHead>
                <TableHead>Reorder Level</TableHead>
                <TableHead className="text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {lowStockItems.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-6 text-muted-foreground">
                    No low stock items
                  </TableCell>
                </TableRow>
              ) : (
                lowStockItems.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>{product.quantity}</TableCell>
                    <TableCell>{product.reorderLevel}</TableCell>
                    <TableCell className="text-right">
                      <span 
                        className={
                          product.quantity === 0 
                            ? "text-inventory-danger font-medium" 
                            : "text-inventory-warning font-medium"
                        }
                      >
                        {product.quantity === 0 ? "Out of Stock" : "Low Stock"}
                      </span>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      {/* Inventory Summary */}
      <Card className="bg-white">
        <CardHeader>
          <CardTitle>Inventory Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-md border p-4">
              <div className="text-sm font-medium text-muted-foreground mb-1">
                Total Products
              </div>
              <div className="text-2xl font-bold">
                {summary.totalProducts}
              </div>
            </div>
            
            <div className="rounded-md border p-4">
              <div className="text-sm font-medium text-muted-foreground mb-1">
                Inventory Value
              </div>
              <div className="text-2xl font-bold">
                {formatCurrency(summary.totalValue)}
              </div>
            </div>
            
            <div className="rounded-md border p-4">
              <div className="text-sm font-medium text-muted-foreground mb-1">
                Low Stock Items
              </div>
              <div className="text-2xl font-bold text-inventory-warning">
                {summary.lowStockItems}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;
