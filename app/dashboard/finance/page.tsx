"use client"

import { useRouter } from "next/navigation"
import { FinanceShell } from "@/components/finance/finance-shell"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  IndianRupee, TrendingUp, TrendingDown, ShoppingCart,
  AlertTriangle, BarChart3, BookOpen, ScrollText,
  ArrowUpRight, ArrowDownRight, ArrowRight,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { FINANCE_SETUPS, FINANCE_APPS } from "@/stores/finance-store"

function formatINRCompact(amount: number) {
  if (amount >= 10000000) return `${(amount / 10000000).toFixed(1)}Cr`
  if (amount >= 100000) return `${(amount / 100000).toFixed(1)}L`
  if (amount >= 1000) return `${(amount / 1000).toFixed(0)}K`
  return amount.toString()
}

const KPI = [
  { label: "Today's Collection", value: 285000, change: 15.2, positive: true, icon: ShoppingCart, color: "text-emerald-500", bg: "bg-emerald-500/10" },
  { label: "Pending Dues", value: 8700000, change: -5.4, positive: true, icon: AlertTriangle, color: "text-amber-500", bg: "bg-amber-500/10" },
  { label: "Monthly Revenue", value: 4800000, change: 12.8, positive: true, icon: TrendingUp, color: "text-primary", bg: "bg-primary/10" },
  { label: "Monthly Expenses", value: 3300000, change: 8.1, positive: false, icon: TrendingDown, color: "text-rose-500", bg: "bg-rose-500/10" },
]

const RECENT_ACTIVITY = [
  { time: "2:32 PM", action: "Fee collected ₹15,000 via Cash", user: "Amit K.", module: "POS", color: "text-emerald-500" },
  { time: "1:55 PM", action: "Journal Voucher JV/26-27/004 posted", user: "CA Sharma", module: "GL", color: "text-primary" },
  { time: "1:40 PM", action: "Petty Cash Voucher #402 deleted", user: "Priya S.", module: "Economics", color: "text-rose-500" },
  { time: "12:15 PM", action: "Purchase Bill PB-2026-089 created", user: "CA Sharma", module: "Payables", color: "text-amber-500" },
  { time: "11:50 AM", action: "Fee plan updated - Transport Fee", user: "Admin", module: "Setups", color: "text-primary" },
  { time: "11:30 AM", action: "Fee collected ₹42,500 via UPI", user: "Amit K.", module: "POS", color: "text-emerald-500" },
]

export default function FinanceDashboardPage() {
  const router = useRouter()

  return (
    <FinanceShell breadcrumbs={[{ label: "Dashboard" }]}>
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
            Finance Engine
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Institutional finance, billing, and economics overview.
          </p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {KPI.map((kpi) => {
            const Icon = kpi.icon
            return (
              <Card key={kpi.label} className="border-border/40 bg-card/30 backdrop-blur-xl">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className={cn("flex size-8 items-center justify-center rounded-xl", kpi.bg)}>
                      <Icon className={cn("size-4", kpi.color)} />
                    </div>
                    <Badge variant="outline" className={cn(
                      "text-[10px] font-semibold",
                      kpi.positive ? "border-emerald-500/30 text-emerald-500" : "border-rose-500/30 text-rose-500"
                    )}>
                      {kpi.positive ? <ArrowUpRight className="mr-0.5 size-2.5" /> : <ArrowDownRight className="mr-0.5 size-2.5" />}
                      {Math.abs(kpi.change)}%
                    </Badge>
                  </div>
                  <p className="mt-3 text-lg font-bold text-foreground sm:text-xl">{formatINRCompact(kpi.value)}</p>
                  <p className="mt-0.5 text-[11px] text-muted-foreground">{kpi.label}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Quick Actions + Activity */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
          {/* Quick Navigation */}
          <div className="lg:col-span-3">
            <Card className="border-border/40 bg-card/30 backdrop-blur-xl">
              <CardContent className="p-4">
                <p className="mb-3 text-xs font-bold uppercase tracking-[0.15em] text-muted-foreground">
                  Quick Access
                </p>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {[...FINANCE_SETUPS.items.slice(0, 3), ...FINANCE_APPS.items.slice(0, 6)].map((item) => {
                    const Icon = item.icon
                    return (
                      <button
                        key={item.id}
                        onClick={() => router.push(item.href)}
                        className="group flex items-center gap-2.5 rounded-xl border border-border/30 bg-background/20 px-3 py-2.5 text-left transition-all hover:border-primary/30 hover:bg-primary/5"
                      >
                        <Icon className="size-4 shrink-0 text-muted-foreground transition-colors group-hover:text-primary" />
                        <span className="truncate text-xs font-medium text-foreground">{item.label}</span>
                        <ArrowRight className="ml-auto size-3 shrink-0 text-muted-foreground/40 transition-all group-hover:translate-x-0.5 group-hover:text-primary" />
                      </button>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <div className="lg:col-span-2">
            <Card className="border-border/40 bg-card/30 backdrop-blur-xl">
              <CardContent className="p-4">
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-xs font-bold uppercase tracking-[0.15em] text-muted-foreground">
                    Recent Activity
                  </p>
                  <button
                    onClick={() => router.push("/dashboard/finance/gl/audit-logs")}
                    className="text-[10px] font-medium text-primary hover:underline"
                  >
                    View All
                  </button>
                </div>
                <div className="flex flex-col gap-3">
                  {RECENT_ACTIVITY.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <span className="mt-0.5 w-14 shrink-0 text-right font-mono text-[10px] text-muted-foreground/60">{item.time}</span>
                      <div className="relative flex-1">
                        {idx < RECENT_ACTIVITY.length - 1 && (
                          <div className="absolute left-0 top-4 h-full w-px bg-border/30" />
                        )}
                        <div className="flex items-start gap-2">
                          <div className={cn("mt-1 size-1.5 shrink-0 rounded-full", item.color.replace("text-", "bg-"))} />
                          <div className="min-w-0">
                            <p className="text-xs text-foreground leading-relaxed">{item.action}</p>
                            <p className="text-[10px] text-muted-foreground/60">{item.user} &middot; {item.module}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </FinanceShell>
  )
}
