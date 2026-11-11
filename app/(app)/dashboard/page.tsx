import Link from "next/link";
import { ArrowUpRight, CalendarDays, CheckCircle2, Plus, Sparkles, Target } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { HabitToggle } from "@/components/habit-toggle";

function localDate() {
  const now = new Date();
  return new Intl.DateTimeFormat("en-CA", { timeZone:"Asia/Kolkata", year:"numeric", month:"2-digit", day:"2-digit" }).format(now);
}

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data:{ user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const [{data:profile},{data:habits},{data:logs}] = await Promise.all([
    supabase.from("profiles").select("nickname").eq("id",user.id).single(),
    supabase.from("habits").select("id,title,category,frequency,weekly_target").eq("active",true).order("created_at"),
    supabase.from("habit_logs").select("habit_id,log_date").eq("log_date",localDate())
  ]);
  const completed = new Set((logs||[]).map(x=>x.habit_id));
  const total = habits?.length||0, count = completed.size;
  const pct = total ? Math.round(count/total*100) : 0;
  const hour = Number(new Intl.DateTimeFormat("en-US",{hour:"2-digit",hour12:false,timeZone:"Asia/Kolkata"}).format(new Date()));
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return <>
    <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div><p className="kicker">{new Intl.DateTimeFormat("en-US", { weekday:"long", timeZone:"Asia/Kolkata" }).format(new Date())} · Your personal space</p><h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">{greeting}, {profile?.nickname || "there"}.</h1><p className="mt-2 text-sm text-[#737B82]">Make today count, one small action at a time.</p></div>
      <Link href="/habits" className="btn-primary inline-flex items-center gap-2"><Plus size={17}/> Add a habit</Link>
    </header>

    <section className="grid gap-4 md:grid-cols-3">
      <div className="rounded-2xl bg-[#20252B] p-5 text-white md:col-span-2">
        <div className="flex items-start justify-between"><div><p className="text-sm text-[#B9C0C6]">Today&apos;s progress</p><p className="mt-2 text-4xl font-black">{pct}<span className="text-xl text-[#92999F]">%</span></p></div><div className="rounded-xl bg-[#343B43] p-3 text-[#F4C84A]"><Target size={22}/></div></div>
        <div className="mt-5 h-2 overflow-hidden rounded-full bg-[#454C53]"><div className="h-full rounded-full bg-[#F4C84A]" style={{width:`${pct}%`}}/></div>
        <p className="mt-3 text-xs text-[#B9C0C6]">{count} of {total} habits completed today</p>
      </div>
      <div className="panel p-5"><p className="kicker">Your focus</p><div className="mt-3 flex items-center gap-2"><Sparkles size={18} className="text-[#B28A18]"/><span className="font-extrabold">Progress, not perfection.</span></div><p className="mt-3 text-sm leading-6 text-[#737B82]">If today gets busy, try a smaller version of a habit. Keeping the connection alive matters.</p><Link href="/insights" className="mt-4 inline-flex items-center gap-1 text-xs font-bold">See your insights <ArrowUpRight size={14}/></Link></div>
    </section>

    <section className="mt-8 grid gap-6 lg:grid-cols-[1.35fr_.65fr]">
      <div className="panel p-5 sm:p-6">
        <div className="mb-5 flex items-center justify-between"><div><p className="kicker">Your routine</p><h2 className="mt-1 text-xl font-black">Today&apos;s habits</h2></div><Link href="/habits" className="text-xs font-bold text-[#737B82] hover:text-[#20252B]">Manage all <ArrowUpRight size={14} className="inline"/></Link></div>
        {!habits?.length ? <div className="rounded-xl border border-dashed border-[#D9DDD7] px-5 py-10 text-center"><div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-[#FFF5D4]"><Target size={22}/></div><h3 className="mt-4 font-extrabold">Start with one small habit</h3><p className="mx-auto mt-2 max-w-xs text-sm text-[#737B82]">Add something simple that you would like to make part of your routine.</p><Link href="/habits" className="btn-primary mt-5 inline-flex">Create your first habit</Link></div> :
          <div className="space-y-3">{habits.map(h=><HabitToggle key={h.id} habit={h} done={completed.has(h.id)} date={localDate()}/>)}</div>}
      </div>
      <div className="space-y-5">
        <div className="panel p-5"><div className="flex items-center gap-2"><CalendarDays size={17}/><h3 className="font-extrabold">A gentle reminder</h3></div><p className="mt-3 text-sm leading-6 text-[#737B82]">A missed day doesn&apos;t erase the effort you&apos;ve already made. Look for the next opportunity to begin again.</p></div>
        <div className="panel p-5"><div className="flex items-center gap-2"><CheckCircle2 size={17}/><h3 className="font-extrabold">Your daily check-in</h3></div><p className="mt-3 text-sm leading-6 text-[#737B82]">Mark habits as you complete them. Your progress is saved to your private account.</p><div className="mt-4 rounded-lg bg-[#FFF7DF] p-3 text-xs font-semibold text-[#5D4914]">Tip: Weekly habits can have flexible targets.</div></div>
      </div>
    </section>
  </>;
}
