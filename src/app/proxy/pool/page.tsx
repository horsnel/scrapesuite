"use client"

import { useState, useMemo } from "react"
import {
  Search,
  Plus,
  Trash2,
  RefreshCw,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Filter,
  X,
  Activity,
  Clock,
  Globe,
  ArrowUpDown,
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
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { LineChart, Line, XAxis, YAxis, AreaChart, Area } from "recharts"

import { mockProxies, type Proxy, type ProxyTier, type ProxyStatus } from "@/lib/mock-data"

const latencyChartConfig = {
  latency: {
    label: "Latency (ms)",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig

const successRateChartConfig = {
  rate: {
    label: "Success Rate %",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig

// Generate mock time series data for a proxy
function generateLatencyHistory(baseLatency: number) {
  const points: { time: string; latency: number }[] = []
  for (let i = 11; i >= 0; i--) {
    const d = new Date()
    d.setHours(d.getHours() - i)
    points.push({
      time: d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      latency: baseLatency + Math.floor(Math.random() * 100 - 50),
    })
  }
  return points
}

function generateSuccessRateHistory(baseRate: number) {
  const points: { time: string; rate: number }[] = []
  for (let i = 11; i >= 0; i--) {
    const d = new Date()
    d.setHours(d.getHours() - i)
    points.push({
      time: d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      rate: Math.min(100, Math.max(0, baseRate + (Math.random() * 4 - 2))),
    })
  }
  return points
}

function getStatusBadge(status: ProxyStatus) {
  switch (status) {
    case "active":
      return <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400">Active</Badge>
    case "retired":
      return <Badge variant="outline" className="text-muted-foreground">Retired</Badge>
    case "testing":
      return <Badge className="bg-sky-100 text-sky-800 dark:bg-sky-900/30 dark:text-sky-400">Testing</Badge>
    case "error":
      return <Badge variant="destructive">Error</Badge>
    default:
      return <Badge variant="secondary">{status}</Badge>
  }
}

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

export default function ProxyPoolPage() {
  const [search, setSearch] = useState("")
  const [tierFilter, setTierFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [providerFilter, setProviderFilter] = useState<string>("all")
  const [countryFilter, setCountryFilter] = useState<string>("all")
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [sortField, setSortField] = useState<keyof Proxy>("id")
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc")

  // Derive unique values for filters
  const providers = useMemo(() => [...new Set(mockProxies.map((p) => p.provider))], [])
  const countries = useMemo(() => [...new Set(mockProxies.map((p) => p.country))], [])

  // Filter and sort
  const filteredProxies = useMemo(() => {
    let result = mockProxies.filter((proxy) => {
      const matchesSearch =
        search === "" ||
        proxy.ip.includes(search) ||
        proxy.id.includes(search) ||
        proxy.country.toLowerCase().includes(search.toLowerCase())
      const matchesTier = tierFilter === "all" || proxy.tier === tierFilter
      const matchesStatus = statusFilter === "all" || proxy.status === statusFilter
      const matchesProvider = providerFilter === "all" || proxy.provider === providerFilter
      const matchesCountry = countryFilter === "all" || proxy.country === countryFilter
      return matchesSearch && matchesTier && matchesStatus && matchesProvider && matchesCountry
    })

    result.sort((a, b) => {
      const aVal = a[sortField]
      const bVal = b[sortField]
      if (typeof aVal === "number" && typeof bVal === "number") {
        return sortDir === "asc" ? aVal - bVal : bVal - aVal
      }
      return sortDir === "asc"
        ? String(aVal).localeCompare(String(bVal))
        : String(bVal).localeCompare(String(aVal))
    })

    return result
  }, [search, tierFilter, statusFilter, providerFilter, countryFilter, sortField, sortDir])

  const toggleSort = (field: keyof Proxy) => {
    if (sortField === field) {
      setSortDir(sortDir === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDir("asc")
    }
  }

  const toggleSelect = (id: string) => {
    const next = new Set(selectedIds)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    setSelectedIds(next)
  }

  const toggleSelectAll = () => {
    if (selectedIds.size === filteredProxies.length) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(filteredProxies.map((p) => p.id)))
    }
  }

  const hasActiveFilters =
    tierFilter !== "all" ||
    statusFilter !== "all" ||
    providerFilter !== "all" ||
    countryFilter !== "all" ||
    search !== ""

  const clearFilters = () => {
    setTierFilter("all")
    setStatusFilter("all")
    setProviderFilter("all")
    setCountryFilter("all")
    setSearch("")
  }

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Proxy Pool</h1>
          <p className="text-muted-foreground text-sm">
            Manage and monitor your proxy pool ({mockProxies.length} proxies)
          </p>
        </div>
        <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="h-4 w-4" />
              Add Proxy
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Proxy</DialogTitle>
              <DialogDescription>
                Add a proxy to your pool. It will be tested before going active.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="ip">IP Address</Label>
                <Input id="ip" placeholder="e.g. 203.0.113.42" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="port">Port</Label>
                  <Input id="port" placeholder="8080" type="number" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="tier">Tier</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select tier" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="residential">Residential</SelectItem>
                      <SelectItem value="mobile">Mobile</SelectItem>
                      <SelectItem value="datacenter">Datacenter</SelectItem>
                      <SelectItem value="isp">ISP</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="provider">Provider</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select provider" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="BrightData">BrightData</SelectItem>
                      <SelectItem value="Oxylabs">Oxylabs</SelectItem>
                      <SelectItem value="SmartProxy">SmartProxy</SelectItem>
                      <SelectItem value="IPRoyal">IPRoyal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="country">Country</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="US">United States</SelectItem>
                      <SelectItem value="DE">Germany</SelectItem>
                      <SelectItem value="GB">United Kingdom</SelectItem>
                      <SelectItem value="FR">France</SelectItem>
                      <SelectItem value="JP">Japan</SelectItem>
                      <SelectItem value="BR">Brazil</SelectItem>
                      <SelectItem value="CA">Canada</SelectItem>
                      <SelectItem value="AU">Australia</SelectItem>
                      <SelectItem value="IN">India</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox id="sticky" />
                <Label htmlFor="sticky" className="text-sm font-normal">
                  Supports sticky sessions
                </Label>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => setAddDialogOpen(false)}>
                Add & Test Proxy
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Filters</span>
              {hasActiveFilters && (
                <Button variant="ghost" size="sm" onClick={clearFilters} className="h-7 text-xs">
                  <X className="h-3 w-3" />
                  Clear
                </Button>
              )}
            </div>
            <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-5">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search IP, ID, country..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-8 h-9"
                />
              </div>
              <Select value={tierFilter} onValueChange={setTierFilter}>
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="Tier" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Tiers</SelectItem>
                  <SelectItem value="residential">Residential</SelectItem>
                  <SelectItem value="mobile">Mobile</SelectItem>
                  <SelectItem value="datacenter">Datacenter</SelectItem>
                  <SelectItem value="isp">ISP</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="retired">Retired</SelectItem>
                  <SelectItem value="testing">Testing</SelectItem>
                  <SelectItem value="error">Error</SelectItem>
                </SelectContent>
              </Select>
              <Select value={providerFilter} onValueChange={setProviderFilter}>
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="Provider" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Providers</SelectItem>
                  {providers.map((p) => (
                    <SelectItem key={p} value={p}>{p}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={countryFilter} onValueChange={setCountryFilter}>
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="Country" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Countries</SelectItem>
                  {countries.map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bulk Actions */}
      {selectedIds.size > 0 && (
        <Card>
          <CardContent className="py-3">
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground">
                {selectedIds.size} selected
              </span>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <RefreshCw className="h-3.5 w-3.5" />
                  Test Selected
                </Button>
                <Button variant="outline" size="sm">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Reactivate
                </Button>
                <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">
                  <Trash2 className="h-3.5 w-3.5" />
                  Retire
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Proxy Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-10">
                  <Checkbox
                    checked={selectedIds.size === filteredProxies.length && filteredProxies.length > 0}
                    onCheckedChange={toggleSelectAll}
                  />
                </TableHead>
                <TableHead className="w-10" />
                <TableHead>
                  <Button variant="ghost" size="sm" className="h-8 -ml-3" onClick={() => toggleSort("ip")}>
                    Proxy <ArrowUpDown className="h-3 w-3" />
                  </Button>
                </TableHead>
                <TableHead>Tier</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden md:table-cell">Provider</TableHead>
                <TableHead className="hidden lg:table-cell">
                  <Button variant="ghost" size="sm" className="h-8 -ml-3" onClick={() => toggleSort("latency")}>
                    Latency <ArrowUpDown className="h-3 w-3" />
                  </Button>
                </TableHead>
                <TableHead className="hidden lg:table-cell">
                  <Button variant="ghost" size="sm" className="h-8 -ml-3" onClick={() => toggleSort("successRate")}>
                    Success <ArrowUpDown className="h-3 w-3" />
                  </Button>
                </TableHead>
                <TableHead className="hidden xl:table-cell">
                  <Button variant="ghost" size="sm" className="h-8 -ml-3" onClick={() => toggleSort("bandwidth")}>
                    BW (GB) <ArrowUpDown className="h-3 w-3" />
                  </Button>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProxies.map((proxy) => {
                const isExpanded = expandedId === proxy.id
                return (
                  <>
                    <TableRow key={proxy.id} className={isExpanded ? "bg-muted/30" : ""}>
                      <TableCell>
                        <Checkbox
                          checked={selectedIds.has(proxy.id)}
                          onCheckedChange={() => toggleSelect(proxy.id)}
                        />
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => setExpandedId(isExpanded ? null : proxy.id)}
                        >
                          {isExpanded ? (
                            <ChevronDown className="h-4 w-4" />
                          ) : (
                            <ChevronRight className="h-4 w-4" />
                          )}
                        </Button>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-mono text-sm">{proxy.ip}:{proxy.port}</span>
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Globe className="h-3 w-3" />
                            {proxy.country}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>{getTierBadge(proxy.tier)}</TableCell>
                      <TableCell>{getStatusBadge(proxy.status)}</TableCell>
                      <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                        {proxy.provider}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <div className="flex items-center gap-1.5">
                          <Clock className="h-3 w-3 text-muted-foreground" />
                          <span className="text-sm tabular-nums">
                            {proxy.latency > 0 ? `${proxy.latency}ms` : "—"}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <div className="flex items-center gap-2">
                          <Progress value={proxy.successRate} className="h-1.5 w-16" />
                          <span className="text-sm tabular-nums">{proxy.successRate}%</span>
                        </div>
                      </TableCell>
                      <TableCell className="hidden xl:table-cell text-sm tabular-nums text-muted-foreground">
                        {proxy.bandwidth}
                      </TableCell>
                    </TableRow>
                    {isExpanded && (
                      <TableRow key={`${proxy.id}-detail`}>
                        <TableCell colSpan={9} className="bg-muted/20 p-4">
                          <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
                            {/* Latency History */}
                            <Card>
                              <CardHeader className="pb-2 pt-4 px-4">
                                <CardTitle className="text-sm flex items-center gap-1.5">
                                  <Clock className="h-4 w-4" />
                                  Latency History
                                </CardTitle>
                              </CardHeader>
                              <CardContent className="px-4 pb-4">
                                <ChartContainer config={latencyChartConfig} className="h-[120px] w-full">
                                  <AreaChart data={generateLatencyHistory(proxy.latency)}>
                                    <XAxis dataKey="time" hide />
                                    <YAxis hide />
                                    <ChartTooltip content={<ChartTooltipContent />} />
                                    <Area
                                      type="monotone"
                                      dataKey="latency"
                                      stroke="var(--chart-1)"
                                      fill="var(--chart-1)"
                                      fillOpacity={0.1}
                                      strokeWidth={2}
                                    />
                                  </AreaChart>
                                </ChartContainer>
                              </CardContent>
                            </Card>

                            {/* Success Rate Trend */}
                            <Card>
                              <CardHeader className="pb-2 pt-4 px-4">
                                <CardTitle className="text-sm flex items-center gap-1.5">
                                  <Activity className="h-4 w-4" />
                                  Success Rate Trend
                                </CardTitle>
                              </CardHeader>
                              <CardContent className="px-4 pb-4">
                                <ChartContainer config={successRateChartConfig} className="h-[120px] w-full">
                                  <LineChart data={generateSuccessRateHistory(proxy.successRate)}>
                                    <XAxis dataKey="time" hide />
                                    <YAxis hide domain={[80, 100]} />
                                    <ChartTooltip content={<ChartTooltipContent />} />
                                    <Line
                                      type="monotone"
                                      dataKey="rate"
                                      stroke="var(--chart-2)"
                                      strokeWidth={2}
                                      dot={false}
                                    />
                                  </LineChart>
                                </ChartContainer>
                              </CardContent>
                            </Card>

                            {/* Proxy Details */}
                            <Card>
                              <CardHeader className="pb-2 pt-4 px-4">
                                <CardTitle className="text-sm">Details</CardTitle>
                              </CardHeader>
                              <CardContent className="px-4 pb-4 space-y-2">
                                <div className="flex justify-between text-xs">
                                  <span className="text-muted-foreground">ID</span>
                                  <span className="font-mono">{proxy.id}</span>
                                </div>
                                <div className="flex justify-between text-xs">
                                  <span className="text-muted-foreground">Sticky Support</span>
                                  <span>{proxy.stickySupport ? "Yes" : "No"}</span>
                                </div>
                                <div className="flex justify-between text-xs">
                                  <span className="text-muted-foreground">Created</span>
                                  <span>{new Date(proxy.createdAt).toLocaleDateString()}</span>
                                </div>
                                <div className="flex justify-between text-xs">
                                  <span className="text-muted-foreground">Last Checked</span>
                                  <span>{new Date(proxy.lastChecked).toLocaleTimeString()}</span>
                                </div>
                                <div className="flex justify-between text-xs">
                                  <span className="text-muted-foreground">Bandwidth</span>
                                  <span className="tabular-nums">{proxy.bandwidth} GB</span>
                                </div>
                              </CardContent>
                            </Card>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </>
                )
              })}
              {filteredProxies.length === 0 && (
                <TableRow>
                  <TableCell colSpan={9} className="h-24 text-center text-muted-foreground">
                    No proxies found matching your filters.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
