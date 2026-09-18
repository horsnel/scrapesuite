"use client"

import { useState } from "react"
import {
  RotateCw,
  Clock,
  Globe,
  Activity,
  Timer,
  Zap,
  Settings2,
  Play,
  Pause,
  X,
  Link2,
  Unlink,
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
import { Switch } from "@/components/ui/switch"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  ChartContainer,
  type ChartConfig,
} from "@/components/ui/chart"
import { Bar, BarChart, XAxis, YAxis } from "recharts"

import {
  activeSessions,
  rotationPolicies,
  sessionFactoryStats,
  type ProxyTier,
  type RotationPolicy,
} from "@/lib/mock-data"

const sessionProviderChartConfig = {
  activeSessions: {
    label: "Active Sessions",
    color: "var(--chart-1)",
  },
  totalSessions: {
    label: "Total Sessions",
    color: "var(--chart-3)",
  },
} satisfies ChartConfig

function getTierBadge(tier: ProxyTier) {
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

function formatDuration(ms: number): string {
  const minutes = Math.floor(ms / 60000)
  if (minutes < 60) return `${minutes}min`
  const hours = Math.floor(minutes / 60)
  const remainMins = minutes % 60
  if (hours < 24) return `${hours}h ${remainMins}m`
  return `${Math.floor(hours / 24)}d ${hours % 24}h`
}

function getTimeRemaining(expiresAt: string | null): string {
  if (!expiresAt) return "No expiry"
  const diff = new Date(expiresAt).getTime() - Date.now()
  if (diff <= 0) return "Expired"
  return formatDuration(diff)
}

export default function ProxyRotationPage() {
  const [policies, setPolicies] = useState<RotationPolicy[]>(rotationPolicies)

  const totalActiveSessions = activeSessions.length
  const stickySessions = activeSessions.filter((s) => s.sticky).length
  const totalBandwidth = activeSessions.reduce((sum, s) => sum + s.bandwidth, 0)
  const totalRequests = activeSessions.reduce((sum, s) => sum + s.requestCount, 0)

  const togglePolicy = (id: string) => {
    setPolicies((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, enabled: !p.enabled } : p
      )
    )
  }

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Rotation & Sessions</h1>
          <p className="text-muted-foreground text-sm">
            Manage proxy rotation policies and active sessions
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <RotateCw className="h-4 w-4" />
            Force Rotation
          </Button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <CardDescription>Active Sessions</CardDescription>
            <CardTitle className="text-3xl tabular-nums">{totalActiveSessions}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Activity className="h-3 w-3 text-emerald-500" />
              <span>{totalRequests.toLocaleString()} total requests</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardDescription>Sticky Sessions</CardDescription>
            <CardTitle className="text-3xl tabular-nums">{stickySessions}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Link2 className="h-3 w-3 text-violet-500" />
              <span>{((stickySessions / totalActiveSessions) * 100).toFixed(0)}% of active</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardDescription>Session Bandwidth</CardDescription>
            <CardTitle className="text-3xl tabular-nums">{totalBandwidth.toFixed(1)}<span className="text-lg font-normal text-muted-foreground">GB</span></CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Globe className="h-3 w-3 text-amber-500" />
              <span>Across {new Set(activeSessions.map((s) => s.country)).size} countries</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardDescription>Active Policies</CardDescription>
            <CardTitle className="text-3xl tabular-nums">{policies.filter((p) => p.enabled).length}<span className="text-lg font-normal text-muted-foreground">/{policies.length}</span></CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Settings2 className="h-3 w-3 text-rose-500" />
              <span>Rotation policies configured</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="sessions" className="space-y-4">
        <TabsList>
          <TabsTrigger value="sessions">Active Sessions</TabsTrigger>
          <TabsTrigger value="policies">Rotation Policies</TabsTrigger>
          <TabsTrigger value="factory">Session Factory</TabsTrigger>
        </TabsList>

        {/* Active Sessions Tab */}
        <TabsContent value="sessions">
          <Card>
            <CardHeader>
              <CardTitle>Active Proxy Sessions</CardTitle>
              <CardDescription>Currently running proxy sessions across all tiers</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Session</TableHead>
                    <TableHead>Proxy</TableHead>
                    <TableHead>Domain</TableHead>
                    <TableHead>Tier</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead className="hidden md:table-cell">Requests</TableHead>
                    <TableHead className="hidden lg:table-cell">Bandwidth</TableHead>
                    <TableHead className="hidden lg:table-cell">Expires</TableHead>
                    <TableHead className="w-20">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {activeSessions.map((session) => (
                    <TableRow key={session.id}>
                      <TableCell className="font-mono text-xs">{session.id}</TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-mono text-xs">{session.proxyIp}</span>
                          <span className="text-xs text-muted-foreground">{session.country}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">{session.domain}</TableCell>
                      <TableCell>{getTierBadge(session.tier)}</TableCell>
                      <TableCell>
                        {session.sticky ? (
                          <Badge variant="secondary" className="bg-violet-50 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400 gap-1">
                            <Link2 className="h-3 w-3" />
                            Sticky
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="gap-1">
                            <Unlink className="h-3 w-3" />
                            Rotating
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="hidden md:table-cell tabular-nums text-sm">{session.requestCount.toLocaleString()}</TableCell>
                      <TableCell className="hidden lg:table-cell tabular-nums text-sm">{session.bandwidth} GB</TableCell>
                      <TableCell className="hidden lg:table-cell text-xs text-muted-foreground">
                        {getTimeRemaining(session.expiresAt)}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="icon" className="h-7 w-7">
                            <RotateCw className="h-3.5 w-3.5" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive">
                            <X className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Rotation Policies Tab */}
        <TabsContent value="policies">
          <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
            {policies.map((policy) => (
              <Card key={policy.id} className={!policy.enabled ? "opacity-60" : ""}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {getTierBadge(policy.tier)}
                      <CardTitle className="text-base">{policy.name}</CardTitle>
                    </div>
                    <Switch
                      checked={policy.enabled}
                      onCheckedChange={() => togglePolicy(policy.id)}
                    />
                  </div>
                  <CardDescription>Configuration for {policy.tier} proxy tier</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-3 grid-cols-2">
                    <div className="space-y-1.5">
                      <Label className="text-xs text-muted-foreground">Strategy</Label>
                      <Select defaultValue={policy.strategy} disabled={!policy.enabled}>
                        <SelectTrigger className="h-8 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="round-robin">Round Robin</SelectItem>
                          <SelectItem value="random">Random</SelectItem>
                          <SelectItem value="least-connections">Least Connections</SelectItem>
                          <SelectItem value="weighted">Weighted</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs text-muted-foreground">Sticky Duration</Label>
                      <Input
                        type="number"
                        defaultValue={policy.stickyDuration / 60000}
                        disabled={!policy.enabled}
                        className="h-8 text-xs"
                      />
                      <span className="text-[10px] text-muted-foreground">minutes</span>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs text-muted-foreground">Max Failures</Label>
                      <Input
                        type="number"
                        defaultValue={policy.maxFailures}
                        disabled={!policy.enabled}
                        className="h-8 text-xs"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs text-muted-foreground">Cooldown (sec)</Label>
                      <Input
                        type="number"
                        defaultValue={policy.cooldownMs / 1000}
                        disabled={!policy.enabled}
                        className="h-8 text-xs"
                      />
                    </div>
                  </div>
                  {policy.enabled && (
                    <Button variant="outline" size="sm" className="w-full">
                      <Settings2 className="h-3.5 w-3.5" />
                      Save Configuration
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Session Factory Tab */}
        <TabsContent value="factory">
          <div className="grid gap-4 grid-cols-1 lg:grid-cols-3">
            {/* Provider Stats Chart */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Session Factory Stats
                </CardTitle>
                <CardDescription>Provider performance comparison</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={sessionProviderChartConfig} className="h-[250px] w-full">
                  <BarChart data={sessionFactoryStats}>
                    <XAxis dataKey="provider" />
                    <YAxis />
                    <Bar dataKey="activeSessions" fill="var(--chart-1)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Provider Details */}
            <Card>
              <CardHeader>
                <CardTitle>Provider Details</CardTitle>
                <CardDescription>Per-provider statistics</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {sessionFactoryStats.map((stat) => (
                  <div key={stat.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{stat.provider}</span>
                      <span className="text-xs text-muted-foreground tabular-nums">
                        {stat.activeSessions} active
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-muted-foreground">Success Rate</span>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <Progress value={stat.successRate} className="h-1 flex-1" />
                          <span className="tabular-nums">{stat.successRate}%</span>
                        </div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Avg Latency</span>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <Timer className="h-3 w-3 text-muted-foreground" />
                          <span className="tabular-nums">{stat.avgLatency}ms</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Total: {stat.totalSessions.toLocaleString()} sessions</span>
                      <span>{stat.bandwidth} TB</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
