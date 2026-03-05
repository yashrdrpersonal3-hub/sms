"use client"

import { useState } from "react"
import { FinanceShell } from "@/components/finance/finance-shell"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Wallet, Plus, Receipt, Fuel, Bus, Wrench, Building2,
  Camera, IndianRupee, Calendar,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface PettyCashEntry {
  id: string
  date: string
  description: string
  amount: number
  category: string
  paidTo: string
  hasReceipt: boolean
}

interface FleetEntry {
  id: string
  date: string
  busNo: string
  fuelType: "Diesel" | "Petrol" | "CNG"
  litres: number
  amount: number
  odometer: number
  driver: string
}

interface MaintenanceLog {
  id: string
  date: string
  asset: string
  type: "Bus Repair" | "Building Repair" | "Workshop"
  description: string
  amount: number
  vendor: string
  status: "Completed" | "In Progress" | "Scheduled"
}

const MOCK_PETTY_CASH: PettyCashEntry[] = [
  { id: "PC-001", date: "2026-03-05", description: "Office stationery - pens and registers", amount: 850, category: "Stationery", paidTo: "Local Shop", hasReceipt: true },
  { id: "PC-002", date: "2026-03-05", description: "Drinking water cans (5x)", amount: 500, category: "Utilities", paidTo: "Water Supplier", hasReceipt: true },
  { id: "PC-003", date: "2026-03-04", description: "Auto-rickshaw for bank deposit", amount: 200, category: "Travel", paidTo: "Driver", hasReceipt: false },
  { id: "PC-004", date: "2026-03-04", description: "Emergency first aid supplies", amount: 1200, category: "Medical", paidTo: "Pharmacy", hasReceipt: true },
  { id: "PC-005", date: "2026-03-03", description: "Refreshments for parent-teacher meet", amount: 3500, category: "Events", paidTo: "Caterer", hasReceipt: true },
  { id: "PC-006", date: "2026-03-03", description: "Plumber repair - washroom", amount: 800, category: "Maintenance", paidTo: "Local Plumber", hasReceipt: false },
]

const MOCK_FLEET: FleetEntry[] = [
  { id: "FL-001", date: "2026-03-05", busNo: "DL-01-AB-1234", fuelType: "Diesel", litres: 80, amount: 7200, odometer: 124500, driver: "Ramesh" },
  { id: "FL-002", date: "2026-03-05", busNo: "DL-01-AB-5678", fuelType: "Diesel", litres: 65, amount: 5850, odometer: 98200, driver: "Suresh" },
  { id: "FL-003", date: "2026-03-04", busNo: "DL-01-AB-9012", fuelType: "CNG", litres: 40, amount: 3200, odometer: 67800, driver: "Mohan" },
  { id: "FL-004", date: "2026-03-04", busNo: "DL-01-AB-1234", fuelType: "Diesel", litres: 75, amount: 6750, odometer: 124200, driver: "Ramesh" },
  { id: "FL-005", date: "2026-03-03", busNo: "DL-01-AB-3456", fuelType: "Petrol", litres: 30, amount: 3150, odometer: 45600, driver: "Ajay" },
]

const MOCK_MAINTENANCE: MaintenanceLog[] = [
  { id: "ML-001", date: "2026-03-04", asset: "Bus DL-01-AB-1234", type: "Bus Repair", description: "Brake pad replacement - front axle", amount: 8500, vendor: "RK Motors", status: "Completed" },
  { id: "ML-002", date: "2026-03-03", asset: "Main Building - Block A", type: "Building Repair", description: "Waterproofing treatment - terrace", amount: 45000, vendor: "RK Construction", status: "In Progress" },
  { id: "ML-003", date: "2026-03-02", asset: "Bus DL-01-AB-5678", type: "Bus Repair", description: "AC compressor service", amount: 12000, vendor: "RK Motors", status: "Completed" },
  { id: "ML-004", date: "2026-03-01", asset: "Workshop", type: "Workshop", description: "Electrical panel upgrade", amount: 28000, vendor: "Delhi Electricals", status: "Scheduled" },
  { id: "ML-005", date: "2026-02-28", asset: "Bus DL-01-AB-9012", type: "Bus Repair", description: "Tyre replacement (2x rear)", amount: 16000, vendor: "Tyre World", status: "Completed" },
]

function formatINR(amount: number) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(amount)
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-IN", { month: "short", day: "numeric" })
}

export default function EconomicsPage() {
  return (
    <FinanceShell breadcrumbs={[{ label: "Daily Economics" }]}>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
            Daily Operations & Maintenance
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Fast-entry ledger for petty cash, fleet fuel, and maintenance tracking.
          </p>
        </div>

        <Tabs defaultValue="petty-cash" className="w-full">
          <TabsList className="w-full bg-card/30 backdrop-blur-sm sm:w-auto">
            <TabsTrigger value="petty-cash" className="flex-1 gap-1.5 text-xs sm:flex-initial">
              <Wallet className="size-3.5" /> Petty Cash
            </TabsTrigger>
            <TabsTrigger value="fleet" className="flex-1 gap-1.5 text-xs sm:flex-initial">
              <Fuel className="size-3.5" /> Fleet
            </TabsTrigger>
            <TabsTrigger value="maintenance" className="flex-1 gap-1.5 text-xs sm:flex-initial">
              <Wrench className="size-3.5" /> Maintenance
            </TabsTrigger>
          </TabsList>

          {/* Petty Cash Tab */}
          <TabsContent value="petty-cash" className="mt-4">
            <div className="flex flex-col gap-4">
              {/* Quick Entry */}
              <Card className="border-dashed border-primary/30 bg-primary/[0.03] backdrop-blur-xl">
                <CardContent className="p-4">
                  <p className="mb-3 text-xs font-bold uppercase tracking-[0.15em] text-muted-foreground">Quick Entry</p>
                  <div className="flex flex-col gap-3 sm:flex-row">
                    <Input placeholder="Description" className="flex-1 border-border/50 bg-background/30" />
                    <Input type="number" placeholder="Amount" className="w-full border-border/50 bg-background/30 sm:w-28" />
                    <Select>
                      <SelectTrigger className="w-full border-border/50 bg-background/30 sm:w-32"><SelectValue placeholder="Category" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Stationery">Stationery</SelectItem>
                        <SelectItem value="Utilities">Utilities</SelectItem>
                        <SelectItem value="Travel">Travel</SelectItem>
                        <SelectItem value="Medical">Medical</SelectItem>
                        <SelectItem value="Events">Events</SelectItem>
                        <SelectItem value="Maintenance">Maintenance</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input placeholder="Paid to" className="w-full border-border/50 bg-background/30 sm:w-32" />
                    <Button size="sm" className="bg-primary hover:bg-primary/90">
                      <Plus className="mr-1 size-3" /> Add
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Summary */}
              <div className="flex items-center justify-between rounded-xl border border-border/40 bg-card/30 px-4 py-3">
                <span className="text-sm font-medium text-muted-foreground">Today&apos;s Total</span>
                <span className="text-lg font-bold text-foreground">{formatINR(MOCK_PETTY_CASH.filter(e => e.date === "2026-03-05").reduce((s, e) => s + e.amount, 0))}</span>
              </div>

              {/* Table */}
              <Card className="border-border/40 bg-card/30 backdrop-blur-xl">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-border/30 hover:bg-transparent">
                        <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Date</TableHead>
                        <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Description</TableHead>
                        <TableHead className="hidden text-xs font-semibold uppercase tracking-wider text-muted-foreground sm:table-cell">Paid To</TableHead>
                        <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Amount</TableHead>
                        <TableHead className="hidden text-xs font-semibold uppercase tracking-wider text-muted-foreground md:table-cell">Receipt</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {MOCK_PETTY_CASH.map((entry) => (
                        <TableRow key={entry.id} className="border-border/20 transition-colors hover:bg-accent/20">
                          <TableCell className="text-xs text-muted-foreground">{formatDate(entry.date)}</TableCell>
                          <TableCell>
                            <div className="min-w-0">
                              <p className="truncate text-sm text-foreground">{entry.description}</p>
                              <Badge variant="outline" className="mt-0.5 border-border/30 text-[9px] text-muted-foreground">{entry.category}</Badge>
                            </div>
                          </TableCell>
                          <TableCell className="hidden text-sm text-muted-foreground sm:table-cell">{entry.paidTo}</TableCell>
                          <TableCell className="text-sm font-semibold text-rose-500">{formatINR(entry.amount)}</TableCell>
                          <TableCell className="hidden md:table-cell">
                            {entry.hasReceipt ? (
                              <Badge variant="outline" className="border-emerald-500/30 bg-emerald-500/10 text-[9px] text-emerald-500">Attached</Badge>
                            ) : (
                              <Badge variant="outline" className="border-border/30 text-[9px] text-muted-foreground">Missing</Badge>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </Card>
            </div>
          </TabsContent>

          {/* Fleet Economics Tab */}
          <TabsContent value="fleet" className="mt-4">
            <div className="flex flex-col gap-4">
              {/* Quick Entry */}
              <Card className="border-dashed border-primary/30 bg-primary/[0.03] backdrop-blur-xl">
                <CardContent className="p-4">
                  <p className="mb-3 text-xs font-bold uppercase tracking-[0.15em] text-muted-foreground">Fuel Entry</p>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6">
                    <Input placeholder="Bus No." className="border-border/50 bg-background/30" />
                    <Select>
                      <SelectTrigger className="border-border/50 bg-background/30"><SelectValue placeholder="Fuel" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Diesel">Diesel</SelectItem>
                        <SelectItem value="Petrol">Petrol</SelectItem>
                        <SelectItem value="CNG">CNG</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input type="number" placeholder="Litres" className="border-border/50 bg-background/30" />
                    <Input type="number" placeholder="Amount" className="border-border/50 bg-background/30" />
                    <Input type="number" placeholder="Odometer" className="border-border/50 bg-background/30" />
                    <Button className="bg-primary hover:bg-primary/90">
                      <Plus className="mr-1 size-3" /> Add
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border/40 bg-card/30 backdrop-blur-xl">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-border/30 hover:bg-transparent">
                        <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Date</TableHead>
                        <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Bus</TableHead>
                        <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Fuel</TableHead>
                        <TableHead className="hidden text-xs font-semibold uppercase tracking-wider text-muted-foreground sm:table-cell">Litres</TableHead>
                        <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Amount</TableHead>
                        <TableHead className="hidden text-xs font-semibold uppercase tracking-wider text-muted-foreground md:table-cell">Odometer</TableHead>
                        <TableHead className="hidden text-xs font-semibold uppercase tracking-wider text-muted-foreground md:table-cell">Driver</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {MOCK_FLEET.map((entry) => (
                        <TableRow key={entry.id} className="border-border/20 transition-colors hover:bg-accent/20">
                          <TableCell className="text-xs text-muted-foreground">{formatDate(entry.date)}</TableCell>
                          <TableCell className="font-mono text-sm text-foreground">{entry.busNo}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className={cn(
                              "text-[9px] font-semibold",
                              entry.fuelType === "Diesel" && "border-amber-500/30 text-amber-500",
                              entry.fuelType === "Petrol" && "border-rose-500/30 text-rose-500",
                              entry.fuelType === "CNG" && "border-emerald-500/30 text-emerald-500",
                            )}>
                              {entry.fuelType}
                            </Badge>
                          </TableCell>
                          <TableCell className="hidden text-sm text-muted-foreground sm:table-cell">{entry.litres}L</TableCell>
                          <TableCell className="text-sm font-semibold text-rose-500">{formatINR(entry.amount)}</TableCell>
                          <TableCell className="hidden font-mono text-xs text-muted-foreground md:table-cell">{entry.odometer.toLocaleString()} km</TableCell>
                          <TableCell className="hidden text-sm text-muted-foreground md:table-cell">{entry.driver}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </Card>
            </div>
          </TabsContent>

          {/* Maintenance Tab */}
          <TabsContent value="maintenance" className="mt-4">
            <div className="flex flex-col gap-4">
              <Card className="border-border/40 bg-card/30 backdrop-blur-xl">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-border/30 hover:bg-transparent">
                        <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Date</TableHead>
                        <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Asset</TableHead>
                        <TableHead className="hidden text-xs font-semibold uppercase tracking-wider text-muted-foreground sm:table-cell">Type</TableHead>
                        <TableHead className="hidden text-xs font-semibold uppercase tracking-wider text-muted-foreground md:table-cell">Description</TableHead>
                        <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Amount</TableHead>
                        <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {MOCK_MAINTENANCE.map((log) => (
                        <TableRow key={log.id} className="border-border/20 transition-colors hover:bg-accent/20">
                          <TableCell className="text-xs text-muted-foreground">{formatDate(log.date)}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                                {log.type === "Bus Repair" ? <Bus className="size-3.5 text-primary" /> : <Building2 className="size-3.5 text-primary" />}
                              </div>
                              <span className="truncate text-sm font-medium text-foreground">{log.asset}</span>
                            </div>
                          </TableCell>
                          <TableCell className="hidden sm:table-cell">
                            <Badge variant="outline" className="border-border/30 text-[9px] text-muted-foreground">{log.type}</Badge>
                          </TableCell>
                          <TableCell className="hidden max-w-[200px] truncate text-sm text-muted-foreground md:table-cell">{log.description}</TableCell>
                          <TableCell className="text-sm font-semibold text-rose-500">{formatINR(log.amount)}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className={cn(
                              "text-[10px] font-semibold uppercase",
                              log.status === "Completed" && "border-emerald-500/30 bg-emerald-500/10 text-emerald-500",
                              log.status === "In Progress" && "border-amber-500/30 bg-amber-500/10 text-amber-500",
                              log.status === "Scheduled" && "border-primary/30 bg-primary/10 text-primary",
                            )}>
                              {log.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </FinanceShell>
  )
}
