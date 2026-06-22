import { Mic2 } from 'lucide-react'

export default function HeroSection() {
  return (
    <section className="spotlight-bg text-center py-10 md:py-14 px-4">
      <div className="animate-float inline-block mb-5">
        <div className="relative">
          <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-gradient-to-br from-[#ff6b35] to-[#e85d2a] flex items-center justify-center shadow-lg shadow-[rgba(255,107,53,0.2)]">
            <Mic2 className="w-8 h-8 md:w-10 md:h-10 text-[#08080c]" />
          </div>
          <div className="absolute -inset-1 rounded-2xl bg-gradient-to-br from-[#ff6b35]/20 to-[#00e5a0]/10 blur-md -z-10" />
        </div>
      </div>
      <h1 className="font-display text-5xl md:text-7xl font-black tracking-tight mb-3">
        即兴说
      </h1>
      <p className="text-[var(--text-secondary)] text-sm md:text-base max-w-sm mx-auto leading-relaxed">
        让AI像人一样说话，像即兴演讲一样自然
      </p>
      <div className="mt-3 flex items-center justify-center gap-2">
        <span className="inline-block w-8 h-px bg-gradient-to-r from-transparent to-[var(--accent)]/40" />
        <span className="text-[10px] text-[var(--text-secondary)] opacity-40 tracking-[0.3em] uppercase font-mono">
          Impromptu
        </span>
        <span className="inline-block w-8 h-px bg-gradient-to-l from-transparent to-[var(--accent)]/40" />
      </div>
    </section>
  )
}
