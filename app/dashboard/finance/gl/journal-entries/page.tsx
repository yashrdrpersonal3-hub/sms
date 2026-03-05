"use client"

import { useState, useMemo } from "react"
import { FinanceShell } from "@/components/finance/finance-shell"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  BookOpen, Plus, Trash2, AlertCircle, CheckCircle2,
  Calendar, Hash, FileText, IndianRupee, Equal,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface JournalLine {
  id: string
  account: string
  accountCode: string
  debit: number
  credit: number
  narration: string
}

interface JournalEntry {
  id: string
  voucherNo: string
  date: string
  narration: string
  lines: JournalLine[]
  status: "Draft" | "Posted" | "Reversed"
  createdBy: string
  totalDebit: number
  totalCredit: number
}

const ACCOUNTS = [
  { code: "1001", name: "Cash in Hand" },
  { code: "1002", name: "Cash at Bank - SBI" },
  { code: "1003", name: "Cash at Bank - HDFC" },
  { code: "2001", name: "Fee Receivables" },
  { code: "2002", name: "Advance from Parents" },
  { code: "3001", name: "Tuition Fee Income" },
  { code: "3002", name: "Transport Fee Income" },
  { code: "3003", name: "Coaching Fee Income" },
  { code: "4001", name: "Salary Expense" },
  { code: "4002", name: "Maintenance Expense" },
  { code: "4003", name: "Utility Expense" },
  { code: "4004", name: "Stationery Expense" },
  { code: "5001", name: "GST Output" },
  { code: "5002", name: "GST Input" },
  { code: "5003", name: "TDS Payable" },
  { code: "6001", name: "Fixed Assets - Furniture" },
  { code: "6002", name: "Fixed Assets - Vehicles" },
  { code: "7001", name: "Capital Fund" },
]

const MOCK_ENTRIES: JournalEntry[] = [
  {
    id: "JV-2026-001",
    voucherNo: "JV/26-27/001",
    date: "2026-03-01",
    narration: "Correction entry: Transport fee reclassification from Q4 to Q1 for batch 2026",
    lines: [
      { id: "l1", account: "Transport Fee Income", accountCode: "3002", debit: 45000, credit: 0, narration: "Reverse Q4 booking" },
      { id: "l2", account: "Advance from Parents", accountCode: "2002", debit: 0, credit: 45000, narration: "Move to advance" },
    ],
    status: "Posted",
    createdBy: "CA Sharma",
    totalDebit: 45000,
    totalCredit: 45000,
  },
  {
    id: "JV-2026-002",
    voucherNo: "JV/26-27/002",
    date: "2026-03-03",
    narration: "Write-off of irrecoverable fee from withdrawn student Admn #4521",
    lines: [
      { id: "l3", account: "Maintenance Expense", accountCode: "4002", debit: 12500, credit: 0, narration: "Bad debt write-off" },
      { id: "l4", account: "Fee Receivables", accountCode: "2001", debit: 0, credit: 12500, narration: "Clear receivable" },
    ],
    status: "Posted",
    createdBy: "CA Sharma",
    totalDebit: 12500,
    totalCredit: 12500,
  },
  {
    id: "JV-2026-003",
    voucherNo: "JV/26-27/003",
    date: "2026-03-05",
    narration: "Depreciation provision for school buses - March 2026",
    lines: [
      { id: "l5", account: "Maintenance Expense", accountCode: "4002", debit: 35000, credit: 0, narration: "Depreciation expense" },
      { id: "l6", account: "Fixed Assets - Vehicles", accountCode: "6002", debit: 0, credit: 35000, narration: "Accumulated depreciation" },
    ],
    status: "Draft",
    createdBy: "Accountant Priya",
    totalDebit: 35000,
    totalCredit: 35000,
  },
  {
    id: "JV-2026-004",
    voucherNo: "JV/26-27/004",
    date: "2026-03-04",
    narration: "GST input credit adjustment for Q3 vendor invoices",
    lines: [
      { id: "l7", account: "GST Input", accountCode: "5002", debit: 18900, credit: 0, narration: "Input credit claim" },
      { id: "l8", account: "GST Output", accountCode: "5001", debit: 0, credit: 12600, narration: "Output liability set-off" },
      { id: "l9", account: "Cash at Bank - HDFC", accountCode: "1003", debit: 0, credit: 6300, narration: "Net GST payment" },
    ],
    status: "Posted",
    createdBy: "CA Sharma",
    totalDebit: 18900,
    totalCredit: 18900,
  },
]

function formatINR(amount: number) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(amount)
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" })
}

function NewJournalEntryDialog() {
  const [lines, setLines] = useState<{ account: string; debit: string; credit: string; narration: string }[]>([
    { account: "", debit: "", credit: "", narration: "" },
    { account: "", debit: "", credit: "", narration: "" },
  ])

  const totalDebit = lines.reduce((sum, l) => sum + (parseFloat(l.debit) || 0), 0)
  const totalCredit = lines.reduce((sum, l) => sum + (parseFloat(l.credit) || 0), 0)
  const isBalanced = totalDebit > 0 && totalDebit === totalCredit

  const addLine = () => {
    setLines([...lines, { account: "", debit: "", credit: "", narration: "" }])
  }

  const removeLine = (idx: number) => {
    if (lines.length <= 2) return
    setLines(lines.filter((_, i) => i !== idx))
  }

  const updateLine = (idx: number, field: string, value: string) => {
    const updated = [...lines]
    updated[idx] = { ...updated[idx], [field]: value }
    // Auto-clear opposite side
    if (field === "debit" && parseFloat(value) > 0) updated[idx].credit = ""
    if (field === "credit" && parseFloat(value) > 0) updated[idx].debit = ""
    setLines(updated)
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" className="bg-primary hover:bg-primary/90">
          <Plus className="mr-1.5 size-3.5" /> New Entry
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl border-border/50 bg-card/95 backdrop-blur-2xl sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BookOpen className="size-5 text-primary" />
            New Journal Voucher
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4 py-2">
          {/* Header fields */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div>
              <Label className="text-xs text-muted-foreground">Date</Label>
              <Input type="date" defaultValue="2026-03-05" className="mt-1 border-border/50 bg-background/30" />
            </div>
            <div className="sm:col-span-2">
              <Label className="text-xs text-muted-foreground">Narration</Label>
              <Input placeholder="Purpose of this journal entry..." className="mt-1 border-border/50 bg-background/30" />
            </div>
          </div>

          <Separator className="bg-border/30" />

          {/* Journal Lines */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <p className="text-xs font-bold uppercase tracking-[0.15em] text-muted-foreground">Ledger Lines</p>
              <Button variant="outline" size="sm" onClick={addLine} className="h-7 border-border/40 text-xs">
                <Plus className="mr-1 size-3" /> Add Line
              </Button>
            </div>

            <ScrollArea className="max-h-[40vh]">
              <div className="flex flex-col gap-2">
                {lines.map((line, idx) => (
                  <div key={idx} className="flex items-start gap-2 rounded-lg border border-border/30 bg-background/20 p-2">
                    <div className="min-w-0 flex-1">
                      <Select value={line.account} onValueChange={(v) => updateLine(idx, "account", v)}>
                        <SelectTrigger className="h-8 border-border/40 bg-background/30 text-xs">
                          <SelectValue placeholder="Select account..." />
                        </SelectTrigger>
                        <SelectContent>
                          {ACCOUNTS.map((acc) => (
                            <SelectItem key={acc.code} value={acc.code}>
                              <span className="font-mono text-muted-foreground">{acc.code}</span>{" "}
                              {acc.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <Input
                      type="number"
                      placeholder="Debit"
                      value={line.debit}
                      onChange={(e) => updateLine(idx, "debit", e.target.value)}
                      className="h-8 w-24 border-border/40 bg-background/30 text-xs sm:w-28"
                    />
                    <Input
                      type="number"
                      placeholder="Credit"
                      value={line.credit}
                      onChange={(e) => updateLine(idx, "credit", e.target.value)}
                      className="h-8 w-24 border-border/40 bg-background/30 text-xs sm:w-28"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeLine(idx)}
                      disabled={lines.length <= 2}
                      className="size-8 shrink-0 p-0 text-muted-foreground hover:text-rose-500"
                    >
                      <Trash2 className="size-3.5" />
                    </Button>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>

          {/* Balance Check */}
          <div className={cn(
            "flex items-center justify-between rounded-xl border px-4 py-3 transition-colors",
            isBalanced
              ? "border-emerald-500/30 bg-emerald-500/5"
              : "border-rose-500/30 bg-rose-500/5"
          )}>
            <div className="flex items-center gap-2">
              {isBalanced ? (
                <CheckCircle2 className="size-4 text-emerald-500" />
              ) : (
                <AlertCircle className="size-4 text-rose-500" />
              )}
              <span className={cn("text-sm font-medium", isBalanced ? "text-emerald-500" : "text-rose-500")}>
                {isBalanced ? "Balanced" : "Unbalanced"}
              </span>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <span className="text-muted-foreground">
                Dr: <span className="font-semibold text-foreground">{formatINR(totalDebit)}</span>
              </span>
              <Equal className="size-3 text-muted-foreground" />
              <span className="text-muted-foreground">
                Cr: <span className="font-semibold text-foreground">{formatINR(totalCredit)}</span>
              </span>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <DialogClose asChild>
            <Button variant="outline" className="border-border/40">Cancel</Button>
          </DialogClose>
          <Button variant="outline" className="border-border/40">Save as Draft</Button>
          <Button disabled={!isBalanced} className="bg-emerald-600 hover:bg-emerald-700">
            <CheckCircle2 className="mr-1.5 size-3.5" /> Post Entry
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default function JournalEntriesPage() {
  const [filterStatus, setFilterStatus] = useState<string>("all")

  const filtered = useMemo(() => {
    if (filterStatus === "all") return MOCK_ENTRIES
    return MOCK_ENTRIES.filter((e) => e.status === filterStatus)
  }, [filterStatus])

  return (
    <FinanceShell breadcrumbs={[{ label: "GL" }, { label: "Journal Entries" }]}>
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
              Journal Entries
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Strict double-entry vouchers for CA adjustments, corrections, and provisions.
            </p>
          </div>
          <NewJournalEntryDialog />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {["all", "Draft", "Posted", "Reversed"].map((status) => (
            <Button
              key={status}
              variant={filterStatus === status ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterStatus(status)}
              className={cn(
                "h-7 text-xs",
                filterStatus === status
                  ? "bg-primary text-primary-foreground"
                  : "border-border/40 text-muted-foreground"
              )}
            >
              {status === "all" ? "All" : status}
            </Button>
          ))}
        </div>

        {/* Entries Table */}
        <Card className="border-border/40 bg-card/30 backdrop-blur-xl">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-border/30 hover:bg-transparent">
                  <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Voucher</TableHead>
                  <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Date</TableHead>
                  <TableHead className="hidden text-xs font-semibold uppercase tracking-wider text-muted-foreground md:table-cell">Narration</TableHead>
                  <TableHead className="text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">Debit</TableHead>
                  <TableHead className="text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">Credit</TableHead>
                  <TableHead className="hidden text-xs font-semibold uppercase tracking-wider text-muted-foreground sm:table-cell">By</TableHead>
                  <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((entry) => (
                  <TableRow key={entry.id} className="group border-border/20 transition-colors hover:bg-accent/20">
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                          <Hash className="size-3 text-primary" />
                        </div>
                        <span className="font-mono text-xs font-medium text-foreground">{entry.voucherNo}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">{formatDate(entry.date)}</TableCell>
                    <TableCell className="hidden max-w-[280px] md:table-cell">
                      <p className="truncate text-sm text-muted-foreground">{entry.narration}</p>
                      <p className="mt-0.5 text-[10px] text-muted-foreground/60">{entry.lines.length} lines</p>
                    </TableCell>
                    <TableCell className="text-right font-mono text-sm font-semibold text-emerald-500">
                      {formatINR(entry.totalDebit)}
                    </TableCell>
                    <TableCell className="text-right font-mono text-sm font-semibold text-rose-500">
                      {formatINR(entry.totalCredit)}
                    </TableCell>
                    <TableCell className="hidden text-xs text-muted-foreground sm:table-cell">{entry.createdBy}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={cn(
                          "text-[10px] font-semibold uppercase",
                          entry.status === "Posted" && "border-emerald-500/30 bg-emerald-500/10 text-emerald-500",
                          entry.status === "Draft" && "border-amber-500/30 bg-amber-500/10 text-amber-500",
                          entry.status === "Reversed" && "border-rose-500/30 bg-rose-500/10 text-rose-500",
                        )}
                      >
                        {entry.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>

        {/* Expanded Detail for First Entry (illustration) */}
        <Card className="border-border/40 bg-card/30 backdrop-blur-xl">
          <CardContent className="p-4">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-xs font-bold uppercase tracking-[0.15em] text-muted-foreground">
                Voucher Detail: {MOCK_ENTRIES[0].voucherNo}
              </p>
              <Badge variant="outline" className="border-emerald-500/30 bg-emerald-500/10 text-[10px] text-emerald-500">
                Posted
              </Badge>
            </div>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-border/30 hover:bg-transparent">
                    <TableHead className="text-xs text-muted-foreground">Account</TableHead>
                    <TableHead className="hidden text-xs text-muted-foreground sm:table-cell">Narration</TableHead>
                    <TableHead className="text-right text-xs text-muted-foreground">Debit</TableHead>
                    <TableHead className="text-right text-xs text-muted-foreground">Credit</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {MOCK_ENTRIES[0].lines.map((line) => (
                    <TableRow key={line.id} className="border-border/20 hover:bg-accent/10">
                      <TableCell>
                        <span className="font-mono text-[10px] text-muted-foreground">{line.accountCode}</span>{" "}
                        <span className="text-sm text-foreground">{line.account}</span>
                      </TableCell>
                      <TableCell className="hidden text-xs text-muted-foreground sm:table-cell">{line.narration}</TableCell>
                      <TableCell className="text-right font-mono text-sm">
                        {line.debit > 0 ? <span className="text-emerald-500">{formatINR(line.debit)}</span> : <span className="text-muted-foreground/40">-</span>}
                      </TableCell>
                      <TableCell className="text-right font-mono text-sm">
                        {line.credit > 0 ? <span className="text-rose-500">{formatINR(line.credit)}</span> : <span className="text-muted-foreground/40">-</span>}
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow className="border-border/30 bg-background/20">
                    <TableCell colSpan={2} className="text-right text-xs font-bold uppercase text-muted-foreground">Total</TableCell>
                    <TableCell className="text-right font-mono text-sm font-bold text-emerald-500">{formatINR(MOCK_ENTRIES[0].totalDebit)}</TableCell>
                    <TableCell className="text-right font-mono text-sm font-bold text-rose-500">{formatINR(MOCK_ENTRIES[0].totalCredit)}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </FinanceShell>
  )
}
