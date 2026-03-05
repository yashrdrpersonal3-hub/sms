"use client"

import { useState } from "react"
import { FinanceShell } from "@/components/finance/finance-shell"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import {
  Plus, Search, MoreHorizontal, FileText, Pencil, Trash2,
  GraduationCap, Bus, BookOpen, Utensils, Shield, Percent,
  Award, ChevronRight, ToggleLeft,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface FeeHead {
  id: string
  name: string
  amount: number
  frequency: "Monthly" | "Quarterly" | "Annual" | "One-Time"
  isRTE: boolean
  category: string
}

interface FeePlan {
  id: string
  name: string
  class: string
  session: string
  status: "Active" | "Draft" | "Archived"
  totalAmount: number
  feeHeads: FeeHead[]
  createdAt: string
}

const MOCK_FEE_PLANS: FeePlan[] = [
  {
    id: "FP-001",
    name: "Standard Plan - Class 1-5",
    class: "Class 1-5",
    session: "2025-26",
    status: "Active",
    totalAmount: 85000,
    feeHeads: [
      { id: "fh1", name: "Tuition Fee", amount: 36000, frequency: "Annual", isRTE: false, category: "Academic" },
      { id: "fh2", name: "Development Fee", amount: 12000, frequency: "Annual", isRTE: false, category: "Academic" },
      { id: "fh3", name: "Transport Fee", amount: 18000, frequency: "Annual", isRTE: false, category: "Transport" },
      { id: "fh4", name: "Coaching Fee", amount: 9000, frequency: "Quarterly", isRTE: false, category: "Coaching" },
      { id: "fh5", name: "Lab Fee", amount: 5000, frequency: "Annual", isRTE: true, category: "Academic" },
      { id: "fh6", name: "Annual Day Fee", amount: 5000, frequency: "One-Time", isRTE: false, category: "Misc" },
    ],
    createdAt: "2025-03-01",
  },
  {
    id: "FP-002",
    name: "Premium Plan - Class 6-10",
    class: "Class 6-10",
    session: "2025-26",
    status: "Active",
    totalAmount: 125000,
    feeHeads: [
      { id: "fh7", name: "Tuition Fee", amount: 54000, frequency: "Annual", isRTE: false, category: "Academic" },
      { id: "fh8", name: "Smart Class Fee", amount: 18000, frequency: "Annual", isRTE: false, category: "Academic" },
      { id: "fh9", name: "Transport Fee", amount: 24000, frequency: "Annual", isRTE: false, category: "Transport" },
      { id: "fh10", name: "Coaching Fee", amount: 15000, frequency: "Quarterly", isRTE: false, category: "Coaching" },
      { id: "fh11", name: "Sports Fee", amount: 8000, frequency: "Annual", isRTE: true, category: "Sports" },
      { id: "fh12", name: "Annual Day Fee", amount: 6000, frequency: "One-Time", isRTE: false, category: "Misc" },
    ],
    createdAt: "2025-03-01",
  },
  {
    id: "FP-003",
    name: "RTE Compliant Plan",
    class: "Class 1-8",
    session: "2025-26",
    status: "Active",
    totalAmount: 0,
    feeHeads: [
      { id: "fh13", name: "Tuition Fee", amount: 0, frequency: "Annual", isRTE: true, category: "Academic" },
      { id: "fh14", name: "Books & Uniform", amount: 0, frequency: "One-Time", isRTE: true, category: "Academic" },
    ],
    createdAt: "2025-02-15",
  },
  {
    id: "FP-004",
    name: "Class 11-12 Science Stream",
    class: "Class 11-12",
    session: "2025-26",
    status: "Draft",
    totalAmount: 165000,
    feeHeads: [
      { id: "fh15", name: "Tuition Fee", amount: 72000, frequency: "Annual", isRTE: false, category: "Academic" },
      { id: "fh16", name: "Lab & Practicals", amount: 30000, frequency: "Annual", isRTE: false, category: "Academic" },
      { id: "fh17", name: "Transport Fee", amount: 24000, frequency: "Annual", isRTE: false, category: "Transport" },
      { id: "fh18", name: "Coaching Fee", amount: 24000, frequency: "Quarterly", isRTE: false, category: "Coaching" },
      { id: "fh19", name: "Library Fee", amount: 15000, frequency: "Annual", isRTE: false, category: "Academic" },
    ],
    createdAt: "2025-03-10",
  },
]

interface RuleConfig {
  type: "Fine" | "Concession" | "Scholarship"
  name: string
  percentage: number
  condition: string
  stackable: boolean
}

const MOCK_RULES: RuleConfig[] = [
  { type: "Fine", name: "Late Payment Fine", percentage: 5, condition: "Payment > 15 days overdue", stackable: false },
  { type: "Concession", name: "Sibling Discount", percentage: 10, condition: "2nd+ sibling enrolled", stackable: true },
  { type: "Scholarship", name: "Merit Scholarship", percentage: 25, condition: "Score > 95% aggregate", stackable: true },
  { type: "Concession", name: "Staff Ward Concession", percentage: 50, condition: "Parent is staff member", stackable: false },
  { type: "Fine", name: "Cheque Bounce Penalty", percentage: 2, condition: "Cheque returned unpaid", stackable: false },
]

function formatINR(amount: number) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(amount)
}

function StatusBadge({ status }: { status: string }) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "text-[10px] font-semibold uppercase tracking-wider",
        status === "Active" && "border-emerald-500/30 bg-emerald-500/10 text-emerald-500",
        status === "Draft" && "border-amber-500/30 bg-amber-500/10 text-amber-500",
        status === "Archived" && "border-muted-foreground/30 bg-muted/50 text-muted-foreground"
      )}
    >
      {status}
    </Badge>
  )
}

export default function FeePlansPage() {
  const [search, setSearch] = useState("")
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [rulesOpen, setRulesOpen] = useState(false)
  const [globalStacking, setGlobalStacking] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<FeePlan | null>(null)
  const [newHeads, setNewHeads] = useState<FeeHead[]>([
    { id: "new-1", name: "", amount: 0, frequency: "Annual", isRTE: false, category: "Academic" },
  ])

  const filtered = MOCK_FEE_PLANS.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.class.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <FinanceShell breadcrumbs={[{ label: "Fee Plans & Structures" }]}>
      <div className="flex flex-col gap-6">
        {/* Page Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
              Fee Plans & Structures
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Manage fee templates, heads, and pricing rules for all classes.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="border-amber-500/30 text-amber-500 hover:bg-amber-500/10"
              onClick={() => setRulesOpen(true)}
            >
              <Shield className="mr-1.5 size-4" />
              <span className="hidden sm:inline">Rules Engine</span>
              <span className="sm:hidden">Rules</span>
            </Button>
            <Button
              size="sm"
              className="bg-primary hover:bg-primary/90"
              onClick={() => {
                setSelectedPlan(null)
                setDrawerOpen(true)
              }}
            >
              <Plus className="mr-1.5 size-4" />
              <span className="hidden sm:inline">Create Plan</span>
              <span className="sm:hidden">New</span>
            </Button>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search plans by name or class..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-10 border-border/50 bg-card/30 pl-10 backdrop-blur-sm"
          />
        </div>

        {/* Fee Plans Table */}
        <Card className="border-border/40 bg-card/30 backdrop-blur-xl">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-border/30 hover:bg-transparent">
                  <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Plan Name</TableHead>
                  <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Class</TableHead>
                  <TableHead className="hidden text-xs font-semibold uppercase tracking-wider text-muted-foreground sm:table-cell">Session</TableHead>
                  <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Total</TableHead>
                  <TableHead className="hidden text-xs font-semibold uppercase tracking-wider text-muted-foreground md:table-cell">Heads</TableHead>
                  <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Status</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((plan) => (
                  <TableRow
                    key={plan.id}
                    className="group cursor-pointer border-border/20 transition-colors hover:bg-accent/30"
                    onClick={() => {
                      setSelectedPlan(plan)
                      setDrawerOpen(true)
                    }}
                  >
                    <TableCell>
                      <div className="flex items-center gap-2.5">
                        <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                          <FileText className="size-4 text-primary" />
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-foreground">{plan.name}</p>
                          <p className="text-xs text-muted-foreground sm:hidden">{plan.session}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-foreground">{plan.class}</TableCell>
                    <TableCell className="hidden text-sm text-muted-foreground sm:table-cell">{plan.session}</TableCell>
                    <TableCell className="text-sm font-semibold text-emerald-500">{formatINR(plan.totalAmount)}</TableCell>
                    <TableCell className="hidden md:table-cell">
                      <Badge variant="outline" className="border-border/50 text-xs text-muted-foreground">{plan.feeHeads.length} heads</Badge>
                    </TableCell>
                    <TableCell><StatusBadge status={plan.status} /></TableCell>
                    <TableCell>
                      <ChevronRight className="size-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {filtered.length === 0 && (
            <div className="flex flex-col items-center gap-2 py-16 text-center">
              <FileText className="size-8 text-muted-foreground/40" />
              <p className="text-sm text-muted-foreground">No fee plans found</p>
            </div>
          )}
        </Card>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: "Active Plans", value: MOCK_FEE_PLANS.filter(p => p.status === "Active").length, color: "text-emerald-500", bg: "bg-emerald-500/10" },
            { label: "Draft Plans", value: MOCK_FEE_PLANS.filter(p => p.status === "Draft").length, color: "text-amber-500", bg: "bg-amber-500/10" },
            { label: "Fee Heads", value: MOCK_FEE_PLANS.reduce((a, p) => a + p.feeHeads.length, 0), color: "text-primary", bg: "bg-primary/10" },
            { label: "RTE Heads", value: MOCK_FEE_PLANS.reduce((a, p) => a + p.feeHeads.filter(h => h.isRTE).length, 0), color: "text-rose-500", bg: "bg-rose-500/10" },
          ].map((stat) => (
            <Card key={stat.label} className="border-border/40 bg-card/30 backdrop-blur-xl">
              <CardContent className="flex items-center gap-3 p-4">
                <div className={cn("flex size-10 shrink-0 items-center justify-center rounded-xl", stat.bg)}>
                  <span className={cn("text-lg font-bold", stat.color)}>{stat.value}</span>
                </div>
                <span className="text-xs font-medium text-muted-foreground">{stat.label}</span>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Create/Edit Plan Drawer */}
      <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
        <SheetContent side="right" className="w-full border-border/40 bg-card/90 p-0 backdrop-blur-2xl sm:max-w-lg">
          <SheetHeader className="border-b border-border/30 px-5 py-4">
            <SheetTitle className="text-base">
              {selectedPlan ? `Edit: ${selectedPlan.name}` : "Create New Fee Plan"}
            </SheetTitle>
          </SheetHeader>
          <ScrollArea className="h-[calc(100dvh-5rem)]">
            <div className="flex flex-col gap-6 p-5">
              {/* Plan Basics */}
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <Label className="text-xs font-medium text-muted-foreground">Plan Name</Label>
                  <Input
                    defaultValue={selectedPlan?.name || ""}
                    placeholder="e.g. Standard Plan - Class 1-5"
                    className="border-border/50 bg-background/30"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <Label className="text-xs font-medium text-muted-foreground">Class Group</Label>
                    <Select defaultValue={selectedPlan?.class || ""}>
                      <SelectTrigger className="border-border/50 bg-background/30"><SelectValue placeholder="Select class" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Class 1-5">Class 1-5</SelectItem>
                        <SelectItem value="Class 6-10">Class 6-10</SelectItem>
                        <SelectItem value="Class 11-12">Class 11-12</SelectItem>
                        <SelectItem value="Class 1-8">Class 1-8</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Label className="text-xs font-medium text-muted-foreground">Session</Label>
                    <Select defaultValue="2025-26">
                      <SelectTrigger className="border-border/50 bg-background/30"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2025-26">2025-26</SelectItem>
                        <SelectItem value="2026-27">2026-27</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <Separator className="bg-border/30" />

              {/* Fee Heads */}
              <div>
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-xs font-bold uppercase tracking-[0.15em] text-muted-foreground">Fee Heads</p>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 text-xs text-primary"
                    onClick={() => setNewHeads(prev => [...prev, { id: `new-${Date.now()}`, name: "", amount: 0, frequency: "Annual", isRTE: false, category: "Academic" }])}
                  >
                    <Plus className="mr-1 size-3" />
                    Add Head
                  </Button>
                </div>

                {/* Existing heads if editing */}
                {selectedPlan && (
                  <div className="mb-4 flex flex-col gap-2">
                    {selectedPlan.feeHeads.map((head) => {
                      const icons: Record<string, typeof GraduationCap> = {
                        Academic: GraduationCap, Transport: Bus, Coaching: BookOpen,
                        Sports: Shield, Misc: Utensils,
                      }
                      const HeadIcon = icons[head.category] || FileText
                      return (
                        <div key={head.id} className="flex items-center gap-3 rounded-xl border border-border/30 bg-background/20 p-3">
                          <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                            <HeadIcon className="size-3.5 text-primary" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <p className="truncate text-sm font-medium text-foreground">{head.name}</p>
                              {head.isRTE && <Badge variant="outline" className="border-rose-500/30 bg-rose-500/10 text-[9px] font-semibold text-rose-500">RTE</Badge>}
                            </div>
                            <p className="text-xs text-muted-foreground">{head.frequency} &middot; {formatINR(head.amount)}</p>
                          </div>
                          <button className="flex size-7 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground">
                            <Pencil className="size-3.5" />
                          </button>
                        </div>
                      )
                    })}
                  </div>
                )}

                {/* New heads form */}
                <div className="flex flex-col gap-3">
                  {newHeads.map((head, i) => (
                    <div key={head.id} className="rounded-xl border border-dashed border-primary/30 bg-primary/[0.03] p-3">
                      <div className="flex flex-col gap-3">
                        <div className="grid grid-cols-2 gap-2">
                          <Input placeholder="Head name" className="border-border/50 bg-background/30 text-sm" />
                          <Input type="number" placeholder="Amount" className="border-border/50 bg-background/30 text-sm" />
                        </div>
                        <div className="flex flex-wrap items-center gap-3">
                          <Select defaultValue="Annual">
                            <SelectTrigger className="h-8 w-28 border-border/50 bg-background/30 text-xs">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Monthly">Monthly</SelectItem>
                              <SelectItem value="Quarterly">Quarterly</SelectItem>
                              <SelectItem value="Annual">Annual</SelectItem>
                              <SelectItem value="One-Time">One-Time</SelectItem>
                            </SelectContent>
                          </Select>
                          <Select defaultValue="Academic">
                            <SelectTrigger className="h-8 w-28 border-border/50 bg-background/30 text-xs">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Academic">Academic</SelectItem>
                              <SelectItem value="Transport">Transport</SelectItem>
                              <SelectItem value="Coaching">Coaching</SelectItem>
                              <SelectItem value="Sports">Sports</SelectItem>
                              <SelectItem value="Misc">Misc</SelectItem>
                            </SelectContent>
                          </Select>
                          <div className="flex items-center gap-2">
                            <Switch id={`rte-${i}`} />
                            <Label htmlFor={`rte-${i}`} className="text-xs text-muted-foreground">RTE</Label>
                          </div>
                          {newHeads.length > 1 && (
                            <button
                              onClick={() => setNewHeads(prev => prev.filter((_, idx) => idx !== i))}
                              className="ml-auto flex size-6 items-center justify-center rounded-md text-destructive hover:bg-destructive/10"
                            >
                              <Trash2 className="size-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button className="flex-1 bg-primary hover:bg-primary/90">
                  {selectedPlan ? "Update Plan" : "Create Plan"}
                </Button>
                <Button variant="outline" onClick={() => setDrawerOpen(false)} className="border-border/50">
                  Cancel
                </Button>
              </div>
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>

      {/* Rules Engine Modal */}
      <Dialog open={rulesOpen} onOpenChange={setRulesOpen}>
        <DialogContent className="max-h-[85dvh] overflow-y-auto border-border/40 bg-card/95 backdrop-blur-2xl sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base">
              <Shield className="size-4 text-amber-500" />
              Rules Engine - Fine / Concession / Scholarship
            </DialogTitle>
          </DialogHeader>

          <div className="mt-2 flex flex-col gap-4">
            {/* Global stacking toggle */}
            <div className="flex items-center justify-between rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
              <div>
                <p className="text-sm font-medium text-foreground">Global Rule Stacking</p>
                <p className="text-xs text-muted-foreground">Allow multiple rules to apply simultaneously</p>
              </div>
              <Switch checked={globalStacking} onCheckedChange={setGlobalStacking} />
            </div>

            {/* Rules list */}
            <div className="flex flex-col gap-2">
              {MOCK_RULES.map((rule, i) => (
                <div key={i} className="flex items-center gap-3 rounded-xl border border-border/30 bg-background/20 p-3">
                  <div className={cn(
                    "flex size-9 shrink-0 items-center justify-center rounded-lg",
                    rule.type === "Fine" && "bg-rose-500/10",
                    rule.type === "Concession" && "bg-amber-500/10",
                    rule.type === "Scholarship" && "bg-emerald-500/10",
                  )}>
                    {rule.type === "Fine" && <Percent className="size-4 text-rose-500" />}
                    {rule.type === "Concession" && <Percent className="size-4 text-amber-500" />}
                    {rule.type === "Scholarship" && <Award className="size-4 text-emerald-500" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="truncate text-sm font-medium text-foreground">{rule.name}</p>
                      <Badge variant="outline" className={cn(
                        "text-[9px] font-semibold uppercase",
                        rule.type === "Fine" && "border-rose-500/30 text-rose-500",
                        rule.type === "Concession" && "border-amber-500/30 text-amber-500",
                        rule.type === "Scholarship" && "border-emerald-500/30 text-emerald-500",
                      )}>
                        {rule.type}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{rule.condition}</p>
                  </div>
                  <div className="text-right">
                    <p className={cn(
                      "text-sm font-bold",
                      rule.type === "Fine" ? "text-rose-500" : "text-emerald-500"
                    )}>
                      {rule.type === "Fine" ? "+" : "-"}{rule.percentage}%
                    </p>
                    {rule.stackable && <p className="text-[10px] text-muted-foreground">stackable</p>}
                  </div>
                </div>
              ))}
            </div>

            {/* Add new rule */}
            <div className="rounded-xl border border-dashed border-primary/30 bg-primary/[0.03] p-4">
              <div className="flex flex-col gap-3">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <Select>
                    <SelectTrigger className="border-border/50 bg-background/30 text-sm">
                      <SelectValue placeholder="Rule type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Fine">Fine</SelectItem>
                      <SelectItem value="Concession">Concession</SelectItem>
                      <SelectItem value="Scholarship">Scholarship</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input placeholder="Rule name" className="border-border/50 bg-background/30 text-sm" />
                  <Input type="number" placeholder="Percentage" className="border-border/50 bg-background/30 text-sm" />
                </div>
                <Input placeholder="Condition (e.g. Payment > 15 days overdue)" className="border-border/50 bg-background/30 text-sm" />
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Checkbox id="stackable" />
                    <Label htmlFor="stackable" className="text-xs text-muted-foreground">Allow stacking with other rules</Label>
                  </div>
                  <Button size="sm" className="bg-primary hover:bg-primary/90">
                    <Plus className="mr-1 size-3" />
                    Add Rule
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setRulesOpen(false)} className="border-border/50">Close</Button>
            <Button className="bg-primary hover:bg-primary/90">Save Rules</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </FinanceShell>
  )
}
