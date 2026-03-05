"use client"

import { FinanceShell } from "@/components/finance/finance-shell"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Banknote, Download, CheckCircle2, Clock, User } from "lucide-react"
import { cn } from "@/lib/utils"

interface PayrollEntry {
  id: string
  empId: string
  name: string
  department: string
  designation: string
  grossSalary: number
  deductions: number
  netSalary: number
  status: "Synced" | "Pending Sync"
}

const MOCK_PAYROLL: PayrollEntry[] = [
  { id: "PR-001", empId: "EMP-001", name: "Dr. Anita Sharma", department: "Academics", designation: "Principal", grossSalary: 125000, deductions: 18750, netSalary: 106250, status: "Synced" },
  { id: "PR-002", empId: "EMP-012", name: "Suresh Verma", department: "Academics", designation: "Sr. Teacher", grossSalary: 65000, deductions: 9750, netSalary: 55250, status: "Synced" },
  { id: "PR-003", empId: "EMP-023", name: "Priya Singh", department: "Admin", designation: "Office Manager", grossSalary: 45000, deductions: 6750, netSalary: 38250, status: "Synced" },
  { id: "PR-004", empId: "EMP-045", name: "Ramesh Kumar", department: "Transport", designation: "Fleet Supervisor", grossSalary: 35000, deductions: 5250, netSalary: 29750, status: "Synced" },
  { id: "PR-005", empId: "EMP-067", name: "Meena Patel", department: "Accounts", designation: "Jr. Accountant", grossSalary: 30000, deductions: 4500, netSalary: 25500, status: "Pending Sync" },
  { id: "PR-006", empId: "EMP-089", name: "Ajay Tiwari", department: "IT", designation: "Lab Assistant", grossSalary: 28000, deductions: 4200, netSalary: 23800, status: "Synced" },
]

function formatINR(amount: number) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(amount)
}

export default function PayrollSyncPage() {
  const totalNet = MOCK_PAYROLL.reduce((s, p) => s + p.netSalary, 0)

  return (
    <FinanceShell breadcrumbs={[{ label: "Payroll Sync" }]}>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
              Payroll Sync - Salary Ledgers
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Read-only sync from HR module. Generate bank advice files for disbursement.
            </p>
          </div>
          <Button className="w-fit bg-emerald-600 font-semibold text-white hover:bg-emerald-700">
            <Banknote className="mr-1.5 size-4" />
            Disburse Salaries
          </Button>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Card className="border-border/40 bg-card/30">
            <CardContent className="p-3 sm:p-4">
              <p className="text-[10px] font-medium uppercase text-muted-foreground">Employees</p>
              <p className="mt-1 text-lg font-bold text-foreground">{MOCK_PAYROLL.length}</p>
            </CardContent>
          </Card>
          <Card className="border-border/40 bg-card/30">
            <CardContent className="p-3 sm:p-4">
              <p className="text-[10px] font-medium uppercase text-muted-foreground">Total Gross</p>
              <p className="mt-1 text-lg font-bold text-foreground">{formatINR(MOCK_PAYROLL.reduce((s, p) => s + p.grossSalary, 0))}</p>
            </CardContent>
          </Card>
          <Card className="border-border/40 bg-card/30">
            <CardContent className="p-3 sm:p-4">
              <p className="text-[10px] font-medium uppercase text-muted-foreground">Deductions</p>
              <p className="mt-1 text-lg font-bold text-rose-500">{formatINR(MOCK_PAYROLL.reduce((s, p) => s + p.deductions, 0))}</p>
            </CardContent>
          </Card>
          <Card className="border-emerald-500/20 bg-card/30">
            <CardContent className="p-3 sm:p-4">
              <p className="text-[10px] font-medium uppercase text-muted-foreground">Net Payable</p>
              <p className="mt-1 text-lg font-bold text-emerald-500">{formatINR(totalNet)}</p>
            </CardContent>
          </Card>
        </div>

        <Card className="border-border/40 bg-card/30 backdrop-blur-xl">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-border/30 hover:bg-transparent">
                  <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Employee</TableHead>
                  <TableHead className="hidden text-xs font-semibold uppercase tracking-wider text-muted-foreground sm:table-cell">Dept</TableHead>
                  <TableHead className="hidden text-xs font-semibold uppercase tracking-wider text-muted-foreground md:table-cell">Gross</TableHead>
                  <TableHead className="hidden text-xs font-semibold uppercase tracking-wider text-muted-foreground md:table-cell">Deductions</TableHead>
                  <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Net Salary</TableHead>
                  <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Sync</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {MOCK_PAYROLL.map((entry) => (
                  <TableRow key={entry.id} className="border-border/20 transition-colors hover:bg-accent/20">
                    <TableCell>
                      <div className="flex items-center gap-2.5">
                        <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                          <User className="size-4 text-primary" />
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-foreground">{entry.name}</p>
                          <p className="text-xs text-muted-foreground">{entry.designation}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden text-sm text-muted-foreground sm:table-cell">{entry.department}</TableCell>
                    <TableCell className="hidden text-sm text-foreground md:table-cell">{formatINR(entry.grossSalary)}</TableCell>
                    <TableCell className="hidden text-sm text-rose-500 md:table-cell">{formatINR(entry.deductions)}</TableCell>
                    <TableCell className="text-sm font-bold text-emerald-500">{formatINR(entry.netSalary)}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={cn(
                        "text-[10px] font-semibold uppercase",
                        entry.status === "Synced" && "border-emerald-500/30 bg-emerald-500/10 text-emerald-500",
                        entry.status === "Pending Sync" && "border-amber-500/30 bg-amber-500/10 text-amber-500",
                      )}>
                        {entry.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>

        <div className="flex justify-end">
          <Button variant="outline" className="border-border/50">
            <Download className="mr-1.5 size-4" />
            Export Bank Advice (.csv)
          </Button>
        </div>
      </div>
    </FinanceShell>
  )
}
