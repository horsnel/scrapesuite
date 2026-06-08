// Mock data for the Proxy Manager Dashboard

export type ProxyTier = "residential" | "mobile" | "datacenter" | "isp";
export type ProxyStatus = "active" | "retired" | "testing" | "error";

export interface Proxy {
  id: string;
  ip: string;
  port: number;
  tier: ProxyTier;
  country: string;
  countryCode: string;
  status: ProxyStatus;
  provider: string;
  latency: number;
  successRate: number;
  lastChecked: string;
  bandwidth: number;
  stickySupport: boolean;
  createdAt: string;
}

export interface ProxyEvent {
  id: string;
  timestamp: string;
  type: "rotation" | "failure" | "recovery" | "retired" | "added" | "tested";
  proxyId: string;
  proxyIp: string;
  message: string;
  tier: ProxyTier;
}

export interface ActiveSession {
  id: string;
  proxyId: string;
  proxyIp: string;
  domain: string;
  startedAt: string;
  requestCount: number;
  bandwidth: number;
  sticky: boolean;
  expiresAt: string | null;
  tier: ProxyTier;
  country: string;
}

export interface RotationPolicy {
  id: string;
  name: string;
  tier: ProxyTier;
  strategy: "round-robin" | "random" | "least-connections" | "weighted";
  stickyDuration: number;
  maxFailures: number;
  cooldownMs: number;
  enabled: boolean;
}

export interface SessionFactoryStats {
  id: string;
  provider: string;
  totalSessions: number;
  activeSessions: number;
  successRate: number;
  avgLatency: number;
  bandwidth: number;
}

// ---- Mock Data ----

export const proxyPoolOverview = {
  total: 1284,
  active: 1047,
  retired: 198,
  testing: 24,
  error: 15,
  byTier: {
    residential: 486,
    mobile: 312,
    datacenter: 354,
    isp: 132,
  },
  overallSuccessRate: 97.2,
  avgLatency: 342,
  totalBandwidth: 2.8, // TB
};

export const geoDistribution = [
  { country: "United States", code: "US", count: 312, percentage: 29.8 },
  { country: "Germany", code: "DE", count: 186, percentage: 17.8 },
  { country: "United Kingdom", code: "GB", count: 124, percentage: 11.8 },
  { country: "France", code: "FR", count: 98, percentage: 9.4 },
  { country: "Japan", code: "JP", count: 87, percentage: 8.3 },
  { country: "Brazil", code: "BR", count: 76, percentage: 7.3 },
  { country: "Canada", code: "CA", count: 64, percentage: 6.1 },
  { country: "Australia", code: "AU", count: 52, percentage: 5.0 },
  { country: "India", code: "IN", count: 28, percentage: 2.7 },
  { country: "Other", code: "XX", count: 20, percentage: 1.8 },
];

export const successRateByTier = [
  { tier: "Residential", rate: 98.5, requests: 145200 },
  { tier: "Mobile", rate: 99.1, requests: 89600 },
  { tier: "Datacenter", rate: 95.3, requests: 234100 },
  { tier: "ISP", rate: 96.8, requests: 67800 },
];

export const recentProxyEvents: ProxyEvent[] = [
  {
    id: "evt-001",
    timestamp: "2025-03-04T14:32:11Z",
    type: "rotation",
    proxyId: "prx-0847",
    proxyIp: "192.168.1.100",
    message: "Rotated session for domain amazon.com",
    tier: "residential",
  },
  {
    id: "evt-002",
    timestamp: "2025-03-04T14:28:45Z",
    type: "failure",
    proxyId: "prx-0312",
    proxyIp: "10.0.0.55",
    message: "Connection timeout after 30s on walmart.com",
    tier: "datacenter",
  },
  {
    id: "evt-003",
    timestamp: "2025-03-04T14:25:03Z",
    type: "recovery",
    proxyId: "prx-0621",
    proxyIp: "172.16.0.23",
    message: "Proxy recovered after 2min downtime",
    tier: "mobile",
  },
  {
    id: "evt-004",
    timestamp: "2025-03-04T14:20:18Z",
    type: "added",
    proxyId: "prx-1284",
    proxyIp: "203.0.113.42",
    message: "New proxy added from BrightData pool",
    tier: "residential",
  },
  {
    id: "evt-005",
    timestamp: "2025-03-04T14:15:52Z",
    type: "retired",
    proxyId: "prx-0198",
    proxyIp: "198.51.100.18",
    message: "Retired: 5 consecutive failures in last hour",
    tier: "datacenter",
  },
  {
    id: "evt-006",
    timestamp: "2025-03-04T14:10:37Z",
    type: "tested",
    proxyId: "prx-0543",
    proxyIp: "203.0.113.88",
    message: "Health check passed - 245ms latency",
    tier: "isp",
  },
  {
    id: "evt-007",
    timestamp: "2025-03-04T14:05:12Z",
    type: "rotation",
    proxyId: "prx-0712",
    proxyIp: "192.168.2.44",
    message: "Auto-rotated sticky session after 10min",
    tier: "mobile",
  },
  {
    id: "evt-008",
    timestamp: "2025-03-04T14:01:55Z",
    type: "failure",
    proxyId: "prx-0955",
    proxyIp: "10.0.1.112",
    message: "HTTP 403 Forbidden on target.com",
    tier: "residential",
  },
];

export const mockProxies: Proxy[] = [
  {
    id: "prx-001",
    ip: "203.0.113.42",
    port: 8080,
    tier: "residential",
    country: "United States",
    countryCode: "US",
    status: "active",
    provider: "BrightData",
    latency: 245,
    successRate: 98.5,
    lastChecked: "2025-03-04T14:30:00Z",
    bandwidth: 45.2,
    stickySupport: true,
    createdAt: "2025-01-15T10:00:00Z",
  },
  {
    id: "prx-002",
    ip: "198.51.100.18",
    port: 3128,
    tier: "datacenter",
    country: "Germany",
    countryCode: "DE",
    status: "active",
    provider: "Oxylabs",
    latency: 89,
    successRate: 95.3,
    lastChecked: "2025-03-04T14:28:00Z",
    bandwidth: 128.7,
    stickySupport: false,
    createdAt: "2025-01-20T08:00:00Z",
  },
  {
    id: "prx-003",
    ip: "192.0.2.55",
    port: 8888,
    tier: "mobile",
    country: "United Kingdom",
    countryCode: "GB",
    status: "active",
    provider: "SmartProxy",
    latency: 412,
    successRate: 99.1,
    lastChecked: "2025-03-04T14:25:00Z",
    bandwidth: 22.1,
    stickySupport: true,
    createdAt: "2025-02-01T12:00:00Z",
  },
  {
    id: "prx-004",
    ip: "172.16.0.23",
    port: 8080,
    tier: "isp",
    country: "Japan",
    countryCode: "JP",
    status: "active",
    provider: "IPRoyal",
    latency: 156,
    successRate: 96.8,
    lastChecked: "2025-03-04T14:20:00Z",
    bandwidth: 67.3,
    stickySupport: true,
    createdAt: "2025-02-10T09:00:00Z",
  },
  {
    id: "prx-005",
    ip: "10.0.0.99",
    port: 3128,
    tier: "residential",
    country: "France",
    countryCode: "FR",
    status: "retired",
    provider: "BrightData",
    latency: 0,
    successRate: 82.1,
    lastChecked: "2025-03-03T20:00:00Z",
    bandwidth: 12.4,
    stickySupport: true,
    createdAt: "2024-11-05T14:00:00Z",
  },
  {
    id: "prx-006",
    ip: "203.0.113.88",
    port: 8080,
    tier: "datacenter",
    country: "United States",
    countryCode: "US",
    status: "active",
    provider: "Oxylabs",
    latency: 67,
    successRate: 97.8,
    lastChecked: "2025-03-04T14:32:00Z",
    bandwidth: 210.5,
    stickySupport: false,
    createdAt: "2025-01-25T16:00:00Z",
  },
  {
    id: "prx-007",
    ip: "198.51.100.142",
    port: 8888,
    tier: "mobile",
    country: "Brazil",
    countryCode: "BR",
    status: "testing",
    provider: "SmartProxy",
    latency: 534,
    successRate: 94.2,
    lastChecked: "2025-03-04T14:15:00Z",
    bandwidth: 8.9,
    stickySupport: true,
    createdAt: "2025-03-01T11:00:00Z",
  },
  {
    id: "prx-008",
    ip: "192.0.2.200",
    port: 3128,
    tier: "isp",
    country: "Canada",
    countryCode: "CA",
    status: "error",
    provider: "IPRoyal",
    latency: 0,
    successRate: 45.6,
    lastChecked: "2025-03-04T13:00:00Z",
    bandwidth: 3.2,
    stickySupport: true,
    createdAt: "2025-02-20T10:00:00Z",
  },
  {
    id: "prx-009",
    ip: "203.0.113.201",
    port: 8080,
    tier: "residential",
    country: "Australia",
    countryCode: "AU",
    status: "active",
    provider: "BrightData",
    latency: 387,
    successRate: 97.2,
    lastChecked: "2025-03-04T14:30:00Z",
    bandwidth: 31.8,
    stickySupport: true,
    createdAt: "2025-02-15T08:00:00Z",
  },
  {
    id: "prx-010",
    ip: "172.16.1.78",
    port: 8888,
    tier: "datacenter",
    country: "India",
    countryCode: "IN",
    status: "active",
    provider: "Oxylabs",
    latency: 198,
    successRate: 93.5,
    lastChecked: "2025-03-04T14:28:00Z",
    bandwidth: 95.4,
    stickySupport: false,
    createdAt: "2025-01-30T13:00:00Z",
  },
  {
    id: "prx-011",
    ip: "10.0.2.15",
    port: 3128,
    tier: "mobile",
    country: "Germany",
    countryCode: "DE",
    status: "active",
    provider: "SmartProxy",
    latency: 456,
    successRate: 98.7,
    lastChecked: "2025-03-04T14:25:00Z",
    bandwidth: 18.6,
    stickySupport: true,
    createdAt: "2025-02-25T15:00:00Z",
  },
  {
    id: "prx-012",
    ip: "198.51.100.222",
    port: 8080,
    tier: "residential",
    country: "United States",
    countryCode: "US",
    status: "retired",
    provider: "BrightData",
    latency: 0,
    successRate: 76.3,
    lastChecked: "2025-03-02T18:00:00Z",
    bandwidth: 5.1,
    stickySupport: true,
    createdAt: "2024-10-12T09:00:00Z",
  },
];

export const activeSessions: ActiveSession[] = [
  {
    id: "ses-001",
    proxyId: "prx-001",
    proxyIp: "203.0.113.42",
    domain: "amazon.com",
    startedAt: "2025-03-04T13:45:00Z",
    requestCount: 847,
    bandwidth: 12.4,
    sticky: true,
    expiresAt: "2025-03-04T14:45:00Z",
    tier: "residential",
    country: "US",
  },
  {
    id: "ses-002",
    proxyId: "prx-002",
    proxyIp: "198.51.100.18",
    domain: "walmart.com",
    startedAt: "2025-03-04T14:10:00Z",
    requestCount: 234,
    bandwidth: 3.8,
    sticky: false,
    expiresAt: null,
    tier: "datacenter",
    country: "DE",
  },
  {
    id: "ses-003",
    proxyId: "prx-003",
    proxyIp: "192.0.2.55",
    domain: "ebay.com",
    startedAt: "2025-03-04T12:30:00Z",
    requestCount: 1562,
    bandwidth: 28.9,
    sticky: true,
    expiresAt: "2025-03-04T14:30:00Z",
    tier: "mobile",
    country: "GB",
  },
  {
    id: "ses-004",
    proxyId: "prx-004",
    proxyIp: "172.16.0.23",
    domain: "target.com",
    startedAt: "2025-03-04T14:00:00Z",
    requestCount: 89,
    bandwidth: 1.2,
    sticky: true,
    expiresAt: "2025-03-04T15:00:00Z",
    tier: "isp",
    country: "JP",
  },
  {
    id: "ses-005",
    proxyId: "prx-006",
    proxyIp: "203.0.113.88",
    domain: "bestbuy.com",
    startedAt: "2025-03-04T13:15:00Z",
    requestCount: 672,
    bandwidth: 9.7,
    sticky: false,
    expiresAt: null,
    tier: "datacenter",
    country: "US",
  },
  {
    id: "ses-006",
    proxyId: "prx-009",
    proxyIp: "203.0.113.201",
    domain: "etsy.com",
    startedAt: "2025-03-04T14:20:00Z",
    requestCount: 45,
    bandwidth: 0.6,
    sticky: true,
    expiresAt: "2025-03-04T15:20:00Z",
    tier: "residential",
    country: "AU",
  },
  {
    id: "ses-007",
    proxyId: "prx-011",
    proxyIp: "10.0.2.15",
    domain: "aliexpress.com",
    startedAt: "2025-03-04T13:50:00Z",
    requestCount: 312,
    bandwidth: 5.4,
    sticky: true,
    expiresAt: "2025-03-04T14:50:00Z",
    tier: "mobile",
    country: "DE",
  },
  {
    id: "ses-008",
    proxyId: "prx-010",
    proxyIp: "172.16.1.78",
    domain: "flipkart.com",
    startedAt: "2025-03-04T14:25:00Z",
    requestCount: 28,
    bandwidth: 0.4,
    sticky: false,
    expiresAt: null,
    tier: "datacenter",
    country: "IN",
  },
];

export const rotationPolicies: RotationPolicy[] = [
  {
    id: "pol-001",
    name: "Residential Default",
    tier: "residential",
    strategy: "weighted",
    stickyDuration: 600000,
    maxFailures: 3,
    cooldownMs: 30000,
    enabled: true,
  },
  {
    id: "pol-002",
    name: "Mobile Sticky",
    tier: "mobile",
    strategy: "least-connections",
    stickyDuration: 900000,
    maxFailures: 2,
    cooldownMs: 60000,
    enabled: true,
  },
  {
    id: "pol-003",
    name: "Datacenter Fast",
    tier: "datacenter",
    strategy: "round-robin",
    stickyDuration: 0,
    maxFailures: 5,
    cooldownMs: 10000,
    enabled: true,
  },
  {
    id: "pol-004",
    name: "ISP Balanced",
    tier: "isp",
    strategy: "random",
    stickyDuration: 300000,
    maxFailures: 3,
    cooldownMs: 45000,
    enabled: false,
  },
];

export const sessionFactoryStats: SessionFactoryStats[] = [
  {
    id: "sf-001",
    provider: "BrightData",
    totalSessions: 4520,
    activeSessions: 312,
    successRate: 98.2,
    avgLatency: 287,
    bandwidth: 1.2,
  },
  {
    id: "sf-002",
    provider: "Oxylabs",
    totalSessions: 3840,
    activeSessions: 278,
    successRate: 96.5,
    avgLatency: 134,
    bandwidth: 0.9,
  },
  {
    id: "sf-003",
    provider: "SmartProxy",
    totalSessions: 2180,
    activeSessions: 165,
    successRate: 99.0,
    avgLatency: 412,
    bandwidth: 0.5,
  },
  {
    id: "sf-004",
    provider: "IPRoyal",
    totalSessions: 1420,
    activeSessions: 98,
    successRate: 95.8,
    avgLatency: 198,
    bandwidth: 0.3,
  },
];

// Analytics mock data
export const bandwidthOverTime = [
  { date: "Feb 26", residential: 42, mobile: 18, datacenter: 86, isp: 12 },
  { date: "Feb 27", residential: 45, mobile: 21, datacenter: 92, isp: 14 },
  { date: "Feb 28", residential: 38, mobile: 16, datacenter: 78, isp: 11 },
  { date: "Mar 01", residential: 51, mobile: 24, datacenter: 105, isp: 16 },
  { date: "Mar 02", residential: 48, mobile: 22, datacenter: 98, isp: 15 },
  { date: "Mar 03", residential: 55, mobile: 26, datacenter: 112, isp: 18 },
  { date: "Mar 04", residential: 52, mobile: 23, datacenter: 108, isp: 17 },
];

export const successRateByDomain = [
  { domain: "amazon.com", rate: 98.5, requests: 45200 },
  { domain: "walmart.com", rate: 96.2, requests: 38100 },
  { domain: "ebay.com", rate: 99.1, requests: 29800 },
  { domain: "target.com", rate: 94.8, requests: 22400 },
  { domain: "bestbuy.com", rate: 97.3, requests: 18600 },
  { domain: "etsy.com", rate: 95.6, requests: 12300 },
  { domain: "aliexpress.com", rate: 91.2, requests: 9800 },
  { domain: "flipkart.com", rate: 93.4, requests: 7200 },
];

export const latencyDistribution = [
  { range: "0-50ms", count: 312, percentage: 29.8 },
  { range: "50-100ms", count: 245, percentage: 23.4 },
  { range: "100-200ms", count: 186, percentage: 17.8 },
  { range: "200-500ms", count: 156, percentage: 14.9 },
  { range: "500ms-1s", count: 98, percentage: 9.4 },
  { range: "1s+", count: 50, percentage: 4.8 },
];

export const topDomains = [
  { domain: "amazon.com", requests: 45200, bandwidth: 612, successRate: 98.5 },
  { domain: "walmart.com", requests: 38100, bandwidth: 489, successRate: 96.2 },
  { domain: "ebay.com", requests: 29800, bandwidth: 334, successRate: 99.1 },
  { domain: "target.com", requests: 22400, bandwidth: 287, successRate: 94.8 },
  { domain: "bestbuy.com", requests: 18600, bandwidth: 234, successRate: 97.3 },
  { domain: "etsy.com", requests: 12300, bandwidth: 145, successRate: 95.6 },
  { domain: "aliexpress.com", requests: 9800, bandwidth: 112, successRate: 91.2 },
  { domain: "flipkart.com", requests: 7200, bandwidth: 86, successRate: 93.4 },
];

export const creditConsumption = [
  { category: "Residential Proxies", credits: 245000, percentage: 38.2 },
  { category: "Mobile Proxies", credits: 168000, percentage: 26.2 },
  { category: "Datacenter Proxies", credits: 134000, percentage: 20.9 },
  { category: "ISP Proxies", credits: 62000, percentage: 9.7 },
  { category: "Premium Geo-Targeting", credits: 22000, percentage: 3.4 },
  { category: "Sticky Sessions", credits: 10000, percentage: 1.6 },
];
