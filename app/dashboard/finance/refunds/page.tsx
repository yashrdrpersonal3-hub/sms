"use client"

import { useState } from "react"
import { FinanceShell } from "@/components/finance/finance-shell"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  RotateCcw, Clock, CheckCircle2, ArrowRight, User,
  IndianRupee, GraduationCap, MoreHorizontal, ChevronRight,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface RefundRequest {
  id: string
  studentName: string
  class: string
  admissionNo: string
  amount: number
  reason: string
  requestDate: string
  status: "Requested" | "Under Review" | "Refund Processed"
  reviewer?: string
  processedDate?: string
}

const MOCK_REFUNDS: RefundRequest[] = [
  { id: "RF-001", studentName: "Ananya Sharma", class: "Class 4-A", admissionNo: "ADM-2024-1100", amount: 4500, reason: "Transport route change - excess collected", requestDate: "2026-03-01", status: "Requested" },
  { id: "RF-002", studentName: "Karan Patel", class: "Class 7-B", admissionNo: "ADM-2023-0892", amount: 9000, reason: "TC issued mid-term - prorated tuition refund", requestDate: "2026-02-28", status: "Requested" },
  { id: "RF-003", studentName: "Meera Singh", class: "Class 10-A", admissionNo: "ADM-2022-0543", amount: 3000, reason: "Double payment - online + cash overlap", requestDate: "2026-02-25", status: "Under Review", reviewer: "Finance Head" },
  { id: "RF-004", studentName: "Vikram Reddy", class: "Class 5-C", admissionNo: "ADM-2024-1210", amount: 5000, reason: "Annual Day cancelled - full refund", requestDate: "2026-02-20", status: "Under Review", reviewer: "Accounts Officer" },
  { id: "RF-005", studentName: "Priya Nair", class: "Class 3-B", admissionNo: "ADM-2024-1043", amount: 2000, reason: "Transport fee refund - route change", requestDate: "2026-02-15", status: "Refund Processed", reviewer: "Admin", processedDate: "2026-02-18" },
  { id: "RF-006", studentName: "Arjun Das", class: "Class 9-A", admissionNo: "ADM-2023-0780", amount: 7500, reason: "Scholarship retroactive adjustment", requestDate: "2026-02-10", status: "Refund Processed", reviewer: "Finance Head", processedDate: "2026-02-14" },
  { id: "RF-007", studentName: "Riya Gupta", class: "Class 6-B", admissionNo: "ADM-2023-0915", amount: 1500, reason: "Lab fee overcharge correction", requestDate: "2026-02-05", status: "Refund Processed", reviewer: "Accounts Officer", processedDate: "2026-02-08" },
]

function formatINR(amount: number) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(amount)
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-IN", { month: "short", day: "numeric" })
}

const columns: { key: RefundRequest["status"]; label: string; color: string; bg: string; icon: typeof Clock }[] = [
  { key: "Requested", label: "Requested", color: "text-amber-500", bg: "border-amber-500/30", icon: Clock },
  { key: "Under Review", label: "Under Review", color: "text-primary", bg: "border-primary/30", icon: ArrowRight },
  { key: "Refund Processed", label: "Processed", color: "text-emerald-500", bg: "border-emerald-500/30", icon: CheckCircle2 },
]

function RefundCard({ refund }: { refund: RefundRequest }) {
  return (
    <Card className="border-border/30 bg-card/30 backdrop-blur-sm transition-all hover:border-primary/20 hover:shadow-md hover:shadow-primary/5">
      <CardContent className="flex flex-col gap-2.5 p-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
              <GraduationCap className="size-4 text-primary" />
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-foreground">{refund.studentName}</p>
              <p className="text-[10px] text-muted-foreground">{refund.class}</p>
            </div>
          </div>
          <span className="text-sm font-bold text-foreground">{formatINR(refund.amount)}</span>
        </div>
        <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">{refund.reason}</p>
        <div className="flex items-center justify-between text-[10px] text-muted-foreground">
          <span>{formatDate(refund.requestDate)}</span>
          <Badge variant="outline" className="border-border/30 text-[9px]">{refund.id}</Badge>
        </div>
        {refund.reviewer && (
          <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
            <User className="size-3" /> {refund.reviewer}
            {refund.processedDate && <span className="ml-auto">{formatDate(refund.processedDate)}</span>}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default function RefundsPage() {
  return (
    <FinanceShell breadcrumbs={[{ label: "Refunds & Adjustments" }]}>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
              Refund Requests
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Track and process refund requests through the approval pipeline.
            </p>
          </div>
          <Button size="sm" className="mt-3 w-fit bg-primary hover:bg-primary/90 sm:mt-0">
            <RotateCcw className="mr-1.5 size-4" />
            New Request
          </Button>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-3 gap-3">
          {columns.map((col) => {
            const Icon = col.icon
            const count = MOCK_REFUNDS.filter(r => r.status === col.key).length
            const total = MOCK_REFUNDS.filter(r => r.status === col.key).reduce((s, r) => s + r.amount, 0)
            return (
              <Card key={col.key} className={cn("border-border/40 bg-card/30 backdrop-blur-xl", col.bg)}>
                <CardContent className="flex flex-col items-center gap-1 p-3 sm:flex-row sm:gap-3 sm:p-4">
                  <Icon className={cn("size-5", col.color)} />
                  <div className="text-center sm:text-left">
                    <p className={cn("text-base font-bold sm:text-lg", col.color)}>{count}</p>
                    <p className="text-[10px] text-muted-foreground">{formatINR(total)}</p>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Kanban Board */}
        {/* Mobile: stacked cards; Desktop: 3-column kanban */}
        <div className="flex flex-col gap-6 lg:hidden">
          {columns.map((col) => {
            const Icon = col.icon
            const items = MOCK_REFUNDS.filter((r) => r.status === col.key)
            return (
              <div key={col.key}>
                <div className="mb-3 flex items-center gap-2">
                  <Icon className={cn("size-4", col.color)} />
                  <span className={cn("text-sm font-semibold", col.color)}>{col.label}</span>
                  <Badge variant="outline" className="border-border/40 text-[10px] text-muted-foreground">{items.length}</Badge>
                </div>
                <div className="flex flex-col gap-2">
                  {items.map((refund) => <RefundCard key={refund.id} refund={refund} />)}
                  {items.length === 0 && (
                    <div className="rounded-xl border border-dashed border-border/30 py-6 text-center text-xs text-muted-foreground">
                      No requests
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        <div className="hidden gap-4 lg:grid lg:grid-cols-3">
          {columns.map((col) => {
            const Icon = col.icon
            const items = MOCK_REFUNDS.filter((r) => r.status === col.key)
            return (
              <div key={col.key} className="flex flex-col">
                <div className={cn("mb-3 flex items-center gap-2 rounded-xl border px-3 py-2.5", col.bg, "bg-card/20")}>
                  <Icon className={cn("size-4", col.color)} />
                  <span className={cn("text-sm font-semibold", col.color)}>{col.label}</span>
                  <Badge variant="outline" className="ml-auto border-border/40 text-[10px] text-muted-foreground">{items.length}</Badge>
                </div>
                <div className="flex flex-1 flex-col gap-2">
                  {items.map((refund) => <RefundCard key={refund.id} refund={refund} />)}
                  {items.length === 0 && (
                    <div className="flex-1 rounded-xl border border-dashed border-border/30 py-8 text-center text-xs text-muted-foreground">
                      Drop requests here
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </FinanceShell>
  )
}
