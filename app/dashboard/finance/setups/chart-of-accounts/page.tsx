"use client"

import { useState } from "react"
import { FinanceShell } from "@/components/finance/finance-shell"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Landmark, ChevronRight, TrendingUp, TrendingDown, Wallet,
  Building2, Banknote, CircleDollarSign, Package, GraduationCap,
  Bus, Utensils, ShieldCheck, Wrench,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface AccountNode {
  id: string
  code: string
  name: string
  type: "Assets" | "Liabilities" | "Income" | "Expenses"
  balance: number
  children?: AccountNode[]
}

const CHART_OF_ACCOUNTS: AccountNode[] = [
  {
    id: "assets", code: "1000", name: "Assets", type: "Assets", balance: 45600000,
    children: [
      { id: "a-cash", code: "1100", name: "Cash & Bank Balances", type: "Assets", balance: 12800000, children: [
        { id: "a-cash-1", code: "1101", name: "Petty Cash", type: "Assets", balance: 125000 },
        { id: "a-cash-2", code: "1102", name: "SBI Current Account", type: "Assets", balance: 8200000 },
        { id: "a-cash-3", code: "1103", name: "HDFC Fixed Deposit", type: "Assets", balance: 4475000 },
      ]},
      { id: "a-receivable", code: "1200", name: "Fee Receivables", type: "Assets", balance: 18500000, children: [
        { id: "a-recv-1", code: "1201", name: "Current Term Dues", type: "Assets", balance: 15200000 },
        { id: "a-recv-2", code: "1202", name: "Transport Dues", type: "Assets", balance: 3300000 },
      ]},
      { id: "a-fixed", code: "1300", name: "Fixed Assets", type: "Assets", balance: 14300000, children: [
        { id: "a-fix-1", code: "1301", name: "Land & Buildings", type: "Assets", balance: 10000000 },
        { id: "a-fix-2", code: "1302", name: "Vehicles & Fleet", type: "Assets", balance: 3200000 },
        { id: "a-fix-3", code: "1303", name: "Furniture & Equipment", type: "Assets", balance: 1100000 },
      ]},
    ],
  },
  {
    id: "liabilities", code: "2000", name: "Liabilities", type: "Liabilities", balance: 15200000,
    children: [
      { id: "l-payable", code: "2100", name: "Accounts Payable", type: "Liabilities", balance: 8400000, children: [
        { id: "l-pay-1", code: "2101", name: "Vendor Payables", type: "Liabilities", balance: 5200000 },
        { id: "l-pay-2", code: "2102", name: "Salary Payable", type: "Liabilities", balance: 3200000 },
      ]},
      { id: "l-advance", code: "2200", name: "Advance Fee Collected", type: "Liabilities", balance: 4800000 },
      { id: "l-tax", code: "2300", name: "Tax Liabilities", type: "Liabilities", balance: 2000000, children: [
        { id: "l-tax-1", code: "2301", name: "GST Payable", type: "Liabilities", balance: 850000 },
        { id: "l-tax-2", code: "2302", name: "TDS Payable", type: "Liabilities", balance: 1150000 },
      ]},
    ],
  },
  {
    id: "income", code: "3000", name: "Income", type: "Income", balance: 32800000,
    children: [
      { id: "i-fee", code: "3100", name: "Fee Income", type: "Income", balance: 28500000, children: [
        { id: "i-fee-1", code: "3101", name: "Tuition Fee", type: "Income", balance: 18000000 },
        { id: "i-fee-2", code: "3102", name: "Transport Fee", type: "Income", balance: 6500000 },
        { id: "i-fee-3", code: "3103", name: "Coaching Fee", type: "Income", balance: 4000000 },
      ]},
      { id: "i-other", code: "3200", name: "Other Income", type: "Income", balance: 4300000, children: [
        { id: "i-other-1", code: "3201", name: "Late Fee / Fines", type: "Income", balance: 1800000 },
        { id: "i-other-2", code: "3202", name: "Canteen Revenue", type: "Income", balance: 2500000 },
      ]},
    ],
  },
  {
    id: "expenses", code: "4000", name: "Expenses", type: "Expenses", balance: 24100000,
    children: [
      { id: "e-salary", code: "4100", name: "Salary & Benefits", type: "Expenses", balance: 14800000 },
      { id: "e-ops", code: "4200", name: "Operations", type: "Expenses", balance: 5200000, children: [
        { id: "e-ops-1", code: "4201", name: "Utilities (Electricity/Water)", type: "Expenses", balance: 2400000 },
        { id: "e-ops-2", code: "4202", name: "Maintenance & Repairs", type: "Expenses", balance: 1800000 },
        { id: "e-ops-3", code: "4203", name: "Security Services", type: "Expenses", balance: 1000000 },
      ]},
      { id: "e-transport", code: "4300", name: "Transport Operations", type: "Expenses", balance: 2800000, children: [
        { id: "e-trans-1", code: "4301", name: "Fuel Expenses", type: "Expenses", balance: 1800000 },
        { id: "e-trans-2", code: "4302", name: "Fleet Maintenance", type: "Expenses", balance: 1000000 },
      ]},
      { id: "e-academic", code: "4400", name: "Academic Expenses", type: "Expenses", balance: 1300000 },
    ],
  },
]

const DEPARTMENT_BUDGETS = [
  { id: "academics", name: "Academics", icon: GraduationCap, capex: 35, opex: 65, budget: 8500000 },
  { id: "transport", name: "Transport", icon: Bus, capex: 60, opex: 40, budget: 4200000 },
  { id: "canteen", name: "Canteen", icon: Utensils, capex: 20, opex: 80, budget: 3100000 },
  { id: "admin", name: "Administration", icon: ShieldCheck, capex: 15, opex: 85, budget: 2800000 },
  { id: "maintenance", name: "Maintenance", icon: Wrench, capex: 45, opex: 55, budget: 2200000 },
  { id: "infra", name: "Infrastructure", icon: Building2, capex: 80, opex: 20, budget: 5000000 },
]

function formatINR(amount: number) {
  if (amount >= 10000000) return `${(amount / 10000000).toFixed(2)} Cr`
  if (amount >= 100000) return `${(amount / 100000).toFixed(2)} L`
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(amount)
}

const typeConfig: Record<string, { color: string; bg: string; icon: typeof TrendingUp }> = {
  Assets: { color: "text-emerald-500", bg: "bg-emerald-500/10", icon: TrendingUp },
  Liabilities: { color: "text-rose-500", bg: "bg-rose-500/10", icon: TrendingDown },
  Income: { color: "text-emerald-500", bg: "bg-emerald-500/10", icon: CircleDollarSign },
  Expenses: { color: "text-rose-500", bg: "bg-rose-500/10", icon: Package },
}

function AccountTreeItem({ node, depth = 0 }: { node: AccountNode; depth?: number }) {
  const config = typeConfig[node.type]
  const Icon = config.icon

  if (node.children && node.children.length > 0) {
    return (
      <AccordionItem value={node.id} className="border-0">
        <AccordionTrigger className={cn("rounded-lg px-3 py-2.5 hover:bg-accent/20 hover:no-underline", depth > 0 && "ml-4")}>
          <div className="flex flex-1 items-center gap-2">
            <Badge variant="outline" className="shrink-0 border-border/40 font-mono text-[10px] text-muted-foreground">{node.code}</Badge>
            <span className="truncate text-sm font-medium text-foreground">{node.name}</span>
            <span className={cn("ml-auto mr-4 shrink-0 text-sm font-bold", config.color)}>{formatINR(node.balance)}</span>
          </div>
        </AccordionTrigger>
        <AccordionContent className="pb-0">
          <Accordion type="multiple" className="w-full">
            {node.children.map((child) => (
              <AccountTreeItem key={child.id} node={child} depth={depth + 1} />
            ))}
          </Accordion>
        </AccordionContent>
      </AccordionItem>
    )
  }

  return (
    <div className={cn("flex items-center gap-2 rounded-lg px-3 py-2.5 transition-colors hover:bg-accent/20", depth > 0 && "ml-4")}>
      <Badge variant="outline" className="shrink-0 border-border/40 font-mono text-[10px] text-muted-foreground">{node.code}</Badge>
      <span className="truncate text-sm text-foreground">{node.name}</span>
      <span className={cn("ml-auto shrink-0 text-sm font-semibold", config.color)}>{formatINR(node.balance)}</span>
    </div>
  )
}

export default function ChartOfAccountsPage() {
  const [budgets, setBudgets] = useState(DEPARTMENT_BUDGETS)

  const updateCapex = (id: string, value: number[]) => {
    setBudgets((prev) =>
      prev.map((b) => (b.id === id ? { ...b, capex: value[0], opex: 100 - value[0] } : b))
    )
  }

  return (
    <FinanceShell breadcrumbs={[{ label: "Chart of Accounts" }]}>
      <div className="flex flex-col gap-6">
        {/* Page Header */}
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
            Chart of Accounts & Budgeting
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Hierarchical ledger structure with department-wise CapEx/OpEx management.
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {CHART_OF_ACCOUNTS.map((node) => {
            const config = typeConfig[node.type]
            const Icon = config.icon
            return (
              <Card key={node.id} className="border-border/40 bg-card/30 backdrop-blur-xl">
                <CardContent className="flex items-center gap-3 p-4">
                  <div className={cn("flex size-10 shrink-0 items-center justify-center rounded-xl", config.bg)}>
                    <Icon className={cn("size-5", config.color)} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-muted-foreground">{node.name}</p>
                    <p className={cn("text-base font-bold sm:text-lg", config.color)}>{formatINR(node.balance)}</p>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Tree View */}
        <Card className="border-border/40 bg-card/30 backdrop-blur-xl">
          <CardContent className="p-0">
            <div className="flex items-center gap-2 border-b border-border/30 px-4 py-3">
              <div className="flex size-7 items-center justify-center rounded-lg bg-primary/10">
                <Landmark className="size-3.5 text-primary" />
              </div>
              <span className="text-sm font-semibold text-foreground">Ledger Hierarchy</span>
            </div>
            <div className="p-2">
              <Accordion type="multiple" defaultValue={["assets", "income"]} className="w-full">
                {CHART_OF_ACCOUNTS.map((node) => (
                  <AccountTreeItem key={node.id} node={node} />
                ))}
              </Accordion>
            </div>
          </CardContent>
        </Card>

        {/* CapEx / OpEx Sliders */}
        <Card className="border-border/40 bg-card/30 backdrop-blur-xl">
          <CardContent className="p-0">
            <div className="flex items-center gap-2 border-b border-border/30 px-4 py-3">
              <div className="flex size-7 items-center justify-center rounded-lg bg-amber-500/10">
                <Wallet className="size-3.5 text-amber-500" />
              </div>
              <span className="text-sm font-semibold text-foreground">Department Budgets - CapEx / OpEx Split</span>
            </div>
            <div className="flex flex-col divide-y divide-border/20 p-4">
              {budgets.map((dept) => {
                const Icon = dept.icon
                return (
                  <div key={dept.id} className="flex flex-col gap-3 py-4 first:pt-0 last:pb-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                          <Icon className="size-4 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">{dept.name}</p>
                          <p className="text-xs text-muted-foreground">Budget: {formatINR(dept.budget)}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 text-xs">
                        <span className="text-primary">CapEx: {dept.capex}%</span>
                        <span className="text-muted-foreground">|</span>
                        <span className="text-emerald-500">OpEx: {dept.opex}%</span>
                      </div>
                    </div>
                    <Slider
                      value={[dept.capex]}
                      onValueChange={(val) => updateCapex(dept.id, val)}
                      max={100}
                      step={5}
                      className="w-full"
                    />
                    <div className="flex gap-2">
                      <div className="flex-1 rounded-md bg-primary/10 px-2 py-1 text-center text-xs text-primary">
                        CapEx: {formatINR(dept.budget * dept.capex / 100)}
                      </div>
                      <div className="flex-1 rounded-md bg-emerald-500/10 px-2 py-1 text-center text-xs text-emerald-500">
                        OpEx: {formatINR(dept.budget * dept.opex / 100)}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </FinanceShell>
  )
}
