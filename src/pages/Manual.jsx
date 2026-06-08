import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Icon } from '../components/Icon.jsx'

// ───────────────────────────────────────────────────────────────────────────────
// Chapters — drive the Contents nav and the scroll anchors.
// PART ONE is flagged primary so it gets the "Start here" treatment.
// ───────────────────────────────────────────────────────────────────────────────
const CHAPTERS = [
  { id: 'p1',    label: 'PART ONE',   sub: 'The Game Plan',           pill: 'gold',    primary: true },
  { id: 'p2',    label: 'PART TWO',   sub: 'The System in Full',      pill: 'emerald' },
  { id: 'p3',    label: 'PART THREE', sub: 'Screen by Screen',        pill: 'cyan' },
  { id: 'p4',    label: 'PART FOUR',  sub: 'Daily Protocol',          pill: 'violet' },
  { id: 'p5',    label: 'PART FIVE',  sub: 'First Three Weeks',       pill: 'emerald' },
  { id: 'p6',    label: 'PART SIX',   sub: 'When It Gets Hard',       pill: 'coral' },
  { id: 'p7',    label: 'PART SEVEN', sub: 'Plain-Language Glossary', pill: 'muted' },
  { id: 'close', label: 'Closing',    sub: 'For Arnie, for Ela',       pill: 'gold' },
]

const PILL_FOR = {
  emerald: 'pill-emerald', coral: 'pill-coral', gold: 'pill-gold',
  violet: 'pill-violet', cyan: 'pill-cyan', muted: 'pill-muted',
}

// ───────────────────────────────────────────────────────────────────────────────
// Layout primitives — match Learn / TradePlan / Lock-it-in look exactly.
// ───────────────────────────────────────────────────────────────────────────────
function Section({ id, pill, label, sub, kicker, primary, children }) {
  const Wrapper = primary ? StartHereWrapper : 'section'
  const wrapProps = primary ? {} : { className: 'space-y-4' }
  return (
    <section id={id} className="scroll-mt-28">
      <Wrapper {...wrapProps}>
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          <span className={`pill ${PILL_FOR[pill] || 'pill-violet'} text-[11px]`}>{label}</span>
          {kicker && <span className="font-display text-textt text-[12px] tracking-wide uppercase">{kicker}</span>}
        </div>
        <h2 className={`font-display font-semibold tracking-tight ${primary ? 'text-3xl md:text-[40px] leading-[1.1] text-textp' : 'text-2xl md:text-3xl text-textp'}`}>
          {sub}
        </h2>
        <div className={primary ? 'mt-4 space-y-4' : 'mt-3'}>
          {children}
        </div>
      </Wrapper>
    </section>
  )
}

function StartHereWrapper({ children }) {
  return (
    <div className="card p-6 md:p-8 relative overflow-hidden" style={{ borderColor: 'rgba(255,179,71,0.45)' }}>
      <div aria-hidden className="pointer-events-none absolute -top-12 -right-12 w-72 h-72 rounded-full"
           style={{ background: 'radial-gradient(circle, rgba(255,179,71,0.15), transparent 65%)' }} />
      <div className="pill pill-gold inline-flex mb-3"><Icon name="flame" className="w-3.5 h-3.5"/> Start here · Read every morning</div>
      <div className="relative">{children}</div>
    </div>
  )
}

// Sub-header inside a part (### Pre-market — before the open, etc.)
function Sub({ children }) {
  return (
    <h3 className="font-display font-semibold text-textp text-lg md:text-xl tracking-tight mt-7 mb-3 flex items-baseline gap-2">
      <span className="text-emerald2 text-glow-emerald">▸</span>
      <span>{children}</span>
    </h3>
  )
}

// Standard prose paragraph
function P({ children }) {
  return <p className="text-textp font-body text-[15.5px] leading-[1.75] tracking-[0.005em] mt-3">{children}</p>
}

// Emphasised inline tokens
const Em  = ({ children }) => <em className="not-italic text-cyan2 font-medium">{children}</em>
const Str = ({ children }) => <strong className="text-gold font-semibold">{children}</strong>

// The IF → action decision line — the scannable live-decision element.
function If({ children }) {
  return (
    <div className="my-1.5 rounded-lg border-l-4 px-4 py-3" style={{ borderLeftColor: '#FFB347', background: 'rgba(255,179,71,0.05)' }}>
      <p className="text-textp font-body text-[14.5px] leading-[1.65]">{children}</p>
    </div>
  )
}
const IfTag = () => <span className="font-mono font-bold text-gold text-[13px] tracking-wider mr-1">IF</span>
const Arrow = () => <span className="font-mono text-emerald2 mx-1">→</span>
const At    = () => <span className="font-mono font-bold text-emerald2 text-[13px] tracking-wider mr-1">AT</span>
const Then  = () => <span className="font-mono font-bold text-emerald2 text-[13px] tracking-wider mr-1">THEN</span>

// Mantra callout
function Mantra({ children }) {
  return (
    <div className="my-4 text-center">
      <p className="font-display tracking-wide text-emerald2 text-glow-emerald text-lg md:text-xl">
        “{children}”
      </p>
    </div>
  )
}

// Generic ordered & unordered lists with on-brand markers
function OL({ children }) { return <ol className="list-decimal pl-6 mt-3 space-y-1.5 marker:text-violet2 marker:font-mono">{children}</ol> }
function UL({ children }) { return <ul className="list-none pl-0 mt-3 space-y-1.5">{children}</ul> }
function LI({ children }) { return <li className="text-textp font-body text-[15px] leading-[1.7] pl-6 relative before:absolute before:left-0 before:top-[0.55em] before:w-2 before:h-2 before:rounded-full before:bg-violet2/70">{children}</li> }
function NLI({ children }) { return <li className="text-textp font-body text-[15px] leading-[1.7]">{children}</li> }

// Inline cross-link to an in-app screen
function X({ to, children }) {
  return (
    <Link to={to} className="text-cyan2 underline decoration-cyan2/40 underline-offset-2 hover:decoration-cyan2 hover:text-cyan2 transition">
      {children}
    </Link>
  )
}

// ───────────────────────────────────────────────────────────────────────────────
// Page
// ───────────────────────────────────────────────────────────────────────────────
export default function Manual() {
  const [activeId, setActiveId] = useState('p1')
  const [tocOpen, setTocOpen] = useState(false)
  const observerRef = useRef(null)

  useEffect(() => {
    if (observerRef.current) observerRef.current.disconnect()
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter(e => e.isIntersecting)
      if (!visible.length) return
      const sorted = visible.sort((a, b) =>
        a.target.getBoundingClientRect().top - b.target.getBoundingClientRect().top
      )
      setActiveId(sorted[0].target.id)
    }, { rootMargin: '-15% 0px -70% 0px', threshold: [0, 0.2, 0.5, 1] })
    observerRef.current = observer
    CHAPTERS.forEach(c => {
      const el = document.getElementById(c.id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [])

  const onTocClick = (id) => (e) => {
    e.preventDefault()
    const el = document.getElementById(id)
    if (el) {
      const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches
      el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' })
    }
    setTocOpen(false)
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto print:max-w-none">
      <header className="print:hidden flex items-start justify-between gap-4 flex-wrap">
        <div className="min-w-0 flex-1">
          <div className="pill pill-gold inline-flex mb-3"><Icon name="book" className="w-3.5 h-3.5"/> Field manual</div>
          <h1 className="font-display font-semibold text-3xl md:text-4xl text-textp tracking-tight">THE FINAL EDGE — Field Manual &amp; Trader’s Briefing</h1>
          <p className="font-display text-texts text-lg mt-2">One setup. With the trend. Mastered.</p>
          <p className="text-texts text-[14px] mt-3 max-w-3xl leading-relaxed">
            <strong className="text-textp font-medium">How to use this manual:</strong> Read <a href="#p1" onClick={onTocClick('p1')} className="text-gold underline decoration-gold/40 underline-offset-2 hover:decoration-gold">PART ONE — THE GAME PLAN</a> every morning before the bell. It’s the exact playbook: the final plan in one breath, then step by step through the whole day, what to do and what to think, from pre-market to the close and after. Use the Contents menu to jump to any other part as reference — the system in full, every screen explained, your daily loop, your first three weeks, what to do when it gets hard, and a plain-language glossary.
          </p>
        </div>
        <button className="btn btn-ghost shrink-0" onClick={() => window.print()} aria-label="Print field manual">
          <Icon name="edit" className="w-4 h-4"/> Print
        </button>
      </header>

      {/* Mobile contents dropdown */}
      <div className="md:hidden print:hidden">
        <button
          className="w-full card p-3 flex items-center justify-between gap-2"
          onClick={() => setTocOpen(o => !o)}
          aria-expanded={tocOpen}
        >
          <span className="flex items-center gap-2 font-display tracking-wide text-textp text-[14px]">
            <Icon name="book" className="w-4 h-4 text-violet2"/>
            Contents · jump to…
          </span>
          <Icon name={tocOpen ? 'x' : 'arrow'} className="w-4 h-4 text-textt"/>
        </button>
        {tocOpen && (
          <nav className="card mt-2 p-2 animate-fadeup">
            <ul className="space-y-1">
              {CHAPTERS.map(c => (
                <li key={c.id}>
                  <a
                    href={`#${c.id}`}
                    onClick={onTocClick(c.id)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-md transition ${activeId === c.id ? 'bg-elevated text-textp' : 'text-texts hover:bg-elevated/60 hover:text-textp'}`}
                  >
                    <span className={`pill ${PILL_FOR[c.pill] || 'pill-violet'} text-[10px] shrink-0`}>{c.label}</span>
                    <span className="font-display text-[13px] truncate">{c.sub}</span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </div>

      <div className="flex gap-8 print:block">
        {/* Sticky Contents — desktop */}
        <aside className="hidden md:block w-60 shrink-0 print:hidden">
          <nav className="sticky top-6">
            <div className="font-display tracking-[0.16em] text-textt text-[11px] uppercase mb-3 pl-2">Contents</div>
            <ul className="space-y-1">
              {CHAPTERS.map(c => {
                const active = activeId === c.id
                return (
                  <li key={c.id}>
                    <a
                      href={`#${c.id}`}
                      onClick={onTocClick(c.id)}
                      className={`group flex items-start gap-2 px-3 py-2 rounded-md border transition ${
                        active
                          ? 'bg-elevated border-border text-textp shadow-[inset_0_0_0_1px_rgba(155,140,255,0.18)]'
                          : 'border-transparent text-texts hover:bg-elevated/60 hover:text-textp'
                      }`}
                    >
                      <span className={`pill ${PILL_FOR[c.pill] || 'pill-violet'} text-[10px] mt-0.5 shrink-0`}>{c.label}</span>
                      <span className="font-display text-[13px] leading-tight">{c.sub}</span>
                    </a>
                  </li>
                )
              })}
            </ul>
            <div className="mt-5 pl-2 text-[11px] font-mono text-textt">
              ⌐ Reading time ≈ 15 min<br/>Re-read PART ONE daily.
            </div>
          </nav>
        </aside>

        {/* Main content */}
        <main className="min-w-0 flex-1 space-y-12 print:space-y-8">
          {/* ─── PART ONE ────────────────────────────────────────────────── */}
          <Section id="p1" pill="gold" label="PART ONE" sub="THE GAME PLAN" kicker="Read this every morning before you trade. This is the plan. Follow it exactly." primary>
            <P>Arnie — this is it. Not a theory, not one more thing to study. This is the final game plan, the one we built out of everything the last five and a half years taught you. The knowledge was never your problem; the discipline under pressure was. So this plan does your discipline for you — it tells you exactly what to look for, exactly when to act, and exactly when to sit on your hands. Read it every single morning before the bell. When you can follow it without thinking, the turnaround stops being a hope and becomes simply what happens.</P>

            <div className="my-5 rounded-card border border-emerald2/40 bg-emerald2/5 p-5">
              <div className="font-display font-semibold tracking-[0.12em] uppercase text-emerald2 text-[12px] mb-2">The plan in one breath</div>
              <p className="text-textp font-body text-[15.5px] leading-[1.75]">
                Keep this in your head all day: We trade the M2K, one setup only — the with-trend flag, in either direction (bull flag long / bear flag short), with the trend. The 15-minute tells us <Str>IF</Str> there’s a trend; the 5-minute shows us <Str>WHERE</Str> the pullback (long) or bounce (short) is and whether it’s healthy; the 2-minute tells us <Str>WHEN</Str>. The pullback or bounce forming is part of the read, never an entry on its own. The ONE AND ONLY trigger is a 2-minute candle that CLOSES above the descending trendline (long) or BELOW the ascending trendline (short). The setup is alive only while price holds above the prior swing low (long) or below the prior swing high (short); a break of that level ends the trade. The stop has two steps: tentative 4 to 6 ticks past the broken trendline level, then FINAL at the STRUCTURE — the swing low at the bottom of the pullback (long) or the swing high at the top of the bounce (short). At our first target we take a third off and move the stop to breakeven so the trade can never hurt us again; we take more at the second target and let a runner ride. We never trade a range, never fight the trend, and we stop the moment we hit our limit. That is the entire edge. Everything below is just living it, hour by hour.
              </p>
            </div>

            <Sub>Pre-market — before the open</Sub>
            <P>Sit down. Open the app on <X to="/">Home</X> and read the Mission line out loud: <Em>grade yourself on following the plan, not on winning.</Em> That is your job today. Now run the Pre-market routine: pull up the 15-minute chart and decide one thing — is the market trending or not?</P>

            <If><IfTag/>the 15-minute is making higher highs and higher lows <Arrow/> today you are a <strong className="text-emerald2">buyer only</strong>. You look for longs and ignore every short.</If>
            <If><IfTag/>it’s making lower highs and lower lows <Arrow/> today you are a <strong className="text-coral">seller only</strong>. Shorts only.</If>
            <If><IfTag/>it’s doing neither — chopping sideways in a range <Arrow/> today may be a <strong className="text-gold">no-trade day</strong>, and that is a winning decision, not a wasted one. We do not trade ranges.</If>

            <P>Mark your key levels. Set your max trades and your max loss for the day right now, while you’re calm — because the calm version of you is the only one you can trust to set them. Then drill the <X to="/trainer">Trainer</X> for five to ten minutes. Do not take a single trade until you’re calling the traps right — the counter-trend reversal attempt, the sideways range, the chase. That warm-up is you sharpening the exact reflex that cost you years.</P>
            <P>The mindset to walk in with: <Em>I need one good setup, not ten. A day with one clean trade — or zero — and full discipline is a successful day. I am not here to be busy. I am here to be precise.</Em></P>

            <Sub>The open and the session — the live decision tree</Sub>
            <P>This is where you’ve lost money for five and a half years, so this is where the plan is law. The market will show you many things. You respond to exactly one of them. Here is what you do, in order, every time price moves:</P>

            <If><IfTag/>there is no 15-minute trend <Arrow/> you do nothing. You watch. You do not “find something.” <Str>No trend, no trade. Full stop.</Str></If>
            <If><IfTag/>the trend is in place and price pulls back on the 5-minute <Arrow/> good. Now you wait. You do not act on the pullback itself.</If>
            <If><IfTag/>price pulls back on the 2-min and starts printing lower highs against the descending trendline <Arrow/> the bull flag is forming. <strong className="text-coral">The shape on its own is NEVER the entry.</strong> You wait for the trendline close.</If>
            <If><IfTag/>a 2-minute candle <strong>CLOSES above the descending 2-min trendline</strong> (the diagonal connecting the lower highs of the flag) — long — or <strong>BELOW the ascending 2-min trendline</strong> (the diagonal connecting the higher lows of the bear-flag bounce) — short — <strong>AND</strong> a confirming candle prints (bullish engulfing/dragonfly for a long, bearish engulfing for a short) <strong>AND</strong> the 5-minute pullback held the prior swing and rode the 20 EMA (healthy, not knifing through) <Arrow/> now you have a setup. Run the <X to="/trade">6-step checklist</X>. If all six are true, enter all 6 contracts at the open of the next candle.</If>
            <If><IfTag/>the candle is weak, or price only poked through the trendline without closing <Arrow/> you <Str>WAIT</Str>. A poke is not a close. <Em>No trendline close, no trade.</Em></If>
            <If><IfTag/>you feel the pull to take a counter-trend reversal attempt, fade the trend, or trade anything in a range <Arrow/> <strong className="text-coral">name it out loud as the trap it is</strong>, and do not take it. That exact urge is the thing that broke you. The plan says no. (See the <X to="/learn/gallery">Do-Not-Trade gallery</X> for pictures of each trap.)</If>

            <P>When you do enter: use the calculator — direction, entry, stop. Put your stop a few ticks beyond the obvious crowd level. Then take your hands off the mouse. The trade is on; your job now is to manage it mechanically, not to feel it.</P>

            <If><At/>the first target (1R) <Arrow/> take a third off and move your stop to breakeven. Say it to yourself: <Em>this trade can no longer hurt me.</Em> That is the breath. Everything after this is a free roll.</If>
            <If><At/>the second target (2R) <Arrow/> take another third off.</If>
            <If><Then/><Arrow/> let the last third run, trailing behind the 9 EMA, toward the measured move (the height of the prior leg projected from your entry). <Em>Targets past the first are a bonus; you never move them to talk yourself into staying.</Em></If>
            <If><IfTag/>you get stopped out and you followed every rule <Arrow/> <strong className="text-emerald2">that was a good trade.</strong> Log it as a rule-following loss, which is exactly what a professional’s losses look like. You do not get angry, and you do not try to win it back. The urge to make it back is the most expensive feeling in this business, and it is always lying to you.</If>
            <If><IfTag/>you hit your max trades or your max loss <Arrow/> <strong className="text-coral">you are done for the day.</strong> The circuit breaker locks the screen. Do not fight it. Close the laptop. Tomorrow is a fresh, clean day.</If>

            <Sub>Midday — the chop</Sub>
            <P>Around late morning into the early afternoon the market often goes dead and directionless. This is a trap dressed up as opportunity.</P>
            <If><IfTag/>it’s chopping sideways <Arrow/> <strong className="text-gold">step away</strong>. Stretch, walk, get coffee. Doing nothing through the dead middle of the day is a skill, and it’s one you’re going to be great at. There is always another setup. Missing one costs you nothing; forcing one costs you real money.</If>

            <Sub>Into the close — the last hour to 4:00</Sub>
            <P>The final stretch can trend again, but be choosier than you were at the open.</P>
            <If><IfTag/>the trend has already made about five hard pushes with a climactic bar and a deep pullback <Arrow/> that’s exhaustion. <strong className="text-coral">Stop taking new entries in that direction</strong>; the move is ending.</If>
            <If><IfTag/>you only want a trade because the day is almost over <Arrow/> that is <strong className="text-coral">not a reason</strong>. Do not initiate a marginal trade into the close.</If>
            <P>Let the bell at 4:00 close the session. If you’re flat and disciplined, you’ve already won the day.</P>

            <Sub>After the close — the ritual that compounds</Sub>
            <P>You’re not done when the market is. Run the End-of-day review: did I follow the plan? what would I change? one honest line. Then open <X to="/stats">Stats</X> and look past the win rate — read your expectancy, your average win against your average loss, and above all your adherence. That adherence number is the only score that matters right now, because it’s the one you control completely and the one that predicts everything else. Once a week, check the <X to="/discipline">Discipline dashboard</X> to see which step you skip most (that’s next week’s Trainer focus) and check the Go-Live Verdict. Your target is never a date. Your target is <Str>GREEN LIGHT</Str>.</P>

            <Sub>Why this turns it around</Sub>
            <P>Be clear-eyed about what’s happening here. The thing that kept you in simulation for five and a half years was never missing knowledge — it was the gap between what you knew at night and what you did in the heat of the open. This plan closes that gap by taking the decision out of the moment of pressure: you decide everything in advance, in the calm, and during the session you only execute. The app enforces it so you can’t quietly cheat — the gate blocks the no-trend trade, the journal records the truth, the verdict holds the line on going live. Nobody can promise you a single day’s outcome; the market owes no one anything. But this is the honest mechanism by which losing traders become consistent ones: a real edge, executed with discipline, repeated enough times that variance turns into expectancy. Do the controllable thing — follow the plan — and the results are what follow.</P>
            <P>This is the Bible now. Not the books, not the next idea — this. Read it every morning. Trade it exactly. Sit out when it tells you to, take the trade when all six clear, take your third at 1R and breathe, and let the verdict — not your hopes — tell you when it’s time for real money. You are ready. The plan is sound, the discipline is built in, and the only two jobs left are reps and honesty.</P>
            <P>Open the app. Run pre-market. Drill the Trainer. And go become the trader you spent five and a half years learning how to be — for you, for Ela, for all of it. Let’s go.</P>
          </Section>

          {/* ─── PART TWO ────────────────────────────────────────────────── */}
          <Section id="p2" pill="emerald" label="PART TWO" sub="THE SYSTEM IN FULL" kicker="The locked plan, written out so you can find any piece in five seconds.">
            <P>Everything in the app points back to this. When a screen mentions a rule, this is the rule.</P>

            <P><Str>The one rule.</Str> Take one setup: the second entry, in the direction of the trend. Everything else is a variation on, or a guardrail around, that single sentence.</P>

            <Sub>What we trade, and when</Sub>
            <UL>
              <LI><Str>Instrument:</Str> M2K (micro Russell 2000) on NinjaTrader. One instrument. Master it.</LI>
              <LI><Str>Chart for entries:</Str> the 2-minute.</LI>
              <LI><Str>Session window:</Str> trade the part of the day with real directional movement — typically the strong push around and after the cash-session open — and stay out of the dead, choppy middle of the day. Set your own session limits in the routine and <X to="/settings">Settings</X>: a max number of trades and a max loss for the day. When you hit either, you’re done.</LI>
            </UL>

            <div className="my-5 rounded-card border border-gold/40 bg-gold/5 p-5">
              <div className="font-display font-semibold tracking-[0.12em] uppercase text-gold text-[12px] mb-2">Bull flag &amp; bear flag — same one setup, opposite directions</div>
              <p className="text-textp font-body text-[15px] leading-[1.75]">
                Arnie — this is one setup, traded with the trend in both directions: <Str>bull flag</Str> in an uptrend (long) or <Str>bear flag</Str> in a downtrend (short). The <Em>pole</Em> is the trend leg; the <Em>flag</Em> is the counter-move that builds against it. The flag's <Em>defining boundary</Em> is its TRENDLINE — descending for a bull flag (connecting the lower highs of the pullback), ascending for a bear flag (connecting the higher lows of the bounce). The TRIGGER, in both directions, is the FIRST 2-minute candle that CLOSES through the trendline. No retest. No second close. The shape of the pullback or bounce is part of the read, but it is never the entry on its own — only the trendline close gets you in.
              </p>
            </div>

            <div className="my-5 rounded-card border border-violet2/40 bg-violet2/5 p-5">
              <div className="font-display font-semibold tracking-[0.12em] uppercase text-violet2 text-[12px] mb-2">M2K math at a glance</div>
              <ul className="text-textp font-body text-[15px] leading-[1.75] space-y-1.5 list-disc pl-5 marker:text-violet2">
                <li>1 tick = <Str>0.10 pts</Str> = <Str>$0.50 / contract</Str>.</li>
                <li>1 point = <Str>10 ticks</Str> = <Str>$5 / contract</Str>.</li>
                <li>A <Em>"few ticks"</Em> past the structure = <Str>0.20 – 0.50 pts</Str> of buffer.</li>
                <li>A 2-point stop on 6 contracts = <Str>$60 risk</Str>. That is your <Str>1R</Str> — the unit everything else is measured in.</li>
              </ul>
              <p className="text-texts font-body text-[13px] mt-3">M2K pays <Str>$5.00 per index point</Str>, and there are <Str>10 ticks to a point</Str> — so each tick is $0.50. Count your ticks in chunks of 10. Express stops in <Str>points</Str> or <Str>R</Str> whenever you can; ticks are just the fine grain.</p>
            </div>

            <Sub>The three timeframes — IF / WHERE / WHEN</Sub>
            <UL>
              <LI><Str>15-minute = IF.</Str> Is there a trend at all? Higher highs <em>AND</em> higher lows → look only for longs (bull flags). Lower highs <em>AND</em> lower lows → look only for shorts (bear flags). Neither → no trade today on this name. <Em>This is the gate.</Em> Nothing happens until it’s green.</LI>
              <LI><Str>5-minute = WHERE.</Str> The pullback, and whether it’s buyable. <Em>Healthy</Em> = holds above the prior swing low (longs) / below the prior swing high (shorts) AND rides just above a rising 20 EMA (longs) / just below a falling 20 EMA (shorts). <Em>Unhealthy</Em> = knifes well past the 20 EMA and keeps going, or breaks the prior swing point → skip.</LI>
              <LI><Str>2-minute = WHEN.</Str> The trigger / the entry — the FIRST 2-minute candle that closes ABOVE the descending 2-min trendline (longs) or BELOW the ascending 2-min trendline (shorts). The trendline is the flag's <em>defining boundary</em>. The shape of the pullback or bounce is never the entry on its own — only the trendline close gets you in.</LI>
            </UL>
            <Mantra>The mantra: 15 says IF; 5 and 2 say WHEN and WHERE.</Mantra>

            <div className="my-5 rounded-card border border-cyan2/40 bg-cyan2/5 p-5">
              <div className="font-display font-semibold tracking-[0.12em] uppercase text-cyan2 text-[12px] mb-1">The three timeframes — each does ONE job</div>
              <div className="font-display text-texts text-[12px] italic mb-3">(and the 5-minute "lower high" is NOT a contradiction)</div>
              <ul className="list-disc pl-5 space-y-2 text-textp font-body text-[14.5px] leading-[1.7]">
                <li><Str>15-minute = THE TREND (the IF).</Str> This is the one that must be higher highs / higher lows. This is your permission to be long at all.</li>
                <li><Str>5-minute = THE PULLBACK HEALTH (the WHERE).</Str> During a pullback, the 5-minute will print a lower high — that lower high IS the pullback. It's supposed to happen. It does not break the uptrend, as long as the pullback holds above the prior swing low and ideally rides the rising 20 EMA. What you reject is the 5-minute breaking BELOW its prior swing low — that's real trend damage, and you skip.</li>
                <li><Str>2-minute = THE TRIGGER (the WHEN).</Str> The close above the flag trendline.</li>
              </ul>
              <p className="text-textp font-body text-[14px] mt-3 leading-[1.7]"><strong>For shorts (bear flag): mirror.</strong> 15-minute downtrend is permission; the 5-minute will print a HIGHER LOW during the bounce (that higher low IS the bounce, not a reversal); reject only if the 5-minute breaks ABOVE its prior swing high; the 2-minute close BELOW the trendline is the trigger.</p>
            </div>

            <Sub>The entry — the ONLY trigger is the 2-minute trendline close</Sub>
            <P>As the pullback builds at the base of the flag, treat it as part of the read — never as an entry. The shape forming tells you a trendline close is becoming likely; that is all it tells you.</P>
            <P><Str>Do NOT enter on a chart shape. Do NOT enter on a "price trigger."</Str></P>
            <P>Wait for a 2-minute candle to <Str>CLOSE above the descending trendline</Str>. That close is your one and only trigger. The moment it closes above the line, enter all 6 contracts at the open of the next candle.</P>

            <div className="my-4 rounded-card border border-gold/40 bg-gold/5 p-4">
              <p className="font-display tracking-wide text-gold text-[14.5px] leading-[1.65]">The close is your edge — wait for it. Anticipating the trigger is how you hand that edge back.</p>
            </div>

            <P><Str>The invalidation.</Str> The setup is alive as long as price holds above the prior swing low. The moment the pullback breaks that prior low, the setup is dead — no trade, no matter how clean the shape looked.</P>

            <OL>
              <NLI>In an established uptrend, price pulls back into the flag and the 5-min starts printing lower highs.</NLI>
              <NLI>The pullback holds above the prior swing low and ideally rides just above the rising 20 EMA — healthy.</NLI>
              <NLI>A confirming candle prints at the trendline close — ideally a <Em>bullish engulfing</Em> or a <Em>dragonfly doji</Em>. A weak little doji is not confirmation.</NLI>
              <NLI><Str>TRIGGER:</Str> the FIRST 2-minute candle that CLOSES above the descending 2-min trendline. Enter all 6 contracts at the open of the next candle. <Em>No retest. No second close. A poke through that doesn’t close through is nothing.</Em></NLI>
            </OL>
            <P className="mt-3 text-texts text-[13px]">See it drawn: the <X to="/learn/gallery">flagship long entry chart (G1)</X> and the bear-flag mirror (G2) in the Visual Library.</P>

            <Sub>BEAR FLAG — exact mirror (same one setup, opposite direction)</Sub>
            <P><Str>Higher-timeframe filter (MANDATORY for shorts):</Str> the 15-minute must be in a downtrend — lower highs and lower lows.</P>
            <UL>
              <LI><Str>Pole</Str> = a sharp drop.</LI>
              <LI><Str>Flag</Str> = price drifting UP on lighter volume; a small rising channel against the downtrend (higher highs and higher lows of the bounce).</LI>
              <LI><Str>Defining boundary</Str> = the <Str>ASCENDING trendline</Str> connecting the <Str>HIGHER LOWS</Str> (the lower edge of the rising flag).</LI>
              <LI><Str>The shape forming is NOT the entry.</Str> As the bounce builds and prints higher lows against the ascending trendline, that's part of the read — it tells you a trendline close is becoming likely. Nothing more.</LI>
              <LI><Str>TRIGGER</Str> = a 2-minute candle CLOSING BELOW the ascending (higher-lows) trendline. Enter all 6 contracts short at the open of the next candle.</LI>
              <LI><Str>Invalidation</Str>: the setup is alive as long as price holds below the prior swing high. A break above that prior high kills the trade.</LI>
            </UL>
            <P><Str>STOP (mirror of the bull-flag stop):</Str></P>
            <UL>
              <LI><Str>Tentative:</Str> 4 to 6 ticks ABOVE the broken trendline (the trendline level at the break, NOT above the breakout candle's close).</LI>
              <LI><Str>Final:</Str> just beyond the structure — the swing HIGH at the top of the bounce.</LI>
            </UL>
            <P><Str>BEAR-FLAG SPECIFICS:</Str></P>
            <UL>
              <LI>Time stop is <Str>TIGHTER</Str>: <Str>2 candles (4 minutes), not 3</Str>. Bear flags work fast or they fail.</LI>
              <LI>Same logic as longs: only the trendline close gets you in.</LI>
            </UL>
            <P>Timeframes for shorts mirror the longs: 15-minute downtrend is permission; the 5-minute will print a HIGHER LOW during the bounce (that higher low IS the bounce, not a reversal); reject only if the 5-minute breaks ABOVE its prior swing high; the 2-minute close below the trendline is the trigger.</P>

            <Sub>The 20 EMA health check</Sub>
            <P>The 20-period average on the 5-minute is your honesty test for the pullback:</P>
            <UL>
              <LI><strong className="text-emerald2">Healthy</strong> → a shallow pullback that holds just above a rising 20 EMA. <Em>Take it.</Em></LI>
              <LI><strong className="text-coral">Unhealthy</strong> → a pullback that slices well below the 20 EMA and keeps going. <Em>Skip it.</Em> The trend is sick; you don’t catch a sick trend.</LI>
            </UL>

            <Sub>The candle grades — what’s printing at the trendline close tells you the quality</Sub>
            <UL>
              <LI><Str>Bullish engulfing</Str> — A+. Strong demand swallowed the prior bar.</LI>
              <LI><Str>Dragonfly doji</Str> — A+ / strong. Sellers tried, failed, buyers slammed it back up.</LI>
              <LI><Str>Morning star (3-bar)</Str> — strong, rare. A beautiful reversal when you get it.</LI>
              <LI><Str>Bearish engulfing</Str> — A+ for shorts.</LI>
              <LI><Str>Weak / star doji</Str> — low conviction. Indecision is not a signal. Pass or wait for better.</LI>
            </UL>
            <P className="mt-3 text-texts text-[13px]">Zoomed, labeled candles live in the <X to="/learn/gallery">Candle Anatomy gallery</X>.</P>

            <Sub>The stop — TWO STEPS, read carefully</Sub>
            <P><Str>STEP 1 — TENTATIVE: 4 to 6 ticks below the broken trendline.</Str> "Below the broken trendline" means below the PRICE LEVEL OF THE TRENDLINE ITSELF, at the exact spot where price punched through it. It does <Em>NOT</Em> mean 4 to 6 ticks below where the breakout candle closed. The candle's close is only the trigger — it is never the stop reference. (A strong breakout candle closes far above the line; a weak one barely above. Your stop must not depend on that.)</P>
            <P><Str>STEP 2 — FINAL (my adjustment): move the stop to just beyond the STRUCTURE</Str> — the swing low at the bottom of the pullback (long) or the swing high at the top of the bounce (short). Depending on exactly where that swing sits, this may land a few ticks higher or a few ticks lower than the tentative spot. I make that call.</P>
            <P><Str>Why the structure is the better stop:</Str> a stop tucked tight under the diagonal trendline gets wicked out on a normal retest. A stop just beyond the structure only triggers if the pattern has actually failed. Because premature stop-outs have been the costliest leak in this trader's results, anchor the stop to the structure.</P>
            <UL>
              <LI><strong className="text-emerald2">Long (bull flag):</strong> tentative 4-6 ticks below the broken trendline level; final at the swing low at the bottom of the pullback.</LI>
              <LI><strong className="text-coral">Short (bear flag):</strong> tentative 4-6 ticks above the broken trendline level; final at the swing high at the top of the bounce.</LI>
            </UL>
            <Mantra>The mantra: Tentative at the trendline. Final at the structure.</Mantra>
            <P className="text-texts text-[13px]">A visual: the <X to="/learn/gallery">stop-hunt chart</X> shows a wick taking the crowd, your stop surviving, the reversal.</P>

            <Sub>The exit — 2-2-2 + breakeven + runner</Sub>
            <P>Think of your position in thirds:</P>
            <OL>
              <NLI>At <Str>T1 (1R)</Str> — the trade has moved one unit of risk in your favor — scale off the first third and immediately move your stop to breakeven. <Em>The trade can no longer hurt you.</Em> This is non-negotiable and it’s the act that lets you stay calm.</NLI>
              <NLI>At <Str>T2 (2R)</Str> — scale off the second third.</NLI>
              <NLI>Let the final third run, trailing behind the 9 EMA, toward a <Str>measured-move target</Str> — the height of the prior leg (the “flagpole”) projected from your entry.</NLI>
            </OL>
            <Mantra>The mantra: Targets beyond T1 are bonus — never recalculated.</Mantra>
            <P className="text-texts text-[13px]">The <X to="/learn/gallery">2-2-2 ladder</X> animates each fill; the <X to="/learn/gallery">measured-move chart</X> shows the flagpole projection.</P>

            <Sub>Anatomy of a trend — which push to trade</Sub>
            <P>A healthy trend tends to make a handful of pushes:</P>
            <UL>
              <LI><Str>Pushes 1–2:</Str> highest probability. This is your bread and butter.</LI>
              <LI><Str>Pushes 3–4:</Str> A+ setups only. Be choosier.</LI>
              <LI><Str>Push 5+</Str> with a climactic bar and a deep pullback: <strong className="text-coral">exhaustion</strong>. Stop taking new entries in that direction. The party’s ending.</LI>
            </UL>

            <Sub>The never-trade list</Sub>
            <P>You do not take any of these, <Em>ever</Em>:</P>
            <UL>
              <LI>A counter-trend long against a downtrend (trying to buy a downtrend on any pullback shape).</LI>
              <LI>A counter-trend short against an uptrend (trying to short a healthy uptrend — with-trend only).</LI>
              <LI>A head &amp; shoulders as a reversal bet.</LI>
              <LI>A symmetrical triangle.</LI>
              <LI>A trading range / sideways market — clean bounces but no trend. <Em>We don’t trade ranges; we sit out.</Em></LI>
              <LI>A standalone candle with no trend context. A pretty candle in a vacuum means nothing.</LI>
            </UL>
            <P className="text-texts text-[13px]">All six are drawn in the <X to="/learn/gallery">Do-Not-Trade gallery</X>.</P>

            <Sub>The 6-step gate</Sub>
            <P>The <X to="/trade">cockpit’s checklist</X> walks you through this exact sequence before you’re allowed to log a trade. Read the on-screen wording and match it to these — they’re the same system:</P>
            <OL>
              <NLI><Str>Trend on the 15-minute</Str> (the hard gate). HH/HL or LH/LL. No trend → the screen blocks you and says <strong className="text-coral">NO TRADE — SIT OUT</strong>.</NLI>
              <NLI><Str>With-trend direction only.</Str> You’re going the way the 15-minute is going. Never against it.</NLI>
              <NLI>The 5-minute pullback (long) or bounce (short) is <Str>healthy</Str> — holding the prior swing low (long) or prior swing high (short), riding the 20 EMA, not knifing through.</NLI>
              <NLI>A <Str>confirming candle</Str> has printed at the trendline close (engulfing / dragonfly, not a weak doji).</NLI>
              <NLI>The <Str>FIRST 2-minute candle has CLOSED above the descending trendline</Str> (long) or <Str>BELOW the ascending trendline</Str> (short). <Em>The trendline close is the ONLY trigger.</Em></NLI>
              <NLI><Str>Stop placed at the STRUCTURE</Str> (swing low at the bottom of the pullback for longs; swing high at the top of the bounce for shorts), tentative 4-6 ticks past broken trendline first.</NLI>
            </OL>
            <P>If all six are true, you have a trade. If even one is false, you don’t. It really is that mechanical — and that’s the point.</P>
          </Section>

          {/* ─── PART THREE ──────────────────────────────────────────────── */}
          <Section id="p3" pill="cyan" label="PART THREE" sub="THE PROGRAM, SCREEN BY SCREEN" kicker="Every part of the app, what it’s for, and how to actually use it.">
            <P><X to="/"><Str>Home</Str></X> — your launchpad and your conscience. At the top is the Mission card — the line “Grade yourself on following the plan, not on winning.” Read it every single time you land here. It’s editable if you ever want to make it yours, but those words are the whole philosophy in one sentence, so I’d leave them. Below that are your transformation tiles — including a clean-day streak that updates itself: when a sim trading day ends net-green it ticks up, and a red day resets it. Home also surfaces your Pre-market routine and End-of-day review, your Go-Live Verdict mirrored from Stats, and a Trader’s toolkit row with one-tap access to your Field Manual (start here), Trade Plan, Discipline dashboard, and Visual Library. <Em>How to use it:</Em> this is your first and last screen of every trading day.</P>

            <P><X to="/learn"><Str>Learn</Str></X> — the ten lessons. The curriculum, in the calm masterclass voice. Ten lessons, each with a “Lock-it-in” box. Several ship with live charts: the flagship pullback → trendline-close entry chart (Lesson 3), the 2-2-2 ladder (Lesson 7), healthy vs. unhealthy pullback with the 20/9 EMAs (Lesson 4), and the two-step stop chart (Lesson 6). <Em>How to use it:</Em> read all ten once in sequence in your first couple of days, then treat Learn as reference. Re-read any lesson the day after you break its rule.</P>

            <P><X to="/learn/gallery"><Str>Learn → Visual Library</Str></X> — your picture book of the whole system, 21 hand-built charts. Setup Gallery (G1–G10): the long entry fully annotated, its short mirror, the 3-panel 15/5/2, 20 EMA health side by side, the animated 2-2-2 ladder, the stop-hunt, first-bounce-is-the-bait, anatomy of a trend, the breakeven mechanic, and the measured move — several animate; press Play and watch the setup form bar by bar. Candle Anatomy (5): zoomed, labeled diagrams of every grade candle. Do-Not-Trade (6): every forbidden pattern, drawn and stamped “NOT THIS,” with a one-line why. <Em>How to use it:</Em> when a concept is fuzzy, see it here instead of re-reading words; spend real time in the Do-Not-Trade gallery, because not-trading the wrong thing is half your edge.</P>

            <P><X to="/trainer"><Str>Trainer</Str></X> — “Trade or Skip.” The flight simulator, and the most important screen for the next three weeks. You’re shown a chart and context, and you call it: Long, Short, Skip, or Wait. Eighteen scenarios per round, shuffleable, loaded with the exact traps that cost you years. Your accuracy this round and all-time is tracked, and the round summary breaks accuracy down by type — valid longs, valid shorts, waits, traps avoided. Three modes: <Str>Instant</Str> (see the finished chart, call it — fast reps); <Str>Watch it form</Str> (the chart animates bar by bar and you call it only after it draws — trains reading a setup as it develops); <Str>Step through</Str> (only the first few bars show; reveal one at a time and call early — closest to live decision-making). <Em>How to use it:</Em> this is your daily warm-up, every session, before you trade — five to ten minutes minimum. Don’t quit the round until you’re calling the traps right. Move Instant → Watch-it-form → Step-through as you improve.</P>

            <P><X to="/flashcards"><Str>Flashcards</Str></X> — eighteen cards covering every mantra. Space-bar to flip, arrows to mark whether you knew it; the deck rotates your weakest cards first. <Em>How to use it:</Em> two minutes a day; keeps the vocabulary of the system on the tip of your tongue.</P>

            <P><X to="/trade"><Str>The Trade Cockpit</Str></X> — where you take and log trades. The 6-step checklist with the hard gate: Step 1 is a hard gate — if the 15-minute trend isn’t there and you leave it unchecked, the screen shows a calm “NO TRADE — SIT OUT” panel and blocks you from logging. <Em>When it blocks you, that is a win.</Em> The calculator: enter direction, entry, and stop, and it instantly gives risk in points, T1 (1R), T2 (2R), risk:reward, and the 2-2-2 split, plus the move-stop-to-breakeven reminder, and it catches a stop on the wrong side. The journal: log every trade with its direction badge, grade (A+/B), candle, a SIM/LIVE tag, and the All-6 vs. Rule-breach pill; it tallies total R and lets you edit/delete. Keyboard shortcuts (desktop): <kbd className="font-mono text-[12px] px-1.5 py-0.5 rounded border border-border bg-bg text-textp">1</kbd>–<kbd className="font-mono text-[12px] px-1.5 py-0.5 rounded border border-border bg-bg text-textp">6</kbd> toggle each step, <kbd className="font-mono text-[12px] px-1.5 py-0.5 rounded border border-border bg-bg text-textp">E</kbd> jumps to the entry field, <kbd className="font-mono text-[12px] px-1.5 py-0.5 rounded border border-border bg-bg text-textp">S</kbd> saves (only if all six are checked and prices are valid), <kbd className="font-mono text-[12px] px-1.5 py-0.5 rounded border border-border bg-bg text-textp">?</kbd> opens the shortcut list, <kbd className="font-mono text-[12px] px-1.5 py-0.5 rounded border border-border bg-bg text-textp">Esc</kbd> closes dialogs. <Em>How to use it:</Em> run the checklist for every potential setup; if it blocks you, sit out and feel good; if it clears, use the calculator, take the sim trade, and log it honestly, including breaches.</P>

            <P><X to="/stats"><Str>Stats</Str></X> — the numbers that actually matter. This screen never shows your win rate alone — it always pairs it with average win, average loss, and expectancy. Filter by SIM / LIVE / All. You get a cumulative-R equity curve with a by-trade / by-day toggle, a rule-adherence tile, and distributions by grade and by candle. The <Str>Go-Live Verdict</Str> lives here (and mirrors to Home): <strong className="text-emerald2">GREEN LIGHT</strong> only when all four are true — at least 20 trades, positive expectancy, rule-adherence ≥ 90%, and win rate ≥ 50%. Otherwise <strong className="text-coral">NOT YET</strong>, telling you exactly which criterion is short and by how much. <Em>How to read yourself honestly:</Em> after each session, look past the win rate — is your expectancy positive? Is your average win bigger than your average loss? And above all, what’s your adherence? Adherence is the number you control completely and the one that predicts everything else. A high-adherence week with a flat P&amp;L is a successful week.</P>

            <P><Str>The Circuit Breaker</Str> — when you hit your max trades or max loss for the session, the app throws a full-screen lock: “You’re done for today — protect the account.” <Em>How to use it:</Em> don’t fight it. It exists for the exact moment your judgment is most compromised — after a hard loss, when the urge to make it back is screaming. When it locks, close the laptop and walk. Tomorrow is another clean day.</P>

            <P><X to="/discipline"><Str>Discipline Dashboard (/discipline)</Str></X> — your character report card. Clean-session streak, clean-days ratio, overall adherence %, and a “the good vs. the dangerous” twin tile that puts rule-following losses in emerald (good!) and rule-breaking wins in coral (dangerous). A rule-break distribution bar shows which step you skip most, plus a recent-days table and a tilt watch for over-trading or trading-after-a-loss without the full checklist. <Em>How to use it:</Em> check it a couple of times a week; if the bar shows you keep skipping the same step, that’s your Trainer homework.</P>

            <P><X to="/plan"><Str>Trade Plan Card (/plan)</Str></X> — a single, beautiful, printable page with the entire locked system on it. There’s a Print button that swaps to clean white-paper/dark-ink styling. <Em>How to use it:</Em> print it and tape it next to your monitor. When you’re in a trade and your pulse is up, your eyes can land on the card instead of your impulses.</P>

            <P><Str>Pre-market Routine &amp; End-of-day Review (on Home)</Str> — Pre-market: mark the 15-minute trend, note key levels, set your max trades and max loss. End-of-day: did I follow the plan? what would I change? a one-line summary. <Em>How to use it:</Em> never skip either. Bookending every session with these two is most of how a disciplined trader is actually made.</P>

            <P><X to="/settings"><Str>Settings</Str></X> — save your preferences (you’ll get a “Saved” confirmation), and find the Danger Zone to reset the journal or everything, each behind a confirmation. The app also installs to your phone or tablet as “Final Edge” and works offline after the first visit, so you can drill the Trainer anywhere.</P>
          </Section>

          {/* ─── PART FOUR ──────────────────────────────────────────────── */}
          <Section id="p4" pill="violet" label="PART FOUR" sub="YOUR DAILY PROTOCOL" kicker="The loop that turns the plan into who you are.">
            <Sub>Before the open (10–15 minutes)</Sub>
            <OL>
              <NLI>Open the app. Read the Mission line on <X to="/">Home</X>.</NLI>
              <NLI>Run the Pre-market routine — mark the 15-min trend, note key levels, set your max trades and max loss.</NLI>
              <NLI>Glance at the <X to="/plan">Trade Plan card</X> (or the printed copy by your screen).</NLI>
              <NLI>Drill the <X to="/trainer">Trainer</X> for 5–10 minutes. <Em>Don’t stop until you’re calling the traps right.</Em></NLI>
            </OL>

            <Sub>During the session (sim)</Sub>
            <OL>
              <NLI>For every potential setup, run the <X to="/trade">6-step checklist</X>.</NLI>
              <NLI>If any step blocks you → <Em>sit out.</Em> That’s the app working. Feel good about it.</NLI>
              <NLI>If it clears → use the calculator, take the sim trade, and log it honestly — including the All-6/breach flag.</NLI>
              <NLI>The instant T1 fills → scale a third, stop to breakeven. <Em>Always.</Em></NLI>
              <NLI>When the circuit breaker locks → you’re done. No exceptions.</NLI>
            </OL>

            <Sub>After the close (5 minutes)</Sub>
            <OL>
              <NLI>Run the End-of-day review.</NLI>
              <NLI>Open <X to="/stats">Stats</X> — read past the win rate to your expectancy, average win vs. loss, and adherence.</NLI>
            </OL>

            <Sub>Once a week</Sub>
            <OL>
              <NLI>Check the <X to="/discipline">Discipline dashboard</X> — which step do you break most? That’s next week’s Trainer focus.</NLI>
              <NLI>Check the Go-Live Verdict. <Em>Your target is not a date. Your target is GREEN LIGHT.</Em></NLI>
            </OL>
          </Section>

          {/* ─── PART FIVE ──────────────────────────────────────────────── */}
          <Section id="p5" pill="emerald" label="PART FIVE" sub="THE FIRST THREE WEEKS" kicker="A concrete rhythm, so “go get your reps” has a shape.">
            <div className="card-elev rounded-card p-4 md:p-5 border border-border mt-2">
              <div className="font-display font-semibold text-emerald2 text-lg mb-1">Week 1 — See it.</div>
              <p className="text-textp font-body text-[15px] leading-[1.7]">Read all ten <X to="/learn">Learn lessons</X> and walk the entire <X to="/learn/gallery">Visual Library</X>, including every Do-Not-Trade chart. Each session: full pre-market, then 10 minutes of Trainer in <Str>Instant</Str> mode before you trade sim. <Em>Goal:</Em> trap-accuracy above 90% in Instant mode. Trade sim lightly — the point this week is recognition, not volume. End every day with the review.</p>
            </div>
            <div className="card-elev rounded-card p-4 md:p-5 border border-border">
              <div className="font-display font-semibold text-cyan2 text-lg mb-1">Week 2 — Call it live-style.</div>
              <p className="text-textp font-body text-[15px] leading-[1.7]">Move your Trainer warm-up to <Str>Watch-it-form</Str>, then <Str>Step-through</Str>. This week you’re training to commit before you know the outcome. Trade your sim sessions normally through the full checklist. Start watching your <X to="/discipline">Discipline dashboard</X> — find the one step you skip most and drill exactly that. <Em>Goal:</Em> adherence ≥ 90% on your logged sim trades, regardless of P&amp;L.</p>
            </div>
            <div className="card-elev rounded-card p-4 md:p-5 border border-border">
              <div className="font-display font-semibold text-gold text-lg mb-1">Week 3 — Prove it.</div>
              <p className="text-textp font-body text-[15px] leading-[1.7]">Keep the warm-up. Trade sim with full process every session. Your <X to="/stats">Stats</X> and Verdict start to mean something now — you’re building toward 20+ trades with positive expectancy and 90%+ adherence. <Em>Goal:</Em> a <Str>GREEN LIGHT</Str> that’s earned, not squeaked.</p>
            </div>

            <Sub>The go-live gate — read this twice</Sub>
            <P>Go to real money only when the app says <Str>GREEN LIGHT</Str> — and ideally after it’s stayed green across a solid run of trades, not the instant trade #20 flips it (twenty is a thin sample; you want the verdict to hold steady, not flicker). If three weeks pass and it still says <strong className="text-coral">NOT YET</strong>, you keep practicing. <Em>The calendar does not override the verdict.</Em> When you do go live: one micro, the same checklist, the same everything. The app doesn’t change. Only the stakes do. And your job stays identical — follow the plan, tell the truth.</P>
          </Section>

          {/* ─── PART SIX ──────────────────────────────────────────────── */}
          <Section id="p6" pill="coral" label="PART SIX" sub="WHEN IT GETS HARD" kicker="The human side. The part that’s about the brain, not the chart.">
            <Sub>After a string of losses</Sub>
            <P>First: were they rule-following losses? If yes, you did nothing wrong — the market just didn’t pay this time, and that’s normal even with a real edge. Check your <X to="/discipline">Discipline screen</X>; if your adherence is high, you are winning even while the P&amp;L is red. If the losses were rule breaks, the fix isn’t to trade more — it’s to go back to the <X to="/trainer">Trainer</X> and re-drill until the reflex is clean. Either way, the circuit breaker is your friend, not your jailer.</P>

            <Sub>The urge to make it back</Sub>
            <P>This is the single most expensive feeling in trading. It arrives right after a loss and whispers “one quick trade to get even.” <Em>It is always lying.</Em> The trade it wants you to take is never an A+ setup — it’s whatever’s in front of you, which means it’s a rule break, which means it’s how a bad day becomes a catastrophic one. When you feel it: stop, look at the Mission line, and if the breaker has tripped, obey it. <Em>Walking away with a small loss intact is a victory.</Em></P>

            <Sub>Boredom in a range</Sub>
            <P>Most of the trading day is not tradable. When the market goes sideways, your edge is to do nothing, and nothing is hard — boredom makes people invent setups that aren’t there. The <X to="/learn/gallery">Do-Not-Trade gallery</X> exists for exactly this. <Em>Sitting out a range is a skilled act.</Em> Get good at it.</P>

            <Sub>FOMO and the chase</Sub>
            <P>When price is already running and you didn’t get in, the move is gone — chasing it puts you in with no pullback, no defined risk, right before the pause. <Em>There is always another setup. Missing one costs you nothing. Chasing one costs you real money.</Em></P>

            <Sub>“I can’t find a setup today.”</Sub>
            <P>Good — that means there wasn’t one, and you correctly didn’t force it. <Em>A day with zero trades and full adherence is a perfect day.</Em> The pros sit on their hands far more than beginners imagine.</P>

            <Sub>The temptation to build instead of trade</Sub>
            <P>I’ll say this once, as your friend: you are brilliant at building, and building feels productive and safe in a way that trading doesn’t. But the app is finished, and another feature won’t make you a trader — <Str>reps will</Str>. When you feel the pull to go add something instead of sitting your session, recognize it for what it is, and open the <X to="/trainer">Trainer</X> instead. <Em>The cockpit is done. Now you fly it.</Em></P>
          </Section>

          {/* ─── PART SEVEN ─────────────────────────────────────────────── */}
          <Section id="p7" pill="muted" label="PART SEVEN" sub="PLAIN-LANGUAGE GLOSSARY" kicker="Every term in the system, in one line.">
            <dl className="space-y-3 mt-2">
              {[
                ['M2K', 'the micro Russell 2000 futures contract. Your one instrument.'],
                ['Scalping', 'taking many small, quick trades for small, defined gains rather than holding for hours.'],
                ['With the trend', 'trading in the same direction the higher timeframe is already moving. The high-probability direction.'],
                ['Higher highs & higher lows (HH/HL)', 'the signature of an uptrend. Lower highs & lower lows = a downtrend.'],
                ['Pullback', 'a temporary move against an uptrend before it (usually) resumes. The body of a bull flag. Where we look to enter.'],
                ['Bounce', 'a temporary move against a downtrend before it (usually) resumes. The body of a bear flag. Where we look to enter shorts.'],
                ['Bull flag / bear flag', 'a small counter-move against the trend — the pullback (long) or bounce (short) — bounded by a flag trendline. The one setup we trade.'],
                ['Prior swing low / prior swing high', 'the most recent significant low (longs) or high (shorts) on the 5-min before the pullback / bounce. The setup is alive only while price holds above (longs) or below (shorts) it. A break ends the setup.'],
                ['2-min descending trendline (longs)', 'the diagonal connecting the LOWER HIGHS of a bull-flag pullback. The flag\'s defining boundary. The FIRST 2-min candle that CLOSES above it is the entry.'],
                ['2-min ascending trendline (shorts)', 'the diagonal connecting the HIGHER LOWS of a bear-flag bounce. The flag\'s defining boundary. The FIRST 2-min candle that CLOSES below it is the entry.'],
                ['Trendline close', 'the entry signal. The FIRST 2-minute bar that finishes past the flag trendline (above for longs, below for shorts). No retest. No second close. A poke that doesn\'t close through is nothing.'],
                ['Stop — two steps', 'TENTATIVE: 4 to 6 ticks beyond the broken trendline LEVEL itself at the break (not below/above the breakout candle\'s close). FINAL: just past the STRUCTURE — the swing low at the bottom of the pullback for longs; swing high at the top of the bounce for shorts. Anchor the final stop to the structure.'],
                ['20 EMA / 9 EMA', 'exponential moving averages (smoothed average price). The 20 is your trend-health gauge; the 9 is what the runner trails.'],
                ['Engulfing candle', 'a bar whose body fully swallows the prior bar’s body. Strong confirmation. Doji — a bar with almost no body (open ≈ close); indecision. Dragonfly doji — a doji with a long lower tail; buyers rejected lower prices (bullish).'],
                ['Liquidity grab / stop hunt', 'the market dipping just far enough to trigger the obvious crowd stops, then reversing. We place our stop beyond the obvious spot to survive it.'],
                ['R (1R, 2R)', '“R” is one unit of risk: the distance from your entry to your stop, in dollars. A trade up “1R” has gained exactly what you were risking. T1 = 1R, T2 = 2R.'],
                ['Risk:reward (R:R)', 'the ratio of what you’re risking to what you’re aiming for. 1:2 means risking 1 to make 2.'],
                ['2-2-2', 'scaling out of the position in thirds at T1, T2, and a runner.'],
                ['Breakeven (move stop to BE)', 'after T1, sliding your stop up to your entry price so the trade can’t lose. The act that lets you breathe.'],
                ['Measured move', 'projecting the height of the prior price leg forward from your entry to estimate the runner’s target.'],
                ['Expectancy', 'your average profit (or loss) per trade over many trades. Positive expectancy = you make money over time, even with losing trades mixed in. The number that matters most.'],
                ['Win rate', 'the percentage of trades that win. Useful only alongside average win and average loss — never alone.'],
                ['Adherence', 'the percentage of your trades that followed all six steps. The number you fully control, and the one that predicts everything else.'],
                ['Tilt', 'trading from emotion (anger, fear, revenge) instead of process. The thing the circuit breaker and tilt-watch exist to stop.'],
                ['Sim vs. Live', 'simulation (fake money, real practice) vs. real money. You move from one to the other only on a GREEN LIGHT.'],
              ].map(([term, def]) => (
                <div key={term} className="grid md:grid-cols-[180px_1fr] gap-x-4 gap-y-1 pb-3 border-b border-border last:border-0">
                  <dt className="font-display font-semibold text-violet2 text-[14.5px]">{term}</dt>
                  <dd className="text-textp font-body text-[14.5px] leading-[1.65]">{def}</dd>
                </div>
              ))}
            </dl>
          </Section>

          {/* ─── CLOSING ────────────────────────────────────────────────── */}
          <Section id="close" pill="gold" label="CLOSING" sub="One last word">
            <P>Here’s the whole thing in four sentences. You already have the knowledge; five and a half years gave you that. The missing piece was never information, it was enforced discipline under pressure — and that’s now built into a tool you can’t quietly cheat. Your only two jobs from here are reps and honesty: drill the Trainer until the pattern is reflex, take sim trades through the gate, log the truth, and let the verdict — not the calendar, not your hopes — decide when you go live. Nobody can promise the market, but a trader who walks in with one proven setup, a cockpit that enforces it, and the honesty to obey his own data is doing the exact thing that turning it around looks like.</P>
            <P>Print the <X to="/plan">Trade Plan</X>. Open the <X to="/trainer">Trainer</X>. Go become the trader.</P>
            <P className="mt-4 text-gold text-glow-gold font-display tracking-wide text-center">For you, for Ela, for the work you’ve put in. I’m rooting for you.</P>

            <div className="text-center mt-8 print:hidden">
              <a href="#p1" onClick={onTocClick('p1')} className="btn btn-ghost inline-flex">
                <Icon name="back" className="w-4 h-4"/> Back to PART ONE
              </a>
            </div>
          </Section>
        </main>
      </div>
    </div>
  )
}
