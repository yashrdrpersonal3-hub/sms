"use client"

import { useState } from "react"
import { FinanceShell } from "@/components/finance/finance-shell"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Plus, Search, Receipt, Building2, Percent, IndianRupee,
  FileCheck, CreditCard, ChevronRight, User, Phone, Landmark,
} from "lucide-react"
import { cn } from "@/lib/utils"

const GST_SLABS = [
  { id: "gst-1", rate: 0, description: "Exempt - Education Services", hsn: "9992", items: "Tuition, Library" },
  { id: "gst-2", rate: 5, description: "Reduced Rate - Printed Books", hsn: "4901", items: "Textbooks, Workbooks" },
  { id: "gst-3", rate: 12, description: "Standard - IT Equipment", hsn: "8471", items: "Lab Equipment, Computers" },
  { id: "gst-4", rate: 18, description: "Standard - Professional Svcs", hsn: "9983", items: "Consulting, Software" },
  { id: "gst-5", rate: 28, description: "Luxury - Vehicles/AC", hsn: "8702", items: "School Buses, AC Units" },
]

const TDS_SECTIONS = [
  { id: "tds-1", section: "194C", description: "Payment to Contractors", rate: 1, threshold: "30,000" },
  { id: "tds-2", section: "194J", description: "Professional/Technical Fees", rate: 10, threshold: "30,000" },
  { id: "tds-3", section: "194I(a)", description: "Rent - Plant/Machinery", rate: 2, threshold: "2,40,000" },
  { id: "tds-4", section: "194I(b)", description: "Rent - Land/Building", rate: 10, threshold: "2,40,000" },
  { id: "tds-5", section: "194H", description: "Commission/Brokerage", rate: 5, threshold: "15,000" },
  { id: "tds-6", section: "192", description: "Salary TDS", rate: 0, threshold: "As per slab" },
]

interface Vendor {
  id: string
  name: string
  pan: string
  gstin: string
  bankName: string
  accountNo: string
  ifsc: string
  category: string
  status: "Verified" | "Pending" | "Rejected"
}

const MOCK_VENDORS: Vendor[] = [
  { id: "V-001", name: "Ashok Bus Transport Pvt. Ltd", pan: "AABCA1234F", gstin: "07AABCA1234F1ZK", bankName: "State Bank of India", accountNo: "3891XXXX4021", ifsc: "SBIN0001234", category: "Transport", status: "Verified" },
  { id: "V-002", name: "Sharma Books & Stationery", pan: "BPSPS5678G", gstin: "07BPSPS5678G1ZM", bankName: "Punjab National Bank", accountNo: "0297XXXX8832", ifsc: "PUNB0123400", category: "Stationery", status: "Verified" },
  { id: "V-003", name: "Delhi IT Solutions LLP", pan: "AACFD9012H", gstin: "07AACFD9012H1ZP", bankName: "ICICI Bank", accountNo: "6210XXXX3345", ifsc: "ICIC0003456", category: "IT Services", status: "Pending" },
  { id: "V-004", name: "Green Canteen Services", pan: "ABCPG3456J", gstin: "07ABCPG3456J1ZQ", bankName: "HDFC Bank", accountNo: "5023XXXX7891", ifsc: "HDFC0001122", category: "Food Services", status: "Verified" },
  { id: "V-005", name: "RK Construction & Maintenance", pan: "CDEPK7890L", gstin: "", bankName: "Bank of Baroda", accountNo: "8840XXXX2231", ifsc: "BARB0DELHI1", category: "Construction", status: "Rejected" },
]

function StatusBadge({ status }: { status: string }) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "text-[10px] font-semibold uppercase tracking-wider",
        status === "Verified" && "border-emerald-500/30 bg-emerald-500/10 text-emerald-500",
        status === "Pending" && "border-amber-500/30 bg-amber-500/10 text-amber-500",
        status === "Rejected" && "border-rose-500/30 bg-rose-500/10 text-rose-500"
      )}
    >
      {status}
    </Badge>
  )
}

export default function TaxationAndKYCPage() {
  const [search, setSearch] = useState("")
  const [vendorDialogOpen, setVendorDialogOpen] = useState(false)

  const filteredVendors = MOCK_VENDORS.filter(
    (v) => v.name.toLowerCase().includes(search.toLowerCase()) || v.pan.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <FinanceShell breadcrumbs={[{ label: "Taxation & KYC" }]}>
      <div className="flex flex-col gap-6">
        {/* Page Header */}
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
            GST, TDS & Vendor KYC
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage tax slabs, deduction sections, and vendor compliance records.
          </p>
        </div>

        {/* Split View - Tabs on mobile, side-by-side on desktop */}
        <div className="flex flex-col gap-6 lg:hidden">
          <Tabs defaultValue="gst" className="w-full">
            <TabsList className="w-full bg-card/30 backdrop-blur-sm">
              <TabsTrigger value="gst" className="flex-1 text-xs">GST Slabs</TabsTrigger>
              <TabsTrigger value="tds" className="flex-1 text-xs">TDS Sections</TabsTrigger>
              <TabsTrigger value="vendors" className="flex-1 text-xs">Vendors</TabsTrigger>
            </TabsList>
            <TabsContent value="gst" className="mt-4"><GSTSlabsCard /></TabsContent>
            <TabsContent value="tds" className="mt-4"><TDSSectionsCard /></TabsContent>
            <TabsContent value="vendors" className="mt-4">
              <VendorsCard
                search={search}
                setSearch={setSearch}
                vendors={filteredVendors}
                onAddVendor={() => setVendorDialogOpen(true)}
              />
            </TabsContent>
          </Tabs>
        </div>

        {/* Desktop split-view */}
        <div className="hidden gap-6 lg:grid lg:grid-cols-5">
          {/* Left: GST + TDS */}
          <div className="col-span-2 flex flex-col gap-4">
            <GSTSlabsCard />
            <TDSSectionsCard />
          </div>
          {/* Right: Vendors */}
          <div className="col-span-3">
            <VendorsCard
              search={search}
              setSearch={setSearch}
              vendors={filteredVendors}
              onAddVendor={() => setVendorDialogOpen(true)}
            />
          </div>
        </div>
      </div>

      {/* Add Vendor Dialog */}
      <Dialog open={vendorDialogOpen} onOpenChange={setVendorDialogOpen}>
        <DialogContent className="max-h-[85dvh] overflow-y-auto border-border/40 bg-card/95 backdrop-blur-2xl sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base">
              <Building2 className="size-4 text-primary" />
              Add Vendor
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4 pt-2">
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs text-muted-foreground">Vendor Name</Label>
              <Input placeholder="Company or individual name" className="border-border/50 bg-background/30" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <Label className="text-xs text-muted-foreground">PAN Number</Label>
                <Input placeholder="XXXXX0000X" className="border-border/50 bg-background/30 font-mono uppercase" />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label className="text-xs text-muted-foreground">GSTIN</Label>
                <Input placeholder="22XXXXX0000X1Z5" className="border-border/50 bg-background/30 font-mono uppercase" />
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs text-muted-foreground">Category</Label>
              <Select>
                <SelectTrigger className="border-border/50 bg-background/30"><SelectValue placeholder="Select category" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Transport">Transport</SelectItem>
                  <SelectItem value="Stationery">Stationery</SelectItem>
                  <SelectItem value="IT Services">IT Services</SelectItem>
                  <SelectItem value="Food Services">Food Services</SelectItem>
                  <SelectItem value="Construction">Construction</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="rounded-xl border border-border/30 bg-background/10 p-4">
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.15em] text-muted-foreground">Bank Details</p>
              <div className="flex flex-col gap-3">
                <Input placeholder="Bank Name" className="border-border/50 bg-background/30" />
                <div className="grid grid-cols-2 gap-3">
                  <Input placeholder="Account Number" className="border-border/50 bg-background/30 font-mono" />
                  <Input placeholder="IFSC Code" className="border-border/50 bg-background/30 font-mono uppercase" />
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setVendorDialogOpen(false)} className="border-border/50">Cancel</Button>
            <Button className="bg-primary hover:bg-primary/90">Save Vendor</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </FinanceShell>
  )
}

function GSTSlabsCard() {
  return (
    <Card className="border-border/40 bg-card/30 backdrop-blur-xl">
      <CardContent className="p-0">
        <div className="flex items-center justify-between border-b border-border/30 px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="flex size-7 items-center justify-center rounded-lg bg-amber-500/10">
              <Percent className="size-3.5 text-amber-500" />
            </div>
            <span className="text-sm font-semibold text-foreground">GST Slabs</span>
          </div>
          <Button variant="ghost" size="sm" className="h-7 text-xs text-primary">
            <Plus className="mr-1 size-3" />
            Add
          </Button>
        </div>
        <div className="flex flex-col divide-y divide-border/20">
          {GST_SLABS.map((slab) => (
            <div key={slab.id} className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-accent/20">
              <div className={cn(
                "flex size-10 shrink-0 items-center justify-center rounded-lg font-bold",
                slab.rate === 0 ? "bg-emerald-500/10 text-emerald-500" : "bg-amber-500/10 text-amber-500"
              )}>
                {slab.rate}%
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-foreground">{slab.description}</p>
                <p className="text-xs text-muted-foreground">HSN: {slab.hsn} &middot; {slab.items}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

function TDSSectionsCard() {
  return (
    <Card className="border-border/40 bg-card/30 backdrop-blur-xl">
      <CardContent className="p-0">
        <div className="flex items-center justify-between border-b border-border/30 px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="flex size-7 items-center justify-center rounded-lg bg-rose-500/10">
              <Receipt className="size-3.5 text-rose-500" />
            </div>
            <span className="text-sm font-semibold text-foreground">TDS Sections</span>
          </div>
        </div>
        <div className="flex flex-col divide-y divide-border/20">
          {TDS_SECTIONS.map((tds) => (
            <div key={tds.id} className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-accent/20">
              <Badge variant="outline" className="shrink-0 border-rose-500/30 bg-rose-500/5 font-mono text-xs text-rose-500">
                {tds.section}
              </Badge>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-foreground">{tds.description}</p>
                <p className="text-xs text-muted-foreground">Threshold: {tds.threshold}</p>
              </div>
              <span className="shrink-0 text-sm font-bold text-rose-500">{tds.rate}%</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

function VendorsCard({ search, setSearch, vendors, onAddVendor }: {
  search: string
  setSearch: (s: string) => void
  vendors: Vendor[]
  onAddVendor: () => void
}) {
  return (
    <Card className="border-border/40 bg-card/30 backdrop-blur-xl">
      <CardContent className="p-0">
        <div className="flex flex-col gap-3 border-b border-border/30 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <div className="flex size-7 items-center justify-center rounded-lg bg-primary/10">
              <Building2 className="size-3.5 text-primary" />
            </div>
            <span className="text-sm font-semibold text-foreground">Vendor KYC</span>
            <Badge variant="outline" className="border-border/50 text-[10px] text-muted-foreground">{vendors.length}</Badge>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative flex-1 sm:w-48 sm:flex-initial">
              <Search className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search vendors..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-8 border-border/50 bg-background/30 pl-8 text-sm"
              />
            </div>
            <Button size="sm" className="h-8 bg-primary hover:bg-primary/90" onClick={onAddVendor}>
              <Plus className="mr-1 size-3" />
              <span className="hidden sm:inline">Add</span>
            </Button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-border/30 hover:bg-transparent">
                <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Vendor</TableHead>
                <TableHead className="hidden text-xs font-semibold uppercase tracking-wider text-muted-foreground sm:table-cell">PAN</TableHead>
                <TableHead className="hidden text-xs font-semibold uppercase tracking-wider text-muted-foreground md:table-cell">GSTIN</TableHead>
                <TableHead className="hidden text-xs font-semibold uppercase tracking-wider text-muted-foreground lg:table-cell">Bank</TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {vendors.map((vendor) => (
                <TableRow key={vendor.id} className="border-border/20 transition-colors hover:bg-accent/20">
                  <TableCell>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-foreground">{vendor.name}</p>
                      <p className="text-xs text-muted-foreground sm:hidden">{vendor.pan}</p>
                    </div>
                  </TableCell>
                  <TableCell className="hidden font-mono text-xs text-muted-foreground sm:table-cell">{vendor.pan}</TableCell>
                  <TableCell className="hidden font-mono text-xs text-muted-foreground md:table-cell">{vendor.gstin || "N/A"}</TableCell>
                  <TableCell className="hidden text-xs text-muted-foreground lg:table-cell">{vendor.bankName}</TableCell>
                  <TableCell><StatusBadge status={vendor.status} /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
