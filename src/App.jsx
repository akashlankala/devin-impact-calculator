import { useState, useCallback, useRef, useEffect } from 'react'
import './App.css'
import ImpactDashboard from './ImpactDashboard'
import IndividualFlow from './IndividualFlow'

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

const FLOATING_CHARS = [
  { char: '{', top: '5%', left: '3%', size: 22, duration: 18 },
  { char: '}', top: '12%', left: '92%', size: 26, duration: 22 },
  { char: '<', top: '20%', left: '8%', size: 16, duration: 25 },
  { char: '/>', top: '28%', left: '88%', size: 20, duration: 19 },
  { char: '(', top: '35%', left: '5%', size: 24, duration: 28 },
  { char: ')', top: '42%', left: '95%', size: 18, duration: 16 },
  { char: ';', top: '50%', left: '2%', size: 14, duration: 23 },
  { char: '=', top: '58%', left: '90%', size: 22, duration: 20 },
  { char: '*', top: '65%', left: '7%', size: 28, duration: 27 },
  { char: '//', top: '72%', left: '93%', size: 16, duration: 17 },
  { char: '\u2192', top: '78%', left: '4%', size: 20, duration: 24 },
  { char: '::', top: '85%', left: '91%', size: 18, duration: 21 },
  { char: '[', top: '15%', left: '50%', size: 14, duration: 26 },
  { char: ']', top: '90%', left: '45%', size: 16, duration: 15 },
  { char: '0', top: '8%', left: '70%', size: 20, duration: 29 },
  { char: '1', top: '45%', left: '15%', size: 18, duration: 22 },
  { char: '</', top: '60%', left: '80%', size: 14, duration: 18 },
  { char: '{}', top: '38%', left: '55%', size: 16, duration: 30 },
  { char: '>', top: '75%', left: '30%', size: 22, duration: 20 },
  { char: '()', top: '25%', left: '40%', size: 14, duration: 25 },
]

const TICKER_ITEMS = [
  { number: '8-12x', desc: 'migration efficiency (Nubank)' },
  { number: '20x', desc: 'cost savings vs. human engineers' },
  { number: '93%', desc: 'faster regression cycles (Litera)' },
  { number: '1,583', desc: 'PRs merged by Devin (Gumroad)' },
  { number: '85%', desc: 'Devin PR merge rate' },
  { number: '10,000+', desc: 'hours saved annually' },
  { number: '4x', desc: 'faster YoY' },
  { number: '$9/hr', desc: 'effective Devin cost' },
]

function FloatingCharacters() {
  return (
    <div className="floating-chars-overlay">
      {FLOATING_CHARS.map((item, i) => (
        <span
          key={i}
          className="floating-char"
          style={{
            top: item.top,
            left: item.left,
            fontSize: `${item.size}px`,
            animation: `float ${item.duration}s ease-in-out infinite`,
            animationDelay: `${i * 0.7}s`,
          }}
        >
          {item.char}
        </span>
      ))}
    </div>
  )
}

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
      <div className="nav-center" style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
        <a href="https://devin.ai/" target="_blank" rel="noopener noreferrer" className="nav-link">Home</a>
        <a href="https://devin.ai/enterprise" target="_blank" rel="noopener noreferrer" className="nav-link">Enterprise</a>
        <a href="https://devin.ai/pricing" target="_blank" rel="noopener noreferrer" className="nav-link">Pricing</a>
        <a href="https://devin.ai/customers" target="_blank" rel="noopener noreferrer" className="nav-link">Customers</a>
        <a href="#" className="nav-link nav-link-active">Impact Calculator</a>
      </div>
      <div className="nav-right" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <a href="https://app.devin.ai/login" target="_blank" rel="noopener noreferrer" className="nav-link">Login</a>
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
    <div style={{ marginBottom: '20px' }}>
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

function StatsTicker() {
  const items = [...TICKER_ITEMS, ...TICKER_ITEMS, ...TICKER_ITEMS]
  return (
    <div className="zone-ticker">
      <div className="ticker-track">
        {items.map((item, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingRight: '48px', whiteSpace: 'nowrap' }}>
            <span style={{ fontSize: '15px', fontWeight: 500, color: '#21C19A' }}>{item.number}</span>
            <span style={{ fontSize: '14px', color: '#8A94A6' }}>{item.desc}</span>
            <span style={{ color: '#555E70', marginLeft: '40px' }}>{'\u00B7'}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function RingChart({ percent }) {
  const radius = 100
  const circumference = 2 * Math.PI * radius
  const offset = circumference * (1 - percent / 100)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ position: 'relative', width: '220px', height: '220px' }}>
        <svg width="220" height="220" viewBox="0 0 220 220">
          <circle cx="110" cy="110" r={radius} fill="none" stroke="#252836" strokeWidth="8" />
          <circle
            cx="110" cy="110" r={radius} fill="none" stroke="#21C19A" strokeWidth="8"
            strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round"
            className="ring-progress"
            style={{ transform: 'rotate(-90deg)', transformOrigin: '110px 110px' }}
          />
        </svg>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
          <div className="gradient-text-green-cyan" style={{ fontSize: '48px', fontWeight: 500, lineHeight: 1 }}>
            {percent}%
          </div>
          <div style={{ fontSize: '13px', color: '#8A94A6', marginTop: '4px' }}>Devin-eligible</div>
        </div>
      </div>
      <p style={{ fontSize: '14px', color: '#BAD7F5', textAlign: 'center', maxWidth: '220px', marginTop: '20px' }}>
        of your team&apos;s time is spent on work Devin can handle
      </p>
      <p style={{ fontSize: '12px', color: '#555E70', textAlign: 'center', maxWidth: '250px', marginTop: '16px' }}>
        Categories 1-5 are automatable. Only new feature development requires human creativity.
      </p>
    </div>
  )
}

const PERSONA_CARDS = [
  { id: 'individual', emoji: '\uD83D\uDC69\u200D\uD83D\uDCBB', title: 'Individual Developer', subtitle: 'Ship faster with an AI teammate', price: 'Core \u00B7 from $20' },
  { id: 'team', emoji: '\uD83D\uDC65', title: 'Team Manager', subtitle: 'Justify Devin for your team with real ROI', price: 'Team \u00B7 $500/mo' },
  { id: 'enterprise', emoji: '\uD83C\uDFE2', title: 'Enterprise Leader', subtitle: 'Evaluate Devin across your organization', price: 'Enterprise \u00B7 Custom pricing' },
]

const TRUST_PILLS = {
  individual: ['4x faster task completion', '$9/hr effective cost', '85% PR merge rate', 'Pay as you go'],
  team: ['Based on Nubank data', 'Cognition case studies', 'Conservative estimates', 'Real-time calculations'],
  enterprise: ['SOC 2 Type II', 'VPC deployment', 'SAML SSO', 'Used by Nubank, Itaú, Ramp'],
}


function App() {
  const [selectedPersona, setSelectedPersona] = useState(null)
  const heroCardsRef = useRef(null)
  const [showStickyBar, setShowStickyBar] = useState(false)
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

  useEffect(() => {
    if (!heroCardsRef.current) return
    const observer = new IntersectionObserver(
      ([entry]) => setShowStickyBar(!entry.isIntersecting),
      { threshold: 0 }
    )
    observer.observe(heroCardsRef.current)
    return () => observer.disconnect()
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

  const scrollToContent = () => {
    const ticker = document.querySelector('.zone-ticker')
    if (ticker) {
      const rect = ticker.getBoundingClientRect()
      window.scrollTo({ top: window.scrollY + rect.bottom, behavior: 'smooth' })
    }
  }

  return (
    <>
      <FloatingCharacters />
      <div className="static-gradient-overlay" />
      <div className="mouse-glow-overlay" />
      <div style={{ position: 'relative', zIndex: 3 }}>
        <NavBar />

        {/* ZONE 1: HERO */}
        <section className="zone-hero">
          <div style={{ textAlign: 'center', maxWidth: '900px', padding: '0 24px' }}>
            <h1 style={{ fontSize: '56px', fontWeight: 400, color: '#F2F5FA', lineHeight: 1.1, letterSpacing: '-0.02em', marginBottom: '16px' }}>
              Devin <span className="gradient-text-blue-green">Impact</span>
            </h1>
            <p style={{ fontSize: '18px', fontWeight: 400, color: '#8A94A6', lineHeight: 1.6, marginBottom: '32px' }}>
              See how Devin fits into your workflow &mdash; whether you&apos;re shipping code, managing a team, or leading an organization
            </p>

            {/* Persona Cards */}
            <div ref={heroCardsRef} style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
              {PERSONA_CARDS.map(card => {
                const isSelected = selectedPersona === card.id
                const hasSelection = selectedPersona !== null
                return (
                  <div
                    key={card.id}
                    onClick={() => setSelectedPersona(card.id)}
                    style={{
                      backgroundColor: '#181B28',
                      border: `1px solid ${isSelected ? '#21C19A' : '#252836'}`,
                      borderRadius: '16px',
                      padding: '24px',
                      cursor: 'pointer',
                      flex: 1,
                      textAlign: 'left',
                      opacity: hasSelection && !isSelected ? 0.5 : 1,
                      transform: hasSelection && !isSelected ? 'scale(0.97)' : 'scale(1)',
                      boxShadow: isSelected ? '0 0 20px rgba(33, 193, 154, 0.1)' : 'none',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <div style={{ fontSize: '24px', marginBottom: '12px' }}>{card.emoji}</div>
                    <div style={{ fontSize: '15px', color: '#F2F5FA', marginBottom: '6px' }}>{card.title}</div>
                    <div style={{ fontSize: '13px', color: '#8A94A6', lineHeight: 1.4, marginBottom: '12px' }}>{card.subtitle}</div>
                    <div style={{ fontSize: '12px', color: '#555E70' }}>{card.price}</div>
                  </div>
                )
              })}
            </div>

            {/* Trust pills based on selectedPersona */}
            {selectedPersona && TRUST_PILLS[selectedPersona] && (
              <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '8px', marginBottom: '24px' }}>
                {TRUST_PILLS[selectedPersona].map(badge => (
                  <span key={badge} style={{ border: '1px solid #252836', borderRadius: '999px', padding: '4px 14px', fontSize: '11px', color: '#8A94A6', background: 'transparent' }}>
                    {badge}
                  </span>
                ))}
              </div>
            )}

            {/* CTA button - only when persona selected */}
            {selectedPersona && (
              <button
                onClick={scrollToContent}
                className="cta-pulse"
                style={{
                  display: 'inline-block', fontSize: '15px', fontWeight: 500, color: '#10131C',
                  backgroundColor: '#21C19A', borderRadius: '999px', padding: '14px 32px',
                  border: 'none', cursor: 'pointer', transition: 'background-color 0.2s ease', marginBottom: '24px',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#1AA886' }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#21C19A' }}
              >
                Calculate your impact {'\u2193'}
              </button>
            )}
            {selectedPersona && (
              <div className="scroll-indicator" style={{ fontSize: '20px', color: '#555E70' }}>
                {'\u2228'}
              </div>
            )}
          </div>
        </section>

        {/* ZONE 2: STATS TICKER */}
        <StatsTicker />

        {/* PERSONA SELECTOR - STICKY BAR */}
        <div style={{ height: '48px' }} />

        <div style={{
          position: 'fixed',
          top: '56px',
          left: 0,
          right: 0,
          zIndex: 45,
          backgroundColor: 'rgba(16, 19, 28, 0.92)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderBottom: '1px solid #252836',
          padding: '10px 0',
          display: 'flex',
          justifyContent: 'center',
          gap: '8px',
          opacity: showStickyBar ? 1 : 0,
          pointerEvents: showStickyBar ? 'auto' : 'none',
          transition: 'opacity 0.2s ease',
        }}>
          {[
            { id: 'individual', emoji: '\uD83D\uDC69\u200D\uD83D\uDCBB', label: 'Individual' },
            { id: 'team', emoji: '\uD83D\uDC65', label: 'Team' },
            { id: 'enterprise', emoji: '\uD83C\uDFE2', label: 'Enterprise' },
          ].map(p => (
            <button
              key={p.id}
              onClick={() => setSelectedPersona(p.id)}
              style={{
                padding: '8px 16px',
                borderRadius: '999px',
                fontSize: '13px',
                cursor: 'pointer',
                border: selectedPersona === p.id ? '1px solid #21C19A' : '1px solid #252836',
                backgroundColor: selectedPersona === p.id ? '#21C19A' : 'transparent',
                color: selectedPersona === p.id ? '#10131C' : '#8A94A6',
                fontWeight: selectedPersona === p.id ? 500 : 400,
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => { if (selectedPersona !== p.id) { e.currentTarget.style.borderColor = '#363A4D'; e.currentTarget.style.color = '#F2F5FA' } }}
              onMouseLeave={(e) => { if (selectedPersona !== p.id) { e.currentTarget.style.borderColor = '#252836'; e.currentTarget.style.color = '#8A94A6' } }}
            >
              {p.emoji} {p.label}
            </button>
          ))}
        </div>

        {/* INDIVIDUAL DEVELOPER FLOW */}
        <div style={{ display: selectedPersona === 'individual' ? 'block' : 'none' }}>
          <IndividualFlow />
        </div>

        {/* ENTERPRISE PLACEHOLDER */}
        {selectedPersona === 'enterprise' && (
          <section style={{ backgroundColor: '#10131C', padding: '80px 24px 64px' }}>
            <div style={{
              maxWidth: '700px', margin: '0 auto', padding: '64px 32px', borderRadius: '16px',
              textAlign: 'center', border: '2px dashed #252836', color: '#8A94A6',
            }}>
              <div style={{ fontSize: '48px', marginBottom: '24px' }}>{"\uD83C\uDFE2"}</div>
              <div style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#21C19A', marginBottom: '12px' }}>COMING SOON</div>
              <h2 style={{ fontSize: '24px', fontWeight: 400, color: '#F2F5FA', marginBottom: '12px' }}>Enterprise Impact Assessment</h2>
              <p style={{ fontSize: '14px', color: '#8A94A6', lineHeight: 1.6, marginBottom: '32px' }}>
                A comprehensive ROI calculator for large-scale Devin deployments, including custom integrations, security compliance, and organization-wide impact projections.
              </p>
              <a
                href="https://devin.ai/enterprise"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-block', fontSize: '15px', fontWeight: 500, color: '#10131C',
                  backgroundColor: '#21C19A', borderRadius: '999px', padding: '12px 28px',
                  textDecoration: 'none', transition: 'background-color 0.2s ease',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#1AA886' }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#21C19A' }}
              >
                Contact Sales
              </a>
            </div>
          </section>
        )}

        {/* TEAM MANAGER FLOW */}
        <div style={{ display: selectedPersona === 'team' ? 'block' : 'none' }}>

        {/* ZONE 3: CONFIGURE YOUR TEAM */}
        <section className="zone-configure" id="zone-configure">
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <div style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#8A94A6', marginBottom: '12px' }}>CONFIGURE</div>
            <h2 style={{ fontSize: '30px', fontWeight: 400, color: '#F2F5FA', marginBottom: '12px' }}>
              Tell us about your team
            </h2>
            <p style={{ fontSize: '14px', color: '#8A94A6' }}>
              We&apos;ll use this to calculate your team&apos;s potential with Devin
            </p>
          </div>

          <div className="two-col-configure">
            <div style={{ backgroundColor: '#181B28', border: '1px solid #252836', borderRadius: '16px', padding: '28px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 400, color: '#F2F5FA', marginBottom: '24px' }}>Team Profile</h3>
              <SliderWithGreen label="How many engineers on your team?" value={engineers} onChange={(e) => setEngineers(Number(e.target.value))} min={5} max={200} />
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: 400, color: '#BAD7F5', marginBottom: '8px' }}>
                  Average fully-loaded engineer cost
                </label>
                <select
                  value={cost} onChange={(e) => setCost(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', fontSize: '14px', fontWeight: 400, color: '#F2F5FA', backgroundColor: '#181B28', border: '1px solid #252836', outline: 'none', cursor: 'pointer' }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = '#21C19A' }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = '#252836' }}
                >
                  {COST_OPTIONS.map(opt => (
                    <option key={opt} value={opt} style={{ backgroundColor: '#181B28' }}>{opt}</option>
                  ))}
                </select>
              </div>
              <SliderWithGreen label="How many tickets are in your current backlog?" value={backlog} onChange={(e) => setBacklog(Number(e.target.value))} min={0} max={1000} />
            </div>

            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 400, color: '#F2F5FA', marginBottom: '16px' }}>
                What&apos;s your biggest challenge?
              </h3>
              <div className="challenge-grid">
                {CHALLENGES.map(ch => {
                  const isSelected = selectedChallenge === ch.id
                  return (
                    <button
                      key={ch.id}
                      onClick={() => handleChallengeSelect(ch.id)}
                      style={{
                        padding: '16px', borderRadius: '12px', textAlign: 'left', cursor: 'pointer',
                        transition: 'all 0.2s ease', backgroundColor: '#181B28',
                        border: `1px solid ${isSelected ? '#21C19A' : '#252836'}`,
                        boxShadow: isSelected ? '0 0 20px rgba(33, 193, 154, 0.08)' : 'none',
                      }}
                      onMouseEnter={(e) => { if (!isSelected) e.currentTarget.style.borderColor = '#363A4D' }}
                      onMouseLeave={(e) => { if (!isSelected) e.currentTarget.style.borderColor = isSelected ? '#21C19A' : '#252836' }}
                    >
                      <div style={{ fontSize: '20px', marginBottom: '8px' }}>{ch.emoji}</div>
                      <div style={{ fontSize: '14px', fontWeight: 400, color: '#F2F5FA' }}>{ch.title}</div>
                      <div style={{ fontSize: '12px', fontWeight: 400, color: '#8A94A6', lineHeight: 1.4, marginTop: '4px' }}>{ch.subtitle}</div>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        </section>

        {/* ZONE 4: TIME ALLOCATION */}
        <section className="zone-time" id="zone-time">
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <div style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#8A94A6', marginBottom: '12px' }}>ESTIMATE</div>
            <h2 style={{ fontSize: '30px', fontWeight: 400, color: '#F2F5FA' }}>
              Where does your team&apos;s time go?
            </h2>
          </div>

          <div className="two-col-time">
            <div style={{ backgroundColor: '#181B28', border: '1px solid #252836', borderRadius: '16px', padding: '28px' }}>
              {TIME_LABELS.map((label, i) => {
                const pct = timeAllocation[i]
                return (
                  <div key={label} style={{ marginBottom: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <label style={{ fontSize: '14px', fontWeight: 400, color: '#BAD7F5' }}>{label}</label>
                      <span style={{ fontSize: '14px', fontWeight: 500, color: '#F2F5FA', minWidth: '40px', textAlign: 'right' }}>{pct}%</span>
                    </div>
                    <input
                      type="range" min={0} max={100} value={pct}
                      onChange={(e) => handleTimeChange(i, e.target.value)}
                      style={{ background: `linear-gradient(to right, #21C19A 0%, #21C19A ${pct}%, #252836 ${pct}%, #252836 100%)` }}
                    />
                  </div>
                )
              })}
              <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #252836' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
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
              </div>
            </div>

            <RingChart percent={devinCanHelp} />
          </div>
        </section>

        {/* ZONES 5-7: IMPACT REPORT */}
        {total === 100 ? (
          <ImpactDashboard teamSize={engineers} costBracket={cost} timeAllocation={timeAllocation} />
        ) : (
          <section className="zone-results">
            <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '48px 32px', borderRadius: '16px', textAlign: 'center', border: '2px dashed #252836', color: '#8A94A6' }}>
              <p style={{ fontSize: '16px', fontWeight: 400 }}>Adjust your time allocation to total 100% to see your impact report</p>
            </div>
          </section>
        )}

        </div>{/* END TEAM MANAGER FLOW */}

        {selectedPersona === null && (
          <section style={{
            backgroundColor: '#10131C',
            padding: '120px 24px',
            textAlign: 'center',
          }}>
            <div style={{
              maxWidth: '500px',
              margin: '0 auto',
            }}>
              <div style={{ fontSize: '32px', marginBottom: '16px' }}>{"\uD83D\uDC46"}</div>
              <p style={{
                fontSize: '18px',
                fontWeight: 400,
                color: '#555E70',
                lineHeight: 1.6,
              }}>
                Select your role above to see your personalized impact report
              </p>
            </div>
          </section>
        )}

        {/* ZONE 8: CTA + FOOTER */}
        <section className="zone-cta">
          <div style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
            <h2 style={{ fontSize: '28px', fontWeight: 400, color: '#F2F5FA', marginBottom: '8px' }}>
              Ready to see these results?
            </h2>
            <p style={{ fontSize: '15px', color: '#8A94A6', marginBottom: '32px' }}>
              Join engineering teams at Nubank, Gumroad, Ramp, and Ita{'\u00FA'}
            </p>
            <a
              href="https://app.devin.ai/" target="_blank" rel="noopener noreferrer" className="cta-pulse"
              style={{
                display: 'inline-block', fontSize: '15px', fontWeight: 500, color: '#10131C',
                backgroundColor: '#21C19A', borderRadius: '999px', padding: '14px 32px',
                textDecoration: 'none', transition: 'background-color 0.2s ease',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#1AA886' }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#21C19A' }}
            >
              Get started with Devin
            </a>
            <div style={{ marginTop: '16px' }}>
              <a
                href="https://devin.ai" target="_blank" rel="noopener noreferrer"
                style={{ fontSize: '13px', color: '#8A94A6', textDecoration: 'none', transition: 'text-decoration 0.2s ease' }}
                onMouseEnter={(e) => { e.currentTarget.style.textDecoration = 'underline' }}
                onMouseLeave={(e) => { e.currentTarget.style.textDecoration = 'none' }}
              >
                Learn more at devin.ai
              </a>
            </div>
          </div>

          <div style={{ maxWidth: '600px', margin: '0 auto', marginTop: '64px' }}>
            <div style={{ borderTop: '1px solid #252836', marginBottom: '24px' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
              <div style={{ fontSize: '12px', color: '#555E70' }}>
                <a href="https://cognition.ai/privacy-policy" target="_blank" rel="noopener noreferrer" style={{ color: '#555E70', textDecoration: 'none' }}>Privacy policy</a>
                {' \u00B7 '}
                <a href="https://cognition.ai/terms-of-service" target="_blank" rel="noopener noreferrer" style={{ color: '#555E70', textDecoration: 'none' }}>Terms of service</a>
              </div>
              <div style={{ fontSize: '12px', color: '#555E70' }}>
                <a href="https://linkedin.com/company/cognition-ai-labs/" target="_blank" rel="noopener noreferrer" style={{ color: '#555E70', textDecoration: 'none' }}>LinkedIn</a>
                {' \u00B7 '}
                <a href="https://x.com/cognition" target="_blank" rel="noopener noreferrer" style={{ color: '#555E70', textDecoration: 'none' }}>X</a>
              </div>
            </div>
            <div style={{ textAlign: 'center', fontSize: '11px', color: '#555E70', paddingBottom: '32px' }}>
              Built with Devin {'\u00B7'} Not affiliated with Cognition
            </div>
          </div>
        </section>
      </div>
    </>
  )
}

export default App
