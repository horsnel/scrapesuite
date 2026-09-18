"use client"

import Link from "next/link"
import {
  Shield,
  Store,
  Briefcase,
  BarChart3,
  Settings,
  Activity,
  Globe,
  Zap,
  TrendingUp,
  ArrowRight,
  Clock,
  Server,
} from "lucide-react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { Area, AreaChart, XAxis, YAxis, CartesianGrid } from "recharts"

import {
  proxyPoolOverview,
  recentProxyEvents,
  bandwidthOverTime,
} from "@/lib/mock-data"

const bandwidthChartConfig = {
  residential: { label: "Residential", color: "var(--chart-1)" },
  mobile: { label: "Mobile", color: "var(--chart-2)" },
  datacenter: { label: "Datacenter", color: "var(--chart-3)" },
  isp: { label: "ISP", color: "var(--chart-4)" },
} satisfies ChartConfig

function formatTimeAgo(timestamp: string): string {
  const now = new Date()
  const time = new Date(timestamp)
  const diffMs = now.getTime() - time.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  if (diffMins < 1) return "just now"
  if (diffMins < 60) return `${diffMins}m ago`
  const diffHours = Math.floor(diffMins / 60)
  if (diffHours < 24) return `${diffHours}h ago`
  return `${Math.floor(diffHours / 24)}d ago`
}

function getEventTypeBadge(type: string) {
  switch (type) {
    case "rotation":
      return <Badge variant="secondary">Rotation</Badge>
    case "failure":
      return <Badge variant="destructive">Failure</Badge>
    case "recovery":
      return <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400">Recovery</Badge>
    case "retired":
      return <Badge variant="outline" className="text-muted-foreground">Retired</Badge>
    case "added":
      return <Badge className="bg-sky-100 text-sky-800 dark:bg-sky-900/30 dark:text-sky-400">Added</Badge>
    case "tested":
      return <Badge variant="outline">Tested</Badge>
    default:
      return <Badge variant="outline">{type}</Badge>
  }
}

const quickLinks = [
  {
    title: "Proxy Manager",
    description: "Monitor & manage proxies",
    href: "/proxy",
    icon: Shield,
    stat: `${proxyPoolOverview.active} active`,
    color: "text-emerald-600 dark:text-emerald-400",
    bgColor: "bg-emerald-50 dark:bg-emerald-900/30",
  },
  {
    title: "Marketplace",
    description: "Browse proxy providers",
    href: "/marketplace",
    icon: Store,
    stat: "4 providers",
    color: "text-violet-600 dark:text-violet-400",
    bgColor: "bg-violet-50 dark:bg-violet-900/30",
  },
  {
    title: "Jobs",
    description: "Manage scrape jobs",
    href: "/jobs",
    icon: Briefcase,
    stat: "12 running",
    color: "text-amber-600 dark:text-amber-400",
    bgColor: "bg-amber-50 dark:bg-amber-900/30",
  },
  {
    title: "Analytics",
    description: "Performance insights",
    href: "/proxy/analytics",
    icon: BarChart3,
    stat: "97.2% success",
    color: "text-rose-600 dark:text-rose-400",
    bgColor: "bg-rose-50 dark:bg-rose-900/30",
  },
]

export default function DashboardPage() {
  const overview = proxyPoolOverview

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Welcome Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground text-sm">
          Welcome to ScrapeSuite. Here&apos;s an overview of your proxy infrastructure.
        </p>
      </div>

      {/* Quick Link Cards */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {quickLinks.map((link) => (
          <Card key={link.href} className="hover:shadow-md transition-shadow">
            <Link href={link.href} className="block">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${link.bgColor}`}>
                    <link.icon className={`h-5 w-5 ${link.color}`} />
                  </div>
                  <Badge variant="secondary" className="text-xs">{link.stat}</Badge>
                </div>
                <CardTitle className="text-base mt-2">{link.title}</CardTitle>
                <CardDescription>{link.description}</CardDescription>
              </CardHeader>
            </Link>
          </Card>
        ))}
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <CardDescription>Active Proxies</CardDescription>
            <CardTitle className="text-3xl tabular-nums">{overview.active.toLocaleString()}</CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={(overview.active / overview.total) * 100} className="h-2" />
            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-2">
              <TrendingUp className="h-3 w-3 text-emerald-500" />
              <span className="text-emerald-600 font-medium">+12</span> this week
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardDescription>Success Rate</CardDescription>
            <CardTitle className="text-3xl tabular-nums">{overview.overallSuccessRate}<span className="text-lg font-normal text-muted-foreground">%</span></CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={overview.overallSuccessRate} className="h-2" />
            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-2">
              <Activity className="h-3 w-3 text-emerald-500" />
              Across all tiers
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardDescription>Avg Latency</CardDescription>
            <CardTitle className="text-3xl tabular-nums">{overview.avgLatency}<span className="text-lg font-normal text-muted-foreground">ms</span></CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Zap className="h-3 w-3 text-amber-500" />
              P95: 892ms
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardDescription>Bandwidth</CardDescription>
            <CardTitle className="text-3xl tabular-nums">{overview.totalBandwidth}<span className="text-lg font-normal text-muted-foreground">TB</span></CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Globe className="h-3 w-3 text-violet-500" />
              This month
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bandwidth Chart + Recent Events */}
      <div className="grid gap-4 grid-cols-1 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Bandwidth Usage
            </CardTitle>
            <CardDescription>7-day bandwidth trend by tier (GB)</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={bandwidthChartConfig} className="h-[280px] w-full">
              <AreaChart data={bandwidthOverTime}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="date" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area
                  type="monotone"
                  dataKey="residential"
                  stackId="1"
                  stroke="var(--chart-1)"
                  fill="var(--chart-1)"
                  fillOpacity={0.4}
                />
                <Area
                  type="monotone"
                  dataKey="mobile"
                  stackId="1"
                  stroke="var(--chart-2)"
                  fill="var(--chart-2)"
                  fillOpacity={0.4}
                />
                <Area
                  type="monotone"
                  dataKey="datacenter"
                  stackId="1"
                  stroke="var(--chart-3)"
                  fill="var(--chart-3)"
                  fillOpacity={0.4}
                />
                <Area
                  type="monotone"
                  dataKey="isp"
                  stackId="1"
                  stroke="var(--chart-4)"
                  fill="var(--chart-4)"
                  fillOpacity={0.4}
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Server className="h-5 w-5" />
                  Recent Events
                </CardTitle>
                <CardDescription>Latest proxy activity</CardDescription>
              </div>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/proxy">
                  View All <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentProxyEvents.slice(0, 5).map((event) => (
              <div key={event.id} className="flex items-start gap-3">
                <div className="mt-0.5">{getEventTypeBadge(event.type)}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm truncate">{event.message}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-muted-foreground font-mono">{event.proxyIp}</span>
                    <span className="text-xs text-muted-foreground">·</span>
                    <span className="text-xs text-muted-foreground">{formatTimeAgo(event.timestamp)}</span>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
