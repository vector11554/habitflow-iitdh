"use client";

import { useState, useTransition } from "react";
import { Check, Loader2 } from "lucide-react";
import { toggleHabit } from "@/app/actions";

export function HabitToggle({ habit, done, date }: { habit:{id:string;title:string;category:string;frequency:string;weekly_target:number}; done:boolean; date:string }) {
  const [isDone,setIsDone] = useState(done);
  const [pending,startTransition] = useTransition();
  const [error,setError] = useState("");
  function change() {
    const next = !isDone;
    setError("");
    setIsDone(next);
    startTransition(async()=>{
      const result = await toggleHabit(habit.id,date,next);
      if (result?.error) { setIsDone(!next); setError(result.error); }
    });
  }
  return <div className="habit-row">
    <button onClick={change} disabled={pending} aria-label={`${isDone?"Unmark":"Mark"} ${habit.title}`} aria-pressed={isDone} className={`habit-check ${isDone?"done":""}`}>
      {pending?<Loader2 size={14} className="animate-spin"/>:isDone?<Check size={15} strokeWidth={3}/>:null}
    </button>
    <div className="min-w-0 flex-1"><p className={`truncate text-sm font-bold ${isDone?"text-[#92999F] line-through":""}`}>{habit.title}</p><p className="mt-1 text-[11px] text-[#92999F]">{habit.category} · {habit.frequency==="weekly"?`${habit.weekly_target} times this week`:"Daily"}</p>{error&&<p role="alert" className="mt-1 text-xs text-red-700">{error}</p>}</div>
    <span className={`text-[10px] font-extrabold uppercase tracking-wider ${isDone?"text-[#397A5B]":"text-[#92999F]"}`}>{isDone?"Done":"To do"}</span>
  </div>;
}
