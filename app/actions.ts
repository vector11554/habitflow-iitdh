"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

const domainOk = (email?: string | null) => !!email && email.toLowerCase().endsWith("@iitdh.ac.in");

async function authenticated() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || !domainOk(user.email)) redirect("/login");
  return { supabase, user };
}

export async function saveNickname(formData: FormData) {
  const nickname = String(formData.get("nickname") || "").trim().replace(/\s+/g," ");
  if (nickname.length < 2 || nickname.length > 24 || !/^[\p{L}\p{N} _.-]+$/u.test(nickname)) {
    return { error: "Choose a nickname between 2 and 24 characters. Letters, numbers, spaces, dots, _ and - are allowed." };
  }
  const { supabase, user } = await authenticated();
  const { error } = await supabase.from("profiles").upsert({ id: user.id, nickname }, { onConflict: "id" });
  if (error) return { error: "Could not save your nickname. Please try again." };
  revalidatePath("/dashboard");
  redirect("/dashboard");
}

export async function createHabit(formData: FormData) {
  const title = String(formData.get("title") || "").trim();
  const category = String(formData.get("category") || "Personal");
  const frequency = String(formData.get("frequency") || "daily");
  const target = Number(formData.get("target") || 1);
  if (title.length < 2 || title.length > 60 || !["daily","weekly"].includes(frequency) || !Number.isInteger(target) || target < 1 || target > (frequency==="daily"?1:7)) {
    return { error: "Please check the habit details and try again." };
  }
  const { supabase, user } = await authenticated();
  const { error } = await supabase.from("habits").insert({
    user_id:user.id, title, category, frequency, weekly_target:frequency==="weekly"?target:1, active:true
  });
  if (error) return { error: "Could not create this habit." };
  revalidatePath("/dashboard");
  revalidatePath("/habits");
  return { success:true };
}

export async function toggleHabit(habitId: string, date: string, completed: boolean) {
  const { supabase, user } = await authenticated();
  if (!/^[0-9a-f-]{36}$/i.test(habitId) || !/^\d{4}-\d{2}-\d{2}$/.test(date)) return { error:"Invalid habit or date." };
  if (completed) {
    const { error } = await supabase.from("habit_logs").upsert(
      { user_id:user.id, habit_id:habitId, log_date:date, completed:true },
      { onConflict:"habit_id,log_date" }
    );
    if (error) return { error:"Could not update habit." };
  } else {
    const { error } = await supabase.from("habit_logs").delete().eq("habit_id",habitId).eq("log_date",date);
    if (error) return { error:"Could not update habit." };
  }
  revalidatePath("/dashboard");
  revalidatePath("/habits");
  return { success:true };
}

export async function archiveHabit(habitId: string) {
  const { supabase } = await authenticated();
  const { error } = await supabase.from("habits").update({ active:false }).eq("id",habitId);
  if (error) return { error:"Could not archive habit." };
  revalidatePath("/dashboard");
  revalidatePath("/habits");
  return { success:true };
}

export async function signOut() {
  const { supabase } = await authenticated();
  await supabase.auth.signOut();
  redirect("/");
}
