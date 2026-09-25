"use client"

import { useMemo, useState } from "react"
import {
  Briefcase,
  Play,
  RefreshCw,
  Search,
  Clock,
  MoreHorizontal,
  Plus,
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
import { jobsOverview, mockJobs, type JobStatus } from "@/lib/mock-data"

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

function statusBadge(status: JobStatus) {
  switch (status) {
    case "running":
      return (
        <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400">
          <span className="mr-1 inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
          Running
        </Badge>
      )
    case "queued":
      return <Badge variant="secondary">Queued</Badge>
    case "completed":
      return <Badge variant="outline">Completed</Badge>
    case "failed":
      return <Badge variant="destructive">Failed</Badge>
    case "paused":
      return <Badge variant="outline" className="text-muted-foreground">Paused</Badge>
    default:
      return <Badge variant="outline">{status}</Badge>
  }
}

export default function JobsPage() {
  const [query, setQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  const filtered = useMemo(() => {
    return mockJobs.filter((job) => {
      const matchesQuery =
        job.name.toLowerCase().includes(query.toLowerCase()) ||
        job.targetUrl.toLowerCase().includes(query.toLowerCase())
      const matchesStatus =
        statusFilter === "all" || job.status === statusFilter
      return matchesQuery && matchesStatus
    })
  }, [query, statusFilter])

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Jobs</h1>
          <p className="text-sm text-muted-foreground">
            Manage and monitor your scrape jobs.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button size="sm">
            <Plus className="mr-2 h-4 w-4" />
            New Job
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Jobs
            </CardTitle>
            <Play className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{jobsOverview.active}</div>
            <p className="text-xs text-muted-foreground">running right now</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Queued
            </CardTitle>
            <Clock className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{jobsOverview.queued}</div>
            <p className="text-xs text-muted-foreground">waiting for a slot</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Records Collected
            </CardTitle>
            <Briefcase className="h-4 w-4 text-sky-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">
              {jobsOverview.totalRecords.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">across all jobs</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Avg. Success Rate
            </CardTitle>
            <RefreshCw className="h-4 w-4 text-violet-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">
              {jobsOverview.avgSuccessRate}%
            </div>
            <p className="text-xs text-muted-foreground">last 24 hours</p>
          </CardContent>
        </Card>
      </div>

      {/* Job list */}
      <Card>
        <CardHeader>
          <CardTitle>All Jobs</CardTitle>
          <CardDescription>
            {filtered.length} of {mockJobs.length} jobs
          </CardDescription>
          <div className="flex flex-col gap-2 pt-2 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search jobs or target URLs..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-8"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                <SelectItem value="running">Running</SelectItem>
                <SelectItem value="queued">Queued</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
                <SelectItem value="paused">Paused</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Job</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Schedule</TableHead>
                <TableHead className="text-right">Records</TableHead>
                <TableHead className="text-right">Success</TableHead>
                <TableHead>Last Run</TableHead>
                <TableHead className="w-10" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((job) => (
                <TableRow key={job.id}>
                  <TableCell>
                    <div className="font-medium">{job.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {job.targetUrl} · {job.template}
                    </div>
                  </TableCell>
                  <TableCell>{statusBadge(job.status)}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">
                      {job.schedule}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {job.records.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right">
                    {job.status === "queued" ? (
                      <span className="text-muted-foreground">—</span>
                    ) : (
                      <div className="flex items-center justify-end gap-2">
                        <Progress
                          value={job.successRate}
                          className="h-1.5 w-16"
                        />
                        <span className="tabular-nums text-xs text-muted-foreground">
                          {job.successRate}%
                        </span>
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {job.status === "queued"
                      ? "waiting"
                      : formatTimeAgo(job.lastRun)}
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="py-10 text-center text-muted-foreground"
                  >
                    No jobs match your filters.
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
