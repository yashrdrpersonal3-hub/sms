"use client"

import { useState } from "react"
import { FinanceShell } from "@/components/finance/finance-shell"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Search, AlertTriangle, MessageSquare, Phone,
  Send, GraduationCap, IndianRupee, Clock,
  FileText, CheckCircle2, XCircle, ChevronRight,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface Defaulter {
  id: string
  studentName: string
  class: string
  parentName: string
  parentMobile: string
  totalDue: number
  overdueDays: number
  lastPayment: string
  fineAccrued: number
}

interface ChequeEntry {
  id: string
  chequeNo: string
  bankName: string
  amount: number
  studentName: string
  depositDate: string
  status: "Pending" | "Cleared" | "Bounced"
}

const MOCK_DEFAULTERS: Defaulter[] = [
  { id: "D-001", studentName: "Aarav Kumar", class: "Class 5-A", parentName: "Rajesh Kumar", parentMobile: "+91 98765 43210", totalDue: 16500, overdueDays: 49, lastPayment: "2026-01-10", fineAccrued: 825 },
  { id: "D-002", studentName: "Simran Kaur", class: "Class 8-B", parentName: "Harpreet Kaur", parentMobile: "+91 87654 32109", totalDue: 24000, overdueDays: 65, lastPayment: "2025-12-15", fineAccrued: 1800 },
  { id: "D-003", studentName: "Rohan Mehta", class: "Class 10-A", parentName: "Suresh Mehta", parentMobile: "+91 76543 21098", totalDue: 31500, overdueDays: 80, lastPayment: "2025-11-20", fineAccrued: 3150 },
  { id: "D-004", studentName: "Nisha Agarwal", class: "Class 3-C", parentName: "Pradeep Agarwal", parentMobile: "+91 65432 10987", totalDue: 9000, overdueDays: 30, lastPayment: "2026-02-01", fineAccrued: 450 },
  { id: "D-005", studentName: "Dev Patil", class: "Class 6-A", parentName: "Manoj Patil", parentMobile: "+91 54321 09876", totalDue: 18000, overdueDays: 45, lastPayment: "2026-01-15", fineAccrued: 900 },
  { id: "D-006", studentName: "Kavya Joshi", class: "Class 12-A", parentName: "Rakesh Joshi", parentMobile: "+91 43210 98765", totalDue: 42000, overdueDays: 90, lastPayment: "2025-11-01", fineAccrued: 5250 },
]

const MOCK_CHEQUES: ChequeEntry[] = [
  { id: "CHQ-001", chequeNo: "298451", bankName: "SBI", amount: 15000, studentName: "Aarav Kumar", depositDate: "2026-03-02", status: "Pending" },
  { id: "CHQ-002", chequeNo: "445022", bankName: "HDFC", amount: 24000, studentName: "Simran Kaur", depositDate: "2026-02-28", status: "Pending" },
  { id: "CHQ-003", chequeNo: "110389", bankName: "PNB", amount: 9000, studentName: "Nisha Agarwal", depositDate: "2026-02-25", status: "Cleared" },
  { id: "CHQ-004", chequeNo: "778901", bankName: "Axis Bank", amount: 18000, studentName: "Dev Patil", depositDate: "2026-02-20", status: "Bounced" },
  { id: "CHQ-005", chequeNo: "556234", bankName: "ICICI", amount: 31500, studentName: "Rohan Mehta", depositDate: "2026-02-15", status: "Cleared" },
]

function formatINR(amount: number) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(amount)
}

function SeverityIndicator({ days }: { days: number }) {
  const level = days > 60 ? "critical" : days > 30 ? "warning" : "mild"
  return (
    <div className={cn(
      "flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-bold uppercase",
      level === "critical" && "bg-rose-500/15 text-rose-500",
      level === "warning" && "bg-amber-500/15 text-amber-500",
      level === "mild" && "bg-muted/50 text-muted-foreground",
    )}>
      <AlertTriangle className="size-3" />
      {days}d
    </div>
  )
}

export default function DefaultersPage() {
  const [search, setSearch] = useState("")
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  const filtered = MOCK_DEFAULTERS.filter(
    (d) => d.studentName.toLowerCase().includes(search.toLowerCase()) || d.parentName.toLowerCase().includes(search.toLowerCase())
  )

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id])
  }

  const selectAll = () => {
    setSelectedIds(selectedIds.length === filtered.length ? [] : filtered.map((d) => d.id))
  }

  return (
    <FinanceShell breadcrumbs={[{ label: "Defaulters & Reminders" }]}>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
            Fee Defaulters & Cheque Clearance
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Red-alert defaulter tracking with bulk reminders and cheque management.
          </p>
        </div>

        <Tabs defaultValue="defaulters" className="w-full">
          <TabsList className="w-full bg-card/30 backdrop-blur-sm sm:w-auto">
            <TabsTrigger value="defaulters" className="flex-1 gap-1.5 text-xs sm:flex-initial">
              <AlertTriangle className="size-3.5" /> Defaulters
            </TabsTrigger>
            <TabsTrigger value="cheques" className="flex-1 gap-1.5 text-xs sm:flex-initial">
              <FileText className="size-3.5" /> Cheque Clearance
            </TabsTrigger>
          </TabsList>

          <TabsContent value="defaulters" className="mt-4">
            <div className="flex flex-col gap-4">
              {/* Actions bar */}
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="relative flex-1 sm:max-w-xs">
                  <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search defaulters..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="h-9 border-border/50 bg-card/30 pl-10"
                  />
                </div>
                {selectedIds.length > 0 && (
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="border-emerald-500/30 text-emerald-500 hover:bg-emerald-500/10">
                      <MessageSquare className="mr-1.5 size-3.5" />
                      <span className="hidden sm:inline">WhatsApp</span> ({selectedIds.length})
                    </Button>
                    <Button size="sm" variant="outline" className="border-primary/30 text-primary hover:bg-primary/10">
                      <Send className="mr-1.5 size-3.5" />
                      <span className="hidden sm:inline">SMS</span> ({selectedIds.length})
                    </Button>
                  </div>
                )}
              </div>

              {/* Defaulters Table */}
              <Card className="border-rose-500/20 bg-card/30 backdrop-blur-xl">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-border/30 hover:bg-transparent">
                        <TableHead className="w-10">
                          <Checkbox checked={selectedIds.length === filtered.length && filtered.length > 0} onCheckedChange={selectAll} />
                        </TableHead>
                        <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Student</TableHead>
                        <TableHead className="hidden text-xs font-semibold uppercase tracking-wider text-muted-foreground sm:table-cell">Parent</TableHead>
                        <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Due</TableHead>
                        <TableHead className="hidden text-xs font-semibold uppercase tracking-wider text-muted-foreground md:table-cell">Fine</TableHead>
                        <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Overdue</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filtered.map((d) => (
                        <TableRow key={d.id} className={cn("border-border/20 transition-colors hover:bg-rose-500/5", selectedIds.includes(d.id) && "bg-rose-500/5")}>
                          <TableCell>
                            <Checkbox checked={selectedIds.includes(d.id)} onCheckedChange={() => toggleSelect(d.id)} />
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2.5">
                              <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-rose-500/10">
                                <GraduationCap className="size-4 text-rose-500" />
                              </div>
                              <div className="min-w-0">
                                <p className="truncate text-sm font-medium text-foreground">{d.studentName}</p>
                                <p className="text-xs text-muted-foreground">{d.class}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="hidden sm:table-cell">
                            <div className="min-w-0">
                              <p className="truncate text-sm text-foreground">{d.parentName}</p>
                              <p className="text-xs text-muted-foreground">{d.parentMobile}</p>
                            </div>
                          </TableCell>
                          <TableCell className="text-sm font-bold text-rose-500">{formatINR(d.totalDue)}</TableCell>
                          <TableCell className="hidden text-sm font-semibold text-amber-500 md:table-cell">{formatINR(d.fineAccrued)}</TableCell>
                          <TableCell><SeverityIndicator days={d.overdueDays} /></TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="cheques" className="mt-4">
            <Card className="border-border/40 bg-card/30 backdrop-blur-xl">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-border/30 hover:bg-transparent">
                      <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Cheque No</TableHead>
                      <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Student</TableHead>
                      <TableHead className="hidden text-xs font-semibold uppercase tracking-wider text-muted-foreground sm:table-cell">Bank</TableHead>
                      <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Amount</TableHead>
                      <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {MOCK_CHEQUES.map((chq) => (
                      <TableRow key={chq.id} className="border-border/20 transition-colors hover:bg-accent/20">
                        <TableCell className="font-mono text-sm text-foreground">{chq.chequeNo}</TableCell>
                        <TableCell className="text-sm text-foreground">{chq.studentName}</TableCell>
                        <TableCell className="hidden text-sm text-muted-foreground sm:table-cell">{chq.bankName}</TableCell>
                        <TableCell className="text-sm font-semibold text-foreground">{formatINR(chq.amount)}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={cn(
                            "text-[10px] font-semibold uppercase",
                            chq.status === "Cleared" && "border-emerald-500/30 bg-emerald-500/10 text-emerald-500",
                            chq.status === "Pending" && "border-amber-500/30 bg-amber-500/10 text-amber-500",
                            chq.status === "Bounced" && "border-rose-500/30 bg-rose-500/10 text-rose-500",
                          )}>
                            {chq.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </FinanceShell>
  )
}
