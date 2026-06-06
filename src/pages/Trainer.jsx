import { Link } from 'react-router-dom'
import { Icon } from '../components/Icon.jsx'

export default function Trainer() {
  return (
    <div className="space-y-6">
      <header>
        <div className="pill pill-cyan inline-flex mb-3"><Icon name="target" className="w-3.5 h-3.5"/> Setup trainer</div>
        <h1 className="font-display font-semibold text-3xl md:text-4xl text-textp">Trade or skip</h1>
        <p className="text-texts mt-2">Coming online in Phase 2.</p>
      </header>
      <Link to="/learn" className="btn btn-ghost inline-flex">← Back to lessons</Link>
    </div>
  )
}
