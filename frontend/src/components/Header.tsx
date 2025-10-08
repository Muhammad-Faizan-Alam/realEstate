import { useEffect, useState } from "react";
import { Search, Menu, X, ChevronDown, User2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);

  const navigationItems = [
    { label: "Find my Agent", href: "/agents" },
    // { label: "Floor Plans", href: "#" },
    // {
    //   label: "Guides",
    //   submenu: [
    //     { label: "Area Guides", href: "#" },
    //     { label: "Building Guides", href: "#" },
    //     { label: "School Guides", href: "#" }
    //   ]
    // },
    // {
    //   label: "Market Intelligence",
    //   submenu: [
    //     { label: "TruEstimate™", href: "#" },
    //     { label: "Property Prices", href: "#" },
    //     { label: "Dubai Transactions", href: "#" },
    //     { label: "Trends", href: "#" },
    //     { label: "New Projects", href: "#" }
    //   ]
    // },
    {
      label: "Portal",
      submenu: [
        { label: "Agent Portal", href: "/agent/dashboard" },
        { label: "Agency Portal", href: "/agency/dashboard" },
        { label: "Admin Portal", href: "/admin/dashboard" },
      ]
    },
    // {
    //   label: "Events",
    //   submenu: [
    //     { label: "Bayut Awards 2024", href: "#" },
    //     { label: "Bayut Awards 2023", href: "#" },
    //     { label: "B3DXB 2022", href: "#" },
    //     { label: "Your Home Your Choice", href: "#" }
    //   ]
    // }
  ];

  useEffect(() => {
    const getProfile = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/profile`, {
          method: "GET",
          credentials: "include", // ✅ cookie sent automatically
        });

        if (res.ok) {
          const data = await res.json();
          setUser(data);
          console.log(data);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    }
    getProfile();
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b shadow-card">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <a href="/" className="text-2xl font-bold text-primary">
              MyRealEstate
            </a>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navigationItems.map((item, index) => (
              <div key={index}>
                {item.submenu ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="flex items-center gap-1 font-medium hover:text-primary transition-smooth">
                        {item.label}
                        <ChevronDown size={16} />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-56 shadow-dropdown">
                      {item.submenu.map((subItem, subIndex) => (
                        <DropdownMenuItem key={subIndex} asChild>
                          <a href={subItem.href} className="w-full">
                            {subItem.label}
                          </a>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <a
                    href={item.href}
                    className="text-sm font-medium hover:text-primary transition-smooth"
                  >
                    {item.label}
                  </a>
                )}
              </div>
            ))}
          </nav>

          {/* Search & Mobile Menu */}
          <div className="flex items-center gap-2">
            {/* Global Search */}
            {/* <Button variant="ghost" size="sm" className="hidden sm:flex">
              <Search size={20} />
            </Button> */}
            <Button variant="ghost" size="sm" className="hidden sm:flex">
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="flex items-center gap-1 font-medium hover:text-primary transition-smooth"
                    >
                      <User2 size={20} />
                      {user.name}
                      <ChevronDown size={16} />
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent align="start" className="w-56 shadow-dropdown">
                    {/* Email display */}
                    <DropdownMenuItem asChild>
                      <span className="text-sm text-gray-600">{user.email}</span>
                    </DropdownMenuItem>

                    {/* Logout */}
                    <DropdownMenuItem
                      onClick={async () => {
                        try {
                          const res = await fetch("http://localhost:5000/api/auth/logout", {
                            method: "POST",
                            credentials: "include", // ✅ send cookies
                          });

                          if (res.ok) {
                            setUser(null);
                            window.location.href = "/"; // Redirect after successful logout
                          }
                        } catch (err) {
                          console.error("Logout failed:", err);
                        }
                      }}
                    >
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <a
                  href="/auth"
                  className="ml-2 flex items-center gap-1 text-sm font-medium text-foreground hover:text-primary"
                >
                  <User2 size={20} />
                  Login
                </a>
              )}
            </Button>

            {/* Mobile Menu */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="sm">
                  {isOpen ? <X size={20} /> : <Menu size={20} />}
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px]">
                <SheetHeader>
                  <SheetTitle>Menu</SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col space-y-4 mt-6">
                  {navigationItems.map((item, index) => (
                    <div key={index}>
                      {item.submenu ? (
                        <div>
                          <div className="font-semibold text-foreground mb-2">
                            {item.label}
                          </div>
                          <div className="pl-4 space-y-2">
                            {item.submenu.map((subItem, subIndex) => (
                              <a
                                key={subIndex}
                                href={subItem.href}
                                className="block text-sm text-muted-foreground hover:text-primary transition-smooth"
                                onClick={() => setIsOpen(false)}
                              >
                                {subItem.label}
                              </a>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <a
                          href={item.href}
                          className="text-foreground hover:text-primary transition-smooth"
                          onClick={() => setIsOpen(false)}
                        >
                          {item.label}
                        </a>
                      )}
                    </div>
                  ))}
                  {/* <Button className="mt-4 w-full">
                    <Search size={16} className="mr-2" />
                    Search Properties
                  </Button> */}
                  <Button variant="ghost" size="sm" className="hidden sm:flex">
                    <User2 size={20} />
                    {user ? (
                      <span className="ml-2 text-sm font-medium text-foreground">
                        {user.name || user.email}
                      </span>
                    ) : (
                      <a href="/auth" className="ml-2 text-sm font-medium text-foreground">
                        Login
                      </a>
                    )}
                  </Button>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;