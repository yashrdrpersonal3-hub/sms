import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { LucideIcon } from "lucide-react"
import {
  Megaphone,
  Target,
  TrendingUp,
  GraduationCap,
  Users,
  Briefcase,
  Contact,
  GitPullRequest,
  Inbox,
  LayoutDashboard,
  UserSearch,
  FolderOpen,
  IndianRupee,
  FileText,
  Receipt,
  Landmark,
  ShoppingCart,
  RotateCcw,
  AlertTriangle,
  CreditCard,
  Wallet,
  Banknote,
  BookOpen,
  ScrollText,
  BarChart3,
} from "lucide-react"

// ── Types ──────────────────────────────────────────
export interface SubModule {
  id: string
  name: string
  icon: LucideIcon
}

export interface SuperModule {
  id: string
  name: string
  icon: LucideIcon
  color: string
  subModules: SubModule[]
}

// ── Data ───────────────────────────────────────────
export const SUPER_MODULES: SuperModule[] = [
  {
    id: "crm",
    name: "CRM & Outreach",
    icon: Target,
    color: "text-sky-500",
    subModules: [
      { id: "campaigns", name: "Campaigns", icon: Megaphone },
      { id: "leads", name: "Leads", icon: TrendingUp },
    ],
  },
  {
    id: "student-lifecycle",
    name: "Student Lifecycle",
    icon: GraduationCap,
    color: "text-emerald-500",
    subModules: [
      { id: "students", name: "Student Directory", icon: Users },
    ],
  },
  {
    id: "hr-staff",
    name: "HR & Staff",
    icon: Briefcase,
    color: "text-amber-500",
    subModules: [
      { id: "staff-directory", name: "Staff Directory", icon: Contact },
      { id: "hiring-drive", name: "Hiring Drives", icon: UserSearch },
      { id: "applicant-pool", name: "Applicant Pool", icon: FolderOpen },
    ],
  },
  {
    id: "finance",
    name: "Finance & Billing",
    icon: IndianRupee,
    color: "text-emerald-500",
    subModules: [
      { id: "fin-dashboard", name: "Finance Dashboard", icon: IndianRupee },
      { id: "fee-plans", name: "Fee Plans", icon: FileText },
      { id: "taxation-kyc", name: "Taxation & KYC", icon: Receipt },
      { id: "chart-of-accounts", name: "Chart of Accounts", icon: Landmark },
      { id: "universal-pos", name: "Universal POS", icon: ShoppingCart },
      { id: "refunds", name: "Refunds", icon: RotateCcw },
      { id: "defaulters", name: "Defaulters", icon: AlertTriangle },
      { id: "vendor-payments", name: "Vendor Payments", icon: CreditCard },
      { id: "daily-economics", name: "Daily Economics", icon: Wallet },
      { id: "payroll-sync", name: "Payroll Sync", icon: Banknote },
      { id: "journal-entries", name: "Journal Entries", icon: BookOpen },
      { id: "audit-logs", name: "Audit Logs", icon: ScrollText },
      { id: "reports-export", name: "Reports & Export", icon: BarChart3 },
    ],
  },
  {
    id: "global-workflow",
    name: "Global Workflow",
    icon: GitPullRequest,
    color: "text-violet-500",
    subModules: [
      { id: "staff-360", name: "Staff 360", icon: LayoutDashboard },
      { id: "approval-inbox", name: "Approval Inbox", icon: Inbox },
    ],
  },
]

// ── Store ──────────────────────────────────────────
interface MenuState {
  pinnedModuleIds: string[]
  megaMenuOpen: boolean
  searchQuery: string
  togglePin: (moduleId: string) => void
  setMegaMenuOpen: (open: boolean) => void
  setSearchQuery: (query: string) => void
}

export const useMenuStore = create<MenuState>()(
  persist(
    (set, get) => ({
      pinnedModuleIds: ["campaigns", "leads", "students", "staff-directory", "hiring-drive", "applicant-pool", "staff-360"],
      megaMenuOpen: false,
      searchQuery: "",
      togglePin: (moduleId: string) => {
        const current = get().pinnedModuleIds
        if (current.includes(moduleId)) {
          set({ pinnedModuleIds: current.filter((id) => id !== moduleId) })
        } else {
          set({ pinnedModuleIds: [...current, moduleId] })
        }
      },
      setMegaMenuOpen: (open: boolean) => set({ megaMenuOpen: open }),
      setSearchQuery: (query: string) => set({ searchQuery: query }),
    }),
    {
      name: "grovehub-menu-storage",
      partialize: (state) => ({ pinnedModuleIds: state.pinnedModuleIds }),
    }
  )
)

// ── Helpers ────────────────────────────────────────
export function getSubModuleById(id: string): SubModule | undefined {
  for (const mod of SUPER_MODULES) {
    const found = mod.subModules.find((sub) => sub.id === id)
    if (found) return found
  }
  return undefined
}

export function getSuperModuleForSub(subId: string): SuperModule | undefined {
  return SUPER_MODULES.find((mod) => mod.subModules.some((sub) => sub.id === subId))
}
