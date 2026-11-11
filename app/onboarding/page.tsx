import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { saveNickname } from "@/app/actions";
import Link from "next/link";

export default async function OnboardingPage() {
  const supabase = await createClient();
  const { data:{ user } } = await supabase.auth.getUser();
  if (!user || !user.email?.toLowerCase().endsWith("@iitdh.ac.in")) redirect("/login");
  const { data:profile } = await supabase.from("profiles").select("nickname").eq("id",user.id).maybeSingle();
  if (profile?.nickname) redirect("/dashboard");

  return <main className="flex min-h-screen items-center justify-center px-5 py-12">
    <div className="panel w-full max-w-lg p-7 sm:p-10">
      <Link href="/" className="mb-10 inline-flex items-center gap-3"><span className="brand-mark">H</span><span className="font-black">habitflow.</span></Link>
      <p className="kicker">One last thing</p>
      <h1 className="mt-3 text-3xl font-black tracking-tight">What should we call you?</h1>
      <p className="mt-3 text-sm leading-6 text-[#737B82]">Choose a nickname for your HabitFlow space. We&apos;ll use it in greetings and throughout your dashboard. Your email stays private.</p>
      <form action={saveNickname} className="mt-8 space-y-5">
        <div><label className="label" htmlFor="nickname">Your nickname</label><input className="field" id="nickname" name="nickname" minLength={2} maxLength={24} placeholder="e.g. Skywalker" required autoComplete="nickname"/><p className="mt-2 text-xs text-[#92999F]">2–24 characters. You can change it later by contacting the project administrator (profile editing can be added).</p></div>
        <button className="btn-primary w-full py-3">Create my space</button>
      </form>
      <p className="mt-6 text-xs text-[#92999F]">Signed in as {user.email}</p>
    </div>
  </main>;
}
