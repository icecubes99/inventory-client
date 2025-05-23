"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Bell, ChevronDown, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import { useAuth } from "@/lib/client/hooks/useAuth"
import { toast } from "sonner"

interface NavItem {
    label: string
    href: string
    dropdown?: boolean
    subItems?: { label: string; href: string }[]
    roles?: string[]
}

const getInitials = (name: string = "") => {
    return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
}

export default function Navbar() {
    const pathname = usePathname()
    const router = useRouter()
    const [isOpen, setIsOpen] = useState(false)
    const { user, logout, isAuthenticated, isLoading } = useAuth()

    const handleLogout = async () => {
        try {
            await logout()
            toast.success("Successfully logged out")
            router.push("/login")
        } catch (error) {
            toast.error("Logout failed. Please try again.")
            console.error("Logout error:", error)
        }
    }

    const allNavItems: NavItem[] = [
        {
            label: "Dashboard",
            href: "/dashboard",
            dropdown: true,
            subItems: [
                { label: "Overview", href: "/dashboard" },
                { label: "Analytics", href: "/dashboard/analytics" },
            ],
        },
        {
            label: "Inventory",
            href: "/inventory",
            roles: ["ADMIN", "INVENTORY_MASTER", "WAREHOUSE_MANAGER"],
        },
        {
            label: "Material Requests",
            href: "/material-requests",
            roles: ["ADMIN", "FOREMAN", "WAREHOUSE_MANAGER"],
        },
        {
            label: "Purchase Orders",
            href: "/purchase-orders",
            roles: ["ADMIN", "PURCHASER", "WAREHOUSE_MANAGER"],
        },
        {
            label: "Deliveries",
            href: "/deliveries",
            roles: ["ADMIN", "WAREHOUSE_MANAGER", "INVENTORY_MASTER"],
        },
        {
            label: "Suppliers",
            href: "/suppliers",
            roles: ["ADMIN", "PURCHASER"],
        },
        {
            label: "Admin",
            href: "/admin",
            dropdown: true,
            roles: ["ADMIN"],
            subItems: [
                { label: "Users", href: "/admin/users" },
                { label: "Locations", href: "/admin/locations" },
                { label: "Settings", href: "/admin/settings" },
            ],
        },
    ]

    const navItems = isAuthenticated && user
        ? allNavItems.filter(item => {
            if (!item.roles) return true
            return item.roles.includes(user.role)
        })
        : []

    const isActive = (path: string) => {
        if (path === "/dashboard" && pathname === "/dashboard") {
            return true
        }
        return pathname?.startsWith(path) && path !== "/dashboard"
    }

    if (isLoading) {
        return (
            <header className="sticky top-0 z-50 w-full border-b bg-white">
                <div className="flex h-16 items-center px-4 md:px-6">
                    <div className="ml-auto flex items-center gap-2">
                        Loading user...
                    </div>
                </div>
            </header>
        )
    }

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-white">
            <div className="flex h-16 items-center px-4 md:px-6">
                <div className="flex items-center gap-2">
                    {isAuthenticated && user && (
                        <Sheet open={isOpen} onOpenChange={setIsOpen}>
                            <SheetTrigger asChild>
                                <Button variant="outline" size="icon" className="md:hidden">
                                    <Menu className="h-5 w-5" />
                                    <span className="sr-only">Toggle menu</span>
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="left" className="w-[240px] sm:w-[300px]">
                                <div className="flex flex-col gap-6">
                                    <div className="flex items-center justify-between">
                                        <Link href="/" className="flex items-center gap-2" onClick={() => setIsOpen(false)}>
                                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-700 text-white">
                                                <span className="text-lg font-bold">I</span>
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-sm font-bold uppercase text-green-700">Illyria</span>
                                                <span className="text-xs text-muted-foreground">Inventory Management System</span>
                                            </div>
                                        </Link>
                                        <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                                            <X className="h-5 w-5" />
                                        </Button>
                                    </div>
                                    {navItems.length > 0 && (
                                        <nav className="flex flex-col gap-2">
                                            {navItems.map((item) => (
                                                <div key={item.label}>
                                                    <Link
                                                        href={item.href}
                                                        className={cn(
                                                            "flex items-center justify-between rounded-md px-3 py-2 text-sm",
                                                            isActive(item.href) ? "bg-green-700 text-white" : "hover:bg-muted",
                                                        )}
                                                        onClick={() => setIsOpen(false)}
                                                    >
                                                        {item.label}
                                                        {item.dropdown && <ChevronDown className="h-4 w-4" />}
                                                    </Link>
                                                    {item.dropdown && item.subItems && (
                                                        <div className="ml-4 mt-1 flex flex-col gap-1">
                                                            {item.subItems.map((subItem) => (
                                                                <Link
                                                                    key={subItem.label}
                                                                    href={subItem.href}
                                                                    className={cn(
                                                                        "rounded-md px-3 py-1.5 text-sm",
                                                                        pathname === subItem.href
                                                                            ? "bg-muted font-medium"
                                                                            : "text-muted-foreground hover:bg-muted hover:text-foreground",
                                                                    )}
                                                                    onClick={() => setIsOpen(false)}
                                                                >
                                                                    {subItem.label}
                                                                </Link>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </nav>
                                    )}
                                </div>
                            </SheetContent>
                        </Sheet>
                    )}
                    <Link href="/" className="flex items-center gap-2">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-700 text-white">
                            <span className="text-lg font-bold">P</span>
                        </div>
                        <div className="hidden flex-col md:flex">
                            <span className="text-sm font-bold uppercase text-green-700">Pueblo De Oro</span>
                            <span className="text-xs text-muted-foreground">Development Corporation</span>
                        </div>
                    </Link>
                </div>
                {isAuthenticated && user && navItems.length > 0 && (
                    <nav className="hidden md:ml-6 md:flex md:items-center md:gap-1">
                        {navItems.map((item) =>
                            item.dropdown ? (
                                <DropdownMenu key={item.label}>
                                    <DropdownMenuTrigger asChild>
                                        <Button
                                            variant={isActive(item.href) ? "default" : "ghost"}
                                            className={cn("flex items-center gap-1", isActive(item.href) ? "bg-green-700 text-white" : "")}
                                        >
                                            {item.label}
                                            <ChevronDown className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        {item.subItems?.map((subItem) => (
                                            <DropdownMenuItem key={subItem.label} asChild>
                                                <Link href={subItem.href}>{subItem.label}</Link>
                                            </DropdownMenuItem>
                                        ))}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            ) : (
                                <Button
                                    key={item.label}
                                    variant="ghost"
                                    className={cn(isActive(item.href) ? "bg-green-700 text-white" : "")}
                                    asChild
                                >
                                    <Link href={item.href}>{item.label}</Link>
                                </Button>
                            ),
                        )}
                    </nav>
                )}
                <div className="ml-auto flex items-center gap-2">
                    {isAuthenticated && user ? (
                        <>
                            <Button variant="ghost" size="icon" className="relative">
                                <Bell className="h-5 w-5" />
                                <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500"></span>
                                <span className="sr-only">Notifications</span>
                            </Button>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="flex items-center gap-2">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-900 text-white">
                                            <span className="text-sm font-medium">{getInitials(user.name)}</span>
                                        </div>
                                        <div className="hidden flex-col items-start md:flex">
                                            <span className="text-sm font-medium">{user.name}</span>
                                            <span className="text-xs text-muted-foreground">{user.role}</span>
                                        </div>
                                        <ChevronDown className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem asChild>
                                        <Link href="/profile">Profile</Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                        <Link href="/settings">Settings</Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={handleLogout}>
                                        Logout
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </>
                    ) : (
                        pathname !== "/login" && (
                            <Button asChild>
                                <Link href="/login">Login</Link>
                            </Button>
                        )
                    )}
                </div>
            </div>
        </header>
    )
}
