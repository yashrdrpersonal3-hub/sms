import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Finance Engine - GroveHub",
  description: "Institutional Finance, Billing & Economics Engine",
}

export default function FinanceLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
