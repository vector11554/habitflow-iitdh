import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { HabitManager } from "@/components/habit-manager";

export default async function HabitsPage() {
  const supabase = await createClient();
  const {data:{user}} = await supabase.auth.getUser();
  if(!user) redirect("/login");
  const {data:habits} = await supabase.from("habits").select("id,title,category,frequency,weekly_target,created_at").eq("active",true).order("created_at",{ascending:false});
  return <><div className="mb-8"><p className="kicker">Build your routine</p><h1 className="mt-2 text-3xl font-black">My habits</h1><p className="mt-2 text-sm text-[#737B82]">Choose habits that are meaningful and realistic for you.</p></div><HabitManager habits={habits||[]}/></>;
}
