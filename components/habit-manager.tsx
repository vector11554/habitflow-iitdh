"use client";

import { FormEvent, useState, useTransition } from "react";
import { Archive, Plus, Target } from "lucide-react";
import { archiveHabit, createHabit } from "@/app/actions";

type Habit = {id:string;title:string;category:string;frequency:string;weekly_target:number;created_at:string};

export function HabitManager({habits:initial}:{habits:Habit[]}) {
  const [habits,setHabits] = useState(initial);
  const [show,setShow] = useState(false);
  const [busy,startTransition] = useTransition();
  const [error,setError] = useState("");
  async function add(e:FormEvent<HTMLFormElement>) {
    e.preventDefault(); setError("");
    const form = new FormData(e.currentTarget);
    startTransition(async()=>{
      const result = await createHabit(form);
      if(result?.error) setError(result.error);
      else window.location.reload();
    });
  }
  function archive(id:string) {
    startTransition(async()=>{
      const result=await archiveHabit(id);
      if(result?.error) setError(result.error);
      else setHabits(old=>old.filter(h=>h.id!==id));
    });
  }
  return <div className="grid gap-6 lg:grid-cols-[.8fr_1.2fr]">
    <section className="panel h-fit p-5">
      <div className="flex items-center gap-2"><Target size={18}/><h2 className="font-extrabold">Create a habit</h2></div>
      <p className="mt-2 text-sm leading-6 text-[#737B82]">Start small. You can always adjust your routine as you learn what works.</p>
      <button onClick={()=>setShow(!show)} className="btn-primary mt-5 inline-flex w-full items-center justify-center gap-2"><Plus size={16}/>{show?"Close form":"Add a new habit"}</button>
      {show&&<form onSubmit={add} className="mt-5 space-y-4">
        <div><label className="label" htmlFor="title">Habit name</label><input id="title" name="title" className="field" placeholder="e.g. Read for 15 minutes" minLength={2} maxLength={60} required/></div>
        <div><label className="label" htmlFor="category">Category</label><select id="category" name="category" className="field"><option>Learning</option><option>Health</option><option>Wellbeing</option><option>Personal</option><option>Creativity</option><option>Other</option></select></div>
        <div><label className="label" htmlFor="frequency">Schedule</label><select id="frequency" name="frequency" className="field"><option value="daily">Daily</option><option value="weekly">Weekly target</option></select></div>
        <div><label className="label" htmlFor="target">Weekly target (used for weekly habits)</label><input id="target" name="target" className="field" type="number" min="1" max="7" defaultValue="3"/></div>
        {error&&<p role="alert" className="text-sm text-red-700">{error}</p>}
        <button disabled={busy} className="btn-primary w-full disabled:opacity-50">{busy?"Saving…":"Save habit"}</button>
      </form>}
    </section>
    <section className="panel p-5">
      <div className="mb-5 flex items-center justify-between"><div><p className="kicker">Your list</p><h2 className="mt-1 text-xl font-black">Active habits <span className="text-sm text-[#92999F]">({habits.length})</span></h2></div></div>
      {habits.length===0?<p className="py-10 text-center text-sm text-[#737B82]">No habits yet. Add your first one to get started.</p>:<div className="space-y-3">{habits.map(h=><div key={h.id} className="flex items-center gap-3 rounded-xl border border-[#E6E8E3] p-3"><div className="grid h-9 w-9 place-items-center rounded-xl bg-[#FFF5D4]"><Target size={17}/></div><div className="min-w-0 flex-1"><p className="truncate text-sm font-bold">{h.title}</p><p className="mt-1 text-xs text-[#92999F]">{h.category} · {h.frequency==="weekly"?`${h.weekly_target}× per week`:"Daily"}</p></div><button onClick={()=>archive(h.id)} disabled={busy} aria-label={`Archive ${h.title}`} title="Archive habit" className="rounded-lg p-2 text-[#92999F] hover:bg-[#F6F7F4] hover:text-[#20252B]"><Archive size={16}/></button></div>)}</div>}
    </section>
  </div>;
}
