"use client"

import {
  BarChart3,
  Activity,
  CheckCircle2,
  Zap,
  Globe,
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
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts"

import {
  jobsOverTime,
  successRateByDomain,
  topDomains,
  creditConsumption,
  proxyPoolOverview,
} from "@/lib/mock-data"

const volumeChartConfig = {
  records: { label: "Records", color: "var(--chart-1)" },
  jobs: { label: "Jobs", color: "var(--chart-2)" },
} satisfies ChartConfig

const domainChartConfig = {
  requests: { label: "Requests", color: "var(--chart-3)" },
} satisfies ChartConfig

export default function AnalyticsPage() {
  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Analytics</h1>
        <p className="text-sm text-muted-foreground">
          Performance insights across your entire scraping operation.
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Proxies
            </CardTitle>
            <Globe className="h-4 w-4 text-sky-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">
              {proxyPoolOverview.active.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              of {proxyPoolOverview.total.toLocaleString()} in the pool
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Success Rate
            </CardTitle>
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">
              {proxyPoolOverview.overallSuccessRate}%
            </div>
            <p className="text-xs text-muted-foreground">last 24 hours</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Avg. Latency
            </CardTitle>
            <Activity className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">
              {proxyPoolOverview.avgLatency}
              <span className="text-sm font-normal text-muted-foreground">ms</span>
            </div>
            <p className="text-xs text-muted-foreground">P95: 892ms</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Credits Used
            </CardTitle>
            <Zap className="h-4 w-4 text-violet-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">
              {creditConsumption
                .reduce((sum, c) => sum + c.credits, 0)
                .toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">this billing cycle</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts row */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Throughput</CardTitle>
            <CardDescription>
              Jobs executed and records collected over the last 24 hours
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={volumeChartConfig} className="h-64 w-full">
              <AreaChart data={jobsOverTime} margin={{ left: -20, right: 8 }}>
                <defs>
                  <linearGradient id="fillRecords" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor="var(--color-records)"
                      stopOpacity={0.6}
                    />
                    <stop
                      offset="95%"
                      stopColor="var(--color-records)"
                      stopOpacity={0.05}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis
                  dataKey="time"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                />
                <YAxis tickLine={false} axisLine={false} tickMargin={8} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area
                  dataKey="records"
                  type="monotone"
                  fill="url(#fillRecords)"
                  stroke="var(--color-records)"
                  strokeWidth={2}
                />
                <Area
                  dataKey="jobs"
                  type="monotone"
                  fillOpacity={0.12}
                  fill="var(--color-jobs)"
                  stroke="var(--color-jobs)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Requests by Domain</CardTitle>
            <CardDescription>
              Top targets by request volume this month
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={domainChartConfig} className="h-64 w-full">
              <BarChart
                data={topDomains.slice(0, 6)}
                layout="vertical"
                margin={{ left: 12, right: 16 }}
              >
                <CartesianGrid horizontal={false} strokeDasharray="3 3" />
                <XAxis
                  type="number"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                />
                <YAxis
                  dataKey="domain"
                  type="category"
                  tickLine={false}
                  axisLine={false}
                  width={96}
                  tickMargin={8}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar
                  dataKey="requests"
                  fill="var(--color-requests)"
                  radius={[0, 4, 4, 0]}
                />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Tables row */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Success Rate by Domain</CardTitle>
            <CardDescription>
              Reliability of extractions per target
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {successRateByDomain.map((d) => (
              <div key={d.domain} className="flex items-center gap-3">
                <div className="w-36 shrink-0 truncate text-sm">
                  {d.domain}
                </div>
                <Progress value={d.rate} className="h-2 flex-1" />
                <div className="w-12 text-right text-sm tabular-nums text-muted-foreground">
                  {d.rate}%
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Credit Consumption</CardTitle>
            <CardDescription>
              Where your credits went this cycle
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {creditConsumption.map((c) => (
              <div key={c.category} className="flex items-center gap-3">
                <div className="flex-1">
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span>{c.category}</span>
                    <span className="tabular-nums text-muted-foreground">
                      {c.credits.toLocaleString()}
                    </span>
                  </div>
                  <Progress value={c.percentage} className="h-2" />
                </div>
                <Badge variant="outline" className="w-14 justify-center">
                  {c.percentage}%
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
