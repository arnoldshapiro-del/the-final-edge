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
                Keep this in your head all day: We trade the M2K, one setup only — the with-trend flag, in either direction (bull flag long / bear flag short), with the trend. The 15-minute tells us <Str>IF</Str> there’s a trend; the 5-minute shows us <Str>WHERE</Str> the pullback (long) or bounce (short) is and whether it’s healthy; the 2-minute tells us <Str>WHEN</Str>. And between trend and trigger stands <Str>the GATEKEEPER — LOCATION</Str>: at the CLOSE of the 2-minute entry candle, a long exists only with price above BOTH Location Gates — the 200 EMA on the 2-minute chart AND session VWAP; a short only below both — structure says where price has been, the two gates say who is in control now, and BOTH must agree. The 20 EMA is a grader, not a gate — the flag low holding at/near it is A-grade (full size), a poke below it is B-grade (half or pass) — and the 9 EMA is reference only. If trend and location conflict — 15/5 up but the 2-min below VWAP/200 — we are FLAT: no long, no short. Flat is a position. The pullback or bounce forming is part of the read, never an entry on its own. The ONE AND ONLY trigger is a 2-minute candle that CLOSES above the descending trendline (long) or BELOW the ascending trendline (short). The setup is alive only while price holds above the prior swing low (long) or below the prior swing high (short); a break of that level ends the trade. The stop has two steps: tentative 4 to 6 ticks past the broken trendline level, then FINAL at the STRUCTURE — the swing low at the bottom of the pullback (long) or the swing high at the top of the bounce (short). At our first target we take a third off and immediately tuck the stop 4 to 6 ticks beyond the most recent 2-minute swing — and from there it only ever ratchets tighter behind each new swing, never looser; we take more at the second target and let a runner ride. We never trade a range, never fight the trend, and we stop the moment we hit our limit. That is the entire edge. Everything below is just living it, hour by hour.
              </p>
            </div>

            <Sub>Pre-market — before the open</Sub>
            <P>Sit down. Open the app on <X to="/">Home</X> and read the Mission line out loud: <Em>grade yourself on following the plan, not on winning.</Em> That is your job today. Now run the Pre-market routine: pull up the 15-minute chart and decide one thing — is the market trending or not?</P>

            <If><IfTag/>the 15-minute is making higher highs and higher lows <Arrow/> today you are a <strong className="text-emerald2">buyer only</strong>. You look for longs and ignore every short.</If>
            <If><IfTag/>it’s making lower highs and lower lows <Arrow/> today you are a <strong className="text-coral">seller only</strong>. Shorts only.</If>
            <If><IfTag/>it’s doing neither — chopping sideways in a range <Arrow/> today may be a <strong className="text-gold">no-trade day</strong>, and that is a winning decision, not a wasted one. We do not trade ranges.</If>

            <P>Check the chart itself: the 2-minute must display session VWAP and the 9, 20 and 200 EMAs — all calculated on 2-minute data. Four lines drawn, four different jobs: VWAP and the 200 are the two Location Gates; the 20 is the grader; the 9 is reference only — and you cannot pass a gate you can’t see. (Early note: in the first 20–30 minutes VWAP is still forming on very few data points, and the 2-min 200 mostly reflects yesterday — the open is a no-rush zone.) Mark your key levels. Set your max trades and your max loss for the day right now, while you’re calm — because the calm version of you is the only one you can trust to set them. Then drill the <X to="/trainer">Trainer</X> for five to ten minutes. Do not take a single trade until you’re calling the traps right — the counter-trend reversal attempt, the sideways range, the chase. That warm-up is you sharpening the exact reflex that cost you years.</P>
            <P>The mindset to walk in with: <Em>I need one good setup, not ten. A day with one clean trade — or zero — and full discipline is a successful day. I am not here to be busy. I am here to be precise.</Em></P>

            <Sub>The open and the session — the live decision tree</Sub>
            <P>This is where you’ve lost money for five and a half years, so this is where the plan is law. The market will show you many things. You respond to exactly one of them. Here is what you do, in order, every time price moves:</P>

            <If><IfTag/>there is no 15-minute trend <Arrow/> you do nothing. You watch. You do not “find something.” <Str>No trend, no trade. Full stop.</Str></If>
            <If><IfTag/>the trend is in place and price pulls back on the 5-minute <Arrow/> good. Now you wait. You do not act on the pullback itself.</If>
            <If><IfTag/>the trend is in place <Arrow/> <Str>check LOCATION — the Gatekeeper</Str> — before you hunt any flag. Long: at the entry candle's close, the 2-min must be above BOTH Location Gates — the 200 EMA on the 2-minute chart AND session VWAP — with no VWAP/200 wall between entry and the first target. Short: the mirror, below both. <strong className="text-coral">Either gate missed = gate closed = no trade in that direction.</strong> (The gates are checked at the entry candle's close — not throughout the pullback.)</If>
            <If><IfTag/>the 15/5 look bullish but the 2-min trades below VWAP and the 200 <Arrow/> <strong className="text-gold">you are FLAT — no long AND no short.</strong> A long fights who owns the tape right now; a short fights the bigger uptrend — that’s shorting a pullback, the mirror of the original mistake. Watch for the Reclaim Sequence instead: a decisive 2-min close above BOTH VWAP and the 200, a hold from above on the retest, and then the FIRST flag — often the best trade of the move. <Em>Flat is a position.</Em></If>
            <If><IfTag/>the 9/20 are braided flat, VWAP is flat or being crossed over and over, or price is squeezed between the 9/20 and VWAP/200 <Arrow/> <strong className="text-gold">chop — sit on your hands.</strong> No setups exist there in either direction.</If>
            <If><IfTag/>price pulls back on the 2-min and starts printing lower highs against the descending trendline <Arrow/> the bull flag is forming. <strong className="text-coral">The shape on its own is NEVER the entry.</strong> Grade it: the flag low holding at/near the 20 = A-grade (full size); a poke below the 20 that holds above both gates = B-grade (half or pass); a 2-min CLOSE below the 200 or VWAP during the flag — or more than half the pole given back — VOIDS it. You wait for the trendline close.</If>
            <If><IfTag/>a 2-minute candle <strong>CLOSES above the descending 2-min trendline</strong> (the diagonal connecting the lower highs of the flag) — long — or <strong>BELOW the ascending 2-min trendline</strong> (the diagonal connecting the higher lows of the bear-flag bounce) — short — <strong>AND</strong> the Gatekeeper is open in that direction <strong>AND</strong> a confirming candle prints (bullish engulfing/dragonfly for a long, bearish engulfing for a short) <strong>AND</strong> the pullback held the prior swing with the flag graded A or B (A: flag low holds the 20 → full size · B: pokes below the 20 but holds the gates → half or pass · VOID if a 2-min candle closed through the 200/VWAP or more than half the pole was given back) <Arrow/> now you have a setup. Run the <X to="/trade">7-step checklist</X>. If all seven are true, enter at the open of the next candle.</If>
            <If><IfTag/>the candle is weak, or price only poked through the trendline without closing <Arrow/> you <Str>WAIT</Str>. A poke is not a close. <Em>No trendline close, no trade.</Em></If>
            <If><IfTag/>you feel the pull to take a counter-trend reversal attempt, fade the trend, or trade anything in a range <Arrow/> <strong className="text-coral">name it out loud as the trap it is</strong>, and do not take it. That exact urge is the thing that broke you. The plan says no. (See the <X to="/learn/gallery">Do-Not-Trade gallery</X> for pictures of each trap.)</If>

            <P>When you do enter: use the calculator — direction, entry, stop. Put your stop a few ticks beyond the obvious crowd level. Then take your hands off the mouse. The trade is on; your job now is to manage it mechanically, not to feel it.</P>

            <If><At/>the first target (1R) <Arrow/> take a third off and immediately move your stop to 4 to 6 ticks beyond the most recent 2-minute swing — under the swing low for longs, above the swing high for shorts — but <Str>only if that tightens it</Str>. Not to your entry: your entry sits exactly where price retests, and a stop parked there gets hit by normal breathing right before the move you wanted. Behind the swing, only a genuine failure takes you out. Say it to yourself: <Em>my risk just got smaller, and it only ever gets smaller.</Em></If>
            <If><At/>the second target (2R) <Arrow/> take another third off.</If>
            <If><Then/><Arrow/> every time a new higher swing low prints (longs) — or a new lower swing high (shorts) — ratchet the stop behind it, 4 to 6 ticks past. The stop only ever moves in the protective direction. <Str>Never loosen a stop.</Str></If>
            <If><Then/><Arrow/> let the last third run, trailing behind the 9 EMA, toward the measured move (the height of the prior leg projected from your entry). <Em>Targets past the first are a bonus; you never move them to talk yourself into staying.</Em></If>
            <If><IfTag/>you get stopped out and you followed every rule <Arrow/> <strong className="text-emerald2">that was a good trade.</strong> Log it as a rule-following loss, which is exactly what a professional’s losses look like. You do not get angry, and you do not try to win it back. The urge to make it back is the most expensive feeling in this business, and it is always lying to you.</If>
            <If><IfTag/>you hit your max trades or your max loss <Arrow/> <strong className="text-coral">you are done for the day.</strong> The circuit breaker locks the screen. Do not fight it. Close the laptop. Tomorrow is a fresh, clean day.</If>

            <Sub>Midday — the chop</Sub>
            <P>Around late morning into the early afternoon the market often goes dead and directionless. This is a trap dressed up as opportunity.</P>
            <If><IfTag/>it’s chopping sideways <Arrow/> <strong className="text-gold">step away</strong>. Stretch, walk, get coffee. Doing nothing through the dead middle of the day is a skill, and it’s one you’re going to be great at. There is always another setup. Missing one costs you nothing; forcing one costs you real money.</If>

            <Sub>Into the close — the last hour to 4:00</Sub>
            <P>The final stretch can trend again, but be choosier than you were at the open.</P>
            <If><IfTag/>the leg has already given you its second flag — or prints a climactic bar and a deep pullback <Arrow/> that’s the end of the reliable trades. <strong className="text-coral">Flag #3 of a leg is NO TRADE, ever</strong> — three pushes form a wedge, and the third flag is where reversal traders enter. The count resets only when price tags VWAP or the 2-min 200 EMA and a fresh setup forms.</If>
            <If><IfTag/>you only want a trade because the day is almost over <Arrow/> that is <strong className="text-coral">not a reason</strong>. Do not initiate a marginal trade into the close.</If>
            <P>Let the bell at 4:00 close the session. If you’re flat and disciplined, you’ve already won the day.</P>

            <Sub>After the close — the ritual that compounds</Sub>
            <P>You’re not done when the market is. Run the End-of-day review: did I follow the plan? what would I change? one honest line. Then open <X to="/stats">Stats</X> and look past the win rate — read your expectancy, your average win against your average loss, and above all your adherence. That adherence number is the only score that matters right now, because it’s the one you control completely and the one that predicts everything else. Once a week, check the <X to="/discipline">Discipline dashboard</X> to see which step you skip most (that’s next week’s Trainer focus) and check the Go-Live Verdict. Your target is never a date. Your target is <Str>GREEN LIGHT</Str>.</P>

            <Sub>Why this turns it around</Sub>
            <P>Be clear-eyed about what’s happening here. The thing that kept you in simulation for five and a half years was never missing knowledge — it was the gap between what you knew at night and what you did in the heat of the open. This plan closes that gap by taking the decision out of the moment of pressure: you decide everything in advance, in the calm, and during the session you only execute. The app enforces it so you can’t quietly cheat — the gate blocks the no-trend trade, the journal records the truth, the verdict holds the line on going live. Nobody can promise you a single day’s outcome; the market owes no one anything. But this is the honest mechanism by which losing traders become consistent ones: a real edge, executed with discipline, repeated enough times that variance turns into expectancy. Do the controllable thing — follow the plan — and the results are what follow.</P>
            <P>This is the Bible now. Not the books, not the next idea — this. Read it every morning. Trade it exactly. Sit out when it tells you to, take the trade when all seven clear, take your third at 1R and breathe, and let the verdict — not your hopes — tell you when it’s time for real money. You are ready. The plan is sound, the discipline is built in, and the only two jobs left are reps and honesty.</P>
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
              <LI><Str>Session window — when to trade:</Str> the prime window is <Str>9:45–11:00 AM ET</Str> — highest liquidity, tightest spreads, cleanest follow-through. Secondary window: <Str>3:00–4:00 PM ET</Str>. Do not trade the literal 9:30 open; let the first real 2-minute structure print. Avoid the lunch chop (~11:30 AM–1:30 PM ET): tight ranges, false breakouts. And never trade overnight (4:00 PM–9:30 AM): thin volume, wide spreads, false breakouts — poison for a flag trader. Roughly 70% of index-futures volume happens in regular hours; the edge lives there. Set your own session limits in the routine and <X to="/settings">Settings</X>: a max number of trades and a max loss for the day. When you hit either, you’re done.</LI>
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
              <LI><Str>5-minute = WHERE.</Str> The pullback, and whether it’s buyable. The one hard line: it must hold above the prior swing low (longs) / below the prior swing high (shorts) — a CLOSE through that prior swing kills the setup. From there the 20 EMA <Em>grades</Em> it: holding at/near the 20 = A-grade (full size); a poke past the 20 that still holds inside both Location Gates = B-grade (half or pass); more than half the pole given back — or a 2-min CLOSE through VWAP/the 200 — voids it entirely.</LI>
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

            <Sub>The Gatekeeper — the two Location Gates (between trend and trigger)</Sub>
            <P>Live trading exposed the one hole in the old flow: the 15 and 5 can print higher highs and higher lows while the 2-minute trades <Em>below everything</Em>. Structure tells you where price <Str>has been</Str>; the two Location Gates — session VWAP and the 200 EMA on the 2-minute chart — tell you <Str>who is in control right now</Str> — and both must agree. The full teaching lives in <X to="/learn/l-gate">Lesson 3</X>; this is the operating summary.</P>
            <UL>
              <LI><Str>Four lines on the chart, four different jobs (2-minute chart, 2-minute data):</Str> session VWAP — GATE; the 200 EMA — GATE, the regime line of the execution chart; the 20 EMA — GRADER, not a gate; the 9 EMA — NOT A RULE, drawn as a visual reference only (its one job is the runner's trail).</LI>
              <LI><Str>The upgraded sequence:</Str> TREND → LOCATION → PATTERN → TRIGGER. Trend (15/5) grants directional permission only; Location (the Gatekeeper) decides <Em>now, or not now</Em>; Pattern stays flags-only; Trigger stays the 2-min trendline close. All four must agree — neither the 15/5 nor the 2-min overrides the other.</LI>
              <LI><Str>Long gate (the only two, at the entry candle's CLOSE):</Str> price above the 200 EMA on the 2-minute chart AND above session VWAP. Either miss = gate closed = no long. The gates are checked at the entry candle's close — NOT throughout the pullback; a flag dipping below the fast EMAs is normal and expected, never a disqualifier by itself.</LI>
              <LI><Str>Short gate (exact mirror):</Str> 15-min AND 5-min downtrends (LH/LL); a bear flag; at the entry close, price below BOTH the 200 EMA and session VWAP; trigger = a 2-min close below the flag trendline.</LI>
              <LI><Str>The 20 EMA grade (the grader, never a gate):</Str> A-GRADE — the flag low holds at or near the 2-min 20 → full size permitted. B-GRADE — the flag pokes below the 20 but holds above both gates → half size or pass. VOID — any 2-min candle CLOSES below the 200 or VWAP during the flag, or the pullback retraces more than 50% of the pole → not a flag, no trade.</LI>
              <LI><Str>Conflict = FLAT:</Str> bullish 15/5 with the 2-min below VWAP/200 means NO long and NO short — shorting there is shorting a pullback inside an uptrend. Three positions exist: long, short, and flat. <Em>Flat is a position.</Em></LI>
              <LI><Str>Trap flags:</Str> a "bull flag" below the gates is the same shape with opposite context — from the other side it is often the bear flag. Same shape, opposite odds. A NO-trade.</LI>
              <LI><Str>The pullback count:</Str> Flag #1 after the gates turn green = full size; Flag #2 = A-grade only; Flag #3 = NO TRADE, ever — three pushes form a wedge, and the third flag is where reversal traders enter. The count resets when price tags VWAP or the 2-min 200 EMA and a fresh setup forms, or at a new session.</LI>
              <LI><Str>The Runway Rule:</Str> no wall (VWAP or the 200) between the entry and the first scale-out target. Wall in the way = skip.</LI>
              <LI><Str>Chop tells (any ONE = sit out):</Str> the 9/20 flat and braided; a flat VWAP; price crossing VWAP repeatedly over ~30 minutes; the squeeze (price sandwiched between the 9/20 and VWAP/200); failed breakouts both ways with small overlapping candles.</LI>
              <LI><Str>The Reclaim Sequence (red → green):</Str> 1) a decisive 2-min close above BOTH VWAP and the 200; 2) HOLD — price retests them and holds from above; 3) the FIRST flag after the held reclaim is valid — often the best trade of the move. Mirror for shorts. It turns waiting into hunting.</LI>
              <LI><Str>Never:</Str> no mean-reversion longs below the 200 "because it's a magnet" (considered and rejected); no shorting pullbacks inside uptrends; no anticipating a reclaim before it prints.</LI>
              <LI><Str>Early session:</Str> the 2-min 200 mostly reflects the prior session early on — which is exactly why VWAP (resets daily) is also mandatory; and in the first ~20–30 minutes VWAP itself is still forming. No exceptions to the two-gate rule — only added patience.</LI>
              <LI><Str>Risk untouched:</Str> the Gatekeeper changes WHICH trades qualify — never how trades are managed. The structure stop that defines your 1R, 2/2/2, and your daily limit (3 losses / 3 full stops = done): all exactly as this app already states them — with size set by the flag grade (A full · B half or pass), never by feeling.</LI>
            </UL>
            <Mantra>The mantra: Trend → Location → Pattern → Trigger. Flat is a position.</Mantra>

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
              <NLI><Str>The Gatekeeper is open:</Str> at the close of the 2-min entry candle, price is above BOTH Location Gates — session VWAP and the 200 EMA on the 2-minute chart — with runway clear to T1. A flag forming below the gates is a trap flag — not this setup.</NLI>
              <NLI>The pullback holds above the prior swing low, and the 20 EMA grades it: the flag low holding at/near the 20 = A-grade (full size); a poke below the 20 that holds above both gates = B-grade (half or pass); a 2-min CLOSE below the 200 or VWAP during the flag — or more than half the pole given back — VOIDS it.</NLI>
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

            <Sub>The 20 EMA grade — A / B / VOID</Sub>
            <P>The 20 EMA grades the flag and sets the size. It is a grader, never a gate:</P>
            <UL>
              <LI><strong className="text-emerald2">A-GRADE</strong> → the flag low holds at or near the 2-min 20 EMA. <Em>Full size permitted.</Em></LI>
              <LI><strong className="text-gold">B-GRADE</strong> → the flag pokes below the 20 EMA but holds above both Location Gates. <Em>Half size, or pass.</Em></LI>
              <LI><strong className="text-coral">VOID</strong> → any 2-min candle CLOSES below the 200 EMA or VWAP during the flag, OR the pullback retraces more than 50% of the pole. <Em>Not a flag. No trade.</Em></LI>
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

            <Sub>The exit — 2-2-2 + the structure trail + runner</Sub>
            <P>Think of your position in thirds — and think of the stop as something that ratchets behind the trade, step by step:</P>
            <OL>
              <NLI><Str>STEP 1 — ON ENTRY.</Str> The ATM places the stop where you typed it and sets T1 at 1R and T2 at 2R from your entry (2 contracts each; the runner has no fixed target). Your FIRST ACTION: make sure that stop sits <Str>4–6 ticks beyond the setup structure</Str> — 4–6 ticks UNDER the setup swing low for longs, 4–6 ticks ABOVE the setup swing high for shorts. On the M2K that typed distance IS your 1R: the structure decides the stop, and the stop decides everything else.</NLI>
              <NLI><Str>STEP 2 — THE MOMENT T1 (1R) FILLS</Str> — scale off the first third, and do <Str>NOT</Str> park the stop at your entry. Immediately move it to <Str>4–6 ticks below the most recent 2-MINUTE swing low</Str> (longs) / <Str>above the most recent 2-minute swing high</Str> (shorts) — but ONLY if that tightens the stop. If the most recent swing sits wider than the current stop, leave the stop alone.</NLI>
              <NLI>At <Str>T2 (2R)</Str> — scale off the second third. The trail keeps working.</NLI>
              <NLI><Str>STEP 3 — KEEP RATCHETING.</Str> Each new HIGHER swing low (longs) → stop moves up to 4–6 ticks under it. Each new LOWER swing high (shorts) → stop moves down to 4–6 ticks above it. Let the final third run, trailing behind the 9 EMA, toward a <Str>measured-move target</Str> — the height of the prior leg (the “flagpole”) projected from your entry — until the structure trail takes you out.</NLI>
            </OL>

            <P><Str>Why we no longer park the stop at entry.</Str> Your entry price sits exactly in the retest zone — where price normally pulls back to test the broken level before continuing, and where everyone else's break-even stops cluster. A stop at exact entry gets hit by the market breathing normally, right before the move you wanted. That habit was costing T2 and the runner on most trades. A stop tucked beyond the swing low only gets hit when the pattern has genuinely failed — which is exactly when you want out.</P>

            <P><Str>How to spot the swing without waiting 4 minutes.</Str> A textbook swing low needs 2 candles to its left and 2 to its right — on a 2-minute chart that's 4 minutes, and the move may be over before it confirms. Don't wait for the textbook. <Em>One 2-minute candle closing back UP off the low</Em> (back DOWN off the high for shorts) is enough confirmation to act, combined with the 4–6 tick buffer.</P>

            <div className="my-4 rounded-card border border-gold/40 bg-gold/5 p-4">
              <p className="font-display tracking-wide text-gold text-[14.5px] leading-[1.65]">THE IRON RULE: the stop only ever moves in the protective direction — UP for longs, DOWN for shorts. NEVER loosen a stop. If a trailed swing breaks, that break is information: the pattern failed, you're out, you keep what you locked in. “Moving it a little lower to give it room” is the habit that destroys accounts.</p>
            </div>

            <P><Str>The honest tradeoff, so you're never surprised:</Str> trailing the structure slightly lowers the win rate versus parking the stop at entry — and materially raises the average winner. Traders who made this switch report roughly 8–12% fewer wins but 40–60% bigger average winners, which is net strongly positive. That is the trade being made, on purpose.</P>

            <P><Str>The buffer in points:</Str> on M2K, 4–6 ticks = 0.4–0.6 points. (On MES it's 1.0–1.5 points — proportionally nearly identical given the Russell's lower index level and the M2K's 0.10-point tick. Same rule, both instruments.)</P>

            <Mantra>The mantra: Targets beyond T1 are bonus — never recalculated. The stop only ever tightens.</Mantra>
            <P className="text-texts text-[13px]">The <X to="/learn/gallery">2-2-2 ladder</X> animates each fill; the <X to="/learn/gallery">measured-move chart</X> shows the flagpole projection.</P>

            <Sub>Anatomy of a trend — THE PULLBACK COUNT</Sub>
            <P>Count the flags of the leg — the count, not your conviction, decides what you may trade:</P>
            <UL>
              <LI><Str>Flag #1</Str> after the Location Gates turn green: <strong className="text-emerald2">full size</strong> — the highest-probability trade of the leg (Raschke's "first pullback" principle).</LI>
              <LI><Str>Flag #2:</Str> permitted <Em>only if A-grade</Em> — its breakout is the leg's third push, the last reliable one.</LI>
              <LI><Str>Flag #3:</Str> <strong className="text-coral">NO TRADE, ever.</strong> Three pushes form a wedge, and the third flag forms exactly where reversal traders enter. It is a defensive warning, not an opportunity.</LI>
              <LI><Str>The count RESETS</Str> when price tags VWAP or the 2-minute 200 EMA and a fresh setup then forms — or at a new session. A climactic bar with a deep pullback is exhaustion regardless: stop taking new entries in that direction.</LI>
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
              <LI>A mean-reversion long below the 200 “because it’s a magnet.” Considered, and deliberately rejected.</LI>
              <LI>A flag on the wrong side of the Location Gates — a bull flag below VWAP and the 2-min 200 EMA, or a bear flag above them. Same shape, opposite odds: the trap flag.</LI>
              <LI>The third flag of a leg — ever. Three pushes form a wedge; the third flag is where reversal traders enter.</LI>
              <LI>An anticipated reclaim — buying before the decisive close above VWAP and the 200 actually prints.</LI>
            </UL>
            <P className="text-texts text-[13px]">The classic six are drawn in the <X to="/learn/gallery">Do-Not-Trade gallery</X>; the location traps are drawn in Lesson 3.</P>

            <Sub>The 7-step gate</Sub>
            <P>The <X to="/trade">cockpit’s checklist</X> walks you through this exact sequence before you’re allowed to log a trade. Read the on-screen wording and match it to these — they’re the same system:</P>
            <OL>
              <NLI><Str>Trend on the 15-minute</Str> (the hard gate). HH/HL or LH/LL. No trend → the screen blocks you and says <strong className="text-coral">NO TRADE — SIT OUT</strong>.</NLI>
              <NLI><Str>With-trend direction only.</Str> You’re going the way the 15-minute is going. Never against it.</NLI>
              <NLI>The flag is <Str>graded</Str> — holding the prior swing low (long) or prior swing high (short); A-grade (flag low holds the 20) = full size, B-grade (pokes below the 20, holds the gates) = half or pass, VOID (2-min close below the 200/VWAP during the flag, or &gt;50% of the pole given back) = no trade — and it is not flag #3 of the leg.</NLI>
              <NLI><Str>LOCATION — the Gatekeeper is open</Str> (the second hard gate). Long: at the entry candle's close, the 2-min above BOTH gates — the 200 EMA and session VWAP; short: below both; runway clear of VWAP/200 walls to T1. Conflict → the screen says <strong className="text-gold">GATE CLOSED — FLAT</strong>: no long AND no short.</NLI>
              <NLI>A <Str>confirming candle</Str> has printed at the trendline close (engulfing / dragonfly, not a weak doji).</NLI>
              <NLI>The <Str>FIRST 2-minute candle has CLOSED above the descending trendline</Str> (long) or <Str>BELOW the ascending trendline</Str> (short). <Em>The trendline close is the ONLY trigger.</Em></NLI>
              <NLI><Str>Stop placed at the STRUCTURE</Str> (swing low at the bottom of the pullback for longs; swing high at the top of the bounce for shorts), tentative 4-6 ticks past broken trendline first.</NLI>
            </OL>
            <P>If all seven are true, you have a trade. If even one is false, you don’t. It really is that mechanical — and that’s the point.</P>
          </Section>

          {/* ─── PART THREE ──────────────────────────────────────────────── */}
          <Section id="p3" pill="cyan" label="PART THREE" sub="THE PROGRAM, SCREEN BY SCREEN" kicker="Every part of the app, what it’s for, and how to actually use it.">
            <P><X to="/"><Str>Home</Str></X> — your launchpad and your conscience. At the top is the Mission card — the line “Grade yourself on following the plan, not on winning.” Read it every single time you land here. It’s editable if you ever want to make it yours, but those words are the whole philosophy in one sentence, so I’d leave them. Below that are your transformation tiles — including a clean-day streak that updates itself: when a sim trading day ends net-green it ticks up, and a red day resets it. Home also surfaces your Pre-market routine and End-of-day review, your Go-Live Verdict mirrored from Stats, and a Trader’s toolkit row with one-tap access to your Field Manual (start here), Trade Plan, Discipline dashboard, and Visual Library. <Em>How to use it:</Em> this is your first and last screen of every trading day.</P>

            <P><X to="/learn"><Str>Learn</Str></X> — the thirteen lessons. The curriculum, in the calm masterclass voice. Thirteen lessons, each with a “Lock-it-in” box. Several ship with live charts: <Em>the Gatekeeper — the two Location Gates</Em> (Lesson 3, with the green-light chart, the trap chart, the Reclaim Sequence and the decision flow), the flagship pullback → trendline-close entry chart with the 5-point flag grade (Lesson 4), the 2-2-2 ladder and the structure trail (Lesson 8), the 20 EMA grade — A/B/VOID — with the 9 as reference (Lesson 5), and the two-step stop chart (Lesson 7). The <Em>Know The Odds</Em> card (Lesson 9) is the honest statistical reality of the system — loose flags failed ~55% of the time vs ~85% success for tight flags with strong poles, and flag tightness is a bigger statistical lever than any moving-average filter. <Em>Method 3 — the Opening Range Break (ORB)</Em> (Lesson 10) is a SEPARATE playbook: the 9:30–9:45 range, broken on the first 2-min close, confirmed by VWAP — smaller size, exits pre-committed in writing. <Em>How to use it:</Em> read all thirteen once in sequence in your first couple of days, then treat Learn as reference. Re-read any lesson the day after you break its rule.</P>

            <P><X to="/learn/gallery"><Str>Learn → Visual Library</Str></X> — your picture book of the whole system, 21 hand-built charts. Setup Gallery (G1–G10): the long entry fully annotated, its short mirror, the 3-panel 15/5/2, 20 EMA health side by side, the animated 2-2-2 ladder, the stop-hunt, first-bounce-is-the-bait, anatomy of a trend, the structure-trail mechanic, and the measured move — several animate; press Play and watch the setup form bar by bar. Candle Anatomy (5): zoomed, labeled diagrams of every grade candle. Do-Not-Trade (6): every forbidden pattern, drawn and stamped “NOT THIS,” with a one-line why. <Em>How to use it:</Em> when a concept is fuzzy, see it here instead of re-reading words; spend real time in the Do-Not-Trade gallery, because not-trading the wrong thing is half your edge.</P>

            <P><X to="/trainer"><Str>Trainer</Str></X> — “Trade or Skip.” The flight simulator, and the most important screen for the next three weeks. You’re shown a chart and context, and you call it: Long, Short, Skip, or Wait. Twenty-four scenarios per round — including the six Gatekeeper drills (D1–D6) with VWAP and the full EMA stack drawn in — shuffleable, loaded with the exact traps that cost you years. Your accuracy this round and all-time is tracked, and the round summary breaks accuracy down by type — valid longs, valid shorts, waits, traps avoided. Three modes: <Str>Instant</Str> (see the finished chart, call it — fast reps); <Str>Watch it form</Str> (the chart animates bar by bar and you call it only after it draws — trains reading a setup as it develops); <Str>Step through</Str> (only the first few bars show; reveal one at a time and call early — closest to live decision-making). <Em>How to use it:</Em> this is your daily warm-up, every session, before you trade — five to ten minutes minimum. Don’t quit the round until you’re calling the traps right. Move Instant → Watch-it-form → Step-through as you improve.</P>

            <P><X to="/flashcards"><Str>Flashcards</Str></X> — thirty cards covering every mantra. Space-bar to flip, arrows to mark whether you knew it; the deck rotates your weakest cards first. <Em>How to use it:</Em> two minutes a day; keeps the vocabulary of the system on the tip of your tongue.</P>

            <P><X to="/trade"><Str>The Trade Cockpit</Str></X> — where you take and log trades. The 7-step checklist with two hard gates: Step 1 is the trend gate — if the 15-minute trend isn’t there and you leave it unchecked, the screen shows a calm “NO TRADE — SIT OUT” panel and blocks you from logging. Step 4 is the location gate — trend without location shows “GATE CLOSED — FLAT.” <Em>When it blocks you, that is a win.</Em> The calculator: enter direction, entry, and stop, and it instantly gives risk in points, T1 (1R), T2 (2R), risk:reward, and the 2-2-2 split, plus the trail-the-stop reminder, and it catches a stop on the wrong side. The journal: log every trade with its direction badge, grade (A+/B), candle, a SIM/LIVE tag, and the All-7 vs. Rule-breach pill; it tallies total R and lets you edit/delete. Keyboard shortcuts (desktop): <kbd className="font-mono text-[12px] px-1.5 py-0.5 rounded border border-border bg-bg text-textp">1</kbd>–<kbd className="font-mono text-[12px] px-1.5 py-0.5 rounded border border-border bg-bg text-textp">7</kbd> toggle each step, <kbd className="font-mono text-[12px] px-1.5 py-0.5 rounded border border-border bg-bg text-textp">E</kbd> jumps to the entry field, <kbd className="font-mono text-[12px] px-1.5 py-0.5 rounded border border-border bg-bg text-textp">S</kbd> saves (only if all seven are checked and prices are valid), <kbd className="font-mono text-[12px] px-1.5 py-0.5 rounded border border-border bg-bg text-textp">?</kbd> opens the shortcut list, <kbd className="font-mono text-[12px] px-1.5 py-0.5 rounded border border-border bg-bg text-textp">Esc</kbd> closes dialogs. <Em>How to use it:</Em> run the checklist for every potential setup; if it blocks you, sit out and feel good; if it clears, use the calculator, take the sim trade, and log it honestly, including breaches. When it blocks you on location — GATE CLOSED — FLAT — remember that flat is a position, and the Reclaim Sequence tells you exactly what re-opens the gate.</P>

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
              <NLI>For every potential setup, run the <X to="/trade">7-step checklist</X> — trend, direction, pullback health, the Gatekeeper, candle, trendline close, stop.</NLI>
              <NLI>If any step blocks you → <Em>sit out.</Em> That’s the app working. Feel good about it.</NLI>
              <NLI>If it clears → use the calculator, take the sim trade, and log it honestly — including the All-7/breach flag.</NLI>
              <NLI>The instant T1 fills → scale a third, then tuck the stop 4–6 ticks behind the most recent 2-minute swing (only if that tightens it) — and ratchet it behind each new swing after that. <Em>Never loosen it.</Em></NLI>
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
              <p className="text-textp font-body text-[15px] leading-[1.7]">Read all thirteen <X to="/learn">Learn lessons</X> — give the Gatekeeper (Lesson 3) a second pass — and walk the entire <X to="/learn/gallery">Visual Library</X>, including every Do-Not-Trade chart. Each session: full pre-market, then 10 minutes of Trainer in <Str>Instant</Str> mode before you trade sim. <Em>Goal:</Em> trap-accuracy above 90% in Instant mode. Trade sim lightly — the point this week is recognition, not volume. End every day with the review.</p>
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
                ['20 EMA / 9 EMA', 'exponential moving averages (smoothed average price). The 20 is the GRADER, not a gate — A-grade flag low holds at/near it (full size), B-grade pokes below it but holds above both gates (half or pass). The 9 is NOT A RULE — drawn as a visual reference only; its one job is the runner\'s trail.'],
                ['The Location Gates', 'the only two: the 200 EMA on the 2-minute chart, and session VWAP. For longs, at the CLOSE of the 2-minute entry candle, price must be above BOTH; for shorts, below both. Checked at the entry candle\'s close — not throughout the pullback.'],
                ['The Gatekeeper', 'the location filter between trend and trigger. On the 2-minute, at the entry candle\'s close: longs only with price above BOTH Location Gates — the 200 EMA and session VWAP; shorts the mirror. Structure says where price has been; the Gatekeeper says who is in control now. Both must agree.'],
                ['Flag grade (A / B / VOID)', 'A-GRADE: flag low holds at/near the 2-min 20 EMA → full size permitted. B-GRADE: flag pokes below the 20 but holds above both Location Gates → half size or pass. VOID: any 2-min candle CLOSES below the 200 EMA or VWAP during the flag, or the pullback retraces more than 50% of the pole → not a flag, no trade.'],
                ['The 5-point flag grade', 'STRONG POLE (3+ candles, one color, big bodies, small wicks, steep — weak pole = no trade) · SHALLOW (less than half the pole given back; best flags give back about a third) · TIGHT (small overlapping bars, narrow orderly channel) · SHORT (roughly 3–10 two-minute bars) · QUIET THEN LOUD (volume contracts in the flag, expands on the break). A tight flag is a staircase pausing on a landing; a loose flag is the staircase collapsing into a ball of yarn.'],
                ['The pullback count', 'Flag #1 after the gates turn green = full size. Flag #2 = A-grade only. Flag #3 = NO TRADE, ever — three pushes form a wedge and the third flag is where reversal traders enter. Resets when price tags VWAP or the 2-min 200 EMA and a fresh setup forms, or at a new session.'],
                ['The give-back rule', 'if open day P&L falls to 50% of its intraday peak, trading is finished for the day. No exceptions.'],
                ['Session VWAP', 'the volume-weighted average price of the session — the institutional benchmark. Large players measure fills against it, defend it, and trade around it. Above it, buyers own the session; below it, sellers do. Resets every day.'],
                ['200 EMA (2-min)', 'the regime line of the execution chart. Early in the day it mostly reflects the prior session — which is exactly why VWAP (resets daily) is also mandatory.'],
                ['The stack / fully stacked', 'the 9, 20 and 200 EMAs in visual order on the chart. A strong-trend LOOK — visual context only. The stack is NOT a rule: no entry requires it, and no grade reads it. The only gates are VWAP and the 200.'],
                ['Trap flag', 'a flag shape on the wrong side of the Location Gates — a "bull flag" below VWAP and the 2-min 200 EMA is the same picture with opposite context; viewed from the other side it is often the bear flag. Same shape, opposite odds. A NO-trade, not a lower-odds trade.'],
                ['Trend → Location → Pattern → Trigger', 'the upgraded sequence. Trend (15/5 structure) grants directional permission; Location (the Gatekeeper) decides now-or-not-now; Pattern is the flag; Trigger is the 2-min trendline close. All four must agree.'],
                ['Flat is a position', 'three positions exist: long, short, and flat. When trend and location conflict (15/5 up, 2-min below VWAP/200) you take neither side — standing aside IS the trade.'],
                ['The Reclaim Sequence', 'how red turns green: 1) a decisive 2-min close above BOTH VWAP and the 200; 2) HOLD — price retests them and holds from above; 3) the FIRST flag after the held reclaim is valid, often the best trade of the move. Mirror for shorts. Never anticipated.'],
                ['The Runway Rule', 'no wall — VWAP or the 200 EMA — may sit between the entry and the first scale-out target. Wall in the way = skip the trade.'],
                ['Chop tells', 'any ONE means sit out: the 9/20 flat and braided; a flat VWAP; price crossing VWAP repeatedly (~30 min); the squeeze (price sandwiched between the 9/20 and VWAP/200); failed breakouts both ways with small overlapping candles.'],
                ['Engulfing candle', 'a bar whose body fully swallows the prior bar’s body. Strong confirmation. Doji — a bar with almost no body (open ≈ close); indecision. Dragonfly doji — a doji with a long lower tail; buyers rejected lower prices (bullish).'],
                ['Liquidity grab / stop hunt', 'the market dipping just far enough to trigger the obvious crowd stops, then reversing. We place our stop beyond the obvious spot to survive it.'],
                ['R (1R, 2R)', '“R” is one unit of risk: the distance from your entry to your stop, in dollars. A trade up “1R” has gained exactly what you were risking. T1 = 1R, T2 = 2R.'],
                ['Risk:reward (R:R)', 'the ratio of what you’re risking to what you’re aiming for. 1:2 means risking 1 to make 2.'],
                ['2-2-2', 'scaling out of the position in thirds at T1, T2, and a runner.'],
                ['Structure trail (after T1)', 'the instant T1 fills, moving the stop to 4–6 ticks beyond the most recent 2-minute swing (under the swing low for longs, above the swing high for shorts) — only if that tightens it — then ratcheting it behind each new swing, only ever tighter. We retired the old rule of sliding the stop to break even at entry: the entry price sits exactly in the retest zone where everyone’s break-even stops cluster, so a stop parked there gets hit by normal market breathing right before the move. The trailed stop only triggers when the pattern has genuinely failed.'],
                ['Opening range / ORB (Method 3)', 'the highest high and lowest low of the first 15 minutes of the session (9:30–9:45 AM ET). The ORB is a SEPARATE playbook (Lesson 10), never blended with flag rules: entry on the FIRST 2-min close beyond the range edge, no 15/5 trend alignment required, price on the matching side of VWAP at entry, exit pre-committed in writing before 9:45 (default 2/2/2), smaller size than flag trades, and 25–45% win rates by design. Skipped entirely, the range edges still act as key support and resistance all day.'],
                ['Measured move', 'projecting the height of the prior price leg forward from your entry to estimate the runner’s target.'],
                ['Expectancy', 'your average profit (or loss) per trade over many trades. Positive expectancy = you make money over time, even with losing trades mixed in. The number that matters most.'],
                ['Win rate', 'the percentage of trades that win. Useful only alongside average win and average loss — never alone.'],
                ['Adherence', 'the percentage of your trades that followed all seven steps. The number you fully control, and the one that predicts everything else.'],
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
