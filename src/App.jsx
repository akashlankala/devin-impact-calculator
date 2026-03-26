import { useState, useCallback, useRef, useEffect } from 'react'
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

function NavBar() {
  return (
    <nav style={{
      position: 'sticky',
      top: 0,
      zIndex: 50,
      width: '100%',
      height: '56px',
      backgroundColor: 'rgba(16, 19, 28, 0.85)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      borderBottom: '1px solid #252836',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 24px',
    }}>
      {/* Left: Logo */}
      <a
        href="https://devin.ai/"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          textDecoration: 'none',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          fontSize: '18px',
          fontWeight: 500,
          color: '#F2F5FA',
        }}
      >
        <span style={{ color: '#21C19A', fontSize: '10px' }}>{'\u25CF'}</span>
        devin
      </a>

      {/* Center: Nav links */}
      <div className="nav-center" style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
        <a href="https://devin.ai/" target="_blank" rel="noopener noreferrer" className="nav-link">Home</a>
        <a href="https://devin.ai/enterprise" target="_blank" rel="noopener noreferrer" className="nav-link">Enterprise</a>
        <a href="https://devin.ai/pricing" target="_blank" rel="noopener noreferrer" className="nav-link">Pricing</a>
        <a href="https://devin.ai/customers" target="_blank" rel="noopener noreferrer" className="nav-link">Customers</a>
        <a href="#" className="nav-link nav-link-active">Impact Calculator</a>
      </div>

      {/* Right: Buttons */}
      <div className="nav-right" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <a
          href="https://app.devin.ai/login"
          target="_blank"
          rel="noopener noreferrer"
          className="nav-link"
        >
          Login
        </a>
        <a
          href="https://app.devin.ai/"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-block',
            fontSize: '14px',
            fontWeight: 500,
            color: '#10131C',
            backgroundColor: '#21C19A',
            borderRadius: '999px',
            padding: '8px 20px',
            textDecoration: 'none',
            transition: 'background-color 0.2s ease',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#1AA886' }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#21C19A' }}
        >
          Get started
        </a>
      </div>
    </nav>
  )
}

function SliderWithGreen({ value, onChange, min, max, label }) {
  const percent = ((value - min) / (max - min)) * 100
  return (
    <div style={{ marginBottom: '16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <label style={{ fontSize: '14px', fontWeight: 400, color: '#BAD7F5' }}>{label}</label>
        <span style={{ fontSize: '14px', fontWeight: 500, color: '#F2F5FA', minWidth: '48px', textAlign: 'right' }}>{value}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={onChange}
        style={{
          background: `linear-gradient(to right, #21C19A 0%, #21C19A ${percent}%, #252836 ${percent}%, #252836 100%)`,
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

  useEffect(() => {
    const handleMouseMove = (e) => {
      document.body.style.setProperty('--mouse-x', `${e.clientX}px`)
      document.body.style.setProperty('--mouse-y', `${e.clientY}px`)
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

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
    <>
      <div className="mouse-glow-overlay" />
      <div style={{ position: 'relative', zIndex: 1, minHeight: '100vh' }}>
        <NavBar />
        <div style={{ maxWidth: '720px', margin: '0 auto', padding: '0 24px' }}>

          {/* SECTION 1 - HERO */}
          <section style={{ textAlign: 'center', paddingTop: '80px', paddingBottom: '40px' }}>
            <h1 style={{
              fontSize: '38px',
              fontWeight: 400,
              color: '#F2F5FA',
              lineHeight: 1.15,
              letterSpacing: '-0.02em',
              marginBottom: '16px',
            }}>
              Devin <span className="gradient-text-blue-green">Impact</span> Calculator
            </h1>
            <p style={{
              fontSize: '16px',
              fontWeight: 400,
              color: '#8A94A6',
              lineHeight: 1.6,
              maxWidth: '560px',
              margin: '0 auto',
            }}>
              See how much engineering time and budget Devin can give back to your team
            </p>
          </section>

          {/* Divider */}
          <div style={{ borderTop: '1px solid #252836', margin: '0 40px 40px 40px' }} />

          {/* SECTION 2 - YOUR TEAM */}
          <section style={{
            background: '#181B28',
            border: '1px solid #252836',
            borderRadius: '16px',
            padding: '28px',
            marginBottom: '56px',
          }}>
            <h2 style={{
              fontSize: '22px',
              fontWeight: 400,
              color: '#F2F5FA',
              letterSpacing: '-0.01em',
              marginBottom: '24px',
            }}>About Your Team</h2>

            <SliderWithGreen
              label="How many engineers on your team?"
              value={engineers}
              onChange={(e) => setEngineers(Number(e.target.value))}
              min={5}
              max={200}
            />

            {/* Cost Dropdown */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: 400,
                color: '#BAD7F5',
                marginBottom: '8px',
              }}>
                Average fully-loaded engineer cost
              </label>
              <select
                value={cost}
                onChange={(e) => setCost(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: 400,
                  color: '#F2F5FA',
                  backgroundColor: '#181B28',
                  border: '1px solid #252836',
                  outline: 'none',
                  cursor: 'pointer',
                }}
                onFocus={(e) => { e.currentTarget.style.borderColor = '#21C19A' }}
                onBlur={(e) => { e.currentTarget.style.borderColor = '#252836' }}
              >
                {COST_OPTIONS.map(opt => (
                  <option key={opt} value={opt} style={{ backgroundColor: '#181B28' }}>{opt}</option>
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
            <div style={{ marginTop: '24px' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: 400,
                color: '#BAD7F5',
                marginBottom: '16px',
              }}>
                What&apos;s your team&apos;s biggest challenge?
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                {CHALLENGES.map(ch => {
                  const isSelected = selectedChallenge === ch.id
                  return (
                    <button
                      key={ch.id}
                      onClick={() => handleChallengeSelect(ch.id)}
                      style={{
                        flex: '1 1 140px',
                        padding: '16px',
                        borderRadius: '12px',
                        textAlign: 'left',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        backgroundColor: '#181B28',
                        border: `1px solid ${isSelected ? '#21C19A' : '#252836'}`,
                        boxShadow: isSelected ? '0 0 20px rgba(33, 193, 154, 0.08)' : 'none',
                        minWidth: '140px',
                      }}
                      onMouseEnter={(e) => { if (!isSelected) e.currentTarget.style.borderColor = '#363A4D' }}
                      onMouseLeave={(e) => { if (!isSelected) e.currentTarget.style.borderColor = '#252836' }}
                    >
                      <div style={{ fontSize: '20px', marginBottom: '8px' }}>{ch.emoji}</div>
                      <div style={{ fontSize: '14px', fontWeight: 400, color: '#F2F5FA' }}>{ch.title}</div>
                      <div style={{ fontSize: '12px', fontWeight: 400, color: '#8A94A6', lineHeight: 1.4, marginTop: '4px' }}>{ch.subtitle}</div>
                    </button>
                  )
                })}
              </div>
            </div>
          </section>

          {/* SECTION 3 - TIME ALLOCATION */}
          <section style={{
            background: '#181B28',
            border: '1px solid #252836',
            borderRadius: '16px',
            padding: '28px',
            marginBottom: '56px',
          }}>
            <h2 style={{
              fontSize: '22px',
              fontWeight: 400,
              color: '#F2F5FA',
              letterSpacing: '-0.01em',
              marginBottom: '8px',
            }}>Where does your team&apos;s time go?</h2>
            <p style={{ fontSize: '14px', fontWeight: 400, color: '#8A94A6', marginBottom: '24px' }}>
              Estimate how your engineers spend their time across these categories
            </p>

            {TIME_LABELS.map((label, i) => {
              const pct = timeAllocation[i]
              return (
                <div key={label} style={{ marginBottom: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <label style={{ fontSize: '14px', fontWeight: 400, color: '#BAD7F5' }}>{label}</label>
                    <span style={{ fontSize: '14px', fontWeight: 500, color: '#F2F5FA', minWidth: '40px', textAlign: 'right' }}>{pct}%</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={pct}
                    onChange={(e) => handleTimeChange(i, e.target.value)}
                    style={{
                      background: `linear-gradient(to right, #21C19A 0%, #21C19A ${pct}%, #252836 ${pct}%, #252836 100%)`,
                    }}
                  />
                </div>
              )
            })}

            {/* Running Total */}
            <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #252836' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <span style={{ fontSize: '14px', fontWeight: 400, color: '#BAD7F5' }}>Total</span>
                <span style={{ fontSize: '14px', fontWeight: 500, color: total === 100 ? '#21C19A' : '#FF6B6B' }}>
                  {total}%
                  {total !== 100 && (
                    <span style={{ fontSize: '13px', fontWeight: 400, marginLeft: '8px', color: '#8A94A6' }}>
                      (should equal 100%)
                    </span>
                  )}
                </span>
              </div>

              {/* Devin-Eligible Banner */}
              <div style={{
                background: '#181B28',
                borderLeft: '3px solid #21C19A',
                borderRadius: '12px',
                padding: '20px 24px',
              }}>
                <span className="gradient-text-green-teal" style={{ fontSize: '22px', fontWeight: 500 }}>{devinCanHelp}%</span>
                <span style={{ fontSize: '15px', fontWeight: 400, color: '#BAD7F5', marginLeft: '8px' }}>
                  of your team&apos;s time is spent on work Devin can help with
                </span>
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
            <section style={{ marginBottom: '56px' }}>
              <div style={{
                padding: '48px 32px',
                borderRadius: '16px',
                textAlign: 'center',
                border: '2px dashed #252836',
                color: '#8A94A6',
              }}>
                <p style={{ fontSize: '16px', fontWeight: 400 }}>Adjust your time allocation to total 100% to see your impact report</p>
              </div>
            </section>
          )}

          {/* CTA SECTION */}
          <section style={{ textAlign: 'center', marginTop: '56px', marginBottom: '32px' }}>
            <p style={{ fontSize: '18px', fontWeight: 400, color: '#F2F5FA', marginBottom: '32px' }}>
              Ready to see these results for your team?
            </p>
            <a
              href="https://app.devin.ai/"
              target="_blank"
              rel="noopener noreferrer"
              className="cta-pulse"
              style={{
                display: 'inline-block',
                fontSize: '14px',
                fontWeight: 500,
                color: '#10131C',
                backgroundColor: '#21C19A',
                borderRadius: '999px',
                padding: '12px 28px',
                textDecoration: 'none',
                transition: 'background-color 0.2s ease',
                marginBottom: '32px',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#1AA886' }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#21C19A' }}
            >
              Get started with Devin
            </a>
            <div>
              <a
                href="https://devin.ai"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontSize: '13px',
                  color: '#8A94A6',
                  textDecoration: 'none',
                  transition: 'text-decoration 0.2s ease',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.textDecoration = 'underline' }}
                onMouseLeave={(e) => { e.currentTarget.style.textDecoration = 'none' }}
              >
                Learn more at devin.ai
              </a>
            </div>
          </section>

          {/* FOOTER */}
          <footer style={{ paddingBottom: '40px', marginTop: '32px' }}>
            <div style={{ borderTop: '1px solid #252836', marginBottom: '24px' }} />
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '12px',
              marginBottom: '16px',
            }}>
              <div style={{ fontSize: '12px', color: '#555E70' }}>
                <a href="https://cognition.ai/privacy-policy" target="_blank" rel="noopener noreferrer" style={{ color: '#555E70', textDecoration: 'none' }}>Privacy policy</a>
                {' \u00B7 '}
                <a href="https://cognition.ai/terms-of-service" target="_blank" rel="noopener noreferrer" style={{ color: '#555E70', textDecoration: 'none' }}>Terms of service</a>
              </div>
              <div style={{ fontSize: '12px', color: '#555E70' }}>
                <a href="https://linkedin.com/company/cognition-ai-labs/" target="_blank" rel="noopener noreferrer" style={{ color: '#555E70', textDecoration: 'none' }}>LinkedIn</a>
                {' \u00B7 '}
                <a href="https://x.com/cognition" target="_blank" rel="noopener noreferrer" style={{ color: '#555E70', textDecoration: 'none' }}>X (Twitter)</a>
              </div>
            </div>
            <div style={{ textAlign: 'center', fontSize: '11px', color: '#555E70' }}>
              Built with Devin &middot; Not affiliated with Cognition
            </div>
          </footer>
        </div>
      </div>
    </>
  )
}

export default App
