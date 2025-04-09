
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard, 
  Package, 
  Tag, 
  Settings, 
  Menu, 
  X
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";
import { Separator } from "@/components/ui/separator";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  const isMobile = useIsMobile();
  const [open, setOpen] = React.useState(false);

  const navigation = [
    {
      name: "Dashboard",
      href: "/",
      icon: LayoutDashboard,
      current: location.pathname === "/",
    },
    {
      name: "Products",
      href: "/products",
      icon: Package,
      current: location.pathname.startsWith("/products"),
    },
    {
      name: "Categories",
      href: "/categories",
      icon: Tag,
      current: location.pathname.startsWith("/categories"),
    },
    {
      name: "Settings",
      href: "/settings",
      icon: Settings,
      current: location.pathname === "/settings",
    },
  ];

  const NavLinks = () => (
    <nav className="space-y-1">
      {navigation.map((item) => (
        <Link
          key={item.name}
          to={item.href}
          onClick={() => setOpen(false)}
          className={cn(
            "flex items-center px-3 py-2 text-sm font-medium rounded-md",
            item.current
              ? "bg-inventory-primary/10 text-inventory-primary"
              : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
          )}
        >
          <item.icon className={cn("mr-3 h-5 w-5", item.current ? "text-inventory-primary" : "text-gray-400")} />
          {item.name}
        </Link>
      ))}
    </nav>
  );

  return (
    <div>
      {/* Mobile Navigation */}
      {isMobile && (
        <div className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="sm:max-w-xs">
              <div className="px-1 py-4">
                <div className="mb-6 mt-2 flex items-center px-3">
                  <h2 className="text-lg font-semibold">PesaSawa Inventory</h2>
                </div>
                <Separator className="mb-6" />
                <NavLinks />
              </div>
            </SheetContent>
          </Sheet>
          <div className="flex-1">
            <h1 className="text-lg font-semibold">PesaSawa Inventory</h1>
          </div>
        </div>
      )}

      <div className="flex min-h-screen">
        {/* Desktop Sidebar */}
        {!isMobile && (
          <div className="flex w-64 flex-col fixed inset-y-0 z-20">
            <div className="flex flex-grow flex-col overflow-y-auto border-r bg-white pt-5">
              <div className="flex flex-shrink-0 items-center px-4">
                <h2 className="text-lg font-bold">PesaSawa Inventory</h2>
              </div>
              <div className="mt-8 flex flex-grow flex-col px-3">
                <NavLinks />
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <main className={cn(
          "flex-1 overflow-y-auto bg-[#F9FAFB] p-6",
          !isMobile && "ml-64"
        )}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
