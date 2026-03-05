"use client"

import { useState, useMemo } from "react"
import { FinanceShell } from "@/components/finance/finance-shell"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  ScrollText, Search, Filter, Download, Shield,
  ShoppingCart, CreditCard, Wallet, BookOpen, Banknote,
  Pencil, Trash2, Plus, Eye,
} from "lucide-react"
import { cn } from "@/lib/utils"

type ActionType = "CREATE" | "UPDATE" | "DELETE" | "LOGIN" | "EXPORT"
type ModuleType = "POS" | "Payables" | "Petty Cash" | "Journal Entry" | "Payroll" | "Refunds" | "Defaulters" | "Fee Plans" | "System"

interface AuditLogEntry {
  id: string
  timestamp: string
  userId: string
  userName: string
  module: ModuleType
  actionType: ActionType
  description: string
  ipAddress: string
  metadata?: string
}

const MODULE_CONFIG: Record<ModuleType, { icon: typeof ShoppingCart; color: string }> = {
  POS: { icon: ShoppingCart, color: "text-emerald-500" },
  Payables: { icon: CreditCard, color: "text-primary" },
  "Petty Cash": { icon: Wallet, color: "text-amber-500" },
  "Journal Entry": { icon: BookOpen, color: "text-violet-500" },
  Payroll: { icon: Banknote, color: "text-sky-500" },
  Refunds: { icon: Banknote, color: "text-rose-500" },
  Defaulters: { icon: Shield, color: "text-rose-400" },
  "Fee Plans": { icon: ScrollText, color: "text-teal-500" },
  System: { icon: Shield, color: "text-muted-foreground" },
}

const ACTION_CONFIG: Record<ActionType, { icon: typeof Plus; color: string; bg: string }> = {
  CREATE: { icon: Plus, color: "text-emerald-500", bg: "border-emerald-500/30 bg-emerald-500/10" },
  UPDATE: { icon: Pencil, color: "text-amber-500", bg: "border-amber-500/30 bg-amber-500/10" },
  DELETE: { icon: Trash2, color: "text-rose-500", bg: "border-rose-500/30 bg-rose-500/10" },
  LOGIN: { icon: Eye, color: "text-primary", bg: "border-primary/30 bg-primary/10" },
  EXPORT: { icon: Download, color: "text-sky-500", bg: "border-sky-500/30 bg-sky-500/10" },
}

const MOCK_AUDIT_LOGS: AuditLogEntry[] = [
  { id: "AL-001", timestamp: "2026-03-05T14:32:11", userId: "USR-042", userName: "Amit Kumar", module: "POS", actionType: "CREATE", description: "Collected fee payment of ₹15,000 via Cash for Admn: 2045 (Rahul Verma)", ipAddress: "192.168.1.45" },
  { id: "AL-002", timestamp: "2026-03-05T14:28:05", userId: "USR-042", userName: "Amit Kumar", module: "POS", actionType: "UPDATE", description: "Applied Sibling Discount of ₹2,000 to Admn: 2046 (Priya Verma)", ipAddress: "192.168.1.45" },
  { id: "AL-003", timestamp: "2026-03-05T13:55:22", userId: "USR-015", userName: "CA Sharma", module: "Journal Entry", actionType: "CREATE", description: "Posted Journal Voucher JV/26-27/004 - GST input credit adjustment ₹18,900", ipAddress: "192.168.1.12" },
  { id: "AL-004", timestamp: "2026-03-05T13:40:18", userId: "USR-008", userName: "Priya Singh", module: "Petty Cash", actionType: "DELETE", description: "Deleted Petty Cash Voucher #402 - Duplicate entry for stationery purchase", ipAddress: "192.168.1.33" },
  { id: "AL-005", timestamp: "2026-03-05T12:15:40", userId: "USR-015", userName: "CA Sharma", module: "Payables", actionType: "CREATE", description: "Created Purchase Bill PB-2026-089 for Delhi Electricals - ₹28,000 + GST", ipAddress: "192.168.1.12" },
  { id: "AL-006", timestamp: "2026-03-05T11:50:33", userId: "USR-001", userName: "Admin", module: "Fee Plans", actionType: "UPDATE", description: "Modified 'Senior Secondary 2026-27' fee plan - updated Transport Fee from ₹3,000 to ₹3,500/month", ipAddress: "192.168.1.1" },
  { id: "AL-007", timestamp: "2026-03-05T11:30:12", userId: "USR-042", userName: "Amit Kumar", module: "POS", actionType: "CREATE", description: "Collected fee payment of ₹42,500 via Online (UPI) for Admn: 1089 (Sneha Gupta)", ipAddress: "192.168.1.45" },
  { id: "AL-008", timestamp: "2026-03-05T10:22:05", userId: "USR-015", userName: "CA Sharma", module: "Payroll", actionType: "EXPORT", description: "Generated Bank Advice file for March 2026 salary disbursement - 142 employees", ipAddress: "192.168.1.12" },
  { id: "AL-009", timestamp: "2026-03-05T10:05:00", userId: "USR-001", userName: "Admin", module: "System", actionType: "LOGIN", description: "Admin logged in from new device - Chrome on Windows 11", ipAddress: "203.0.113.42" },
  { id: "AL-010", timestamp: "2026-03-04T16:45:22", userId: "USR-042", userName: "Amit Kumar", module: "POS", actionType: "UPDATE", description: "Manually overrode Sibling Discount for Admn: 1042 - increased from ₹1,000 to ₹1,500", ipAddress: "192.168.1.45" },
  { id: "AL-011", timestamp: "2026-03-04T15:33:11", userId: "USR-008", userName: "Priya Singh", module: "Petty Cash", actionType: "CREATE", description: "Added Petty Cash Voucher #PC-006 - Plumber repair washroom ₹800", ipAddress: "192.168.1.33" },
  { id: "AL-012", timestamp: "2026-03-04T14:10:55", userId: "USR-015", userName: "CA Sharma", module: "Journal Entry", actionType: "CREATE", description: "Created Draft Journal Voucher JV/26-27/003 - Bus depreciation provision ₹35,000", ipAddress: "192.168.1.12" },
  { id: "AL-013", timestamp: "2026-03-04T12:20:08", userId: "USR-001", userName: "Admin", module: "Refunds", actionType: "UPDATE", description: "Approved Refund Request #RF-2026-012 - ₹8,500 for withdrawn student Admn: 3022", ipAddress: "192.168.1.1" },
  { id: "AL-014", timestamp: "2026-03-04T11:05:33", userId: "USR-042", userName: "Amit Kumar", module: "Defaulters", actionType: "CREATE", description: "Triggered bulk SMS fee reminders to 45 defaulter families - Q1 pending dues", ipAddress: "192.168.1.45" },
  { id: "AL-015", timestamp: "2026-03-04T09:30:00", userId: "USR-015", userName: "CA Sharma", module: "Payables", actionType: "UPDATE", description: "Marked PB-2026-085 as Paid - RK Motors vendor payment ₹8,500 via NEFT", ipAddress: "192.168.1.12" },
  { id: "AL-016", timestamp: "2026-03-03T17:12:45", userId: "USR-008", userName: "Priya Singh", module: "Petty Cash", actionType: "CREATE", description: "Added Petty Cash Voucher #PC-005 - Refreshments for parent-teacher meet ₹3,500", ipAddress: "192.168.1.33" },
  { id: "AL-017", timestamp: "2026-03-03T15:48:30", userId: "USR-015", userName: "CA Sharma", module: "Journal Entry", actionType: "CREATE", description: "Posted Journal Voucher JV/26-27/002 - Bad debt write-off ₹12,500", ipAddress: "192.168.1.12" },
  { id: "AL-018", timestamp: "2026-03-03T14:05:12", userId: "USR-001", userName: "Admin", module: "Fee Plans", actionType: "CREATE", description: "Created new fee plan 'Nursery 2026-27' with 6 fee heads including RTE exemptions", ipAddress: "192.168.1.1" },
]

function formatTimestamp(ts: string) {
  const d = new Date(ts)
  return d.toLocaleDateString("en-IN", { month: "short", day: "numeric" }) + " " + d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true })
}

export default function AuditLogsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [filterModule, setFilterModule] = useState<string>("all")
  const [filterAction, setFilterAction] = useState<string>("all")
  const [filterUser, setFilterUser] = useState<string>("all")

  const users = useMemo(() => {
    const unique = new Map<string, string>()
    MOCK_AUDIT_LOGS.forEach((l) => unique.set(l.userId, l.userName))
    return Array.from(unique.entries()).map(([id, name]) => ({ id, name }))
  }, [])

  const filtered = useMemo(() => {
    return MOCK_AUDIT_LOGS.filter((log) => {
      if (filterModule !== "all" && log.module !== filterModule) return false
      if (filterAction !== "all" && log.actionType !== filterAction) return false
      if (filterUser !== "all" && log.userId !== filterUser) return false
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase()
        return (
          log.description.toLowerCase().includes(q) ||
          log.userName.toLowerCase().includes(q) ||
          log.module.toLowerCase().includes(q) ||
          log.id.toLowerCase().includes(q)
        )
      }
      return true
    })
  }, [searchQuery, filterModule, filterAction, filterUser])

  return (
    <FinanceShell breadcrumbs={[{ label: "GL" }, { label: "Audit Logs" }]}>
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
              Financial Audit Logs
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Immutable activity log of every financial operation across all modules.
            </p>
          </div>
          <Button variant="outline" size="sm" className="border-border/40 text-muted-foreground">
            <Download className="mr-1.5 size-3.5" /> Export CSV
          </Button>
        </div>

        {/* Filters Bar */}
        <Card className="border-border/40 bg-card/30 backdrop-blur-xl">
          <CardContent className="p-3">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search audit logs..."
                  className="h-8 border-border/40 bg-background/30 pl-8 text-sm"
                />
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Select value={filterModule} onValueChange={setFilterModule}>
                  <SelectTrigger className="h-8 w-full border-border/40 bg-background/30 text-xs sm:w-32">
                    <Filter className="mr-1 size-3 text-muted-foreground" />
                    <SelectValue placeholder="Module" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Modules</SelectItem>
                    {Object.keys(MODULE_CONFIG).map((mod) => (
                      <SelectItem key={mod} value={mod}>{mod}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={filterAction} onValueChange={setFilterAction}>
                  <SelectTrigger className="h-8 w-full border-border/40 bg-background/30 text-xs sm:w-28">
                    <SelectValue placeholder="Action" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Actions</SelectItem>
                    {Object.keys(ACTION_CONFIG).map((a) => (
                      <SelectItem key={a} value={a}>{a}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={filterUser} onValueChange={setFilterUser}>
                  <SelectTrigger className="h-8 w-full border-border/40 bg-background/30 text-xs sm:w-32">
                    <SelectValue placeholder="User" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Users</SelectItem>
                    {users.map((u) => (
                      <SelectItem key={u.id} value={u.id}>{u.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results Count */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Shield className="size-3" />
          <span>{filtered.length} log entries</span>
          {(filterModule !== "all" || filterAction !== "all" || filterUser !== "all" || searchQuery) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => { setFilterModule("all"); setFilterAction("all"); setFilterUser("all"); setSearchQuery(""); }}
              className="h-5 px-1.5 text-[10px] text-primary hover:text-primary"
            >
              Clear filters
            </Button>
          )}
        </div>

        {/* Audit Logs Table */}
        <Card className="border-border/40 bg-card/30 backdrop-blur-xl">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-border/30 hover:bg-transparent">
                  <TableHead className="w-[130px] text-xs font-semibold uppercase tracking-wider text-muted-foreground">Timestamp</TableHead>
                  <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">User</TableHead>
                  <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Module</TableHead>
                  <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Action</TableHead>
                  <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Description</TableHead>
                  <TableHead className="hidden text-xs font-semibold uppercase tracking-wider text-muted-foreground lg:table-cell">IP Address</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((log) => {
                  const modCfg = MODULE_CONFIG[log.module]
                  const actCfg = ACTION_CONFIG[log.actionType]
                  const ModIcon = modCfg.icon
                  const ActIcon = actCfg.icon
                  return (
                    <TableRow key={log.id} className="border-border/20 transition-colors hover:bg-accent/20">
                      <TableCell className="font-mono text-[11px] text-muted-foreground whitespace-nowrap">
                        {formatTimestamp(log.timestamp)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary">
                            {log.userName.charAt(0)}
                          </div>
                          <div className="min-w-0">
                            <p className="truncate text-xs font-medium text-foreground">{log.userName}</p>
                            <p className="font-mono text-[10px] text-muted-foreground/60">{log.userId}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5">
                          <ModIcon className={cn("size-3.5 shrink-0", modCfg.color)} />
                          <span className="text-xs text-muted-foreground whitespace-nowrap">{log.module}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={cn("text-[9px] font-bold uppercase", actCfg.bg, actCfg.color)}>
                          <ActIcon className="mr-0.5 size-2.5" />
                          {log.actionType}
                        </Badge>
                      </TableCell>
                      <TableCell className="max-w-[300px]">
                        <p className="text-xs text-foreground/80 leading-relaxed line-clamp-2">{log.description}</p>
                      </TableCell>
                      <TableCell className="hidden font-mono text-[11px] text-muted-foreground/60 lg:table-cell">
                        {log.ipAddress}
                      </TableCell>
                    </TableRow>
                  )
                })}
                {filtered.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="py-12 text-center text-sm text-muted-foreground">
                      No audit logs match your filters.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </Card>

        {/* Immutability Notice */}
        <div className="flex items-start gap-2 rounded-xl border border-amber-500/20 bg-amber-500/5 px-4 py-3">
          <Shield className="mt-0.5 size-4 shrink-0 text-amber-500" />
          <div>
            <p className="text-xs font-semibold text-amber-500">Immutable Ledger</p>
            <p className="mt-0.5 text-[11px] text-muted-foreground leading-relaxed">
              Audit logs are write-once and cannot be modified or deleted. All financial operations across POS, Payables, Journal Entries, and other modules are automatically logged with user identity and IP address for compliance.
            </p>
          </div>
        </div>
      </div>
    </FinanceShell>
  )
}
