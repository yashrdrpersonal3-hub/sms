"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import {
  ArrowLeft, Phone, Mail, MapPin, Briefcase, Wallet,
  Clock, GitPullRequest, Shield, Eye, FileText,
  Calendar, ChevronRight, X, ClipboardCheck, CircleDot,
  CheckCircle2, AlertCircle, Plus, Search, Filter,
  CreditCard, Download, GraduationCap, TrendingUp,
  AlertTriangle, CheckCircle, XCircle, UserPlus, Send,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { DashboardShell } from "@/components/dashboard/shell"
import { cn } from "@/lib/utils"
import { useToast } from "@/components/ui/use-toast"

/* ══════════════════════════════════════════════════════
   DEMO DATA
   ══════════════════════════════════════════════════════ */

const STAFF = {
  id: "st-001",
  name: "Mrs. Anita Sharma",
  empId: "EMP-001",
  photo: "AS",
  roles: ["Teacher"],
  empType: "Full-Time",
  department: "Academic",
  teacherCategory: "PGT",
  subject: "Mathematics",
  phone: "9876543001",
  email: "anita.sharma@school.edu",
  address: "B-12, Sector 8, Rewari, Haryana 123401",
  dob: "1986-03-15",
  gender: "Female",
  qualification: "M.Sc Mathematics, B.Ed",
  experience: "12 yrs",
  attendance: "present" as const,
  joinDate: "2020-04-01",
  createdBy: "Admin Office",
  shift: "General (8:00 AM - 4:00 PM)",
  reportingTo: "Mr. R.K. Sharma",
}

const PAYROLL = {
  ctc: "7,20,000",
  basic: "30,000",
  hra: "12,000",
  da: "6,000",
  gross: "60,000",
  pf: "3,600",
  profTax: "200",
  net: "56,200",
  bankAcc: "****4092",
  bankName: "State Bank of India",
}

const PAY_SLIPS = [
  { month: "Feb 2026", gross: 60000, deductions: 3800, net: 56200, status: "paid" as const },
  { month: "Jan 2026", gross: 60000, deductions: 3800, net: 56200, status: "paid" as const },
  { month: "Dec 2025", gross: 60000, deductions: 3800, net: 56200, status: "paid" as const },
  { month: "Nov 2025", gross: 58000, deductions: 3600, net: 54400, status: "paid" as const },
]

const LEAVE_BAL = [
  { type: "Casual Leave", total: 12, used: 5, pending: 1, color: "text-sky-500" },
  { type: "Sick Leave", total: 10, used: 3, pending: 0, color: "text-red-500" },
  { type: "Earned Leave", total: 15, used: 2, pending: 0, color: "text-emerald-500" },
  { type: "Comp Off", total: 4, used: 1, pending: 1, color: "text-amber-500" },
]

const QUICK_ACTIONS = [
  { id: "payslip", label: "Download Pay Slip", icon: CreditCard, color: "text-emerald-500", desc: "Latest salary slip" },
  { id: "leave", label: "Apply Leave", icon: Calendar, color: "text-sky-500", desc: "Submit leave request" },
  { id: "attendance", label: "My Attendance", icon: Clock, color: "text-amber-500", desc: "View attendance" },
  { id: "documents", label: "My Documents", icon: FileText, color: "text-violet-500", desc: "Certificates & IDs" },
  { id: "tax", label: "Tax Declaration", icon: Shield, color: "text-primary", desc: "IT declaration" },
  { id: "training", label: "Trainings", icon: GraduationCap, color: "text-pink-500", desc: "Learning modules" },
]

type TaskStatus = "upcoming" | "overdue" | "completed"
interface StaffTask {
  id: string; title: string; dueDate: string; status: TaskStatus
  module: string; link: string; assignedBy: string; assignedAt: string
}

const TASKS: StaffTask[] = [
  { id: "t1", title: "Submit Term 2 Grades for Class 9-A", dueDate: "2026-03-15", status: "upcoming", module: "Academic", link: "#", assignedBy: "Principal", assignedAt: "2026-03-01" },
  { id: "t2", title: "Complete Annual Appraisal Self-Review", dueDate: "2026-03-10", status: "upcoming", module: "HR", link: "#", assignedBy: "HR Admin", assignedAt: "2026-02-25" },
  { id: "t3", title: "Update Emergency Contact Details", dueDate: "2026-02-28", status: "overdue", module: "HR", link: "#", assignedBy: "System", assignedAt: "2026-02-15" },
  { id: "t4", title: "Attend Math Dept Meeting", dueDate: "2026-03-08", status: "upcoming", module: "Academic", link: "#", assignedBy: "HOD Math", assignedAt: "2026-03-02" },
  { id: "t5", title: "Submit Jan Attendance Report", dueDate: "2026-02-05", status: "completed", module: "HR", link: "#", assignedBy: "HR Admin", assignedAt: "2026-01-25" },
]

const TASK_STATUS_CFG: Record<TaskStatus, { label: string; cls: string; icon: typeof CheckCircle2 }> = {
  upcoming:  { label: "Upcoming",  cls: "border-sky-500/30 bg-sky-500/10 text-sky-500", icon: CircleDot },
  overdue:   { label: "Overdue",   cls: "border-red-500/30 bg-red-500/10 text-red-500", icon: AlertCircle },
  completed: { label: "Done",      cls: "border-emerald-500/30 bg-emerald-500/10 text-emerald-500", icon: CheckCircle2 },
}

/* ── Requests ── */
type ReqStatus = "pending" | "approved" | "rejected" | "in-review"
type ReqType = "leave" | "reimbursement" | "asset" | "onboarding" | "document"

interface Request {
  id: string; type: ReqType; title: string; status: ReqStatus
  submittedAt: string; updatedAt: string; approver: string
  description: string; currentStep: number; totalSteps: number
}

const TYPE_CFG: Record<ReqType, { label: string; icon: typeof FileText; color: string }> = {
  leave:         { label: "Leave",         icon: Calendar,   color: "text-sky-500" },
  reimbursement: { label: "Reimbursement", icon: CreditCard, color: "text-emerald-500" },
  asset:         { label: "Asset Request", icon: Briefcase,  color: "text-amber-500" },
  onboarding:    { label: "Onboarding",    icon: UserPlus,   color: "text-violet-500" },
  document:      { label: "Document",      icon: FileText,   color: "text-primary" },
}

const STATUS_CFG: Record<ReqStatus, { label: string; cls: string }> = {
  pending:     { label: "Pending",   cls: "border-amber-500/30 bg-amber-500/10 text-amber-500" },
  approved:    { label: "Approved",  cls: "border-emerald-500/30 bg-emerald-500/10 text-emerald-500" },
  rejected:    { label: "Rejected",  cls: "border-red-500/30 bg-red-500/10 text-red-500" },
  "in-review": { label: "In Review", cls: "border-sky-500/30 bg-sky-500/10 text-sky-500" },
}

const REQUESTS_SEED: Request[] = [
  { id: "r-1", type: "leave", title: "Casual Leave - 3 Days", status: "pending", submittedAt: "2026-03-01", updatedAt: "2026-03-01", approver: "Mrs. Sunita Verma", description: "Family function in Jaipur from 10 Mar to 12 Mar.", currentStep: 1, totalSteps: 3 },
  { id: "r-2", type: "reimbursement", title: "Travel Reimbursement - Field Visit", status: "approved", submittedAt: "2026-02-20", updatedAt: "2026-02-25", approver: "Mr. R.K. Sharma", description: "Visited 3 feeder schools. Bus + auto expenses.", currentStep: 3, totalSteps: 3 },
  { id: "r-3", type: "asset", title: "Laptop Replacement Request", status: "in-review", submittedAt: "2026-02-28", updatedAt: "2026-03-02", approver: "IT Admin", description: "Current laptop keyboard malfunctioning. Need replacement.", currentStep: 2, totalSteps: 4 },
  { id: "r-4", type: "leave", title: "Sick Leave - 1 Day", status: "rejected", submittedAt: "2026-02-15", updatedAt: "2026-02-16", approver: "Mrs. Sunita Verma", description: "Fever and cold. Visited doctor.", currentStep: 2, totalSteps: 3 },
  { id: "r-5", type: "document", title: "Salary Certificate Request", status: "approved", submittedAt: "2026-02-10", updatedAt: "2026-02-12", approver: "HR Admin", description: "Needed for home loan application.", currentStep: 3, totalSteps: 3 },
  { id: "r-6", type: "reimbursement", title: "Medical Reimbursement - OPD", status: "pending", submittedAt: "2026-03-03", updatedAt: "2026-03-03", approver: "Mrs. Sunita Verma", description: "OPD visit for eye checkup.", currentStep: 1, totalSteps: 3 },
]

/* ── Attendance ── */
type AttStatus = "present" | "absent" | "late" | "holiday" | "half-day"
interface AttEntry { date: string; day: string; in: string; out: string; status: AttStatus; hours: string }

const ATT_STATUS_CFG: Record<AttStatus, { label: string; cls: string; dot: string }> = {
  present:  { label: "Present",  cls: "border-emerald-500/30 bg-emerald-500/10 text-emerald-500", dot: "bg-emerald-500" },
  absent:   { label: "Absent",   cls: "border-red-500/30 bg-red-500/10 text-red-500", dot: "bg-red-500" },
  late:     { label: "Late",     cls: "border-amber-500/30 bg-amber-500/10 text-amber-500", dot: "bg-amber-500" },
  holiday:  { label: "Holiday",  cls: "border-sky-500/30 bg-sky-500/10 text-sky-500", dot: "bg-sky-500" },
  "half-day": { label: "Half Day", cls: "border-orange-500/30 bg-orange-500/10 text-orange-500", dot: "bg-orange-500" },
}

const WEEKLY_ATT: AttEntry[] = [
  { date: "2026-03-02", day: "Mon", in: "7:55 AM", out: "4:02 PM", status: "present", hours: "8h 7m" },
  { date: "2026-03-03", day: "Tue", in: "8:10 AM", out: "4:15 PM", status: "present", hours: "8h 5m" },
  { date: "2026-03-04", day: "Wed", in: "7:50 AM", out: "4:00 PM", status: "present", hours: "8h 10m" },
  { date: "2026-03-05", day: "Thu", in: "-", out: "-", status: "absent", hours: "-" },
  { date: "2026-03-06", day: "Fri", in: "-", out: "-", status: "holiday", hours: "-" },
  { date: "2026-03-07", day: "Sat", in: "9:20 AM", out: "1:10 PM", status: "half-day", hours: "3h 50m" },
  { date: "2026-03-08", day: "Sun", in: "-", out: "-", status: "holiday", hours: "-" },
]

function generateMonthlyAtt(): AttEntry[] {
  const statuses: AttStatus[] = ["present", "present", "present", "present", "late", "absent", "holiday", "half-day", "present", "present"]
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
  return Array.from({ length: 31 }, (_, i) => {
    const d = i + 1
    const dateObj = new Date(2026, 2, d)
    const dayName = days[dateObj.getDay()]
    const st = dayName === "Sun" ? "holiday" : statuses[i % statuses.length]
    return {
      date: `2026-03-${String(d).padStart(2, "0")}`,
      day: dayName,
      in: st === "present" || st === "late" ? "8:00 AM" : st === "half-day" ? "9:00 AM" : "-",
      out: st === "present" ? "4:00 PM" : st === "late" ? "4:10 PM" : st === "half-day" ? "1:00 PM" : "-",
      status: st,
      hours: st === "present" ? "8h" : st === "late" ? "7h 30m" : st === "half-day" ? "4h" : "-",
    }
  })
}

const MONTHLY_ATT = generateMonthlyAtt()

const YEARLY_ATT = [
  { month: "Apr 2025", present: 22, absent: 2, late: 1, holiday: 5, total: 30 },
  { month: "May 2025", present: 20, absent: 3, late: 2, holiday: 6, total: 31 },
  { month: "Jun 2025", present: 18, absent: 1, late: 0, holiday: 11, total: 30 },
  { month: "Jul 2025", present: 23, absent: 2, late: 1, holiday: 5, total: 31 },
  { month: "Aug 2025", present: 21, absent: 3, late: 2, holiday: 5, total: 31 },
  { month: "Sep 2025", present: 20, absent: 1, late: 1, holiday: 8, total: 30 },
  { month: "Oct 2025", present: 19, absent: 2, late: 3, holiday: 7, total: 31 },
  { month: "Nov 2025", present: 22, absent: 1, late: 0, holiday: 7, total: 30 },
  { month: "Dec 2025", present: 16, absent: 2, late: 1, holiday: 12, total: 31 },
  { month: "Jan 2026", present: 22, absent: 2, late: 1, holiday: 6, total: 31 },
  { month: "Feb 2026", present: 20, absent: 1, late: 2, holiday: 5, total: 28 },
  { month: "Mar 2026", present: 4, absent: 1, late: 0, holiday: 0, total: 5 },
]

/* ── Announcements ── */
const ANNOUNCEMENTS = [
  { id: "1", title: "Annual Sports Day - 15 Mar", type: "event", date: "2026-03-05" },
  { id: "2", title: "Salary credited for Feb 2026", type: "payroll", date: "2026-03-01" },
  { id: "3", title: "PF Contribution Updated - Check Payslip", type: "hr", date: "2026-02-28" },
]

/* ── Audit Log ── */
const AUDIT_LOG = [
  { id: "a1", date: "2026-03-01", module: "HR" as const, event: "Marked present via biometric at 07:52 AM", actor: "System" },
  { id: "a2", date: "2026-02-28", module: "HR" as const, event: "Applied for Casual Leave (5-7 Mar)", actor: "Self" },
  { id: "a3", date: "2026-02-20", module: "Finance" as const, event: "Travel reimbursement approved - Rs 2,400", actor: "Mr. Rao (Finance)" },
  { id: "a4", date: "2026-02-15", module: "Academic" as const, event: "Assigned as Class Teacher for 9-A", actor: "Principal" },
  { id: "a5", date: "2026-02-14", module: "HR" as const, event: "Sick Leave approved (1 day)", actor: "Mr. Kumar (HR)" },
  { id: "a6", date: "2026-02-01", module: "Finance" as const, event: "February salary processed - Net Rs 56,200", actor: "System" },
]

const MODULE_COLORS: Record<string, { bg: string; text: string; dot: string }> = {
  HR: { bg: "bg-amber-500/10", text: "text-amber-500", dot: "bg-amber-500" },
  Finance: { bg: "bg-emerald-500/10", text: "text-emerald-500", dot: "bg-emerald-500" },
  Academic: { bg: "bg-violet-500/10", text: "text-violet-500", dot: "bg-violet-500" },
  Transport: { bg: "bg-sky-500/10", text: "text-sky-500", dot: "bg-sky-500" },
}

/* ══════════════════════════════════════════════════════
   PAGE COMPONENT
   ══════════════════════════════════════════════════════ */

export default function Staff360Page() {
  const router = useRouter()
  const { toast } = useToast()

  /* Sheet states */
  const [payrollOpen, setPayrollOpen] = useState(false)
  const [tasksOpen, setTasksOpen] = useState(false)
  const [paySlipOpen, setPaySlipOpen] = useState(false)
  const [newReqOpen, setNewReqOpen] = useState(false)
  const [detailReq, setDetailReq] = useState<Request | null>(null)

  /* Request filters */
  const [reqSearch, setReqSearch] = useState("")
  const [reqStatusFilter, setReqStatusFilter] = useState<ReqStatus | "all">("all")
  const [reqTypeFilter, setReqTypeFilter] = useState<ReqType | "all">("all")

  /* Attendance view */
  const [attView, setAttView] = useState<"weekly" | "monthly" | "yearly">("weekly")

  /* New Request form */
  const [newReqType, setNewReqType] = useState<ReqType | "">("")

  const filteredRequests = useMemo(() => {
    return REQUESTS_SEED.filter(r => {
      if (reqStatusFilter !== "all" && r.status !== reqStatusFilter) return false
      if (reqTypeFilter !== "all" && r.type !== reqTypeFilter) return false
      if (reqSearch && !r.title.toLowerCase().includes(reqSearch.toLowerCase())) return false
      return true
    })
  }, [reqSearch, reqStatusFilter, reqTypeFilter])

  const overdueTasks = TASKS.filter(t => t.status === "overdue").length
  const upcomingTasks = TASKS.filter(t => t.status === "upcoming").length
  const pendingReqs = REQUESTS_SEED.filter(r => r.status === "pending").length
  const inReviewReqs = REQUESTS_SEED.filter(r => r.status === "in-review").length
  const approvedReqs = REQUESTS_SEED.filter(r => r.status === "approved").length

  function handleSubmitRequest() {
    toast({ title: "Request Submitted", description: `Your ${newReqType} request has been submitted for review.` })
    setNewReqOpen(false)
    setNewReqType("")
  }

  return (
    <DashboardShell>
      <div className="flex flex-col gap-4 pb-8">

        {/* ── Back ── */}
        <button onClick={() => router.push("/dashboard/hr/staff")} className="flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground self-start">
          <ArrowLeft className="size-3.5" />Back to Directory
        </button>

        {/* ══════════════════════════════════════════
            IDENTITY HEADER + NEW REQUEST BUTTON
            ══════════════════════════════════════════ */}
        <div className="rounded-2xl border border-border/40 bg-card/60 p-4 shadow-2xl backdrop-blur-2xl sm:p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-5">
            <div className="flex size-16 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-xl font-bold text-primary sm:size-20 sm:text-2xl">
              {STAFF.photo}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <h1 className="truncate text-lg font-bold text-foreground sm:text-xl">{STAFF.name}</h1>
                  <p className="text-xs text-muted-foreground">{STAFF.empId} &middot; {STAFF.department}</p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <div className="flex items-center gap-1.5">
                    <div className="size-2 rounded-full bg-emerald-500" />
                    <span className="text-xs font-medium text-emerald-500">Present Today</span>
                  </div>
                  <Button size="sm" onClick={() => setNewReqOpen(true)} className="gap-1.5 shadow-md shadow-primary/20 text-xs">
                    <Plus className="size-3.5" />New Request
                  </Button>
                </div>
              </div>
              <div className="mt-3 flex flex-wrap gap-1.5">
                <Badge variant="outline" className="border-sky-500/30 text-[10px] text-sky-500">Teacher</Badge>
                <Badge variant="outline" className="border-primary/30 text-[10px] text-primary">{STAFF.teacherCategory}</Badge>
                <Badge variant="outline" className="border-amber-500/30 text-[10px] text-amber-500">{STAFF.subject}</Badge>
                <Badge variant="outline" className="border-border/40 text-[10px] text-muted-foreground">{STAFF.empType}</Badge>
                <Badge variant="outline" className="border-border/40 text-[10px] text-muted-foreground">{STAFF.experience}</Badge>
              </div>
              <div className="mt-3 flex flex-col gap-1.5 text-[11px] text-muted-foreground sm:flex-row sm:items-center sm:gap-4">
                <span className="flex items-center gap-1"><Phone className="size-3" />{STAFF.phone}</span>
                <span className="flex items-center gap-1"><Mail className="size-3" />{STAFF.email}</span>
                <span className="flex items-center gap-1"><Calendar className="size-3" />Joined {STAFF.joinDate}</span>
              </div>
            </div>
          </div>
          <p className="mt-3 border-t border-border/20 pt-2 text-[10px] text-muted-foreground/60">
            Reports to {STAFF.reportingTo} &middot; Shift: {STAFF.shift} &middot; Onboarded by {STAFF.createdBy} on {STAFF.joinDate}
          </p>
        </div>

        {/* ══════════════════════════════════════════
            QUICK ACTIONS
            ══════════════════════════════════════════ */}
        <div>
          <p className="mb-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Quick Actions</p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {QUICK_ACTIONS.map(a => {
              const Icon = a.icon
              return (
                <button
                  key={a.id}
                  onClick={() => {
                    if (a.id === "payslip") setPaySlipOpen(true)
                    if (a.id === "leave") { setNewReqType("leave"); setNewReqOpen(true) }
                  }}
                  className="flex flex-col items-center gap-2 rounded-2xl border border-border/40 bg-card/60 p-3 shadow-2xl backdrop-blur-2xl transition-all hover:border-primary/30 hover:bg-card/80 sm:p-4"
                >
                  <div className={cn("flex size-10 items-center justify-center rounded-xl", a.color.replace("text-", "bg-").replace("500", "500/10"))}>
                    <Icon className={cn("size-5", a.color)} />
                  </div>
                  <span className="text-center text-xs font-semibold text-foreground">{a.label}</span>
                  <span className="hidden text-center text-[10px] text-muted-foreground sm:block">{a.desc}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* ══════════════════════════════════════════
            BENTO GRID: Tasks + Compensation
            ══════════════════════════════════════════ */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {/* Tasks */}
          <button onClick={() => setTasksOpen(true)} className="group rounded-2xl border border-border/40 bg-card/60 p-4 text-left shadow-2xl backdrop-blur-2xl transition-all hover:border-primary/30 hover:bg-primary/5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="flex size-8 items-center justify-center rounded-lg bg-sky-500/10">
                  <ClipboardCheck className="size-4 text-sky-500" />
                </div>
                <p className="text-xs font-semibold text-foreground">Tasks & Dues</p>
              </div>
              <div className="flex items-center gap-2">
                {overdueTasks > 0 && (
                  <Badge variant="outline" className="border-red-500/30 bg-red-500/10 text-[9px] text-red-500">{overdueTasks} overdue</Badge>
                )}
                <ChevronRight className="size-4 text-muted-foreground/40 transition-transform group-hover:translate-x-0.5" />
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              {TASKS.filter(t => t.status !== "completed").slice(0, 3).map(t => {
                const cfg = TASK_STATUS_CFG[t.status]
                return (
                  <div key={t.id} className="flex items-center justify-between gap-2">
                    <span className="truncate text-[11px] text-muted-foreground">{t.title}</span>
                    <Badge variant="outline" className={cn("ml-2 shrink-0 text-[9px]", cfg.cls)}>{t.dueDate.slice(5)}</Badge>
                  </div>
                )
              })}
              {upcomingTasks > 3 && <p className="text-[10px] text-muted-foreground/50">+{upcomingTasks - 3} more...</p>}
            </div>
          </button>

          {/* Compensation */}
          <button onClick={() => setPayrollOpen(true)} className="group rounded-2xl border border-border/40 bg-card/60 p-4 text-left shadow-2xl backdrop-blur-2xl transition-all hover:border-primary/30 hover:bg-primary/5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="flex size-8 items-center justify-center rounded-lg bg-emerald-500/10">
                  <Wallet className="size-4 text-emerald-500" />
                </div>
                <p className="text-xs font-semibold text-foreground">Compensation</p>
              </div>
              <ChevronRight className="size-4 text-muted-foreground/40 transition-transform group-hover:translate-x-0.5" />
            </div>
            <div className="flex flex-col gap-1">
              <div className="flex items-baseline justify-between">
                <span className="text-[11px] text-muted-foreground">Net Payable</span>
                <span className="text-sm font-bold text-foreground">Rs {PAYROLL.net}</span>
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-[11px] text-muted-foreground">CTC</span>
                <span className="text-xs text-muted-foreground">Rs {PAYROLL.ctc}</span>
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-[11px] text-muted-foreground">Bank</span>
                <span className="text-xs text-muted-foreground">{PAYROLL.bankName} {PAYROLL.bankAcc}</span>
              </div>
            </div>
          </button>
        </div>

        {/* ══════════════════════════════════════════
            LEAVE BALANCE + RECENT PAYROLL
            ══════════════════════════════════════════ */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {/* Leave Balance */}
          <div className="rounded-2xl border border-border/40 bg-card/60 p-4 shadow-2xl backdrop-blur-2xl">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Leave Balance</p>
              <Badge variant="outline" className="text-[10px] border-border/30">FY 2025-26</Badge>
            </div>
            <div className="flex flex-col gap-3">
              {LEAVE_BAL.map(l => {
                const remaining = l.total - l.used - l.pending
                const pct = (l.used / l.total) * 100
                return (
                  <div key={l.type} className="flex flex-col gap-1.5 rounded-xl border border-border/30 bg-background/30 p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-foreground">{l.type}</span>
                      <span className="text-xs font-bold text-foreground">{remaining}<span className="font-normal text-muted-foreground">/{l.total}</span></span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-border/30">
                      <div className={cn("h-full rounded-full", l.color.replace("text-", "bg-"))} style={{ width: `${pct}%` }} />
                    </div>
                    <div className="flex items-center gap-3 text-[10px] text-muted-foreground/70">
                      <span>Used: {l.used}</span>
                      {l.pending > 0 && <span className="text-amber-500">Pending: {l.pending}</span>}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Recent Payroll */}
          <div className="rounded-2xl border border-border/40 bg-card/60 p-4 shadow-2xl backdrop-blur-2xl">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Recent Payroll</p>
              <button onClick={() => setPaySlipOpen(true)} className="text-[10px] font-medium text-primary hover:underline">View All</button>
            </div>
            <div className="flex flex-col gap-3">
              {PAY_SLIPS.slice(0, 3).map(p => (
                <div key={p.month} className="flex items-center justify-between rounded-xl border border-border/30 bg-background/30 p-3">
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-foreground">{p.month}</p>
                    <p className="text-[10px] text-muted-foreground">Gross: Rs.{p.gross.toLocaleString("en-IN")} | Ded: Rs.{p.deductions.toLocaleString("en-IN")}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-sm font-bold text-emerald-500">Rs.{p.net.toLocaleString("en-IN")}</span>
                    <button className="rounded-md p-1 hover:bg-accent"><Download className="size-3.5 text-muted-foreground" /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════════
            MY REQUESTS (INLINE)
            ══════════════════════════════════════════ */}
        <div className="rounded-2xl border border-border/40 bg-card/60 p-4 shadow-2xl backdrop-blur-2xl">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">My Requests</p>
            <Button size="sm" variant="outline" onClick={() => setNewReqOpen(true)} className="gap-1.5 text-[10px] h-7 border-border/50">
              <Plus className="size-3" />New
            </Button>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            <StatCard label="Pending" value={pendingReqs} icon={Clock} accent="text-amber-500" />
            <StatCard label="In Review" value={inReviewReqs} icon={AlertTriangle} accent="text-sky-500" />
            <StatCard label="Approved" value={approvedReqs} icon={CheckCircle} accent="text-emerald-500" />
          </div>

          {/* Search + Filters */}
          <div className="flex flex-col gap-3 mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
              <input
                value={reqSearch}
                onChange={e => setReqSearch(e.target.value)}
                placeholder="Search requests..."
                className="w-full rounded-xl border border-border/50 bg-background/80 py-2 pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary/60 focus:outline-none focus:ring-1 focus:ring-primary/30"
              />
            </div>
            <div className="flex flex-wrap gap-1.5">
              {(["all", "pending", "in-review", "approved", "rejected"] as const).map(s => (
                <button
                  key={s}
                  onClick={() => setReqStatusFilter(s)}
                  className={cn(
                    "rounded-lg px-2.5 py-1 text-[11px] font-medium transition-all",
                    reqStatusFilter === s ? "bg-primary/10 text-primary ring-1 ring-primary/30" : "bg-muted/30 text-muted-foreground hover:bg-muted/50"
                  )}
                >
                  {s === "all" ? "All" : s === "in-review" ? "In Review" : s.charAt(0).toUpperCase() + s.slice(1)}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap gap-1.5">
              {(["all", ...Object.keys(TYPE_CFG)] as (ReqType | "all")[]).map(t => (
                <button
                  key={t}
                  onClick={() => setReqTypeFilter(t)}
                  className={cn(
                    "flex items-center gap-1 rounded-lg px-2.5 py-1 text-[11px] font-medium transition-all",
                    reqTypeFilter === t ? "bg-primary/10 text-primary ring-1 ring-primary/30" : "bg-muted/30 text-muted-foreground hover:bg-muted/50"
                  )}
                >
                  {t !== "all" && (() => { const I = TYPE_CFG[t].icon; return <I className="size-3" /> })()}
                  {t === "all" ? "All Types" : TYPE_CFG[t].label}
                </button>
              ))}
            </div>
          </div>

          {/* Request list */}
          <div className="flex flex-col gap-3">
            {filteredRequests.length === 0 && (
              <div className="flex flex-col items-center gap-2 py-10 text-center">
                <GitPullRequest className="size-8 text-muted-foreground/30" />
                <p className="text-sm text-muted-foreground">No requests found</p>
              </div>
            )}
            {filteredRequests.map(r => {
              const cfg = TYPE_CFG[r.type]
              const stCfg = STATUS_CFG[r.status]
              const Icon = cfg.icon
              return (
                <button
                  key={r.id}
                  onClick={() => setDetailReq(r)}
                  className="group flex flex-col gap-2 rounded-xl border border-border/30 bg-background/30 p-3 text-left transition-all hover:border-primary/30 hover:bg-primary/5 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex items-start gap-3 min-w-0 flex-1">
                    <div className={cn("flex size-9 shrink-0 items-center justify-center rounded-lg", cfg.color.replace("text-", "bg-").replace("500", "500/10"))}>
                      <Icon className={cn("size-4", cfg.color)} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="truncate text-sm font-medium text-foreground">{r.title}</p>
                        <Badge variant="outline" className={cn("text-[10px] shrink-0", stCfg.cls)}>{stCfg.label}</Badge>
                      </div>
                      <p className="mt-0.5 truncate text-[11px] text-muted-foreground">{r.description}</p>
                      <div className="mt-1 flex flex-wrap items-center gap-3 text-[10px] text-muted-foreground/70">
                        <span className="flex items-center gap-1"><Calendar className="size-3" />{r.submittedAt}</span>
                        <span>Approver: {r.approver}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0 sm:flex-col sm:items-end sm:gap-1">
                    <div className="flex items-center gap-1">
                      {Array.from({ length: r.totalSteps }).map((_, i) => (
                        <div key={i} className={cn("h-1.5 w-4 rounded-full", i < r.currentStep ? "bg-primary" : "bg-border/40")} />
                      ))}
                    </div>
                    <span className="text-[10px] text-muted-foreground">Step {r.currentStep}/{r.totalSteps}</span>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* ══════════════════════════════════════════
            ATTENDANCE (Weekly / Monthly / Yearly)
            ══════════════════════════════════════════ */}
        <div className="rounded-2xl border border-border/40 bg-card/60 p-4 shadow-2xl backdrop-blur-2xl">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Attendance</p>
            <div className="flex gap-1">
              {(["weekly", "monthly", "yearly"] as const).map(v => (
                <button
                  key={v}
                  onClick={() => setAttView(v)}
                  className={cn(
                    "rounded-lg px-3 py-1.5 text-[11px] font-medium transition-all",
                    attView === v ? "bg-primary/10 text-primary ring-1 ring-primary/30" : "bg-muted/30 text-muted-foreground hover:bg-muted/50"
                  )}
                >
                  {v.charAt(0).toUpperCase() + v.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Legend */}
          <div className="mb-4 flex flex-wrap gap-3">
            {Object.entries(ATT_STATUS_CFG).map(([key, cfg]) => (
              <div key={key} className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                <div className={cn("size-2.5 rounded-full", cfg.dot)} />
                {cfg.label}
              </div>
            ))}
          </div>

          {/* Weekly view */}
          {attView === "weekly" && (
            <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
              {WEEKLY_ATT.map(entry => {
                const st = ATT_STATUS_CFG[entry.status]
                return (
                  <div key={entry.date} className="flex flex-col items-center gap-1 rounded-xl border border-border/30 bg-background/30 py-2 sm:py-3">
                    <span className="text-[10px] text-muted-foreground">{entry.day}</span>
                    <div className={cn("size-3 rounded-full sm:size-4", st.dot)} title={st.label} />
                    <span className="text-[8px] text-muted-foreground sm:text-[10px]">{entry.in !== "-" ? entry.in : ""}</span>
                  </div>
                )
              })}
            </div>
          )}

          {/* Monthly view */}
          {attView === "monthly" && (
            <div>
              <p className="mb-3 text-xs font-medium text-foreground">March 2026</p>
              {/* Summary */}
              <div className="mb-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
                {[
                  { label: "Present", count: MONTHLY_ATT.filter(d => d.status === "present").length, color: "text-emerald-500" },
                  { label: "Absent", count: MONTHLY_ATT.filter(d => d.status === "absent").length, color: "text-red-500" },
                  { label: "Late", count: MONTHLY_ATT.filter(d => d.status === "late").length, color: "text-amber-500" },
                  { label: "Holiday", count: MONTHLY_ATT.filter(d => d.status === "holiday").length, color: "text-sky-500" },
                ].map(s => (
                  <div key={s.label} className="flex items-center gap-2 rounded-lg border border-border/30 bg-background/30 p-2">
                    <span className={cn("text-lg font-bold", s.color)}>{s.count}</span>
                    <span className="text-[11px] text-muted-foreground">{s.label}</span>
                  </div>
                ))}
              </div>
              {/* Calendar grid */}
              <div className="grid grid-cols-7 gap-1">
                {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
                  <div key={`h-${i}`} className="py-1 text-center text-[10px] font-medium text-muted-foreground">{d}</div>
                ))}
                {/* Offset for first day of month (March 2026 starts on Sunday = 0) */}
                {MONTHLY_ATT.map(entry => {
                  const st = ATT_STATUS_CFG[entry.status]
                  const dayNum = parseInt(entry.date.slice(-2))
                  return (
                    <div
                      key={entry.date}
                      className="flex flex-col items-center gap-0.5 rounded-lg border border-border/20 bg-background/20 p-1 sm:p-1.5"
                      title={`${entry.date} - ${st.label}`}
                    >
                      <span className="text-[10px] text-foreground">{dayNum}</span>
                      <div className={cn("size-2 rounded-full sm:size-2.5", st.dot)} />
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Yearly view */}
          {attView === "yearly" && (
            <div>
              <p className="mb-3 text-xs font-medium text-foreground">FY 2025-26</p>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {YEARLY_ATT.map(m => {
                  const pct = Math.round((m.present / m.total) * 100)
                  return (
                    <div key={m.month} className="rounded-xl border border-border/30 bg-background/30 p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium text-foreground">{m.month}</span>
                        <span className={cn("text-sm font-bold", pct >= 90 ? "text-emerald-500" : pct >= 75 ? "text-amber-500" : "text-red-500")}>{pct}%</span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-border/30 mb-2">
                        <div className={cn("h-full rounded-full", pct >= 90 ? "bg-emerald-500" : pct >= 75 ? "bg-amber-500" : "bg-red-500")} style={{ width: `${pct}%` }} />
                      </div>
                      <div className="flex flex-wrap gap-2 text-[10px] text-muted-foreground">
                        <span className="text-emerald-500">{m.present}P</span>
                        <span className="text-red-500">{m.absent}A</span>
                        <span className="text-amber-500">{m.late}L</span>
                        <span className="text-sky-500">{m.holiday}H</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>

        {/* ══════════════════════════════════════════
            ANNOUNCEMENTS
            ══════════════════════════════════════════ */}
        <div className="rounded-2xl border border-border/40 bg-card/60 p-4 shadow-2xl backdrop-blur-2xl">
          <p className="mb-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Announcements</p>
          <div className="flex flex-col gap-2">
            {ANNOUNCEMENTS.map(a => (
              <div key={a.id} className="flex items-center gap-3 rounded-xl border border-border/30 bg-background/30 px-3 py-2.5">
                <div className={cn(
                  "flex size-8 shrink-0 items-center justify-center rounded-lg",
                  a.type === "event" ? "bg-violet-500/10" : a.type === "payroll" ? "bg-emerald-500/10" : "bg-sky-500/10"
                )}>
                  {a.type === "event" ? <Calendar className="size-4 text-violet-500" /> : a.type === "payroll" ? <CreditCard className="size-4 text-emerald-500" /> : <AlertTriangle className="size-4 text-sky-500" />}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-medium text-foreground">{a.title}</p>
                  <p className="text-[10px] text-muted-foreground">{a.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ══════════════════════════════════════════
            QUALIFICATIONS
            ══════════════════════════════════════════ */}
        <div className="rounded-2xl border border-border/40 bg-card/60 p-4 shadow-2xl backdrop-blur-2xl">
          <div className="flex items-center gap-2 mb-3">
            <div className="flex size-8 items-center justify-center rounded-lg bg-violet-500/10">
              <Shield className="size-4 text-violet-500" />
            </div>
            <p className="text-xs font-semibold text-foreground">Qualifications</p>
          </div>
          <div className="flex flex-col gap-1.5">
            <InfoRow label="Qualification" value={STAFF.qualification} />
            <InfoRow label="DOB" value={STAFF.dob} />
            <InfoRow label="Gender" value={STAFF.gender} />
            <InfoRow label="Address" value={STAFF.address} />
          </div>
        </div>

        {/* ══════════════════════════════════════════
            OMNI-AUDIT LOG
            ══════════════════════════════════════════ */}
        <div className="rounded-2xl border border-border/40 bg-card/60 p-4 shadow-2xl backdrop-blur-2xl">
          <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Omni-Audit Log</p>
          <div className="relative flex flex-col gap-0">
            <div className="absolute left-[11px] top-2 bottom-2 w-px bg-border/40 sm:left-[15px]" />
            {AUDIT_LOG.map((a) => {
              const mc = MODULE_COLORS[a.module] || MODULE_COLORS.HR
              return (
                <div key={a.id} className="relative flex gap-3 pb-4 sm:gap-4">
                  <div className={cn("relative z-10 mt-1 flex size-6 shrink-0 items-center justify-center rounded-full sm:size-8", mc.bg)}>
                    <div className={cn("size-2 rounded-full sm:size-2.5", mc.dot)} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-col gap-0.5 sm:flex-row sm:items-center sm:gap-2">
                      <Badge variant="outline" className={cn("w-fit text-[9px]", mc.text, `border-${a.module === "HR" ? "amber" : a.module === "Finance" ? "emerald" : a.module === "Academic" ? "violet" : "sky"}-500/30`)}>{a.module}</Badge>
                      <span className="text-[10px] text-muted-foreground">{a.date}</span>
                    </div>
                    <p className="mt-0.5 text-xs text-foreground">{a.event}</p>
                    <p className="text-[10px] text-muted-foreground/60">By {a.actor}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════
          SHEETS / DRAWERS
          ══════════════════════════════════════════════════════ */}

      {/* Tasks Drawer */}
      <Sheet open={tasksOpen} onOpenChange={setTasksOpen}>
        <SheetContent side="right" className="w-full border-border/40 bg-card/95 p-0 backdrop-blur-2xl sm:!w-[480px] sm:!max-w-[480px] [&>button]:hidden">
          <div className="flex h-full flex-col">
            <div className="flex items-center justify-between border-b border-border/30 px-4 py-3">
              <SheetTitle className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <ClipboardCheck className="size-4 text-sky-500" />Tasks & Dues
              </SheetTitle>
              <button onClick={() => setTasksOpen(false)} className="rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground"><X className="size-4" /></button>
            </div>
            <div className="flex-1 overflow-y-auto px-4 py-4">
              <div className="flex flex-col gap-2">
                {TASKS.map(t => {
                  const cfg = TASK_STATUS_CFG[t.status]
                  const StatusIcon = cfg.icon
                  return (
                    <div key={t.id} className="flex flex-col gap-1.5 rounded-xl border border-border/30 bg-background/30 px-4 py-3">
                      <div className="flex items-start gap-3">
                        <StatusIcon className={cn("mt-0.5 size-4 shrink-0", cfg.cls.split(" ").pop())} />
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="text-sm font-medium text-foreground">{t.title}</p>
                            <Badge variant="outline" className={cn("text-[10px]", cfg.cls)}>{cfg.label}</Badge>
                          </div>
                          <div className="mt-1 flex flex-wrap items-center gap-3 text-[10px] text-muted-foreground">
                            <span className="flex items-center gap-1"><Calendar className="size-3" />Due: {t.dueDate}</span>
                            <span>{t.module}</span>
                          </div>
                          <p className="mt-1 text-[10px] text-muted-foreground/50">Assigned by: {t.assignedBy} on {t.assignedAt}</p>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Payroll Detail Drawer */}
      <Sheet open={payrollOpen} onOpenChange={setPayrollOpen}>
        <SheetContent side="right" className="w-full border-border/40 bg-card/95 p-0 backdrop-blur-2xl sm:!w-[480px] sm:!max-w-[480px] [&>button]:hidden">
          <div className="flex h-full flex-col">
            <div className="flex items-center justify-between border-b border-border/30 px-4 py-3">
              <SheetTitle className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <Wallet className="size-4 text-emerald-500" />Compensation Details
              </SheetTitle>
              <button onClick={() => setPayrollOpen(false)} className="rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground"><X className="size-4" /></button>
            </div>
            <div className="flex-1 overflow-y-auto px-4 py-4">
              <div className="flex flex-col gap-3">
                <PayrollRow label="Annual CTC" value={`Rs ${PAYROLL.ctc}`} highlight />
                <PayrollRow label="Monthly Gross" value={`Rs ${PAYROLL.gross}`} />
                <div className="h-px bg-border/30" />
                <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Earnings</p>
                <PayrollRow label="Basic Pay" value={`Rs ${PAYROLL.basic}`} />
                <PayrollRow label="HRA" value={`Rs ${PAYROLL.hra}`} />
                <PayrollRow label="DA" value={`Rs ${PAYROLL.da}`} />
                <div className="h-px bg-border/30" />
                <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Deductions</p>
                <PayrollRow label="PF Deduction" value={`Rs ${PAYROLL.pf}`} />
                <PayrollRow label="Professional Tax" value={`Rs ${PAYROLL.profTax}`} />
                <div className="h-px bg-border/30" />
                <PayrollRow label="Net Payable" value={`Rs ${PAYROLL.net}`} highlight />
                <div className="h-px bg-border/30" />
                <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Bank Details</p>
                <PayrollRow label="Bank" value={PAYROLL.bankName} />
                <PayrollRow label="Account" value={PAYROLL.bankAcc} />
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Pay Slip Detail Sheet */}
      <Sheet open={paySlipOpen} onOpenChange={setPaySlipOpen}>
        <SheetContent side="right" className="w-full border-border/40 bg-card/95 backdrop-blur-2xl sm:!w-[480px] sm:!max-w-[480px] p-0 overflow-hidden [&>button]:hidden">
          <div className="flex h-full flex-col">
            <div className="flex items-center justify-between border-b border-border/30 px-4 py-3">
              <SheetTitle className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <CreditCard className="size-5 text-emerald-500" />Pay Slips
              </SheetTitle>
              <button onClick={() => setPaySlipOpen(false)} className="rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground"><X className="size-4" /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              <div className="flex flex-col gap-3">
                {PAY_SLIPS.map(p => (
                  <div key={p.month} className="rounded-2xl border border-border/30 bg-background/30 p-4">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-sm font-semibold text-foreground">{p.month}</p>
                      <Badge variant="outline" className="border-emerald-500/30 bg-emerald-500/10 text-[10px] text-emerald-500">Paid</Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-3 mb-3">
                      <div><p className="text-[10px] text-muted-foreground">Gross</p><p className="text-sm font-bold text-foreground">Rs.{p.gross.toLocaleString("en-IN")}</p></div>
                      <div><p className="text-[10px] text-muted-foreground">Deductions</p><p className="text-sm font-bold text-red-500">Rs.{p.deductions.toLocaleString("en-IN")}</p></div>
                      <div><p className="text-[10px] text-muted-foreground">Net Pay</p><p className="text-sm font-bold text-emerald-500">Rs.{p.net.toLocaleString("en-IN")}</p></div>
                    </div>
                    <Button variant="outline" size="sm" className="w-full gap-1.5 border-border/50 text-xs">
                      <Download className="size-3" />Download PDF
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Request Detail Sheet */}
      <Sheet open={!!detailReq} onOpenChange={v => !v && setDetailReq(null)}>
        <SheetContent side="right" className="w-full border-border/40 bg-card/95 backdrop-blur-2xl sm:!w-[480px] sm:!max-w-[480px] p-0 overflow-hidden [&>button]:hidden">
          {detailReq && (() => {
            const cfg = TYPE_CFG[detailReq.type]
            const stCfg = STATUS_CFG[detailReq.status]
            const Icon = cfg.icon
            return (
              <div className="flex h-full flex-col">
                <div className="flex items-center justify-between border-b border-border/30 px-4 py-3">
                  <SheetTitle className="flex items-center gap-2 text-sm font-semibold text-foreground">
                    <Icon className={cn("size-5", cfg.color)} />{detailReq.title}
                  </SheetTitle>
                  <button onClick={() => setDetailReq(null)} className="rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground"><X className="size-4" /></button>
                </div>
                <div className="flex-1 overflow-y-auto p-4">
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className={cn("text-xs", stCfg.cls)}>{stCfg.label}</Badge>
                      <div className="flex items-center gap-1.5">
                        {Array.from({ length: detailReq.totalSteps }).map((_, i) => (
                          <div key={i} className={cn("h-2 w-8 rounded-full", i < detailReq.currentStep ? "bg-primary" : "bg-border/40")} />
                        ))}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { l: "Type", v: cfg.label },
                        { l: "Approver", v: detailReq.approver },
                        { l: "Submitted", v: detailReq.submittedAt },
                        { l: "Updated", v: detailReq.updatedAt },
                      ].map(r => (
                        <div key={r.l} className="rounded-xl border border-border/30 bg-background/30 p-3">
                          <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{r.l}</p>
                          <p className="mt-1 text-sm font-medium text-foreground">{r.v}</p>
                        </div>
                      ))}
                    </div>
                    <div className="rounded-xl border border-border/30 bg-background/30 p-4">
                      <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Description</p>
                      <p className="mt-2 text-sm leading-relaxed text-foreground">{detailReq.description}</p>
                    </div>
                    {/* Workflow trail */}
                    <div className="flex flex-col gap-2">
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Workflow Trail</p>
                      {["Request Submitted", "Manager Review", "HR Approval", "Finance Clearance"].slice(0, detailReq.totalSteps).map((step, i) => (
                        <div key={step} className="flex items-center gap-3">
                          <div className={cn(
                            "flex size-7 shrink-0 items-center justify-center rounded-full border text-[10px] font-bold",
                            i < detailReq.currentStep ? "border-emerald-500 bg-emerald-500 text-white" :
                            i === detailReq.currentStep ? "border-primary bg-primary text-primary-foreground" :
                            "border-border/50 bg-muted/30 text-muted-foreground"
                          )}>
                            {i < detailReq.currentStep ? <CheckCircle className="size-3.5" /> : i + 1}
                          </div>
                          <span className={cn("text-sm", i < detailReq.currentStep ? "text-emerald-500" : i === detailReq.currentStep ? "font-semibold text-foreground" : "text-muted-foreground")}>{step}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-end gap-2 border-t border-border/30 bg-card/60 px-4 py-3 backdrop-blur-xl">
                  {detailReq.status === "pending" && (
                    <Button variant="outline" size="sm" className="border-red-500/30 text-red-500 hover:bg-red-500/10 text-xs">Withdraw</Button>
                  )}
                  <Button size="sm" onClick={() => setDetailReq(null)} className="text-xs shadow-md shadow-primary/20">Close</Button>
                </div>
              </div>
            )
          })()}
        </SheetContent>
      </Sheet>

      {/* ══════════════════════════════════════════
          NEW REQUEST SHEET (Dropdown + Forms)
          ══════════════════════════════════════════ */}
      <Sheet open={newReqOpen} onOpenChange={v => { setNewReqOpen(v); if (!v) setNewReqType("") }}>
        <SheetContent side="right" className="w-full border-border/40 bg-card/95 backdrop-blur-2xl sm:!w-[520px] sm:!max-w-[520px] p-0 overflow-hidden [&>button]:hidden">
          <div className="flex h-full flex-col">
            <div className="flex items-center justify-between border-b border-border/30 px-4 py-3">
              <SheetTitle className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <Plus className="size-4 text-primary" />New Request
              </SheetTitle>
              <button onClick={() => { setNewReqOpen(false); setNewReqType("") }} className="rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground"><X className="size-4" /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              <div className="flex flex-col gap-5">
                {/* Type selector */}
                <div className="flex flex-col gap-2">
                  <Label className="text-xs font-medium text-foreground">Request Type</Label>
                  <Select value={newReqType} onValueChange={(v) => setNewReqType(v as ReqType)}>
                    <SelectTrigger className="border-border/50 bg-background/80">
                      <SelectValue placeholder="Select request type..." />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(TYPE_CFG).map(([key, cfg]) => (
                        <SelectItem key={key} value={key}>
                          <span className="flex items-center gap-2">
                            <cfg.icon className={cn("size-4", cfg.color)} />
                            {cfg.label}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Dynamic form based on type */}
                {newReqType === "leave" && <LeaveForm />}
                {newReqType === "asset" && <AssetForm />}
                {newReqType === "reimbursement" && <ReimbursementForm />}
                {newReqType === "onboarding" && <OnboardingForm />}
                {newReqType === "document" && <DocumentForm />}
              </div>
            </div>
            {newReqType && (
              <div className="flex items-center justify-end gap-2 border-t border-border/30 bg-card/60 px-4 py-3 backdrop-blur-xl">
                <Button variant="outline" size="sm" onClick={() => setNewReqType("")} className="border-border/50 text-xs">Reset</Button>
                <Button size="sm" onClick={handleSubmitRequest} className="gap-1.5 text-xs shadow-md shadow-primary/20">
                  <Send className="size-3" />Submit Request
                </Button>
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </DashboardShell>
  )
}

/* ══════════════════════════════════════════════════════
   REQUEST FORM COMPONENTS
   ══════════════════════════════════════════════════════ */

function LeaveForm() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label className="text-xs text-muted-foreground">Leave Type</Label>
        <Select>
          <SelectTrigger className="border-border/50 bg-background/80"><SelectValue placeholder="Select leave type..." /></SelectTrigger>
          <SelectContent>
            <SelectItem value="cl">Casual Leave (CL)</SelectItem>
            <SelectItem value="sl">Sick Leave (SL)</SelectItem>
            <SelectItem value="el">Earned Leave (EL)</SelectItem>
            <SelectItem value="comp">Comp Off</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-2">
          <Label className="text-xs text-muted-foreground">From Date</Label>
          <Input type="date" className="border-border/50 bg-background/80" />
        </div>
        <div className="flex flex-col gap-2">
          <Label className="text-xs text-muted-foreground">To Date</Label>
          <Input type="date" className="border-border/50 bg-background/80" />
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <Label className="text-xs text-muted-foreground">Reason</Label>
        <Textarea placeholder="Describe the reason for leave..." className="min-h-[80px] border-border/50 bg-background/80" />
      </div>
    </div>
  )
}

function AssetForm() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label className="text-xs text-muted-foreground">Asset Type</Label>
        <Select>
          <SelectTrigger className="border-border/50 bg-background/80"><SelectValue placeholder="Select asset type..." /></SelectTrigger>
          <SelectContent>
            <SelectItem value="laptop">Laptop</SelectItem>
            <SelectItem value="phone">Phone</SelectItem>
            <SelectItem value="id-card">ID Card</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex flex-col gap-2">
        <Label className="text-xs text-muted-foreground">Description</Label>
        <Textarea placeholder="Describe the asset requirement..." className="min-h-[80px] border-border/50 bg-background/80" />
      </div>
      <div className="flex flex-col gap-2">
        <Label className="text-xs text-muted-foreground">Urgency</Label>
        <Select>
          <SelectTrigger className="border-border/50 bg-background/80"><SelectValue placeholder="Select urgency..." /></SelectTrigger>
          <SelectContent>
            <SelectItem value="normal">Normal</SelectItem>
            <SelectItem value="urgent">Urgent</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}

function ReimbursementForm() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label className="text-xs text-muted-foreground">Category</Label>
        <Select>
          <SelectTrigger className="border-border/50 bg-background/80"><SelectValue placeholder="Select category..." /></SelectTrigger>
          <SelectContent>
            <SelectItem value="travel">Travel</SelectItem>
            <SelectItem value="medical">Medical</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-2">
          <Label className="text-xs text-muted-foreground">Amount (Rs)</Label>
          <Input type="number" placeholder="0" className="border-border/50 bg-background/80" />
        </div>
        <div className="flex flex-col gap-2">
          <Label className="text-xs text-muted-foreground">Date of Expense</Label>
          <Input type="date" className="border-border/50 bg-background/80" />
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <Label className="text-xs text-muted-foreground">Description</Label>
        <Textarea placeholder="Describe the expense..." className="min-h-[80px] border-border/50 bg-background/80" />
      </div>
      <div className="flex flex-col gap-2">
        <Label className="text-xs text-muted-foreground">Bill Reference</Label>
        <Input placeholder="Invoice / Bill number" className="border-border/50 bg-background/80" />
      </div>
    </div>
  )
}

function OnboardingForm() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label className="text-xs text-muted-foreground">Employee Name</Label>
        <Input placeholder="Full name" className="border-border/50 bg-background/80" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-2">
          <Label className="text-xs text-muted-foreground">Department</Label>
          <Select>
            <SelectTrigger className="border-border/50 bg-background/80"><SelectValue placeholder="Select..." /></SelectTrigger>
            <SelectContent>
              <SelectItem value="academic">Academic</SelectItem>
              <SelectItem value="admin">Administration</SelectItem>
              <SelectItem value="finance">Finance</SelectItem>
              <SelectItem value="transport">Transport</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-2">
          <Label className="text-xs text-muted-foreground">Designation</Label>
          <Input placeholder="e.g. PGT Teacher" className="border-border/50 bg-background/80" />
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <Label className="text-xs text-muted-foreground">Joining Date</Label>
        <Input type="date" className="border-border/50 bg-background/80" />
      </div>
    </div>
  )
}

function DocumentForm() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label className="text-xs text-muted-foreground">Document Type</Label>
        <Select>
          <SelectTrigger className="border-border/50 bg-background/80"><SelectValue placeholder="Select document type..." /></SelectTrigger>
          <SelectContent>
            <SelectItem value="salary-cert">Salary Certificate</SelectItem>
            <SelectItem value="experience">Experience Letter</SelectItem>
            <SelectItem value="noc">NOC</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex flex-col gap-2">
        <Label className="text-xs text-muted-foreground">Purpose</Label>
        <Textarea placeholder="Why do you need this document?" className="min-h-[80px] border-border/50 bg-background/80" />
      </div>
      <div className="flex flex-col gap-2">
        <Label className="text-xs text-muted-foreground">Urgency</Label>
        <Select>
          <SelectTrigger className="border-border/50 bg-background/80"><SelectValue placeholder="Select urgency..." /></SelectTrigger>
          <SelectContent>
            <SelectItem value="normal">Normal</SelectItem>
            <SelectItem value="urgent">Urgent</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════════════
   HELPER COMPONENTS
   ══════════════════════════════════════════════════════ */

function StatCard({ label, value, icon: Icon, accent }: { label: string; value: number; icon: typeof Clock; accent: string }) {
  return (
    <div className="flex items-center gap-2 rounded-xl border border-border/30 bg-background/30 p-2 sm:gap-3 sm:p-3">
      <div className={cn("flex size-8 shrink-0 items-center justify-center rounded-lg sm:size-9", accent.replace("text-", "bg-").replace("500", "500/10"))}>
        <Icon className={cn("size-4", accent)} />
      </div>
      <div className="min-w-0">
        <p className="text-base font-bold text-foreground sm:text-lg">{value}</p>
        <p className="truncate text-[10px] text-muted-foreground">{label}</p>
      </div>
    </div>
  )
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-2">
      <span className="shrink-0 text-[11px] text-muted-foreground">{label}</span>
      <span className="text-right text-xs text-foreground">{value}</span>
    </div>
  )
}

function PayrollRow({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className={cn("text-xs", highlight ? "font-semibold text-foreground" : "text-muted-foreground")}>{label}</span>
      <span className={cn("text-xs font-mono", highlight ? "font-bold text-primary" : "text-foreground")}>{value}</span>
    </div>
  )
}
