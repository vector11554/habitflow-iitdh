import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Sidebar, MobileNav } from "@/components/nav";

export default async function AppLayout({ children }: { children:React.ReactNode }) {
  const supabase = await createClient();
  const { data:{ user } } = await supabase.auth.getUser();
  if (!user || !user.email?.toLowerCase().endsWith("@iitdh.ac.in")) redirect("/login");
  const { data:profile } = await supabase.from("profiles").select("nickname").eq("id",user.id).maybeSingle();
  if (!profile?.nickname) redirect("/onboarding");
  return <div className="shell">
    <Sidebar nickname={profile.nickname} active=""/>
    <div className="lg:pl-[248px]"><main className="mx-auto max-w-7xl px-5 pb-28 pt-8 sm:px-8 lg:px-10 lg:pb-12">{children}</main></div>
    <MobileNav active=""/>
  </div>;
}
