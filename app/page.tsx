import Link from "next/link";
import { ArrowUpRight, CheckCircle2, Compass, Sparkles, Target } from "lucide-react";
import type { LucideIcon } from "lucide-react";

const features: { icon: LucideIcon; title: string; desc: string }[] = [
  {
    icon: Target,
    title: "Make it yours",
    desc: "Create habits around the life you actually have."
  },
  {
    icon: Compass,
    title: "Stay flexible",
    desc: "Set weekly targets and adjust when plans change."
  },
  {
    icon: Sparkles,
    title: "Start again",
    desc: "Use gentle recovery prompts instead of guilt."
  }
];

export default function HomePage() {
  return (
    <main className="min-h-screen overflow-hidden">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
        <Link href="/" className="flex items-center gap-3">
          <span className="brand-mark">H</span>
          <span className="text-lg font-black tracking-tight">
            habitflow<span className="text-[#B28A18]">.</span>
          </span>
        </Link>

        <div className="flex items-center gap-3">
          <span className="hidden text-xs font-semibold text-[#737B82] sm:inline">
            A space for IIT Dharwad
          </span>
          <Link href="/login" className="btn-primary inline-flex items-center gap-2">
            Get started <ArrowUpRight size={16} />
          </Link>
        </div>
      </nav>

      <section className="mx-auto grid max-w-7xl items-center gap-12 px-6 pb-20 pt-12 lg:grid-cols-[1.1fr_.9fr] lg:pt-20">
        <div>
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#E6E8E3] bg-white px-3 py-2 text-xs font-bold text-[#59616A]">
            <span className="h-2 w-2 rounded-full bg-[#F4C84A]" />
            Built for the IIT Dharwad community
          </div>

          <h1 className="max-w-2xl text-5xl font-black leading-[1.06] tracking-[-.055em] sm:text-7xl">
            Small steps.<br />
            <span className="relative inline-block">
              Stronger days.
              <span className="absolute -bottom-1 left-0 -z-10 h-4 w-full bg-[#F4C84A] opacity-70" />
            </span>
          </h1>

          <p className="mt-7 max-w-xl text-lg leading-8 text-[#737B82]">
            Build habits that fit your life. Track your progress, learn what works, and find your way back whenever a day doesn&apos;t go to plan.
          </p>

          <div className="mt-9 flex flex-wrap gap-3">
            <Link href="/login" className="btn-primary inline-flex items-center gap-2 px-5 py-3">
              Start building <ArrowUpRight size={17} />
            </Link>
            <a href="#approach" className="btn-secondary px-5 py-3">
              Explore the approach
            </a>
          </div>

          <div className="mt-10 flex items-center gap-5 text-xs font-semibold text-[#737B82]">
            <span className="flex items-center gap-2">
              <CheckCircle2 size={15} /> Private by design
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle2 size={15} /> Flexible goals
            </span>
          </div>
        </div>

        <div className="relative">
          <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-[#F4C84A] opacity-25 blur-3xl" />

          <div className="panel relative p-5 sm:p-7">
            <div className="flex items-center justify-between">
              <div>
                <p className="kicker">Your overview</p>
                <h2 className="mt-1 text-xl font-extrabold">A little better, daily.</h2>
              </div>
              <span className="rounded-full bg-[#FFF5D4] px-3 py-1.5 text-xs font-bold text-[#5D4914]">
                Today
              </span>
            </div>

            <div className="mt-7 rounded-2xl bg-[#20252B] p-5 text-white">
              <p className="text-sm text-[#C6CBD0]">Today&apos;s progress</p>
              <div className="mt-2 flex items-end justify-between">
                <span className="text-4xl font-black">
                  3<span className="text-xl text-[#AEB5BB]">/5</span>
                </span>
                <span className="text-sm font-bold text-[#F4C84A]">60% complete</span>
              </div>
              <div className="mt-4 h-2 overflow-hidden rounded-full bg-[#454C53]">
                <div className="h-full w-[60%] rounded-full bg-[#F4C84A]" />
              </div>
            </div>

            <div className="mt-5 space-y-3">
              {["Read for 20 minutes", "Take a mindful break", "Practice a new skill"].map((item, i) => (
                <div key={item} className="flex items-center gap-3 rounded-xl border border-[#E6E8E3] p-3">
                  <span className={`grid h-7 w-7 place-items-center rounded-lg ${i < 2 ? "bg-[#F4C84A]" : "border border-[#D9DDD7]"}`}>
                    {i < 2 ? <CheckCircle2 size={16} /> : <span className="h-2 w-2 rounded-full bg-[#D9DDD7]" />}
                  </span>
                  <span className={`text-sm font-semibold ${i < 2 ? "text-[#737B82] line-through" : "text-[#20252B]"}`}>
                    {item}
                  </span>
                  <span className="ml-auto text-[10px] font-bold uppercase tracking-wider text-[#92999F]">
                    {i === 0 ? "Learning" : i === 1 ? "Wellbeing" : "Growth"}
                  </span>
                </div>
              ))}
            </div>

            <p className="mt-5 text-center text-xs text-[#92999F]">
              A missed day is a pause, not a full stop.
            </p>
          </div>
        </div>
      </section>

      <section id="approach" className="bg-[#20252B] px-6 py-20 text-white">
        <div className="mx-auto max-w-7xl">
          <p className="kicker !text-[#F4C84A]">A better way to build consistency</p>
          <h2 className="mt-3 max-w-2xl text-3xl font-black tracking-tight sm:text-4xl">
            Progress is more than an unbroken streak.
          </h2>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {features.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="rounded-2xl border border-[#41484F] bg-[#2A3037] p-6">
                <div className="mb-5 grid h-11 w-11 place-items-center rounded-xl bg-[#F4C84A] text-[#20252B]">
                  <Icon size={21} />
                </div>
                <h3 className="text-lg font-extrabold">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-[#B9C0C6]">{desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 flex flex-wrap items-center justify-between gap-5 border-t border-[#41484F] pt-8">
            <p className="text-sm text-[#B9C0C6]">
              A focused habit space for the IIT Dharwad community.
            </p>
            <Link href="/login" className="btn-primary inline-flex items-center gap-2">
              Join HabitFlow <ArrowUpRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      <footer className="px-6 py-6 text-center text-xs text-[#737B82]">
        HabitFlow · IIT Dharwad community project
      </footer>
    </main>
  );
}
