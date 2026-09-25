"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import {
  User,
  Bell,
  ShieldCheck,
  Save,
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
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { getCurrentUser, type SessionUser } from "@/lib/auth-client"

export default function SettingsPage() {
  const router = useRouter()
  const [user, setUser] = useState<SessionUser | null>(null)

  // Notification preferences (demo state)
  const [emailAlerts, setEmailAlerts] = useState(true)
  const [jobFailures, setJobFailures] = useState(true)
  const [weeklyReport, setWeeklyReport] = useState(false)
  const [productUpdates, setProductUpdates] = useState(false)

  // API defaults
  const [timeoutSec, setTimeoutSec] = useState("30")
  const [retries, setRetries] = useState("2")

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      const { status, user: u } = await getCurrentUser()
      if (cancelled) return
      if (status === "unauthorized") {
        router.push("/login")
        return
      }
      if (u) setUser(u)
    }
    load()
    return () => {
      cancelled = true
    }
  }, [router])

  const displayName = user?.name || user?.email?.split("@")[0] || "User"

  return (
    <div className="flex flex-col gap-6 p-6 max-w-3xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground">
          Manage your account, notifications, and API defaults.
        </p>
      </div>

      {/* Account */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-4 w-4 text-muted-foreground" />
            Account
          </CardTitle>
          <CardDescription>Your profile and plan information.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Display name</Label>
              <Input id="name" defaultValue={displayName} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                value={user?.email || ""}
                disabled
                className="text-muted-foreground"
              />
            </div>
          </div>
          <div className="flex items-center justify-between rounded-lg border p-3">
            <div>
              <div className="text-sm font-medium">Current plan</div>
              <div className="text-xs text-muted-foreground">
                {user?.plan === "free"
                  ? "100 API calls per month"
                  : user?.plan === "pro"
                    ? "10,000 API calls per month"
                    : "Unlimited API calls"}
              </div>
            </div>
            <Badge className="capitalize">{user?.plan || "free"}</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-4 w-4 text-muted-foreground" />
            Notifications
          </CardTitle>
          <CardDescription>
            Choose what you want to be notified about.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium">Email alerts</div>
              <div className="text-xs text-muted-foreground">
                Important account and billing notices
              </div>
            </div>
            <Switch checked={emailAlerts} onCheckedChange={setEmailAlerts} />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium">Job failure alerts</div>
              <div className="text-xs text-muted-foreground">
                When a scrape job fails or drops below its success threshold
              </div>
            </div>
            <Switch checked={jobFailures} onCheckedChange={setJobFailures} />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium">Weekly usage report</div>
              <div className="text-xs text-muted-foreground">
                A summary of requests, records, and credits every Monday
              </div>
            </div>
            <Switch checked={weeklyReport} onCheckedChange={setWeeklyReport} />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium">Product updates</div>
              <div className="text-xs text-muted-foreground">
                New templates, features, and improvements
              </div>
            </div>
            <Switch
              checked={productUpdates}
              onCheckedChange={setProductUpdates}
            />
          </div>
        </CardContent>
      </Card>

      {/* API defaults */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-muted-foreground" />
            API Defaults
          </CardTitle>
          <CardDescription>
            Applied to new scrape jobs unless overridden per request.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="timeout">Request timeout</Label>
              <Select value={timeoutSec} onValueChange={setTimeoutSec}>
                <SelectTrigger id="timeout">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10 seconds</SelectItem>
                  <SelectItem value="30">30 seconds</SelectItem>
                  <SelectItem value="60">60 seconds</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="retries">Automatic retries</Label>
              <Select value={retries} onValueChange={setRetries}>
                <SelectTrigger id="retries">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">No retries</SelectItem>
                  <SelectItem value="1">1 retry</SelectItem>
                  <SelectItem value="2">2 retries</SelectItem>
                  <SelectItem value="3">3 retries</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button>
          <Save className="mr-2 h-4 w-4" />
          Save changes
        </Button>
      </div>
    </div>
  )
}
