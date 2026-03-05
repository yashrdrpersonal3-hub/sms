"use client"

import { useState } from "react"
import { FinanceShell } from "@/components/finance/finance-shell"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Search, ShoppingCart, User, Phone, Wallet, CreditCard,
  Banknote, QrCode, GraduationCap, ChevronDown, ChevronUp,
  Clock, Receipt, AlertTriangle, CheckCircle2, FileText,
  IndianRupee, Users, Bus, BookOpen, ArrowRight,
  CircleDollarSign, RotateCcw, Percent, CalendarDays,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface Sibling {
  id: string
  name: string
  class: string
  admissionNo: string
  photo?: string
}

interface FeeItem {
  id: string
  studentId: string
  studentName: string
  head: string
  amount: number
  dueDate: string
  status: "Pending" | "Overdue" | "Partial"
  category: string
}

interface TimelineEvent {
  id: string
  date: string
  time: string
  type: "invoice" | "payment" | "fine" | "concession" | "refund" | "system"
  title: string
  description: string
  amount?: number
  user?: string
}

const FAMILY = {
  parentName: "Mr. Rajesh Kumar",
  parentMobile: "+91 98765 43210",
  parentEmail: "rajesh.kumar@email.com",
  advanceWallet: 5000,
  totalDues: 47500,
  siblings: [
    { id: "STU-001", name: "Aarav Kumar", class: "Class 5-A", admissionNo: "ADM-2024-1042" },
    { id: "STU-002", name: "Priya Kumar", class: "Class 3-B", admissionNo: "ADM-2024-1043" },
    { id: "STU-003", name: "Rohan Kumar", class: "Class 8-C", admissionNo: "ADM-2023-0891" },
  ] as Sibling[],
}

const PENDING_FEES: FeeItem[] = [
  { id: "f1", studentId: "STU-001", studentName: "Aarav Kumar", head: "Tuition Fee - Q3", amount: 9000, dueDate: "2026-01-15", status: "Overdue", category: "Academic" },
  { id: "f2", studentId: "STU-001", studentName: "Aarav Kumar", head: "Transport Fee - Q3", amount: 4500, dueDate: "2026-01-15", status: "Overdue", category: "Transport" },
  { id: "f3", studentId: "STU-001", studentName: "Aarav Kumar", head: "Coaching Fee - Jan", amount: 3000, dueDate: "2026-01-10", status: "Overdue", category: "Coaching" },
  { id: "f4", studentId: "STU-002", studentName: "Priya Kumar", head: "Tuition Fee - Q3", amount: 9000, dueDate: "2026-01-15", status: "Pending", category: "Academic" },
  { id: "f5", studentId: "STU-002", studentName: "Priya Kumar", head: "Annual Day Fee", amount: 5000, dueDate: "2026-02-01", status: "Pending", category: "Misc" },
  { id: "f6", studentId: "STU-003", studentName: "Rohan Kumar", head: "Tuition Fee - Q3", amount: 13500, dueDate: "2026-01-15", status: "Partial", category: "Academic" },
  { id: "f7", studentId: "STU-003", studentName: "Rohan Kumar", head: "Lab Fee - Annual", amount: 3500, dueDate: "2026-03-01", status: "Pending", category: "Academic" },
]

const TIMELINE_EVENTS: TimelineEvent[] = [
  { id: "t1", date: "2026-03-05", time: "09:15 AM", type: "system", title: "Q4 Invoice Generated", description: "System auto-generated Q4 fee invoices for all 3 students.", amount: 52000 },
  { id: "t2", date: "2026-02-28", time: "11:30 AM", type: "payment", title: "Fee Payment Received", description: "Cashier 'Amit' collected payment via UPI for Rohan's partial dues.", amount: 10000, user: "Amit (Cashier)" },
  { id: "t3", date: "2026-02-15", time: "04:00 PM", type: "concession", title: "Sibling Discount Applied", description: "System auto-applied 10% sibling discount on Priya's Tuition Fee.", amount: -900 },
  { id: "t4", date: "2026-02-01", time: "12:00 AM", type: "fine", title: "Late Fine Auto-Applied", description: "System auto-applied late payment fine on Aarav's Q3 Tuition Fee.", amount: 500 },
  { id: "t5", date: "2026-01-15", time: "10:00 AM", type: "invoice", title: "Q3 Invoice Generated", description: "System generated Q3 fee invoices for all 3 students.", amount: 47500 },
  { id: "t6", date: "2026-01-10", time: "03:45 PM", type: "payment", title: "Fee Payment Received", description: "Cashier 'Sunita' collected payment via Cash for Aarav's Q2 dues.", amount: 16500, user: "Sunita (Cashier)" },
  { id: "t7", date: "2025-12-20", time: "02:00 PM", type: "refund", title: "Refund Processed", description: "Transport fee refund processed for Priya (route change).", amount: -2000, user: "Admin" },
  { id: "t8", date: "2025-12-15", time: "09:00 AM", type: "payment", title: "Advance Deposit", description: "Parent deposited advance amount to wallet via Cheque.", amount: 15000, user: "Rajesh Kumar (Parent)" },
  { id: "t9", date: "2025-11-01", time: "12:00 AM", type: "system", title: "Fee Plan Updated", description: "Transport Fee revised for Class 5 students. New route pricing applied.", amount: 500 },
  { id: "t10", date: "2025-10-05", time: "11:00 AM", type: "payment", title: "Fee Payment Received", description: "Online payment received via NEFT for Q2 dues.", amount: 32000, user: "Rajesh Kumar (Parent)" },
]

function formatINR(amount: number) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(Math.abs(amount))
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })
}

const timelineConfig: Record<string, { color: string; bg: string; icon: typeof Receipt }> = {
  invoice: { color: "text-primary", bg: "bg-primary/15", icon: FileText },
  payment: { color: "text-emerald-500", bg: "bg-emerald-500/15", icon: CircleDollarSign },
  fine: { color: "text-rose-500", bg: "bg-rose-500/15", icon: AlertTriangle },
  concession: { color: "text-amber-500", bg: "bg-amber-500/15", icon: Percent },
  refund: { color: "text-rose-400", bg: "bg-rose-400/15", icon: RotateCcw },
  system: { color: "text-muted-foreground", bg: "bg-muted/30", icon: Clock },
}

export default function POSPage() {
  const [search, setSearch] = useState("")
  const [selectedFamily, setSelectedFamily] = useState(true)
  const [selectedFees, setSelectedFees] = useState<string[]>([])
  const [paymentMethod, setPaymentMethod] = useState<string>("cash")
  const [mobileView, setMobileView] = useState<"context" | "cart" | "timeline">("cart")

  const toggleFee = (feeId: string) => {
    setSelectedFees((prev) =>
      prev.includes(feeId) ? prev.filter((id) => id !== feeId) : [...prev, feeId]
    )
  }

  const selectAllFees = () => {
    if (selectedFees.length === PENDING_FEES.length) {
      setSelectedFees([])
    } else {
      setSelectedFees(PENDING_FEES.map((f) => f.id))
    }
  }

  const selectedTotal = PENDING_FEES.filter((f) => selectedFees.includes(f.id)).reduce((sum, f) => sum + f.amount, 0)

  const groupedFees = FAMILY.siblings.map((sibling) => ({
    ...sibling,
    fees: PENDING_FEES.filter((f) => f.studentId === sibling.id),
  }))

  return (
    <FinanceShell breadcrumbs={[{ label: "Universal POS" }]}>
      <div className="flex flex-col gap-4">
        {/* Page Header + Search */}
        <div className="flex flex-col gap-4">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
              Universal POS - Family Billing 360
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Scan ID, search student, or enter parent mobile to load family context.
            </p>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Scan ID / Student Name / Parent Mobile..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-11 border-border/50 bg-card/30 pl-10 text-base backdrop-blur-sm"
            />
          </div>
        </div>

        {/* Mobile Tab Switcher */}
        <div className="flex gap-2 lg:hidden">
          {[
            { key: "context", label: "Family", icon: Users },
            { key: "cart", label: "Cart", icon: ShoppingCart },
            { key: "timeline", label: "History", icon: Clock },
          ].map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.key}
                onClick={() => setMobileView(tab.key as typeof mobileView)}
                className={cn(
                  "flex flex-1 items-center justify-center gap-1.5 rounded-xl border px-3 py-2.5 text-sm font-medium transition-all",
                  mobileView === tab.key
                    ? "border-primary/40 bg-primary/10 text-primary"
                    : "border-border/40 bg-card/30 text-muted-foreground"
                )}
              >
                <Icon className="size-4" />
                {tab.label}
              </button>
            )
          })}
        </div>

        {selectedFamily && (
          <div className="flex flex-col gap-4 lg:grid lg:grid-cols-5 lg:gap-6">
            {/* Left Panel: Family Context */}
            <div className={cn("col-span-2 flex flex-col gap-4", mobileView !== "context" && "hidden lg:flex")}>
              {/* Parent Card */}
              <Card className="border-border/40 bg-card/30 backdrop-blur-xl">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex size-12 shrink-0 items-center justify-center rounded-xl border border-primary/30 bg-primary/10 text-base font-bold text-primary">
                      RK
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-base font-semibold text-foreground">{FAMILY.parentName}</p>
                      <div className="mt-1 flex flex-col gap-0.5 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1.5"><Phone className="size-3" />{FAMILY.parentMobile}</span>
                        <span className="truncate">{FAMILY.parentEmail}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Wallet */}
              <Card className="border-emerald-500/20 bg-emerald-500/5 backdrop-blur-xl">
                <CardContent className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-2.5">
                    <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-500/15">
                      <Wallet className="size-5 text-emerald-500" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">Advance Wallet</p>
                      <p className="text-lg font-bold text-emerald-500">{formatINR(FAMILY.advanceWallet)}</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="border-emerald-500/30 text-emerald-500 hover:bg-emerald-500/10">
                    Top Up
                  </Button>
                </CardContent>
              </Card>

              {/* Siblings */}
              <div>
                <p className="mb-2 text-xs font-bold uppercase tracking-[0.15em] text-muted-foreground">
                  Linked Students ({FAMILY.siblings.length})
                </p>
                <div className="flex flex-col gap-2">
                  {FAMILY.siblings.map((sibling) => {
                    const siblingFees = PENDING_FEES.filter((f) => f.studentId === sibling.id)
                    const siblingTotal = siblingFees.reduce((s, f) => s + f.amount, 0)
                    const hasOverdue = siblingFees.some((f) => f.status === "Overdue")
                    return (
                      <Card key={sibling.id} className="border-border/40 bg-card/30 backdrop-blur-xl">
                        <CardContent className="flex items-center gap-3 p-3">
                          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                            <GraduationCap className="size-5 text-primary" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium text-foreground">{sibling.name}</p>
                            <p className="text-xs text-muted-foreground">{sibling.class} &middot; {sibling.admissionNo}</p>
                          </div>
                          <div className="text-right">
                            <p className={cn("text-sm font-bold", hasOverdue ? "text-rose-500" : "text-amber-500")}>
                              {formatINR(siblingTotal)}
                            </p>
                            <p className="text-[10px] text-muted-foreground">{siblingFees.length} pending</p>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-2">
                <Card className="border-border/40 bg-card/30">
                  <CardContent className="p-3 text-center">
                    <p className="text-lg font-bold text-rose-500">{formatINR(FAMILY.totalDues)}</p>
                    <p className="text-[10px] text-muted-foreground">Total Outstanding</p>
                  </CardContent>
                </Card>
                <Card className="border-border/40 bg-card/30">
                  <CardContent className="p-3 text-center">
                    <p className="text-lg font-bold text-emerald-500">{formatINR(FAMILY.advanceWallet)}</p>
                    <p className="text-[10px] text-muted-foreground">Wallet Balance</p>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Right Panel: Tabs */}
            <div className={cn("col-span-3", mobileView === "context" && "hidden lg:block")}>
              {/* Desktop tabs */}
              <div className="hidden lg:block">
                <Tabs defaultValue="cart" className="w-full">
                  <TabsList className="w-full bg-card/30 backdrop-blur-sm">
                    <TabsTrigger value="cart" className="flex-1 gap-1.5 text-xs">
                      <ShoppingCart className="size-3.5" /> The Cart
                    </TabsTrigger>
                    <TabsTrigger value="timeline" className="flex-1 gap-1.5 text-xs">
                      <Clock className="size-3.5" /> Fee Audit & History
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="cart" className="mt-4"><CartContent groupedFees={groupedFees} selectedFees={selectedFees} toggleFee={toggleFee} selectAllFees={selectAllFees} selectedTotal={selectedTotal} paymentMethod={paymentMethod} setPaymentMethod={setPaymentMethod} /></TabsContent>
                  <TabsContent value="timeline" className="mt-4"><TimelineContent /></TabsContent>
                </Tabs>
              </div>

              {/* Mobile direct render */}
              <div className="lg:hidden">
                {mobileView === "cart" && <CartContent groupedFees={groupedFees} selectedFees={selectedFees} toggleFee={toggleFee} selectAllFees={selectAllFees} selectedTotal={selectedTotal} paymentMethod={paymentMethod} setPaymentMethod={setPaymentMethod} />}
                {mobileView === "timeline" && <TimelineContent />}
              </div>
            </div>
          </div>
        )}
      </div>
    </FinanceShell>
  )
}

function CartContent({ groupedFees, selectedFees, toggleFee, selectAllFees, selectedTotal, paymentMethod, setPaymentMethod }: {
  groupedFees: (Sibling & { fees: FeeItem[] })[]
  selectedFees: string[]
  toggleFee: (id: string) => void
  selectAllFees: () => void
  selectedTotal: number
  paymentMethod: string
  setPaymentMethod: (m: string) => void
}) {
  return (
    <div className="flex flex-col gap-4">
      {/* Select All */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Checkbox
            checked={selectedFees.length === PENDING_FEES.length}
            onCheckedChange={selectAllFees}
          />
          <span className="text-sm font-medium text-foreground">Select All Pending Fees</span>
        </div>
        <Badge variant="outline" className="border-border/50 text-xs text-muted-foreground">
          {selectedFees.length}/{PENDING_FEES.length} selected
        </Badge>
      </div>

      {/* Fee items grouped by student */}
      {groupedFees.map((student) => (
        <Card key={student.id} className="border-border/40 bg-card/30 backdrop-blur-xl">
          <CardContent className="p-0">
            <div className="flex items-center gap-2.5 border-b border-border/30 px-4 py-3">
              <GraduationCap className="size-4 text-primary" />
              <span className="text-sm font-semibold text-foreground">{student.name}</span>
              <Badge variant="outline" className="ml-auto border-border/40 text-[10px] text-muted-foreground">{student.class}</Badge>
            </div>
            <div className="flex flex-col divide-y divide-border/20">
              {student.fees.map((fee) => (
                <label
                  key={fee.id}
                  className={cn(
                    "flex cursor-pointer items-center gap-3 px-4 py-3 transition-colors hover:bg-accent/20",
                    selectedFees.includes(fee.id) && "bg-primary/5"
                  )}
                >
                  <Checkbox
                    checked={selectedFees.includes(fee.id)}
                    onCheckedChange={() => toggleFee(fee.id)}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-foreground">{fee.head}</p>
                    <p className="text-xs text-muted-foreground">Due: {formatDate(fee.dueDate)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className={cn(
                        "text-[9px] font-semibold uppercase",
                        fee.status === "Overdue" && "border-rose-500/30 bg-rose-500/10 text-rose-500",
                        fee.status === "Pending" && "border-amber-500/30 bg-amber-500/10 text-amber-500",
                        fee.status === "Partial" && "border-primary/30 bg-primary/10 text-primary"
                      )}
                    >
                      {fee.status}
                    </Badge>
                    <span className="shrink-0 text-sm font-bold text-foreground">{formatINR(fee.amount)}</span>
                  </div>
                </label>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Checkout Section */}
      {selectedFees.length > 0 && (
        <Card className="border-primary/30 bg-primary/5 backdrop-blur-xl">
          <CardContent className="flex flex-col gap-4 p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-foreground">Checkout Total</span>
              <span className="text-xl font-bold text-primary">{formatINR(selectedTotal)}</span>
            </div>

            <Separator className="bg-primary/20" />

            {/* Payment method */}
            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.15em] text-muted-foreground">Payment Method</p>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: "cash", label: "Cash", icon: Banknote },
                  { id: "cheque", label: "Cheque/DD", icon: FileText },
                  { id: "online", label: "UPI/Cards", icon: QrCode },
                ].map((method) => {
                  const Icon = method.icon
                  return (
                    <button
                      key={method.id}
                      onClick={() => setPaymentMethod(method.id)}
                      className={cn(
                        "flex flex-col items-center gap-1.5 rounded-xl border px-3 py-3 text-xs font-medium transition-all",
                        paymentMethod === method.id
                          ? "border-primary/40 bg-primary/15 text-primary"
                          : "border-border/40 bg-background/20 text-muted-foreground hover:border-primary/20"
                      )}
                    >
                      <Icon className="size-5" />
                      {method.label}
                    </button>
                  )
                })}
              </div>
            </div>

            {paymentMethod === "cheque" && (
              <div className="grid grid-cols-2 gap-2">
                <Input placeholder="Cheque/DD No." className="border-border/50 bg-background/30 text-sm" />
                <Input placeholder="Bank Name" className="border-border/50 bg-background/30 text-sm" />
              </div>
            )}

            {paymentMethod === "online" && (
              <div className="grid grid-cols-2 gap-2">
                <Input placeholder="Transaction ID" className="border-border/50 bg-background/30 text-sm" />
                <Select>
                  <SelectTrigger className="border-border/50 bg-background/30 text-sm"><SelectValue placeholder="Gateway" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="upi">UPI</SelectItem>
                    <SelectItem value="card">Credit/Debit Card</SelectItem>
                    <SelectItem value="neft">NEFT/RTGS</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            <Button className="h-12 bg-emerald-600 text-base font-semibold text-white hover:bg-emerald-700">
              <IndianRupee className="mr-1.5 size-5" />
              Collect {formatINR(selectedTotal)}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

function TimelineContent() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-foreground">Fee Audit & History Timeline</p>
        <Badge variant="outline" className="border-border/50 text-[10px] text-muted-foreground">
          {TIMELINE_EVENTS.length} events
        </Badge>
      </div>

      {/* Vertical Timeline */}
      <div className="relative">
        {/* Timeline line */}
        <div className="absolute bottom-0 left-5 top-0 w-px bg-border/40" />

        <div className="flex flex-col gap-1">
          {TIMELINE_EVENTS.map((event, i) => {
            const config = timelineConfig[event.type]
            const Icon = config.icon
            const isPositive = event.type === "payment" || event.type === "invoice"
            const isNegative = event.type === "fine"

            return (
              <div key={event.id} className="group relative flex gap-4 py-3 pl-0">
                {/* Timeline node */}
                <div className={cn("relative z-10 flex size-10 shrink-0 items-center justify-center rounded-xl border border-border/30", config.bg)}>
                  <Icon className={cn("size-4", config.color)} />
                </div>

                {/* Content */}
                <div className="min-w-0 flex-1 rounded-xl border border-border/30 bg-card/20 p-3 transition-colors group-hover:bg-accent/10">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-foreground">{event.title}</p>
                      <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">{event.description}</p>
                      {event.user && (
                        <p className="mt-1 text-[10px] text-muted-foreground/70">By: {event.user}</p>
                      )}
                    </div>
                    {event.amount !== undefined && (
                      <span className={cn(
                        "shrink-0 text-sm font-bold",
                        event.amount > 0 ? (isNegative ? "text-rose-500" : "text-emerald-500") : "text-amber-500"
                      )}>
                        {event.amount > 0 ? (isNegative ? "+" : "+") : ""}{formatINR(event.amount)}
                      </span>
                    )}
                  </div>
                  <div className="mt-2 flex items-center gap-2 text-[10px] text-muted-foreground/60">
                    <CalendarDays className="size-3" />
                    {formatDate(event.date)} at {event.time}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
