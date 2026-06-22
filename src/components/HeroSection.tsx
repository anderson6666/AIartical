import { Mic2 } from 'lucide-react'

export default function HeroSection() {
  return (
    <section className="spotlight-bg text-center py-12 md:py-16 px-4">
      <div className="animate-float inline-block mb-4">
        <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-[#ff6b35] to-[#e85d2a] flex items-center justify-center">
          <Mic2 className="w-7 h-7 md:w-8 md:h-8 text-[#0a0a0f]" />
        </div>
      </div>
      <h1 className="font-display text-4xl md:text-6xl font-black tracking-tight mb-3">
        即兴说
      </h1>
      <p className="text-[var(--text-secondary)] text-base md:text-lg max-w-md mx-auto leading-relaxed">
        让AI像人一样说话，像即兴演讲一样自然
      </p>
      <p className="text-[var(--text-secondary)] text-xs mt-2 opacity-60 tracking-widest uppercase">
        Impromptu
      </p>
    </section>
  )
}
