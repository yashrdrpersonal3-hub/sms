"use client"

import { useState } from "react"
import { FinanceShell } from "@/components/finance/finance-shell"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose, DialogFooter } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import {
  BarChart3, TrendingUp, TrendingDown, IndianRupee,
  Download, FileText, Building2, Users, Bus,
  BookOpen, ArrowUpRight, ArrowDownRight, Wallet,
} from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, CartesianGrid, Legend } from "recharts"
import { cn } from "@/lib/utils"

function formatINR(amount: number) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(amount)
}

function formatINRCompact(amount: number) {
  if (amount >= 10000000) return `${(amount / 10000000).toFixed(1)}Cr`
  if (amount >= 100000) return `${(amount / 100000).toFixed(1)}L`
  if (amount >= 1000) return `${(amount / 1000).toFixed(0)}K`
  return amount.toString()
}

const DEPT_SPENDING = [
  { dept: "Primary", budget: 1200000, spent: 980000, color: "#2563eb" },
  { dept: "Secondary", budget: 1800000, spent: 1650000, color: "#10b981" },
  { dept: "Sr. Secondary", budget: 2200000, spent: 1920000, color: "#f59e0b" },
  { dept: "Admin", budget: 800000, spent: 720000, color: "#f43f5e" },
  { dept: "Transport", budget: 1500000, spent: 1380000, color: "#8b5cf6" },
  { dept: "Maintenance", budget: 600000, spent: 510000, color: "#06b6d4" },
]

const MONTHLY_REVENUE = [
  { month: "Apr", income: 4500000, expense: 2800000 },
  { month: "May", income: 3200000, expense: 2600000 },
  { month: "Jun", income: 2800000, expense: 2500000 },
  { month: "Jul", income: 5200000, expense: 3000000 },
  { month: "Aug", income: 3100000, expense: 2700000 },
  { month: "Sep", income: 2900000, expense: 2600000 },
  { month: "Oct", income: 5800000, expense: 3200000 },
  { month: "Nov", income: 3400000, expense: 2800000 },
  { month: "Dec", income: 3000000, expense: 2700000 },
  { month: "Jan", income: 5500000, expense: 3100000 },
  { month: "Feb", income: 3200000, expense: 2900000 },
  { month: "Mar", income: 4800000, expense: 3300000 },
]

const FEE_COLLECTION_STATUS = [
  { name: "Collected", value: 78, color: "#10b981" },
  { name: "Pending", value: 15, color: "#f59e0b" },
  { name: "Overdue", value: 7, color: "#f43f5e" },
]

const EXPENSE_BREAKDOWN = [
  { name: "Salaries", value: 55, color: "#2563eb" },
  { name: "Maintenance", value: 12, color: "#f59e0b" },
  { name: "Transport", value: 10, color: "#8b5cf6" },
  { name: "Utilities", value: 8, color: "#06b6d4" },
  { name: "Stationery", value: 5, color: "#10b981" },
  { name: "Events", value: 4, color: "#f43f5e" },
  { name: "Others", value: 6, color: "#6b7280" },
]

const SUMMARY_CARDS = [
  { label: "Total Revenue (YTD)", value: 47400000, change: 12.5, positive: true, icon: TrendingUp, color: "text-emerald-500", bg: "bg-emerald-500/10" },
  { label: "Total Expenses (YTD)", value: 32200000, change: 8.3, positive: false, icon: TrendingDown, color: "text-rose-500", bg: "bg-rose-500/10" },
  { label: "Net Surplus", value: 15200000, change: 18.2, positive: true, icon: IndianRupee, color: "text-primary", bg: "bg-primary/10" },
  { label: "Pending Dues", value: 8700000, change: -5.4, positive: true, icon: Wallet, color: "text-amber-500", bg: "bg-amber-500/10" },
]

const TALLY_XML = `<?xml version="1.0" encoding="UTF-8"?>
<ENVELOPE>
  <HEADER>
    <TALLYREQUEST>Import Data</TALLYREQUEST>
  </HEADER>
  <BODY>
    <IMPORTDATA>
      <REQUESTDESC>
        <REPORTNAME>All Masters</REPORTNAME>
      </REQUESTDESC>
      <REQUESTDATA>
        <TALLYMESSAGE xmlns:UDF="TallyUDF">
          <!-- Ledger: Tuition Fee Income -->
          <LEDGER NAME="Tuition Fee Income" ACTION="Create">
            <PARENT>Direct Incomes</PARENT>
            <OPENINGBALANCE>-34500000.00</OPENINGBALANCE>
            <CURRENCYNAME>INR</CURRENCYNAME>
          </LEDGER>
          <!-- Ledger: Transport Fee Income -->
          <LEDGER NAME="Transport Fee Income" ACTION="Create">
            <PARENT>Direct Incomes</PARENT>
            <OPENINGBALANCE>-8200000.00</OPENINGBALANCE>
            <CURRENCYNAME>INR</CURRENCYNAME>
          </LEDGER>
          <!-- Ledger: Salary Expense -->
          <LEDGER NAME="Salary Expense" ACTION="Create">
            <PARENT>Direct Expenses</PARENT>
            <OPENINGBALANCE>17700000.00</OPENINGBALANCE>
            <CURRENCYNAME>INR</CURRENCYNAME>
          </LEDGER>
          <!-- Ledger: Maintenance Expense -->
          <LEDGER NAME="Maintenance Expense" ACTION="Create">
            <PARENT>Indirect Expenses</PARENT>
            <OPENINGBALANCE>3860000.00</OPENINGBALANCE>
            <CURRENCYNAME>INR</CURRENCYNAME>
          </LEDGER>
          <!-- Voucher Entry: March Collection -->
          <VOUCHER VCHTYPE="Receipt" ACTION="Create">
            <DATE>20260305</DATE>
            <NARRATION>March 2026 Fee Collection Batch</NARRATION>
            <ALLLEDGERENTRIES.LIST>
              <LEDGERNAME>Cash at Bank - SBI</LEDGERNAME>
              <AMOUNT>-4800000.00</AMOUNT>
            </ALLLEDGERENTRIES.LIST>
            <ALLLEDGERENTRIES.LIST>
              <LEDGERNAME>Tuition Fee Income</LEDGERNAME>
              <AMOUNT>4800000.00</AMOUNT>
            </ALLLEDGERENTRIES.LIST>
          </VOUCHER>
        </TALLYMESSAGE>
      </REQUESTDATA>
    </IMPORTDATA>
  </BODY>
</ENVELOPE>`

function TallyExportDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">
          <Download className="mr-1.5 size-3.5" /> Export to Tally / QuickBooks
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl border-border/50 bg-card/95 backdrop-blur-2xl sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="size-5 text-emerald-500" />
            Statutory Export - Tally XML
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline" className="border-emerald-500/30 bg-emerald-500/10 text-[10px] text-emerald-500">Tally Prime</Badge>
            <Badge variant="outline" className="border-primary/30 bg-primary/10 text-[10px] text-primary">QuickBooks IIF</Badge>
            <Badge variant="outline" className="border-border/30 text-[10px] text-muted-foreground">XBRL (Coming Soon)</Badge>
          </div>
          <ScrollArea className="h-[50vh] w-full rounded-lg border border-border/40 bg-background/40 p-4">
            <pre className="whitespace-pre-wrap font-mono text-xs text-emerald-400/90 leading-relaxed">{TALLY_XML}</pre>
          </ScrollArea>
          <p className="text-[11px] text-muted-foreground">
            This XML payload contains all ledger masters and voucher entries for the current financial year. Import this file directly into Tally Prime via Gateway {">"} Import {">"} XML.
          </p>
        </div>
        <DialogFooter className="gap-2">
          <DialogClose asChild>
            <Button variant="outline" className="border-border/40">Close</Button>
          </DialogClose>
          <Button className="bg-emerald-600 hover:bg-emerald-700">
            <Download className="mr-1.5 size-3.5" /> Download XML
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: { name: string; value: number; color: string }[]; label?: string }) => {
  if (!active || !payload) return null
  return (
    <div className="rounded-lg border border-border/50 bg-card/95 px-3 py-2 shadow-xl backdrop-blur-xl">
      <p className="mb-1 text-xs font-semibold text-foreground">{label}</p>
      {payload.map((p, i) => (
        <p key={i} className="text-xs" style={{ color: p.color }}>
          {p.name}: {formatINR(p.value)}
        </p>
      ))}
    </div>
  )
}

export default function ReportsPage() {
  const [year] = useState("2025-26")

  return (
    <FinanceShell breadcrumbs={[{ label: "Reports & Export" }]}>
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
              Year-End CA-Ready Reports
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Financial dashboards, department-wise analytics, and statutory exports for FY {year}.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Select defaultValue="2025-26">
              <SelectTrigger className="h-8 w-28 border-border/40 bg-background/30 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2025-26">FY 2025-26</SelectItem>
                <SelectItem value="2024-25">FY 2024-25</SelectItem>
              </SelectContent>
            </Select>
            <TallyExportDialog />
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {SUMMARY_CARDS.map((card) => {
            const Icon = card.icon
            return (
              <Card key={card.label} className="border-border/40 bg-card/30 backdrop-blur-xl">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className={cn("flex size-8 items-center justify-center rounded-xl", card.bg)}>
                      <Icon className={cn("size-4", card.color)} />
                    </div>
                    <Badge variant="outline" className={cn(
                      "text-[10px] font-semibold",
                      card.positive
                        ? "border-emerald-500/30 text-emerald-500"
                        : "border-rose-500/30 text-rose-500"
                    )}>
                      {card.positive ? <ArrowUpRight className="mr-0.5 size-2.5" /> : <ArrowDownRight className="mr-0.5 size-2.5" />}
                      {Math.abs(card.change)}%
                    </Badge>
                  </div>
                  <p className="mt-3 text-lg font-bold text-foreground sm:text-xl">{formatINRCompact(card.value)}</p>
                  <p className="mt-0.5 text-[11px] text-muted-foreground">{card.label}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="w-full bg-card/30 backdrop-blur-sm sm:w-auto">
            <TabsTrigger value="overview" className="flex-1 gap-1.5 text-xs sm:flex-initial">
              <BarChart3 className="size-3.5" /> Overview
            </TabsTrigger>
            <TabsTrigger value="departments" className="flex-1 gap-1.5 text-xs sm:flex-initial">
              <Building2 className="size-3.5" /> Departments
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="mt-4">
            <div className="flex flex-col gap-4">
              {/* Monthly Income vs Expense */}
              <Card className="border-border/40 bg-card/30 backdrop-blur-xl">
                <CardContent className="p-4">
                  <p className="mb-4 text-xs font-bold uppercase tracking-[0.15em] text-muted-foreground">
                    Monthly Income vs Expense
                  </p>
                  <div className="h-64 w-full sm:h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={MONTHLY_REVENUE} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                        <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} tickFormatter={(v) => formatINRCompact(v)} width={45} />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: "11px", color: "#94a3b8" }} />
                        <Line type="monotone" dataKey="income" name="Income" stroke="#10b981" strokeWidth={2} dot={{ r: 3, fill: "#10b981" }} />
                        <Line type="monotone" dataKey="expense" name="Expense" stroke="#f43f5e" strokeWidth={2} dot={{ r: 3, fill: "#f43f5e" }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Pie Charts */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {/* Fee Collection Status */}
                <Card className="border-border/40 bg-card/30 backdrop-blur-xl">
                  <CardContent className="p-4">
                    <p className="mb-4 text-xs font-bold uppercase tracking-[0.15em] text-muted-foreground">
                      Fee Collection Status
                    </p>
                    <div className="flex items-center gap-4">
                      <div className="size-40 shrink-0 sm:size-48">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={FEE_COLLECTION_STATUS}
                              cx="50%"
                              cy="50%"
                              innerRadius="60%"
                              outerRadius="85%"
                              paddingAngle={3}
                              dataKey="value"
                            >
                              {FEE_COLLECTION_STATUS.map((entry, idx) => (
                                <Cell key={idx} fill={entry.color} stroke="transparent" />
                              ))}
                            </Pie>
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                      <div className="flex flex-col gap-2">
                        {FEE_COLLECTION_STATUS.map((item) => (
                          <div key={item.name} className="flex items-center gap-2">
                            <div className="size-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                            <span className="text-xs text-muted-foreground">{item.name}</span>
                            <span className="text-xs font-semibold text-foreground">{item.value}%</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Expense Breakdown */}
                <Card className="border-border/40 bg-card/30 backdrop-blur-xl">
                  <CardContent className="p-4">
                    <p className="mb-4 text-xs font-bold uppercase tracking-[0.15em] text-muted-foreground">
                      Expense Breakdown
                    </p>
                    <div className="flex items-center gap-4">
                      <div className="size-40 shrink-0 sm:size-48">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={EXPENSE_BREAKDOWN}
                              cx="50%"
                              cy="50%"
                              innerRadius="60%"
                              outerRadius="85%"
                              paddingAngle={2}
                              dataKey="value"
                            >
                              {EXPENSE_BREAKDOWN.map((entry, idx) => (
                                <Cell key={idx} fill={entry.color} stroke="transparent" />
                              ))}
                            </Pie>
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                      <div className="flex flex-col gap-1.5">
                        {EXPENSE_BREAKDOWN.map((item) => (
                          <div key={item.name} className="flex items-center gap-2">
                            <div className="size-2 rounded-full" style={{ backgroundColor: item.color }} />
                            <span className="text-[11px] text-muted-foreground">{item.name}</span>
                            <span className="text-[11px] font-semibold text-foreground">{item.value}%</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Department Spending Tab */}
          <TabsContent value="departments" className="mt-4">
            <div className="flex flex-col gap-4">
              <Card className="border-border/40 bg-card/30 backdrop-blur-xl">
                <CardContent className="p-4">
                  <p className="mb-4 text-xs font-bold uppercase tracking-[0.15em] text-muted-foreground">
                    Department-wise Budget vs Spending
                  </p>
                  <div className="h-64 w-full sm:h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={DEPT_SPENDING} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                        <XAxis dataKey="dept" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} tickFormatter={(v) => formatINRCompact(v)} width={45} />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: "11px", color: "#94a3b8" }} />
                        <Bar dataKey="budget" name="Budget" fill="#2563eb" radius={[4, 4, 0, 0]} barSize={20} />
                        <Bar dataKey="spent" name="Spent" fill="#f59e0b" radius={[4, 4, 0, 0]} barSize={20} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Department Cards */}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {DEPT_SPENDING.map((dept) => {
                  const utilization = Math.round((dept.spent / dept.budget) * 100)
                  return (
                    <Card key={dept.dept} className="border-border/40 bg-card/30 backdrop-blur-xl">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-semibold text-foreground">{dept.dept}</p>
                          <Badge variant="outline" className={cn(
                            "text-[10px] font-semibold",
                            utilization > 90 ? "border-rose-500/30 text-rose-500" :
                            utilization > 75 ? "border-amber-500/30 text-amber-500" :
                            "border-emerald-500/30 text-emerald-500"
                          )}>
                            {utilization}% utilized
                          </Badge>
                        </div>
                        <div className="mt-3 flex items-end justify-between text-xs">
                          <div>
                            <p className="text-muted-foreground">Budget</p>
                            <p className="text-sm font-bold text-foreground">{formatINRCompact(dept.budget)}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-muted-foreground">Spent</p>
                            <p className="text-sm font-bold text-foreground">{formatINRCompact(dept.spent)}</p>
                          </div>
                        </div>
                        {/* Utilization bar */}
                        <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-background/40">
                          <div
                            className={cn(
                              "h-full rounded-full transition-all",
                              utilization > 90 ? "bg-rose-500" :
                              utilization > 75 ? "bg-amber-500" :
                              "bg-emerald-500"
                            )}
                            style={{ width: `${utilization}%` }}
                          />
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </FinanceShell>
  )
}
