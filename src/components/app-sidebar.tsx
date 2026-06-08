"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Shield,
  Store,
  Briefcase,
  BarChart3,
  Settings,
  Globe,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
} from "@/components/ui/sidebar"

const mainNavItems = [
  {
    title: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Proxy Manager",
    href: "/proxy",
    icon: Shield,
  },
  {
    title: "Marketplace",
    href: "/marketplace",
    icon: Store,
  },
  {
    title: "Jobs",
    href: "/jobs",
    icon: Briefcase,
  },
  {
    title: "Analytics",
    href: "/analytics",
    icon: BarChart3,
  },
]

const proxySubItems = [
  {
    title: "Proxy Dashboard",
    href: "/proxy",
    icon: Shield,
  },
  {
    title: "Proxy Pool",
    href: "/proxy/pool",
    icon: Globe,
  },
  {
    title: "Rotation & Sessions",
    href: "/proxy/rotation",
    icon: Shield,
  },
  {
    title: "Proxy Analytics",
    href: "/proxy/analytics",
    icon: BarChart3,
  },
]

export function AppSidebar() {
  const pathname = usePathname()
  const isProxySection = pathname.startsWith("/proxy")

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="px-4 py-3">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Shield className="h-4 w-4" />
          </div>
          <div className="flex flex-col group-data-[collapsible=icon]:hidden">
            <span className="text-sm font-semibold">ScrapeSuite</span>
            <span className="text-[10px] text-muted-foreground">Proxy Manager</span>
          </div>
        </Link>
      </SidebarHeader>
      <SidebarSeparator />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNavItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={
                      item.href === "/"
                        ? pathname === "/"
                        : pathname.startsWith(item.href)
                    }
                    tooltip={item.title}
                  >
                    <Link href={item.href}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {isProxySection && (
          <>
            <SidebarSeparator />
            <SidebarGroup>
              <SidebarGroupLabel>Proxy Management</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {proxySubItems.map((item) => (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton
                        asChild
                        isActive={pathname === item.href}
                        tooltip={item.title}
                      >
                        <Link href={item.href}>
                          <item.icon className="h-4 w-4" />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </>
        )}

        <SidebarSeparator />
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === "/settings"}
                  tooltip="Settings"
                >
                  <Link href="/settings">
                    <Settings className="h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
