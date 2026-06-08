"use client"

import {
  BarChart3,
  TrendingUp,
  Clock,
  Globe,
  Zap,
  CreditCard,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
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
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from "@/components/ui/chart"
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Line,
  LineChart,
  Cell,
  PieChart,
  Pie,
} from "recharts"

import {
  bandwidthOverTime,
  successRateByDomain,
  latencyDistribution,
  topDomains,
  creditConsumption,
} from "@/lib/mock-data"

const bandwidthChartConfig = {
  residential: { label: "Residential", color: "var(--chart-1)" },
  mobile: { label: "Mobile", color: "var(--chart-2)" },
  datacenter: { label: "Datacenter", color: "var(--chart-3)" },
  isp: { label: "ISP", color: "var(--chart-4)" },
} satisfies ChartConfig

const successRateChartConfig = {
  rate: { label: "Success Rate %", color: "var(--chart-2)" },
} satisfies ChartConfig

const latencyChartConfig = {
  count: { label: "Proxy Count", color: "var(--chart-1)" },
} satisfies ChartConfig

const domainRequestChartConfig = {
  requests: { label: "Requests", color: "var(--chart-1)" },
} satisfies ChartConfig

const creditChartConfig = {
  credits: { label: "Credits", color: "var(--chart-1)" },
  "Residential Proxies": { label: "Residential", color: "var(--chart-1)" },
  "Mobile Proxies": { label: "Mobile", color: "var(--chart-2)" },
  "Datacenter Proxies": { label: "Datacenter", color: "var(--chart-3)" },
  "ISP Proxies": { label: "ISP", color: "var(--chart-4)" },
  "Premium Geo-Targeting": { label: "Premium Geo", color: "var(--chart-5)" },
  "Sticky Sessions": { label: "Sticky", color: "var(--chart-1)" },
} satisfies ChartConfig

const CREDIT_COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
  "var(--chart-1)",
]

const LATENCY_BAR_COLORS = [
  "var(--chart-2)",
  "var(--chart-2)",
  "var(--chart-1)",
  "var(--chart-1)",
  "var(--chart-5)",
  "var(--chart-5)",
]

export default function ProxyAnalyticsPage() {
  const totalCredits = creditConsumption.reduce((sum, c) => sum + c.credits, 0)
  const totalBandwidth = bandwidthOverTime.reduce(
    (sum, d) => sum + d.residential + d.mobile + d.datacenter + d.isp,
    0
  )
  const avgSuccessRate =
    successRateByDomain.reduce((sum, d) => sum + d.rate, 0) / successRateByDomain.length

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Proxy Analytics</h1>
          <p className="text-muted-foreground text-sm">
            Performance metrics and usage insights
          </p>
        </div>
        <div className="flex gap-2">
          <Badge variant="outline" className="gap-1 py-1">
            <Clock className="h-3 w-3" />
            Last 7 days
          </Badge>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <CardDescription>Total Bandwidth</CardDescription>
            <CardTitle className="text-3xl tabular-nums">{totalBandwidth}<span className="text-lg font-normal text-muted-foreground">GB</span></CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <ArrowUpRight className="h-3 w-3 text-emerald-500" />
              <span className="text-emerald-600 font-medium">+8.2%</span> vs previous week
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardDescription>Avg Success Rate</CardDescription>
            <CardTitle className="text-3xl tabular-nums">{avgSuccessRate.toFixed(1)}<span className="text-lg font-normal text-muted-foreground">%</span></CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <ArrowUpRight className="h-3 w-3 text-emerald-500" />
              <span className="text-emerald-600 font-medium">+0.4%</span> vs previous week
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardDescription>Credits Used</CardDescription>
            <CardTitle className="text-3xl tabular-nums">{(totalCredits / 1000).toFixed(0)}<span className="text-lg font-normal text-muted-foreground">K</span></CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <ArrowDownRight className="h-3 w-3 text-amber-500" />
              <span className="text-amber-600 font-medium">-3.1%</span> vs previous week
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardDescription>P95 Latency</CardDescription>
            <CardTitle className="text-3xl tabular-nums">892<span className="text-lg font-normal text-muted-foreground">ms</span></CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <ArrowDownRight className="h-3 w-3 text-emerald-500" />
              <span className="text-emerald-600 font-medium">-12ms</span> vs previous week
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bandwidth Over Time */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Bandwidth Usage Over Time
          </CardTitle>
          <CardDescription>GB consumed per day by proxy tier</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={bandwidthChartConfig} className="h-[300px] w-full">
            <AreaChart data={bandwidthOverTime}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="date" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <ChartLegend content={<ChartLegendContent />} />
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

      {/* Two column charts */}
      <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
        {/* Success Rate by Domain */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Success Rate by Domain
            </CardTitle>
            <CardDescription>Request success rates across target domains</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={successRateChartConfig} className="h-[280px] w-full">
              <LineChart data={successRateByDomain}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="domain" tick={{ fontSize: 10 }} angle={-30} textAnchor="end" height={60} />
                <YAxis domain={[88, 100]} tickFormatter={(v) => `${v}%`} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line
                  type="monotone"
                  dataKey="rate"
                  stroke="var(--chart-2)"
                  strokeWidth={2}
                  dot={{ r: 4, fill: "var(--chart-2)" }}
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* P95 Latency Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Latency Distribution
            </CardTitle>
            <CardDescription>P95 latency distribution across proxy pool</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={latencyChartConfig} className="h-[280px] w-full">
              <BarChart data={latencyDistribution}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="range" tick={{ fontSize: 11 }} />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="count" radius={[4, 4, 0, 0]} barSize={40}>
                  {latencyDistribution.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={LATENCY_BAR_COLORS[index]} />
                  ))}
                </Bar>
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Top Domains & Credit Consumption */}
      <div className="grid gap-4 grid-cols-1 lg:grid-cols-5">
        {/* Top Domains Table */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Top Domains by Request Volume
            </CardTitle>
            <CardDescription>Most active target domains</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Domain</TableHead>
                  <TableHead>Requests</TableHead>
                  <TableHead className="hidden sm:table-cell">Bandwidth</TableHead>
                  <TableHead>Success Rate</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topDomains.map((domain) => (
                  <TableRow key={domain.domain}>
                    <TableCell className="font-medium text-sm">{domain.domain}</TableCell>
                    <TableCell className="tabular-nums text-sm">
                      {(domain.requests / 1000).toFixed(1)}K
                    </TableCell>
                    <TableCell className="hidden sm:table-cell tabular-nums text-sm text-muted-foreground">
                      {domain.bandwidth} GB
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Progress value={domain.successRate} className="h-1.5 w-16" />
                        <span className="text-xs tabular-nums">{domain.successRate}%</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Credit Consumption Breakdown */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Credit Consumption
            </CardTitle>
            <CardDescription>Breakdown by category</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={creditChartConfig} className="h-[200px] w-full">
              <PieChart>
                <ChartTooltip content={<ChartTooltipContent />} />
                <Pie
                  data={creditConsumption}
                  dataKey="credits"
                  nameKey="category"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  innerRadius={40}
                  paddingAngle={2}
                >
                  {creditConsumption.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={CREDIT_COLORS[index % CREDIT_COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ChartContainer>
            <div className="mt-4 space-y-2.5">
              {creditConsumption.map((item, index) => (
                <div key={item.category} className="flex items-center gap-2">
                  <span
                    className="h-2.5 w-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: CREDIT_COLORS[index % CREDIT_COLORS.length] }}
                  />
                  <span className="text-xs text-muted-foreground truncate flex-1">{item.category}</span>
                  <span className="text-xs font-medium tabular-nums">{item.percentage}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
