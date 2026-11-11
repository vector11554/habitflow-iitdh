import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { BarChart3, Lightbulb, TrendingUp } from "lucide-react";

export default async function InsightsPage() {
  const supabase=await createClient();
  const {data:{user}}=await supabase.auth.getUser();
  if(!user) redirect("/login");
  const since=new Date(); since.setDate(since.getDate()-6);
  const {data:logs}=await supabase.from("habit_logs").select("log_date,habit_id").gte("log_date",since.toISOString().slice(0,10));
  const total=logs?.length||0;
  const days=new Set((logs||[]).map(x=>x.log_date)).size;
  const activeDays=Array.from({length:7},(_,i)=>{const d=new Date(since);d.setDate(since.getDate()+i);const key=d.toISOString().slice(0,10);return {key,label:d.toLocaleDateString("en-US",{weekday:"short"}),count:(logs||[]).filter(x=>x.log_date===key).length}});
  const max=Math.max(1,...activeDays.map(d=>d.count));
  return <><div className="mb-8"><p className="kicker">Notice your patterns</p><h1 className="mt-2 text-3xl font-black">Your insights</h1><p className="mt-2 text-sm text-[#737B82]">Use data as a guide, not a judgement.</p></div>
    <div className="grid gap-4 sm:grid-cols-3">
      <div className="panel p-5"><p className="kicker">Completions</p><p className="mt-2 text-3xl font-black">{total}</p><p className="mt-1 text-xs text-[#92999F]">In the last 7 days</p></div>
      <div className="panel p-5"><p className="kicker">Days active</p><p className="mt-2 text-3xl font-black">{days}<span className="text-base text-[#92999F]">/7</span></p><p className="mt-1 text-xs text-[#92999F]">Days with at least one completion</p></div>
      <div className="panel p-5"><p className="kicker">Your approach</p><p className="mt-2 text-xl font-black">Keep it flexible</p><p className="mt-1 text-xs text-[#92999F]">Consistency can include restarts.</p></div>
    </div>
    <section className="panel mt-6 p-6"><div className="flex items-center gap-2"><BarChart3 size={18}/><h2 className="font-extrabold">Daily completions</h2></div><div className="mt-8 flex h-48 items-end justify-between gap-3">{activeDays.map(d=><div key={d.key} className="flex h-full flex-1 flex-col items-center justify-end gap-2"><span className="text-xs font-bold text-[#737B82]">{d.count||""}</span><div className="w-full max-w-12 rounded-t-lg bg-[#F4C84A]" style={{height:`${Math.max(5,d.count/max*100)}%`}}/><span className="text-xs text-[#92999F]">{d.label}</span></div>)}</div></section>
    <section className="panel mt-6 flex gap-4 p-5"><div className="grid h-10 w-10 flex-shrink-0 place-items-center rounded-xl bg-[#FFF5D4]"><Lightbulb size={19}/></div><div><h3 className="font-extrabold">A useful way to read this</h3><p className="mt-2 text-sm leading-6 text-[#737B82]">Your data shows activity, not your worth or effort. Look for patterns you can experiment with: a smaller target, a different time of day, or a more flexible weekly schedule.</p></div></section>
  </>;
}
