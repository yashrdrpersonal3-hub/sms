"use client"

import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { DashboardHeader } from "@/components/dashboard/header"
import { MegaMenu } from "@/components/dashboard/mega-menu"
import { FinanceSidebar } from "@/components/finance/finance-sidebar"
import { useFinanceStore } from "@/stores/finance-store"
import { IndianRupee, PanelLeft } from "lucide-react"

export function FinanceShell({ children, breadcrumbs }: { children: React.ReactNode; breadcrumbs?: { label: string; href?: string }[] }) {
  const { setMobileSidebarOpen } = useFinanceStore()

  return (
    <div className="relative min-h-dvh overflow-hidden bg-background">
      {/* Ambient background orbs */}
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-32 -left-32 size-96 rounded-full bg-primary/[0.07] blur-[100px]" />
        <div className="absolute top-1/3 -right-24 size-80 rounded-full bg-emerald-500/[0.04] blur-[80px]" />
        <div className="absolute -bottom-40 left-1/3 size-72 rounded-full bg-primary/[0.04] blur-[100px]" />
      </div>

      {/* Desktop sidebar (hidden on mobile) */}
      <div className="hidden md:block">
        <DashboardSidebar />
      </div>

      {/* Header */}
      <DashboardHeader
        breadcrumbs={[
          { label: "Finance" },
          ...(breadcrumbs || []),
        ]}
      />

      {/* Finance sub-sidebar */}
      <FinanceSidebar />

      {/* Mobile finance nav toggle */}
      <button
        onClick={() => setMobileSidebarOpen(true)}
        className="fixed bottom-20 right-4 z-30 flex size-12 items-center justify-center rounded-full border border-border/40 bg-card/80 shadow-lg backdrop-blur-xl transition-all hover:bg-accent lg:hidden"
        aria-label="Open finance menu"
      >
        <PanelLeft className="size-5 text-primary" />
      </button>

      {/* Main content */}
      <main className="mt-14 p-4 md:ml-16 lg:ml-72 md:p-6">
        {children}
      </main>

      {/* Bottom nav on mobile */}
      <MegaMenu />
    </div>
  )
}
