import { create } from "zustand"
import type { LucideIcon } from "lucide-react"
import {
  FileText,
  Receipt,
  Landmark,
  ShoppingCart,
  RotateCcw,
  AlertTriangle,
  CreditCard,
  Wallet,
  BookOpen,
  ScrollText,
  BarChart3,
  Calculator,
  Building2,
  TreePine,
  Fuel,
  Wrench,
  Banknote,
} from "lucide-react"

export interface FinanceNavItem {
  id: string
  label: string
  icon: LucideIcon
  href: string
}

export interface FinanceNavGroup {
  id: string
  title: string
  items: FinanceNavItem[]
}

export const FINANCE_SETUPS: FinanceNavGroup = {
  id: "setups",
  title: "Finance Setups",
  items: [
    { id: "fee-plans", label: "Fee Plans & Structures", icon: FileText, href: "/dashboard/finance/setups/fee-plans" },
    { id: "taxation-kyc", label: "Taxation & KYC", icon: Receipt, href: "/dashboard/finance/setups/taxation-and-kyc" },
    { id: "chart-of-accounts", label: "Chart of Accounts", icon: Landmark, href: "/dashboard/finance/setups/chart-of-accounts" },
  ],
}

export const FINANCE_APPS: FinanceNavGroup = {
  id: "apps",
  title: "Finance Apps",
  items: [
    { id: "pos", label: "Universal POS", icon: ShoppingCart, href: "/dashboard/finance/pos" },
    { id: "refunds", label: "Refunds & Adjustments", icon: RotateCcw, href: "/dashboard/finance/refunds" },
    { id: "defaulters", label: "Defaulters & Reminders", icon: AlertTriangle, href: "/dashboard/finance/defaulters" },
    { id: "payables", label: "Vendor Payments", icon: CreditCard, href: "/dashboard/finance/payables" },
    { id: "economics", label: "Daily Economics", icon: Wallet, href: "/dashboard/finance/economics" },
    { id: "payroll-sync", label: "Payroll Sync", icon: Banknote, href: "/dashboard/finance/payroll-sync" },
    { id: "journal-entries", label: "Journal Entries", icon: BookOpen, href: "/dashboard/finance/gl/journal-entries" },
    { id: "audit-logs", label: "Audit Logs", icon: ScrollText, href: "/dashboard/finance/gl/audit-logs" },
    { id: "reports", label: "Reports & Export", icon: BarChart3, href: "/dashboard/finance/reports" },
  ],
}

interface FinanceState {
  activeSection: string
  mobileSidebarOpen: boolean
  setActiveSection: (section: string) => void
  setMobileSidebarOpen: (open: boolean) => void
}

export const useFinanceStore = create<FinanceState>()((set) => ({
  activeSection: "fee-plans",
  mobileSidebarOpen: false,
  setActiveSection: (section: string) => set({ activeSection: section }),
  setMobileSidebarOpen: (open: boolean) => set({ mobileSidebarOpen: open }),
}))
