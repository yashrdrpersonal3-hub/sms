"use client"

import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { FINANCE_SETUPS, FINANCE_APPS, useFinanceStore } from "@/stores/finance-store"
import type { FinanceNavGroup } from "@/stores/finance-store"
import { IndianRupee } from "lucide-react"

function NavGroup({ group, pathname, onNavigate }: { group: FinanceNavGroup; pathname: string; onNavigate: (href: string) => void }) {
  return (
    <div>
      <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground/70">
        {group.title}
      </p>
      <div className="flex flex-col gap-0.5">
        {group.items.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.href)}
              className={cn(
                "group flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-all",
                isActive
                  ? "bg-primary/15 text-primary shadow-sm shadow-primary/5"
                  : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
              )}
            >
              <Icon className={cn("size-4 shrink-0", isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} />
              <span className="truncate">{item.label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

function SidebarContent({ pathname, onNavigate }: { pathname: string; onNavigate: (href: string) => void }) {
  return (
    <ScrollArea className="flex-1">
      <div className="flex flex-col gap-6 p-4">
        <NavGroup group={FINANCE_SETUPS} pathname={pathname} onNavigate={onNavigate} />
        <Separator className="bg-border/30" />
        <NavGroup group={FINANCE_APPS} pathname={pathname} onNavigate={onNavigate} />
      </div>
    </ScrollArea>
  )
}

export function FinanceSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { mobileSidebarOpen, setMobileSidebarOpen } = useFinanceStore()

  const handleNavigate = (href: string) => {
    router.push(href)
    setMobileSidebarOpen(false)
  }

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex fixed left-16 top-14 z-20 h-[calc(100dvh-3.5rem)] w-56 flex-col border-r border-border/40 bg-card/30 backdrop-blur-xl">
        <div className="flex items-center gap-2 border-b border-border/30 px-4 py-3">
          <div className="flex size-7 items-center justify-center rounded-lg bg-emerald-500/15">
            <IndianRupee className="size-3.5 text-emerald-500" />
          </div>
          <span className="text-sm font-semibold text-foreground">Finance Engine</span>
        </div>
        <SidebarContent pathname={pathname} onNavigate={handleNavigate} />
      </aside>

      {/* Mobile sidebar as Sheet */}
      <Sheet open={mobileSidebarOpen} onOpenChange={setMobileSidebarOpen}>
        <SheetContent
          side="left"
          className="w-72 border-border/40 bg-card/90 p-0 backdrop-blur-2xl"
        >
          <SheetHeader className="border-b border-border/30 px-4 py-3">
            <SheetTitle className="flex items-center gap-2 text-sm">
              <div className="flex size-7 items-center justify-center rounded-lg bg-emerald-500/15">
                <IndianRupee className="size-3.5 text-emerald-500" />
              </div>
              Finance Engine
            </SheetTitle>
          </SheetHeader>
          <SidebarContent pathname={pathname} onNavigate={handleNavigate} />
        </SheetContent>
      </Sheet>
    </>
  )
}
