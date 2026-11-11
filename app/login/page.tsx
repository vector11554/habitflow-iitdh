"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Mail, ShieldCheck } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const [email,setEmail] = useState("");
  const [busy,setBusy] = useState(false);
  const [message,setMessage] = useState("");
  const [error,setError] = useState("");

  async function submit(e: FormEvent) {
    e.preventDefault(); setError(""); setMessage("");
    const normalized = email.trim().toLowerCase();
    if (!/^[a-z0-9._%+-]+@iitdh\.ac\.in$/.test(normalized)) {
      setError("Please use your IIT Dharwad email address ending in @iitdh.ac.in.");
      return;
    }
    setBusy(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOtp({
        email: normalized,
        options: { emailRedirectTo: `${window.location.origin}/auth/callback` }
      });
      if (error) throw error;
      setMessage("Check your IIT Dharwad inbox. We sent you a secure sign-in link.");
    } catch (err:unknown) {
      setError(err instanceof Error ? err.message : "Unable to send the sign-in email. Please try again.");
    } finally { setBusy(false); }
  }

  return (
    <main className="grid min-h-screen lg:grid-cols-2">
      <section className="relative hidden overflow-hidden bg-[#20252B] p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="absolute -right-32 top-20 h-96 w-96 rounded-full bg-[#F4C84A] opacity-10 blur-3xl"/>
        <Link href="/" className="relative flex items-center gap-3"><span className="brand-mark">H</span><span className="text-lg font-black">habitflow.</span></Link>
        <div className="relative max-w-lg">
          <p className="kicker !text-[#F4C84A]">Your next chapter starts small</p>
          <h1 className="mt-5 text-5xl font-black leading-tight tracking-tight">Build the habits that build you.</h1>
          <p className="mt-6 text-lg leading-8 text-[#B9C0C6]">A calmer way to make progress, understand your patterns and keep going when life gets busy.</p>
          <div className="mt-9 inline-flex items-center gap-3 rounded-xl border border-[#454C53] bg-[#2A3037] px-4 py-3 text-sm text-[#D5DADF]"><ShieldCheck size={18} className="text-[#F4C84A]"/> IIT Dharwad email verification</div>
        </div>
        <p className="relative text-xs text-[#92999F]">HabitFlow · IIT Dharwad community project</p>
      </section>

      <section className="flex min-h-screen items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <Link href="/" className="mb-12 inline-flex items-center gap-2 text-sm font-semibold text-[#737B82] hover:text-[#20252B]"><ArrowLeft size={16}/> Back to home</Link>
          <div className="mb-8 lg:hidden"><span className="brand-mark">H</span></div>
          <p className="kicker">Welcome to HabitFlow</p>
          <h2 className="mt-3 text-3xl font-black tracking-tight">Sign in to continue.</h2>
          <p className="mt-3 text-sm leading-6 text-[#737B82]">Use your official IIT Dharwad email. We&apos;ll send you a one-time secure sign-in link.</p>
          <form onSubmit={submit} className="mt-8 space-y-5">
            <div><label className="label" htmlFor="email">IIT Dharwad email</label><div className="relative"><Mail size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#92999F]"/><input id="email" className="field pl-10" type="email" autoComplete="email" placeholder="yourname@iitdh.ac.in" value={email} onChange={e=>setEmail(e.target.value)} required/></div><p className="mt-2 text-xs text-[#92999F]">Only addresses ending in @iitdh.ac.in are accepted.</p></div>
            {error && <p role="alert" className="rounded-xl bg-[#FFF0EE] p-3 text-sm text-[#9D342D]">{error}</p>}
            {message && <p role="status" className="rounded-xl bg-[#EEF7F0] p-3 text-sm text-[#286044]">{message}</p>}
            <button disabled={busy} className="btn-primary w-full py-3 disabled:cursor-not-allowed disabled:opacity-60">{busy?"Sending link…":"Email me a sign-in link"}</button>
          </form>
          <p className="mt-7 text-center text-xs leading-5 text-[#92999F]">By continuing, you confirm that you are using an IIT Dharwad email account. Your habits are private to your account.</p>
        </div>
      </section>
    </main>
  );
}
