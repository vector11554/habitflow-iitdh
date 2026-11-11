import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { CalendarDays } from "lucide-react";

export default async function CalendarPage() {
  const supabase=await createClient();
  const {data:{user}}=await supabase.auth.getUser();
  if(!user) redirect("/login");
  const start=new Date(); start.setDate(start.getDate()-27);
  const startDate=start.toISOString().slice(0,10);
  const {data:logs}=await supabase.from("habit_logs").select("log_date").gte("log_date",startDate).order("log_date");
  const counts=new Map<string,number>();
  (logs||[]).forEach(x=>counts.set(x.log_date,(counts.get(x.log_date)||0)+1));
  const days=Array.from({length:28},(_,i)=>{const d=new Date(start);d.setDate(start.getDate()+i);return d.toISOString().slice(0,10)});
  return <><div className="mb-8"><p className="kicker">Look back with curiosity</p><h1 className="mt-2 text-3xl font-black">Your calendar</h1><p className="mt-2 text-sm text-[#737B82]">A snapshot of the days you showed up.</p></div>
    <section className="panel p-6"><div className="flex items-center gap-2"><CalendarDays size={18}/><h2 className="font-extrabold">Last 28 days</h2></div><div className="mt-7 grid grid-cols-7 gap-2 sm:grid-cols-7 md:grid-cols-7">{days.map((day,i)=>{const n=counts.get(day)||0;return <div key={day} className="text-center"><div title={`${day}: ${n} completed habits`} className={`mx-auto grid aspect-square max-w-16 place-items-center rounded-xl border text-xs font-bold ${n>=3?"border-[#E9B92D] bg-[#F4C84A] text-[#20252B]":n>0?"border-[#F4E4B2] bg-[#FFF5D4] text-[#5D4914]":"border-[#E6E8E3] bg-[#F6F7F4] text-[#92999F]"}`}>{n||"·"}</div><p className="mt-2 text-[9px] text-[#92999F]">{new Date(day+"T12:00:00").toLocaleDateString("en-IN",{day:"numeric",month:"short"})}</p></div>})}</div><div className="mt-7 flex items-center justify-end gap-3 text-[10px] text-[#737B82]"><span>Less</span><span className="h-3 w-3 rounded bg-[#F6F7F4] border border-[#E6E8E3]"/><span className="h-3 w-3 rounded bg-[#FFF5D4]"/><span className="h-3 w-3 rounded bg-[#F4C84A]"/>More</div></section>
  </>;
}
