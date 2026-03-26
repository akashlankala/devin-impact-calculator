import { useState, useCallback, useRef } from 'react'
import './App.css'
import ImpactDashboard from './ImpactDashboard'

const CHALLENGE_DEFAULTS = {
  migrations: [30, 15, 10, 10, 10, 25],
  bugs: [10, 30, 10, 10, 15, 25],
  tests: [10, 15, 30, 10, 10, 25],
  security: [10, 10, 10, 30, 15, 25],
  techdebt: [20, 15, 10, 10, 15, 30],
}

const CHALLENGES = [
  { id: 'migrations', emoji: '\u{1F504}', title: 'Migrations', subtitle: 'Stuck upgrading legacy systems' },
  { id: 'bugs', emoji: '\u{1F41B}', title: 'Bug Backlog', subtitle: "Can't keep up with tickets" },
  { id: 'tests', emoji: '\u{1F9EA}', title: 'Test Coverage', subtitle: 'Coverage too low, things keep breaking' },
  { id: 'security', emoji: '\u{1F512}', title: 'Security', subtitle: 'Mountain of vulnerabilities to fix' },
  { id: 'techdebt', emoji: '\u{1F4DD}', title: 'Tech Debt', subtitle: 'Poorly documented, messy codebase' },
]

const TIME_LABELS = [
  'Migrations & Refactoring',
  'Bug Fixes & Tickets',
  'Writing & Maintaining Tests',
  'Security & Vulnerability Fixes',
  'Code Reviews',
  'New Feature Development',
]

const COST_OPTIONS = [
  '$100K\u2013$125K',
  '$125K\u2013$150K',
  '$150K\u2013$175K',
  '$175K\u2013$200K',
  '$200K+',
]

function SliderWithGreen({ value, onChange, min, max, label }) {
  const percent = ((value - min) / (max - min)) * 100
  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-2">
        <label className="text-sm font-medium text-white">{label}</label>
        <span className="text-sm font-semibold text-white min-w-12 text-right">{value}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={onChange}
        style={{
          background: `linear-gradient(to right, #21C19A 0%, #21C19A ${percent}%, #333 ${percent}%, #333 100%)`,
        }}
      />
    </div>
  )
}

function App() {
  const [engineers, setEngineers] = useState(25)
  const [cost, setCost] = useState('$150K\u2013$175K')
  const [backlog, setBacklog] = useState(150)
  const [selectedChallenge, setSelectedChallenge] = useState('migrations')
  const [timeAllocation, setTimeAllocation] = useState([...CHALLENGE_DEFAULTS.migrations])
  const hasManuallyEdited = useRef(false)

  const handleTimeChange = useCallback((index, value) => {
    hasManuallyEdited.current = true
    setTimeAllocation(prev => {
      const next = [...prev]
      next[index] = Number(value)
      return next
    })
  }, [])

  const handleChallengeSelect = useCallback((id) => {
    setSelectedChallenge(id)
    hasManuallyEdited.current = false
    setTimeAllocation([...CHALLENGE_DEFAULTS[id]])
  }, [])

  const total = timeAllocation.reduce((sum, v) => sum + v, 0)
  const devinCanHelp = 100 - timeAllocation[5]

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0A0A0A' }}>
      <div className="mx-auto px-6 py-16" style={{ maxWidth: '800px' }}>

        {/* SECTION 1 - HERO */}
        <section className="text-center pt-12 pb-20">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 tracking-tight">
            Devin Impact Calculator
          </h1>
          <p className="text-lg md:text-xl mx-auto" style={{ color: '#A0A0A0', maxWidth: '560px' }}>
            See how much engineering time and budget Devin can give back to your team
          </p>
        </section>

        {/* SECTION 2 - YOUR TEAM */}
        <section className="pb-16">
          <h2 className="text-2xl font-bold text-white mb-8">About Your Team</h2>

          <SliderWithGreen
            label="How many engineers on your team?"
            value={engineers}
            onChange={(e) => setEngineers(Number(e.target.value))}
            min={5}
            max={200}
          />

          {/* Cost Dropdown */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-white mb-2">
              Average fully-loaded engineer cost
            </label>
            <select
              value={cost}
              onChange={(e) => setCost(e.target.value)}
              className="w-full px-4 py-3 rounded-lg text-white text-sm font-medium border cursor-pointer"
              style={{
                backgroundColor: '#111111',
                borderColor: '#1E1E1E',
                outline: 'none',
              }}
            >
              {COST_OPTIONS.map(opt => (
                <option key={opt} value={opt} style={{ backgroundColor: '#111111' }}>{opt}</option>
              ))}
            </select>
          </div>

          <SliderWithGreen
            label="How many tickets are in your current backlog?"
            value={backlog}
            onChange={(e) => setBacklog(Number(e.target.value))}
            min={0}
            max={1000}
          />

          {/* Challenge Cards */}
          <div className="mt-8">
            <label className="block text-sm font-medium text-white mb-4">
              What&apos;s your team&apos;s biggest challenge?
            </label>
            <div className="flex flex-wrap gap-3">
              {CHALLENGES.map(ch => {
                const isSelected = selectedChallenge === ch.id
                return (
                  <button
                    key={ch.id}
                    onClick={() => handleChallengeSelect(ch.id)}
                    className="flex-1 p-4 rounded-xl text-left transition-all duration-200 cursor-pointer"
                    style={{
                      backgroundColor: '#111111',
                      border: `2px solid ${isSelected ? '#21C19A' : '#1E1E1E'}`,
                      boxShadow: isSelected ? '0 0 20px rgba(33, 193, 154, 0.15)' : 'none',
                      minWidth: '140px',
                    }}
                  >
                    <div className="text-2xl mb-2">{ch.emoji}</div>
                    <div className="text-sm font-semibold text-white">{ch.title}</div>
                    <div className="text-xs mt-1" style={{ color: '#A0A0A0' }}>{ch.subtitle}</div>
                  </button>
                )
              })}
            </div>
          </div>
        </section>

        {/* SECTION 3 - TIME ALLOCATION */}
        <section className="pb-16">
          <h2 className="text-2xl font-bold text-white mb-2">Where does your team&apos;s time go?</h2>
          <p className="text-sm mb-8" style={{ color: '#A0A0A0' }}>
            Estimate how your engineers spend their time across these categories
          </p>

          {TIME_LABELS.map((label, i) => {
            const pct = timeAllocation[i]
            return (
              <div key={label} className="mb-5">
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium text-white">{label}</label>
                  <span className="text-sm font-semibold text-white min-w-10 text-right">{pct}%</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={pct}
                  onChange={(e) => handleTimeChange(i, e.target.value)}
                  style={{
                    background: `linear-gradient(to right, #21C19A 0%, #21C19A ${pct}%, #333 ${pct}%, #333 100%)`,
                  }}
                />
              </div>
            )
          })}

          {/* Running Total */}
          <div className="mt-6 pt-6" style={{ borderTop: '1px solid #1E1E1E' }}>
            <div className="flex justify-between items-center mb-6">
              <span className="text-sm font-medium text-white">Total</span>
              <span
                className="text-sm font-bold"
                style={{ color: total === 100 ? '#21C19A' : '#FF4444' }}
              >
                {total}%
                {total !== 100 && (
                  <span className="text-xs font-normal ml-2" style={{ color: '#FF4444' }}>
                    (should equal 100%)
                  </span>
                )}
              </span>
            </div>

            <div
              className="text-center text-2xl md:text-3xl font-bold py-6 px-4 rounded-xl"
              style={{
                color: '#21C19A',
                backgroundColor: 'rgba(33, 193, 154, 0.06)',
                border: '1px solid rgba(33, 193, 154, 0.15)',
              }}
            >
              {devinCanHelp}% of your team&apos;s time is spent on work Devin can help with
            </div>
          </div>
        </section>

        {/* SECTION 4 - IMPACT REPORT */}
        {total === 100 ? (
          <ImpactDashboard
            teamSize={engineers}
            costBracket={cost}
            timeAllocation={timeAllocation}
          />
        ) : (
          <section className="pb-20">
            <div
              className="py-16 px-8 rounded-xl text-center"
              style={{
                border: '2px dashed #333333',
                color: '#A0A0A0',
              }}
            >
              <p className="text-lg">Adjust your time allocation to total 100% to see your impact report</p>
            </div>
          </section>
        )}
      </div>
    </div>
  )
}

export default App
