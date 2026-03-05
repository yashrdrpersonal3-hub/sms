"use client"

import { useState } from "react"
import { FinanceShell } from "@/components/finance/finance-shell"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import {
  Search, Upload, CreditCard, FileText, Building2,
  Receipt, IndianRupee, Plus, Sparkles,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface PurchaseBill {
  id: string
  vendor: string
  invoiceNo: string
  amount: number
  gstAmount: number
  tdsAmount: number
  netPayable: number
  date: string
  dueDate: string
  status: "Pending" | "Approved" | "Paid"
  category: string
}

const MOCK_BILLS: PurchaseBill[] = [
  { id: "PB-001", vendor: "Ashok Bus Transport", invoiceNo: "INV-2026-0891", amount: 245000, gstAmount: 44100, tdsAmount: 2450, netPayable: 286650, date: "2026-03-01", dueDate: "2026-03-31", status: "Pending", category: "Transport" },
  { id: "PB-002", vendor: "Sharma Books & Stationery", invoiceNo: "INV-2026-0234", amount: 85000, gstAmount: 4250, tdsAmount: 850, netPayable: 88400, date: "2026-02-28", dueDate: "2026-03-28", status: "Pending", category: "Stationery" },
  { id: "PB-003", vendor: "Delhi IT Solutions LLP", invoiceNo: "DITS-2026-0156", amount: 150000, gstAmount: 27000, tdsAmount: 15000, netPayable: 162000, date: "2026-02-25", dueDate: "2026-03-25", status: "Approved", category: "IT Services" },
  { id: "PB-004", vendor: "Green Canteen Services", invoiceNo: "GCS-2026-0089", amount: 120000, gstAmount: 6000, tdsAmount: 1200, netPayable: 124800, date: "2026-02-20", dueDate: "2026-03-20", status: "Approved", category: "Food Services" },
  { id: "PB-005", vendor: "RK Construction", invoiceNo: "RKC-2026-0045", amount: 350000, gstAmount: 63000, tdsAmount: 3500, netPayable: 409500, date: "2026-02-15", dueDate: "2026-03-15", status: "Paid", category: "Construction" },
  { id: "PB-006", vendor: "Ashok Bus Transport", invoiceNo: "INV-2026-0780", amount: 245000, gstAmount: 44100, tdsAmount: 2450, netPayable: 286650, date: "2026-02-01", dueDate: "2026-02-28", status: "Paid", category: "Transport" },
]

function formatINR(amount: number) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(amount)
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-IN", { month: "short", day: "numeric" })
}

export default function PayablesPage() {
  const [search, setSearch] = useState("")
  const [uploadOpen, setUploadOpen] = useState(false)

  const filtered = MOCK_BILLS.filter(
    (b) => b.vendor.toLowerCase().includes(search.toLowerCase()) || b.invoiceNo.toLowerCase().includes(search.toLowerCase())
  )

  const totalPending = MOCK_BILLS.filter(b => b.status === "Pending").reduce((s, b) => s + b.netPayable, 0)
  const totalApproved = MOCK_BILLS.filter(b => b.status === "Approved").reduce((s, b) => s + b.netPayable, 0)
  const totalPaid = MOCK_BILLS.filter(b => b.status === "Paid").reduce((s, b) => s + b.netPayable, 0)

  return (
    <FinanceShell breadcrumbs={[{ label: "Vendor Payments" }]}>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
              Vendor Payments & Expenses
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Track purchase bills, apply GST/TDS, and process vendor payments.
            </p>
          </div>
          <Button size="sm" className="w-fit bg-primary hover:bg-primary/90" onClick={() => setUploadOpen(true)}>
            <Upload className="mr-1.5 size-4" />
            <span className="hidden sm:inline">Upload Invoice</span>
            <span className="sm:hidden">Upload</span>
          </Button>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-3 gap-3">
          <Card className="border-amber-500/20 bg-card/30 backdrop-blur-xl">
            <CardContent className="p-3 sm:p-4">
              <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Pending</p>
              <p className="mt-1 text-base font-bold text-amber-500 sm:text-lg">{formatINR(totalPending)}</p>
            </CardContent>
          </Card>
          <Card className="border-primary/20 bg-card/30 backdrop-blur-xl">
            <CardContent className="p-3 sm:p-4">
              <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Approved</p>
              <p className="mt-1 text-base font-bold text-primary sm:text-lg">{formatINR(totalApproved)}</p>
            </CardContent>
          </Card>
          <Card className="border-emerald-500/20 bg-card/30 backdrop-blur-xl">
            <CardContent className="p-3 sm:p-4">
              <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Paid</p>
              <p className="mt-1 text-base font-bold text-emerald-500 sm:text-lg">{formatINR(totalPaid)}</p>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <div className="relative sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search bills..." value={search} onChange={(e) => setSearch(e.target.value)} className="h-9 border-border/50 bg-card/30 pl-10" />
        </div>

        {/* Bills Table */}
        <Card className="border-border/40 bg-card/30 backdrop-blur-xl">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-border/30 hover:bg-transparent">
                  <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Vendor</TableHead>
                  <TableHead className="hidden text-xs font-semibold uppercase tracking-wider text-muted-foreground sm:table-cell">Invoice</TableHead>
                  <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Amount</TableHead>
                  <TableHead className="hidden text-xs font-semibold uppercase tracking-wider text-muted-foreground md:table-cell">GST</TableHead>
                  <TableHead className="hidden text-xs font-semibold uppercase tracking-wider text-muted-foreground md:table-cell">TDS</TableHead>
                  <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Net</TableHead>
                  <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((bill) => (
                  <TableRow key={bill.id} className="border-border/20 transition-colors hover:bg-accent/20">
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                          <Building2 className="size-3.5 text-primary" />
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-foreground">{bill.vendor}</p>
                          <p className="text-xs text-muted-foreground sm:hidden">{bill.invoiceNo}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden font-mono text-xs text-muted-foreground sm:table-cell">{bill.invoiceNo}</TableCell>
                    <TableCell className="text-sm text-foreground">{formatINR(bill.amount)}</TableCell>
                    <TableCell className="hidden text-sm text-amber-500 md:table-cell">{formatINR(bill.gstAmount)}</TableCell>
                    <TableCell className="hidden text-sm text-rose-500 md:table-cell">{formatINR(bill.tdsAmount)}</TableCell>
                    <TableCell className="text-sm font-bold text-foreground">{formatINR(bill.netPayable)}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={cn(
                        "text-[10px] font-semibold uppercase",
                        bill.status === "Pending" && "border-amber-500/30 bg-amber-500/10 text-amber-500",
                        bill.status === "Approved" && "border-primary/30 bg-primary/10 text-primary",
                        bill.status === "Paid" && "border-emerald-500/30 bg-emerald-500/10 text-emerald-500",
                      )}>
                        {bill.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>

      {/* Upload Invoice Dialog */}
      <Dialog open={uploadOpen} onOpenChange={setUploadOpen}>
        <DialogContent className="max-h-[85dvh] overflow-y-auto border-border/40 bg-card/95 backdrop-blur-2xl sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base">
              <Upload className="size-4 text-primary" />
              Upload Invoice - AI Scanning
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4 pt-2">
            {/* Drop zone */}
            <div className="flex flex-col items-center gap-3 rounded-2xl border-2 border-dashed border-primary/30 bg-primary/[0.03] p-8 text-center">
              <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10">
                <FileText className="size-7 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Drop invoice file here</p>
                <p className="text-xs text-muted-foreground">PDF, JPG, PNG up to 10MB</p>
              </div>
              <Button variant="outline" size="sm" className="border-primary/30 text-primary">
                Browse Files
              </Button>
            </div>

            {/* AI scan result preview */}
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4">
              <div className="mb-3 flex items-center gap-2">
                <Sparkles className="size-4 text-emerald-500" />
                <span className="text-xs font-semibold text-emerald-500">AI Invoice Scanning & Reconciliation</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <Label className="text-[10px] text-muted-foreground">Vendor</Label>
                  <Input disabled defaultValue="Auto-detected..." className="h-8 border-border/30 bg-background/20 text-xs" />
                </div>
                <div className="flex flex-col gap-1">
                  <Label className="text-[10px] text-muted-foreground">Amount</Label>
                  <Input disabled defaultValue="Auto-detected..." className="h-8 border-border/30 bg-background/20 text-xs" />
                </div>
                <div className="flex flex-col gap-1">
                  <Label className="text-[10px] text-muted-foreground">GST</Label>
                  <Input disabled defaultValue="Auto-detected..." className="h-8 border-border/30 bg-background/20 text-xs" />
                </div>
                <div className="flex flex-col gap-1">
                  <Label className="text-[10px] text-muted-foreground">TDS Applied</Label>
                  <Input disabled defaultValue="Auto-detected..." className="h-8 border-border/30 bg-background/20 text-xs" />
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setUploadOpen(false)} className="border-border/50">Cancel</Button>
            <Button className="bg-primary hover:bg-primary/90">Process Invoice</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </FinanceShell>
  )
}
