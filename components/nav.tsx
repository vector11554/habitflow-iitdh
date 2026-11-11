import Link from "next/link";
import { BarChart3, CalendarDays, CheckSquare, Home, LogOut, Settings, Sparkles } from "lucide-react";
import { signOut } from "@/app/actions";

const items = [
  ["/dashboard","Overview",Home],
  ["/habits","My habits",CheckSquare],
  ["/calendar","Calendar",CalendarDays],
  ["/insights","Insights",BarChart3]
] as const;

export function Sidebar({ nickname, active }: { nickname:string; active:string }) {
  return <aside className="sidebar fixed left-0 top-0 hidden flex-col p-5 lg:flex">
    <Link href="/" className="mb-12 flex items-center gap-3 px-1"><span className="brand-mark">H</span><span className="text-lg font-black tracking-tight">habitflow<span className="text-[#F4C84A]">.</span></span></Link>
    <p className="kicker mb-3 px-3 !text-[#92999F]">Workspace</p>
    <nav className="space-y-1">{items.map(([href,label,Icon])=><Link key={href} href={href} className={`nav-link ${active===href?"active":""}`}><Icon size={17}/>{label}</Link>)}</nav>
    <div className="mt-auto">
      <div className="mb-4 rounded-xl border border-[#41484F] bg-[#2A3037] p-3">
        <div className="flex items-center gap-2"><Sparkles size={15} className="text-[#F4C84A]"/><span className="text-xs font-bold">Keep showing up</span></div>
        <p className="mt-2 text-xs leading-5 text-[#B9C0C6]">Small actions, repeated with care, create meaningful change.</p>
      </div>
      <div className="flex items-center gap-3 border-t border-[#41484F] pt-4">
        <div className="grid h-9 w-9 place-items-center rounded-full bg-[#F4C84A] font-black text-[#20252B]">{nickname.slice(0,1).toUpperCase()}</div>
        <div className="min-w-0 flex-1"><p className="truncate text-sm font-bold">{nickname}</p><p className="text-[10px] text-[#92999F]">IIT Dharwad</p></div>
        <form action={signOut}><button aria-label="Sign out" className="text-[#B9C0C6] hover:text-white"><LogOut size={17}/></button></form>
      </div>
    </div>
  </aside>;
}

export function MobileNav({ active }: { active:string }) {
  return <nav className="mobile-nav fixed bottom-0 left-0 z-20 hidden w-full justify-around border-t border-[#E6E8E3] bg-white px-2 py-3">
    {items.map(([href,label,Icon])=><Link key={href} href={href} className={`flex flex-col items-center gap-1 text-[10px] font-bold ${active===href?"text-[#20252B]":"text-[#92999F]"}`}><Icon size={19}/>{label}</Link>)}
  </nav>;
}
