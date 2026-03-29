import { useState } from 'react'

const INTENT_CARDS = [
  { id: 'speedup', emoji: '\uD83D\uDCBC', title: 'Speed up my dev work', subtitle: "I'm a developer \u2014 I want to spend less time on busywork" },
  { id: 'sideproject', emoji: '\uD83D\uDE80', title: 'Build a side project', subtitle: "I have an idea I've been wanting to bring to life" },
  { id: 'newbuilder', emoji: '\uD83C\uDF31', title: 'Build something new', subtitle: "I'm not a coder but I want to create something" },
]

const PAIN_POINTS = [
  { id: 'bugs', emoji: '\uD83D\uDC1B', title: 'Bug fixes & firefighting' },
  { id: 'tests', emoji: '\uD83E\uDDEA', title: 'Writing tests' },
  { id: 'understanding', emoji: '\uD83D\uDCD6', title: 'Understanding existing code' },
  { id: 'devops', emoji: '\uD83D\uDD27', title: 'DevOps & deployment' },
  { id: 'boilerplate', emoji: '\uD83D\uDCDD', title: 'Boilerplate & repetitive code' },
]

const PROJECT_TYPES = [
  { id: 'website', emoji: '\uD83C\uDF10', title: 'Website or web app' },
  { id: 'mobile', emoji: '\uD83D\uDCF1', title: 'Mobile app' },
  { id: 'extension', emoji: '\uD83E\uDDE9', title: 'Chrome extension' },
  { id: 'data', emoji: '\uD83D\uDCCA', title: 'Data project' },
  { id: 'automation', emoji: '\uD83E\uDD16', title: 'Automation or bot' },
  { id: 'other', emoji: '\uD83D\uDCA1', title: 'Something else' },
]

const HOURLY_OPTIONS = [
  { label: '< $50/hr', value: 40 },
  { label: '$50-75/hr', value: 62 },
  { label: '$75-100/hr', value: 87 },
  { label: '$100-150/hr', value: 125 },
  { label: '$150+/hr', value: 175 },
]

const PROGRESS_OPTIONS = [
  { id: 'idea', label: 'Just an idea' },
  { id: 'stuck', label: 'Started but stuck' },
  { id: 'almost', label: 'Almost done' },
]

const TRIED_OPTIONS = [
  { id: 'stuck', emoji: '\uD83D\uDD04', title: 'Yes \u2014 I got stuck or gave up' },
  { id: 'new', emoji: '\uD83C\uDD95', title: "No \u2014 I don't know where to start" },
]

function SliderWithGreen({ value, onChange, min, max, label, displayValue }) {
  const percent = ((value - min) / (max - min)) * 100
  return (
    <div style={{ marginBottom: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <label style={{ fontSize: '14px', fontWeight: 400, color: '#BAD7F5' }}>{label}</label>
        <span style={{ fontSize: '14px', fontWeight: 500, color: '#F2F5FA', minWidth: '48px', textAlign: 'right' }}>{displayValue !== undefined ? displayValue : value}</span>
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

function GradientText({ children, style = {} }) {
  return (
    <span style={{
      background: 'linear-gradient(90deg, #4991E5, #21C19A)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      ...style,
    }}>
      {children}
    </span>
  )
}

function GreenPillCTA({ text, href }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: 'inline-block',
          backgroundColor: '#21C19A',
          color: '#10131C',
          borderRadius: '999px',
          padding: '12px 28px',
          fontWeight: 500,
          fontSize: '15px',
          textDecoration: 'none',
          transition: 'background-color 0.2s ease',
        }}
        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#1AA886' }}
        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#21C19A' }}
      >
        {text}
      </a>
    </div>
  )
}

/* ======================== SPEEDUP REPORT ======================== */
function SpeedupReport({ codingHours, busyworkPercent, hourlyRate, painPoint }) {
  const busyworkHours = codingHours * (busyworkPercent / 100)
  const efficiencyMultiplier = 3.5
  const reviewOverhead = 0.20
  const hoursReclaimedRaw = busyworkHours * (1 - 1 / efficiencyMultiplier)
  const hoursReclaimed = Math.round(hoursReclaimedRaw * (1 - reviewOverhead))
  const newBusyworkHours = busyworkHours - hoursReclaimed
  const afterBusyworkPercent = Math.max(0, Math.round((newBusyworkHours / codingHours) * 100))
  const weeklyValue = hoursReclaimed * hourlyRate
  const devinWeeklyCost = Math.round(busyworkHours / efficiencyMultiplier * 9)

  const painData = {
    bugs: { number: 'Fewer fires', label: 'Bug fixes handled', subtitle: 'Devin handles triage and first-pass fixes while you focus on features' },
    tests: { number: 'Ship confident', label: 'Tests covered', subtitle: "Devin writes the tests you've been skipping" },
    understanding: { number: 'Instant clarity', label: 'Codebase mapped', subtitle: 'Stop spelunking \u2014 Devin maps the codebase for you' },
    devops: { number: 'Autopilot', label: 'DevOps handled', subtitle: 'CI/CD and infrastructure runs in the background' },
    boilerplate: { number: 'Skip it', label: 'Boilerplate gone', subtitle: 'Repetitive code writes itself \u2014 you make creative decisions' },
  }
  const pain = painPoint ? painData[painPoint] : { number: 'More time', label: 'For what matters', subtitle: "Delegate the work you don't want to do" }

  let hoursSubtitle
  if (hoursReclaimed > 10) hoursSubtitle = "That's more than a full extra day"
  else if (hoursReclaimed > 5) hoursSubtitle = "That's like getting an extra afternoon every day"
  else hoursSubtitle = 'A few hours back makes all the difference'

  return (
    <section style={{ backgroundColor: '#141825', padding: '64px 24px', borderTop: '1px solid #252836' }}>
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <div style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#8A94A6', marginBottom: '12px' }}>YOUR IMPACT</div>
        <h2 style={{ fontSize: '28px', fontWeight: 400, color: '#F2F5FA' }}>
          Your Week, <GradientText>Transformed</GradientText>
        </h2>
      </div>

      {/* Before/After bars */}
      <div style={{ maxWidth: '800px', margin: '0 auto 40px' }}>
        <div style={{ fontSize: '13px', textTransform: 'uppercase', color: '#8A94A6', marginBottom: '8px' }}>YOUR WEEK NOW</div>
        <div style={{ height: '48px', borderRadius: '8px', overflow: 'hidden', display: 'flex', marginBottom: '16px' }}>
          <div style={{ width: `${busyworkPercent}%`, backgroundColor: '#363A4D', display: 'flex', alignItems: 'center', paddingLeft: '12px', transition: 'width 0.5s ease' }}>
            {busyworkPercent > 20 && <span style={{ fontSize: '13px', color: '#8A94A6', whiteSpace: 'nowrap' }}>Busywork &middot; {busyworkPercent}%</span>}
          </div>
          <div style={{ width: `${100 - busyworkPercent}%`, backgroundColor: '#21C19A', display: 'flex', alignItems: 'center', paddingLeft: '12px', transition: 'width 0.5s ease' }}>
            {(100 - busyworkPercent) > 20 && <span style={{ fontSize: '13px', color: '#10131C', whiteSpace: 'nowrap' }}>Meaningful work &middot; {100 - busyworkPercent}%</span>}
          </div>
        </div>

        <div style={{ fontSize: '13px', textTransform: 'uppercase', color: '#8A94A6', marginBottom: '8px' }}>YOUR WEEK WITH DEVIN</div>
        <div style={{ height: '48px', borderRadius: '8px', overflow: 'hidden', display: 'flex' }}>
          <div style={{ width: `${afterBusyworkPercent}%`, backgroundColor: '#363A4D', display: 'flex', alignItems: 'center', paddingLeft: '12px', transition: 'width 0.5s ease' }}>
            {afterBusyworkPercent > 20 && <span style={{ fontSize: '13px', color: '#8A94A6', whiteSpace: 'nowrap' }}>Busywork &middot; {afterBusyworkPercent}%</span>}
          </div>
          <div style={{ width: `${100 - afterBusyworkPercent}%`, backgroundColor: '#21C19A', display: 'flex', alignItems: 'center', paddingLeft: '12px', transition: 'width 0.5s ease' }}>
            {(100 - afterBusyworkPercent) > 20 && <span style={{ fontSize: '13px', color: '#10131C', whiteSpace: 'nowrap' }}>Meaningful work &middot; {100 - afterBusyworkPercent}%</span>}
          </div>
        </div>
      </div>

      {/* Metric cards */}
      <div className="ind-metric-row" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', maxWidth: '900px', margin: '0 auto 40px' }}>
        <div style={{ backgroundColor: '#181B28', border: '1px solid #252836', borderRadius: '16px', padding: '24px', transition: 'border-color 0.2s ease' }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#363A4D' }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#252836' }}>
          <div style={{ fontSize: '24px', marginBottom: '12px' }}>{'\u23F1\uFE0F'}</div>
          <div style={{ fontSize: '28px', fontWeight: 500, marginBottom: '4px' }}><GradientText>{hoursReclaimed} hrs/week</GradientText></div>
          <div style={{ fontSize: '14px', color: '#F2F5FA', marginTop: '8px' }}>Hours reclaimed per week</div>
          <div style={{ fontSize: '13px', color: '#8A94A6', marginTop: '4px' }}>{hoursSubtitle}</div>
        </div>
        <div style={{ backgroundColor: '#181B28', border: '1px solid #252836', borderRadius: '16px', padding: '24px', transition: 'border-color 0.2s ease' }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#363A4D' }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#252836' }}>
          <div style={{ fontSize: '24px', marginBottom: '12px' }}>{'\uD83D\uDCB0'}</div>
          <div style={{ fontSize: '28px', fontWeight: 500, marginBottom: '4px' }}><GradientText>${weeklyValue.toLocaleString()}/week</GradientText></div>
          <div style={{ fontSize: '14px', color: '#F2F5FA', marginTop: '8px' }}>Value of your reclaimed time</div>
          <div style={{ fontSize: '13px', color: '#8A94A6', marginTop: '4px' }}>Devin costs ~${devinWeeklyCost}/week for this</div>
        </div>
        <div style={{ backgroundColor: '#181B28', border: '1px solid #252836', borderRadius: '16px', padding: '24px', transition: 'border-color 0.2s ease' }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#363A4D' }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#252836' }}>
          <div style={{ fontSize: '24px', marginBottom: '12px' }}>{'\uD83C\uDFAF'}</div>
          <div style={{ fontSize: '28px', fontWeight: 500, marginBottom: '4px' }}><GradientText>{pain.number}</GradientText></div>
          <div style={{ fontSize: '14px', color: '#F2F5FA', marginTop: '8px' }}>{pain.label}</div>
          <div style={{ fontSize: '13px', color: '#8A94A6', marginTop: '4px' }}>{pain.subtitle}</div>
        </div>
      </div>

      <GreenPillCTA text="Start building with Devin \u2014 from $20" href="https://app.devin.ai/" />
    </section>
  )
}

/* ======================== SIDEPROJECT REPORT ======================== */
function SideProjectReport({ projectType, progress, hoursPerWeek }) {
  const baseWeeks = { website: 14, mobile: 20, extension: 8, data: 12, automation: 10, other: 14 }
  const progressMultiplier = { idea: 1, stuck: 0.6, almost: 0.3 }
  const weeksAlone = Math.max(1, Math.round(baseWeeks[projectType] * progressMultiplier[progress] * (10 / hoursPerWeek)))
  const weeksWithDevin = Math.max(1, Math.ceil(weeksAlone / 3.5))
  const estimatedCost = weeksWithDevin * hoursPerWeek * 9

  const barWidthPercent = Math.max(5, (weeksWithDevin / weeksAlone) * 100)

  const progressSubtitles = {
    idea: 'From concept to deployed \u2014 Devin handles the heavy lifting',
    stuck: 'Pick up where you left off \u2014 Devin works with your existing code',
    almost: 'The home stretch \u2014 Devin polishes, tests, and deploys',
  }

  return (
    <section style={{ backgroundColor: '#141825', padding: '64px 24px', borderTop: '1px solid #252836' }}>
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <div style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#8A94A6', marginBottom: '12px' }}>YOUR PROJECT</div>
        <h2 style={{ fontSize: '28px', fontWeight: 400, color: '#F2F5FA' }}>
          From Idea to <GradientText>Launch</GradientText>
        </h2>
      </div>

      {/* Timeline bars */}
      <div style={{ maxWidth: '800px', margin: '0 auto 40px' }}>
        <div style={{ fontSize: '13px', textTransform: 'uppercase', color: '#8A94A6', marginBottom: '8px' }}>BUILDING ALONE</div>
        <div style={{ height: '44px', borderRadius: '8px', backgroundColor: '#363A4D', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: '12px', marginBottom: '16px' }}>
          <span style={{ fontSize: '13px', color: '#8A94A6', whiteSpace: 'nowrap' }}>~{weeksAlone} weeks</span>
        </div>

        <div style={{ fontSize: '13px', textTransform: 'uppercase', color: '#8A94A6', marginBottom: '8px' }}>WITH DEVIN</div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{
            height: '44px', borderRadius: '8px', backgroundColor: '#21C19A',
            width: `${barWidthPercent}%`, minWidth: '60px',
            display: 'flex', alignItems: 'center',
            justifyContent: barWidthPercent > 30 ? 'flex-end' : 'flex-start',
            paddingRight: barWidthPercent > 30 ? '12px' : '0',
            paddingLeft: barWidthPercent > 30 ? '0' : '0',
            transition: 'width 0.5s ease',
          }}>
            {barWidthPercent > 30 && <span style={{ fontSize: '13px', color: '#10131C', whiteSpace: 'nowrap' }}>~{weeksWithDevin} weeks {'\uD83D\uDE80'}</span>}
          </div>
          {barWidthPercent <= 30 && <span style={{ fontSize: '13px', color: '#21C19A', whiteSpace: 'nowrap', marginLeft: '8px' }}>~{weeksWithDevin} weeks {'\uD83D\uDE80'}</span>}
        </div>
      </div>

      {/* Metric cards */}
      <div className="ind-metric-two" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', maxWidth: '700px', margin: '0 auto 32px' }}>
        <div style={{ backgroundColor: '#181B28', border: '1px solid #252836', borderRadius: '16px', padding: '24px', transition: 'border-color 0.2s ease' }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#363A4D' }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#252836' }}>
          <div style={{ fontSize: '24px', marginBottom: '12px' }}>{'\uD83D\uDCB0'}</div>
          <div style={{ fontSize: '28px', fontWeight: 500, marginBottom: '4px' }}><GradientText>~${estimatedCost.toLocaleString()}</GradientText></div>
          <div style={{ fontSize: '14px', color: '#F2F5FA', marginTop: '8px' }}>Estimated cost to build</div>
          <div style={{ fontSize: '13px', color: '#8A94A6', marginTop: '4px' }}>A freelancer would charge $3,000&ndash;$10,000</div>
        </div>
        <div style={{ backgroundColor: '#181B28', border: '1px solid #252836', borderRadius: '16px', padding: '24px', transition: 'border-color 0.2s ease' }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#363A4D' }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#252836' }}>
          <div style={{ fontSize: '24px', marginBottom: '12px' }}>{'\u23F0'}</div>
          <div style={{ fontSize: '28px', fontWeight: 500, marginBottom: '4px' }}><GradientText>~{weeksWithDevin} weeks</GradientText></div>
          <div style={{ fontSize: '14px', color: '#F2F5FA', marginTop: '8px' }}>Estimated time to launch</div>
          <div style={{ fontSize: '13px', color: '#8A94A6', marginTop: '4px' }}>{progressSubtitles[progress]}</div>
        </div>
      </div>

      {/* Callout card */}
      <div style={{
        backgroundColor: '#181B28', borderLeft: '3px solid #21C19A', borderRadius: '12px',
        padding: '20px', maxWidth: '700px', margin: '0 auto 40px',
      }}>
        <div style={{ fontSize: '15px', fontWeight: 400, color: '#F2F5FA', marginBottom: '12px' }}>
          What you focus on vs. what Devin handles
        </div>
        <div className="ind-callout-cols" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
          <div>
            <div style={{ fontSize: '13px', fontWeight: 500, color: '#21C19A', marginBottom: '4px' }}>You:</div>
            {['Design decisions', 'Content & copy', 'Business logic', 'Final review'].map(item => (
              <div key={item} style={{ fontSize: '13px', color: '#BAD7F5', lineHeight: 1.8 }}>{item}</div>
            ))}
          </div>
          <div>
            <div style={{ fontSize: '13px', fontWeight: 500, color: '#8A94A6', marginBottom: '4px' }}>Devin:</div>
            {['Code scaffolding', 'Responsive layout', 'Testing', 'Deployment', 'Bug fixes'].map(item => (
              <div key={item} style={{ fontSize: '13px', color: '#8A94A6', lineHeight: 1.8 }}>{item}</div>
            ))}
          </div>
        </div>
      </div>

      <GreenPillCTA text="Start your project \u2014 from $20" href="https://app.devin.ai/" />
    </section>
  )
}

/* ======================== NEW BUILDER REPORT ======================== */
function NewBuilderReport({ newProjectType, triedBefore }) {
  const costEstimates = { website: 80, mobile: 200, extension: 60, data: 100, automation: 75, other: 120 }
  const estimatedCost = costEstimates[newProjectType]

  const triedSubtitles = {
    stuck: "You're not starting from scratch. Devin picks up where you left off.",
    new: "You don't need to know how to code. Just know what you want.",
  }
  const triedSubtitle = triedBefore ? triedSubtitles[triedBefore] : 'Describe your vision and Devin handles the rest.'

  const steps = [
    { num: '1', title: 'Describe', text: 'Tell Devin what you want in plain English' },
    { num: '2', title: 'Devin Builds', text: 'Devin writes the code, tests it, and deploys it' },
    { num: '3', title: 'You Ship', text: 'Review, tweak, and launch your project' },
  ]

  return (
    <section style={{ backgroundColor: '#141825', padding: '64px 24px', borderTop: '1px solid #252836' }}>
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <div style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#8A94A6', marginBottom: '12px' }}>YOUR PATH</div>
        <h2 style={{ fontSize: '28px', fontWeight: 400, color: '#F2F5FA' }}>
          You Can <GradientText>Build This</GradientText>
        </h2>
      </div>

      {/* 3-step diagram */}
      <div className="ind-steps-row" style={{ maxWidth: '750px', margin: '0 auto 40px', display: 'flex', gap: '16px', alignItems: 'stretch' }}>
        {steps.map((step, i) => (
          <div key={step.num} style={{ display: 'flex', alignItems: 'stretch', flex: i < steps.length - 1 ? undefined : 1 }}>
            <div style={{
              backgroundColor: '#181B28', border: '1px solid #252836', borderRadius: '16px',
              padding: '24px', flex: 1, textAlign: 'center',
            }}>
              <div style={{
                width: '36px', height: '36px', backgroundColor: '#21C19A', color: '#10131C',
                fontSize: '16px', fontWeight: 600, borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 12px',
              }}>{step.num}</div>
              <div style={{ fontSize: '16px', color: '#F2F5FA', marginBottom: '8px' }}>{step.title}</div>
              <div style={{ fontSize: '13px', color: '#8A94A6' }}>{step.text}</div>
            </div>
            {i < steps.length - 1 && (
              <div className="ind-step-arrow" style={{ display: 'flex', alignItems: 'center', padding: '0 4px', fontSize: '20px', color: '#555E70' }}>
                {'\u2192'}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Metric cards */}
      <div className="ind-metric-two" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', maxWidth: '700px', margin: '0 auto 32px' }}>
        <div style={{ backgroundColor: '#181B28', border: '1px solid #252836', borderRadius: '16px', padding: '24px', transition: 'border-color 0.2s ease' }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#363A4D' }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#252836' }}>
          <div style={{ fontSize: '24px', marginBottom: '12px' }}>{'\uD83D\uDCB0'}</div>
          <div style={{ fontSize: '28px', fontWeight: 500, marginBottom: '4px' }}><GradientText>~${estimatedCost}</GradientText></div>
          <div style={{ fontSize: '14px', color: '#F2F5FA', marginTop: '8px' }}>Estimated cost to build</div>
          <div style={{ fontSize: '13px', color: '#8A94A6', marginTop: '4px' }}>A freelance developer would charge $2,000&ndash;$5,000</div>
        </div>
        <div style={{ backgroundColor: '#181B28', border: '1px solid #252836', borderRadius: '16px', padding: '24px', transition: 'border-color 0.2s ease' }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#363A4D' }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#252836' }}>
          <div style={{ fontSize: '24px', marginBottom: '12px' }}>{'\uD83D\uDCAC'}</div>
          <div style={{ fontSize: '28px', fontWeight: 500, marginBottom: '4px' }}><GradientText>No coding required</GradientText></div>
          <div style={{ fontSize: '14px', color: '#F2F5FA', marginTop: '8px' }}>Just describe what you want</div>
          <div style={{ fontSize: '13px', color: '#8A94A6', marginTop: '4px' }}>{triedSubtitle}</div>
        </div>
      </div>

      {/* Social proof callout */}
      <div style={{
        backgroundColor: '#181B28', borderLeft: '3px solid #21C19A', borderRadius: '12px',
        padding: '20px', maxWidth: '700px', margin: '0 auto 40px',
      }}>
        <div style={{ fontSize: '15px', fontWeight: 400, color: '#F2F5FA', marginBottom: '8px' }}>
          You&apos;re not alone
        </div>
        <div style={{ fontSize: '14px', color: '#BAD7F5', lineHeight: 1.6 }}>
          At Gumroad, marketing and support teams ship code changes through Devin every day &mdash; no engineering degree required.
        </div>
      </div>

      <GreenPillCTA text="Build your first project \u2014 from $20" href="https://app.devin.ai/" />
    </section>
  )
}

/* ======================== MAIN INDIVIDUAL FLOW ======================== */
export default function IndividualFlow() {
  const [devIntent, setDevIntent] = useState(null)
  const [codingHours, setCodingHours] = useState(35)
  const [busyworkPercent, setBusyworkPercent] = useState(50)
  const [hourlyRate, setHourlyRate] = useState(87)
  const [painPoint, setPainPoint] = useState(null)
  const [projectType, setProjectType] = useState(null)
  const [progress, setProgress] = useState('idea')
  const [hoursPerWeek, setHoursPerWeek] = useState(5)
  const [newProjectType, setNewProjectType] = useState(null)
  const [triedBefore, setTriedBefore] = useState(null)

  return (
    <>
      {/* STEP 1: INTENT SELECTOR */}
      <section style={{ backgroundColor: '#10131C', padding: '80px 24px 64px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <div style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#8A94A6', marginBottom: '12px' }}>YOUR WORKFLOW</div>
            <h2 style={{ fontSize: '30px', fontWeight: 400, color: '#F2F5FA', marginBottom: '12px' }}>How do you use Devin?</h2>
            <p style={{ fontSize: '14px', color: '#8A94A6' }}>Tell us about your work and we&apos;ll show you what changes</p>
          </div>

          <div className="ind-intent-cards" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
            {INTENT_CARDS.map(card => {
              const isSelected = devIntent === card.id
              const hasSelection = devIntent !== null
              return (
                <button
                  key={card.id}
                  onClick={() => setDevIntent(card.id)}
                  style={{
                    backgroundColor: '#181B28',
                    border: `1px solid ${isSelected ? '#21C19A' : '#252836'}`,
                    borderRadius: '16px',
                    padding: '24px',
                    cursor: 'pointer',
                    textAlign: 'left',
                    opacity: hasSelection && !isSelected ? 0.5 : 1,
                    transform: hasSelection && !isSelected ? 'scale(0.97)' : 'scale(1)',
                    boxShadow: isSelected ? '0 0 20px rgba(33, 193, 154, 0.1)' : 'none',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <div style={{ fontSize: '24px', marginBottom: '12px' }}>{card.emoji}</div>
                  <div style={{ fontSize: '15px', color: '#F2F5FA', marginBottom: '6px' }}>{card.title}</div>
                  <div style={{ fontSize: '13px', color: '#8A94A6', lineHeight: 1.4 }}>{card.subtitle}</div>
                </button>
              )
            })}
          </div>

          {/* STEP 2: CONDITIONAL INPUTS */}
          {devIntent === 'speedup' && (
            <div className="ind-speedup-cols" style={{ display: 'grid', gridTemplateColumns: '55% 45%', gap: '24px', marginTop: '40px' }}>
              {/* LEFT COLUMN */}
              <div style={{ backgroundColor: '#181B28', border: '1px solid #252836', borderRadius: '16px', padding: '28px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 400, color: '#F2F5FA', marginBottom: '24px' }}>Your Coding Week</h3>
                <SliderWithGreen
                  label="Hours per week you spend coding"
                  value={codingHours}
                  onChange={(e) => setCodingHours(Number(e.target.value))}
                  min={10} max={60}
                />
                <SliderWithGreen
                  label="What percentage is busywork you'd love to delegate?"
                  value={busyworkPercent}
                  onChange={(e) => setBusyworkPercent(Number(e.target.value))}
                  min={10} max={90}
                  displayValue={`${busyworkPercent}%`}
                />
                <div style={{ fontSize: '12px', color: '#555E70', marginTop: '-12px', marginBottom: '20px' }}>
                  Bug fixes, tests, boilerplate, code reviews, DevOps
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: 400, color: '#BAD7F5', marginBottom: '8px' }}>
                    Your hourly rate (or equivalent)
                  </label>
                  <select
                    value={hourlyRate}
                    onChange={(e) => setHourlyRate(Number(e.target.value))}
                    style={{
                      width: '100%', padding: '10px 14px', borderRadius: '8px', fontSize: '14px',
                      fontWeight: 400, color: '#F2F5FA', backgroundColor: '#181B28',
                      border: '1px solid #252836', outline: 'none', cursor: 'pointer',
                    }}
                    onFocus={(e) => { e.currentTarget.style.borderColor = '#21C19A' }}
                    onBlur={(e) => { e.currentTarget.style.borderColor = '#252836' }}
                  >
                    {HOURLY_OPTIONS.map(opt => (
                      <option key={opt.value} value={opt.value} style={{ backgroundColor: '#181B28' }}>{opt.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* RIGHT COLUMN */}
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: 400, color: '#F2F5FA', marginBottom: '16px' }}>What eats most of your time?</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {PAIN_POINTS.map(pp => {
                    const isSelected = painPoint === pp.id
                    return (
                      <button
                        key={pp.id}
                        onClick={() => setPainPoint(pp.id)}
                        style={{
                          backgroundColor: '#181B28',
                          border: `1px solid ${isSelected ? '#21C19A' : '#252836'}`,
                          borderRadius: '12px',
                          padding: '14px 16px',
                          cursor: 'pointer',
                          textAlign: 'left',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          boxShadow: isSelected ? '0 0 20px rgba(33, 193, 154, 0.1)' : 'none',
                          transition: 'all 0.2s ease',
                        }}
                        onMouseEnter={(e) => { if (!isSelected) e.currentTarget.style.borderColor = '#363A4D' }}
                        onMouseLeave={(e) => { if (!isSelected) e.currentTarget.style.borderColor = isSelected ? '#21C19A' : '#252836' }}
                      >
                        <span style={{ fontSize: '18px' }}>{pp.emoji}</span>
                        <span style={{ fontSize: '14px', color: '#F2F5FA' }}>{pp.title}</span>
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          )}

          {devIntent === 'sideproject' && (
            <div style={{ maxWidth: '700px', margin: '40px auto 0' }}>
              <div style={{ backgroundColor: '#181B28', border: '1px solid #252836', borderRadius: '16px', padding: '28px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 400, color: '#F2F5FA', marginBottom: '24px' }}>Your Project</h3>

                <div style={{ fontSize: '14px', color: '#BAD7F5', marginBottom: '12px' }}>What are you building?</div>
                <div className="ind-project-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '24px' }}>
                  {PROJECT_TYPES.map(pt => {
                    const isSelected = projectType === pt.id
                    return (
                      <button
                        key={pt.id}
                        onClick={() => setProjectType(pt.id)}
                        style={{
                          backgroundColor: '#181B28',
                          border: `1px solid ${isSelected ? '#21C19A' : '#252836'}`,
                          borderRadius: '12px',
                          padding: '16px',
                          cursor: 'pointer',
                          textAlign: 'center',
                          boxShadow: isSelected ? '0 0 20px rgba(33, 193, 154, 0.1)' : 'none',
                          transition: 'all 0.2s ease',
                        }}
                        onMouseEnter={(e) => { if (!isSelected) e.currentTarget.style.borderColor = '#363A4D' }}
                        onMouseLeave={(e) => { if (!isSelected) e.currentTarget.style.borderColor = isSelected ? '#21C19A' : '#252836' }}
                      >
                        <div style={{ fontSize: '20px', marginBottom: '6px' }}>{pt.emoji}</div>
                        <div style={{ fontSize: '13px', color: '#F2F5FA' }}>{pt.title}</div>
                      </button>
                    )
                  })}
                </div>

                <div style={{ fontSize: '14px', color: '#BAD7F5', marginBottom: '12px' }}>How far along are you?</div>
                <div style={{
                  backgroundColor: '#252836', borderRadius: '999px', padding: '4px',
                  display: 'flex', marginBottom: '24px',
                }}>
                  {PROGRESS_OPTIONS.map(opt => (
                    <button
                      key={opt.id}
                      onClick={() => setProgress(opt.id)}
                      style={{
                        flex: 1,
                        padding: '8px 20px',
                        borderRadius: '999px',
                        fontSize: '13px',
                        cursor: 'pointer',
                        border: 'none',
                        backgroundColor: progress === opt.id ? '#21C19A' : 'transparent',
                        color: progress === opt.id ? '#10131C' : '#8A94A6',
                        fontWeight: progress === opt.id ? 500 : 400,
                        transition: 'all 0.2s ease',
                      }}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>

                <SliderWithGreen
                  label="Hours per week you can dedicate"
                  value={hoursPerWeek}
                  onChange={(e) => setHoursPerWeek(Number(e.target.value))}
                  min={1} max={20}
                />
              </div>
            </div>
          )}

          {devIntent === 'newbuilder' && (
            <div style={{ maxWidth: '600px', margin: '40px auto 0' }}>
              <div style={{ backgroundColor: '#181B28', border: '1px solid #252836', borderRadius: '16px', padding: '28px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 400, color: '#F2F5FA', marginBottom: '24px' }}>Your Vision</h3>

                <div style={{ fontSize: '14px', color: '#BAD7F5', marginBottom: '12px' }}>What do you want to build?</div>
                <div className="ind-project-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '24px' }}>
                  {PROJECT_TYPES.map(pt => {
                    const isSelected = newProjectType === pt.id
                    return (
                      <button
                        key={pt.id}
                        onClick={() => setNewProjectType(pt.id)}
                        style={{
                          backgroundColor: '#181B28',
                          border: `1px solid ${isSelected ? '#21C19A' : '#252836'}`,
                          borderRadius: '12px',
                          padding: '16px',
                          cursor: 'pointer',
                          textAlign: 'center',
                          boxShadow: isSelected ? '0 0 20px rgba(33, 193, 154, 0.1)' : 'none',
                          transition: 'all 0.2s ease',
                        }}
                        onMouseEnter={(e) => { if (!isSelected) e.currentTarget.style.borderColor = '#363A4D' }}
                        onMouseLeave={(e) => { if (!isSelected) e.currentTarget.style.borderColor = isSelected ? '#21C19A' : '#252836' }}
                      >
                        <div style={{ fontSize: '20px', marginBottom: '6px' }}>{pt.emoji}</div>
                        <div style={{ fontSize: '13px', color: '#F2F5FA' }}>{pt.title}</div>
                      </button>
                    )
                  })}
                </div>

                <div style={{ fontSize: '14px', color: '#BAD7F5', marginBottom: '12px' }}>Have you tried building it before?</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  {TRIED_OPTIONS.map(opt => {
                    const isSelected = triedBefore === opt.id
                    return (
                      <button
                        key={opt.id}
                        onClick={() => setTriedBefore(opt.id)}
                        style={{
                          backgroundColor: '#181B28',
                          border: `1px solid ${isSelected ? '#21C19A' : '#252836'}`,
                          borderRadius: '12px',
                          padding: '16px',
                          cursor: 'pointer',
                          textAlign: 'center',
                          boxShadow: isSelected ? '0 0 20px rgba(33, 193, 154, 0.1)' : 'none',
                          transition: 'all 0.2s ease',
                        }}
                        onMouseEnter={(e) => { if (!isSelected) e.currentTarget.style.borderColor = '#363A4D' }}
                        onMouseLeave={(e) => { if (!isSelected) e.currentTarget.style.borderColor = isSelected ? '#21C19A' : '#252836' }}
                      >
                        <div style={{ fontSize: '18px', marginBottom: '6px' }}>{opt.emoji}</div>
                        <div style={{ fontSize: '13px', color: '#F2F5FA' }}>{opt.title}</div>
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* STEP 3: IMPACT REPORTS */}
      {devIntent === 'speedup' && (
        <SpeedupReport
          codingHours={codingHours}
          busyworkPercent={busyworkPercent}
          hourlyRate={hourlyRate}
          painPoint={painPoint}
        />
      )}

      {devIntent === 'sideproject' && projectType !== null && (
        <SideProjectReport
          projectType={projectType}
          progress={progress}
          hoursPerWeek={hoursPerWeek}
        />
      )}

      {devIntent === 'newbuilder' && newProjectType !== null && (
        <NewBuilderReport
          newProjectType={newProjectType}
          triedBefore={triedBefore}
        />
      )}
    </>
  )
}
