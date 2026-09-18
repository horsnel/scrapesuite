"use client"

import {
  Shield,
  Activity,
  Clock,
  Globe,
  Zap,
  TrendingUp,
  AlertTriangle,
  Plus,
  RefreshCw,
  ArrowRight,
  Server,
} from "lucide-react"
import Link from "next/link"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardAction,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { Bar, BarChart, XAxis, YAxis, Cell, PieChart, Pie } from "recharts"

import {
  proxyPoolOverview,
  geoDistribution,
  successRateByTier,
  recentProxyEvents,
} from "@/lib/mock-data"

const tierChartConfig = {
  rate: {
    label: "Success Rate %",
  },
  Residential: {
    label: "Residential",
    color: "var(--chart-1)",
  },
  Mobile: {
    label: "Mobile",
    color: "var(--chart-2)",
  },
  Datacenter: {
    label: "Datacenter",
    color: "var(--chart-3)",
  },
  ISP: {
    label: "ISP",
    color: "var(--chart-4)",
  },
} satisfies ChartConfig

const geoChartConfig = {
  count: {
    label: "Proxies",
  },
  US: { label: "United States", color: "var(--chart-1)" },
  DE: { label: "Germany", color: "var(--chart-2)" },
  GB: { label: "United Kingdom", color: "var(--chart-3)" },
  FR: { label: "France", color: "var(--chart-4)" },
  JP: { label: "Japan", color: "var(--chart-5)" },
  BR: { label: "Brazil", color: "var(--chart-1)" },
  CA: { label: "Canada", color: "var(--chart-2)" },
  AU: { label: "Australia", color: "var(--chart-3)" },
  IN: { label: "India", color: "var(--chart-4)" },
  XX: { label: "Other", color: "var(--chart-5)" },
} satisfies ChartConfig

const GEO_COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
]

const TIER_BAR_COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
]

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

function getTierBadge(tier: string) {
  switch (tier) {
    case "residential":
      return <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">Residential</Badge>
    case "mobile":
      return <Badge variant="secondary" className="bg-violet-50 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400">Mobile</Badge>
    case "datacenter":
      return <Badge variant="secondary" className="bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">Datacenter</Badge>
    case "isp":
      return <Badge variant="secondary" className="bg-rose-50 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400">ISP</Badge>
    default:
      return <Badge variant="secondary">{tier}</Badge>
  }
}

export default function ProxyDashboardPage() {
  const overview = proxyPoolOverview

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Proxy Manager</h1>
          <p className="text-muted-foreground text-sm">
            Monitor and manage your proxy infrastructure
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4" />
            Test Pool
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4" />
            Add Proxy
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <CardDescription>Total Proxies</CardDescription>
            <CardTitle className="text-3xl tabular-nums">{overview.total.toLocaleString()}</CardTitle>
            <CardAction>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                <Shield className="h-5 w-5 text-muted-foreground" />
              </div>
            </CardAction>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 text-emerald-500" />
              <span className="text-emerald-600 font-medium">+12</span> from last week
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardDescription>Active</CardDescription>
            <CardTitle className="text-3xl tabular-nums">{overview.active.toLocaleString()}</CardTitle>
            <CardAction>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 dark:bg-emerald-900/30">
                <Activity className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              </div>
            </CardAction>
          </CardHeader>
          <CardContent>
            <Progress value={(overview.active / overview.total) * 100} className="h-2" />
            <p className="text-xs text-muted-foreground mt-2">
              {((overview.active / overview.total) * 100).toFixed(1)}% of total pool
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardDescription>Avg Latency</CardDescription>
            <CardTitle className="text-3xl tabular-nums">{overview.avgLatency}<span className="text-lg font-normal text-muted-foreground">ms</span></CardTitle>
            <CardAction>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                <Clock className="h-5 w-5 text-muted-foreground" />
              </div>
            </CardAction>
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
            <CardDescription>Success Rate</CardDescription>
            <CardTitle className="text-3xl tabular-nums">{overview.overallSuccessRate}<span className="text-lg font-normal text-muted-foreground">%</span></CardTitle>
            <CardAction>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                <TrendingUp className="h-5 w-5 text-muted-foreground" />
              </div>
            </CardAction>
          </CardHeader>
          <CardContent>
            <Progress value={overview.overallSuccessRate} className="h-2" />
            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-2">
              <AlertTriangle className="h-3 w-3 text-amber-500" />
              {overview.error} proxies in error state
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tier Breakdown Cards */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardDescription className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                Residential
              </CardDescription>
              <Badge variant="secondary" className="text-xs">{overview.byTier.residential}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Progress value={(overview.byTier.residential / overview.total) * 100} className="h-1.5 flex-1" />
              <span className="text-xs text-muted-foreground tabular-nums">
                {((overview.byTier.residential / overview.total) * 100).toFixed(0)}%
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardDescription className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-violet-500" />
                Mobile
              </CardDescription>
              <Badge variant="secondary" className="text-xs">{overview.byTier.mobile}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Progress value={(overview.byTier.mobile / overview.total) * 100} className="h-1.5 flex-1" />
              <span className="text-xs text-muted-foreground tabular-nums">
                {((overview.byTier.mobile / overview.total) * 100).toFixed(0)}%
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardDescription className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-amber-500" />
                Datacenter
              </CardDescription>
              <Badge variant="secondary" className="text-xs">{overview.byTier.datacenter}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Progress value={(overview.byTier.datacenter / overview.total) * 100} className="h-1.5 flex-1" />
              <span className="text-xs text-muted-foreground tabular-nums">
                {((overview.byTier.datacenter / overview.total) * 100).toFixed(0)}%
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardDescription className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-rose-500" />
                ISP
              </CardDescription>
              <Badge variant="secondary" className="text-xs">{overview.byTier.isp}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Progress value={(overview.byTier.isp / overview.total) * 100} className="h-1.5 flex-1" />
              <span className="text-xs text-muted-foreground tabular-nums">
                {((overview.byTier.isp / overview.total) * 100).toFixed(0)}%
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid gap-4 grid-cols-1 lg:grid-cols-7">
        {/* Geographic Distribution */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Geographic Distribution
            </CardTitle>
            <CardDescription>Proxy locations by country</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={geoChartConfig} className="h-[280px] w-full">
              <PieChart>
                <ChartTooltip content={<ChartTooltipContent />} />
                <Pie
                  data={geoDistribution}
                  dataKey="count"
                  nameKey="country"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  innerRadius={50}
                  paddingAngle={2}
                >
                  {geoDistribution.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={GEO_COLORS[index % GEO_COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ChartContainer>
            <div className="mt-4 grid grid-cols-2 gap-2">
              {geoDistribution.slice(0, 6).map((item) => (
                <div key={item.code} className="flex items-center gap-2 text-xs">
                  <span className="text-muted-foreground">{item.country}</span>
                  <span className="ml-auto font-medium tabular-nums">{item.count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Success Rate by Tier */}
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Success Rate by Tier
            </CardTitle>
            <CardDescription>Request success rates and volume</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={tierChartConfig} className="h-[280px] w-full">
              <BarChart data={successRateByTier} layout="vertical" margin={{ left: 20 }}>
                <XAxis type="number" domain={[90, 100]} tickFormatter={(v) => `${v}%`} />
                <YAxis type="category" dataKey="tier" width={100} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="rate" radius={[0, 4, 4, 0]} barSize={28}>
                  {successRateByTier.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={TIER_BAR_COLORS[index]} />
                  ))}
                </Bar>
              </BarChart>
            </ChartContainer>
            <div className="mt-4 space-y-2">
              {successRateByTier.map((item, index) => (
                <div key={item.tier} className="flex items-center gap-2 text-xs">
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: TIER_BAR_COLORS[index] }}
                  />
                  <span className="text-muted-foreground">{item.tier}</span>
                  <span className="ml-auto font-medium tabular-nums">{item.rate}%</span>
                  <span className="text-muted-foreground">({(item.requests / 1000).toFixed(1)}K req)</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Events */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Server className="h-5 w-5" />
                Recent Proxy Events
              </CardTitle>
              <CardDescription>Latest activity across your proxy pool</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/proxy/pool">
                View All <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Time</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Proxy</TableHead>
                <TableHead>Tier</TableHead>
                <TableHead className="hidden md:table-cell">Message</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentProxyEvents.slice(0, 6).map((event) => (
                <TableRow key={event.id}>
                  <TableCell className="text-xs text-muted-foreground tabular-nums whitespace-nowrap">
                    {formatTimeAgo(event.timestamp)}
                  </TableCell>
                  <TableCell>{getEventTypeBadge(event.type)}</TableCell>
                  <TableCell className="font-mono text-xs">{event.proxyIp}</TableCell>
                  <TableCell>{getTierBadge(event.tier)}</TableCell>
                  <TableCell className="hidden md:table-cell text-xs text-muted-foreground max-w-[300px] truncate">
                    {event.message}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
        <Link href="/proxy/pool" className="block">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Plus className="h-5 w-5" />
                Add Proxy
              </CardTitle>
              <CardDescription>Add a new proxy to your pool</CardDescription>
            </CardHeader>
          </Card>
        </Link>
        <Link href="/proxy/rotation" className="block">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <RefreshCw className="h-5 w-5" />
                Rotate Pool
              </CardTitle>
              <CardDescription>Force rotation across active sessions</CardDescription>
            </CardHeader>
          </Card>
        </Link>
        <Link href="/proxy/analytics" className="block">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Activity className="h-5 w-5" />
                View Analytics
              </CardTitle>
              <CardDescription>Detailed performance metrics</CardDescription>
            </CardHeader>
          </Card>
        </Link>
      </div>
    </div>
  )
}
