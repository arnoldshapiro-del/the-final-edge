import { Link } from 'react-router-dom'
import { SETUP_GALLERY, CANDLE_GALLERY, DONT_TRADE_GALLERY } from '../galleryData.jsx'
import { AnatomyCandle } from '../components/GalleryCharts.jsx'
import { Icon } from '../components/Icon.jsx'

function SectionTitle({ icon, label, kicker, color = 'violet' }) {
  const pillMap = { emerald: 'pill-emerald', coral: 'pill-coral', gold: 'pill-gold', violet: 'pill-violet', cyan: 'pill-cyan' }
  return (
    <div>
      <div className="flex items-center gap-2 mb-1">
        <Icon name={icon} className="w-5 h-5 text-violet2"/>
        <h2 className="font-display font-semibold text-2xl md:text-3xl text-textp tracking-tight">{label}</h2>
      </div>
      {kicker && <p className="text-texts text-[14px]">{kicker}</p>}
    </div>
  )
}

export default function Gallery() {
  return (
    <div className="space-y-12 max-w-5xl mx-auto">
      <header>
        <Link to="/learn" className="text-texts hover:text-textp text-[13px] flex items-center gap-1 font-display mb-3">
          <Icon name="back" className="w-4 h-4"/> Back to lessons
        </Link>
        <div className="pill pill-violet inline-flex mb-3"><Icon name="spark" className="w-3.5 h-3.5"/> Visual library</div>
        <h1 className="font-display font-semibold text-3xl md:text-4xl text-textp tracking-tight">See the edge — every angle.</h1>
        <p className="text-texts mt-2 max-w-2xl">Ten gallery charts of the setup, the candle anatomy that grades it, and the six patterns we never trade.</p>
      </header>

      {/* SETUP GALLERY */}
      <section className="space-y-5">
        <SectionTitle icon="target" label="Setup gallery" kicker="One edge, ten lenses." color="emerald"/>
        <div className="space-y-5">
          {SETUP_GALLERY.map(g => (
            <article key={g.id} className="space-y-2">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <h3 className="font-display font-semibold text-textp text-lg">{g.title}</h3>
              </div>
              {g.render()}
              <p className="text-texts text-[13px] font-body leading-relaxed">{g.caption}</p>
            </article>
          ))}
        </div>
      </section>

      {/* CANDLE ANATOMY */}
      <section className="space-y-5">
        <SectionTitle icon="flame" label="Candle anatomy" kicker="What it means at Dip 2." color="gold"/>
        <div className="grid md:grid-cols-2 gap-4">
          {CANDLE_GALLERY.map(c => (
            <AnatomyCandle key={c.id} entry={c} />
          ))}
        </div>
      </section>

      {/* DO NOT TRADE */}
      <section className="space-y-5">
        <SectionTitle icon="shield" label="Do NOT trade" kicker="Patterns the old you hunted. Not this one." color="coral"/>
        <div className="grid md:grid-cols-2 gap-4">
          {DONT_TRADE_GALLERY.map(d => (
            <article key={d.id} className="space-y-2">
              <h3 className="font-display font-semibold text-textp text-[15px]">{d.title}</h3>
              {d.render()}
              <p className="text-texts text-[13px] font-body leading-relaxed">{d.why}</p>
            </article>
          ))}
        </div>
      </section>

      <div className="text-center pt-4">
        <Link to="/trainer" className="btn btn-primary inline-flex"><Icon name="target" className="w-4 h-4"/> Drill it in the Trainer</Link>
      </div>
    </div>
  )
}
