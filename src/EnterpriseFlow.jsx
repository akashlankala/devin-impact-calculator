import { useState } from 'react'

// === LOCAL COMPONENTS ===

function SliderWithGreen({ value, onChange, min, max, label, displayValue, step }) {
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
        step={step || 1}
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

// === CONSTANTS ===

const ENTERPRISE_COST_OPTIONS = [
  { label: '$100K\u2013$125K', value: 54 },
  { label: '$125K\u2013$150K', value: 66 },
  { label: '$150K\u2013$175K', value: 78 },
  { label: '$175K\u2013$200K', value: 90 },
  { label: '$200K\u2013$250K', value: 108 },
  { label: '$250K+', value: 132 },
]

const CATEGORIES = [
  { id: 'migrations', name: 'Migrations & Modernization', percent: 20, multiplier: 8, source: 'Nubank case study \u2014 8-12x migration efficiency (conservative: 8x)', caseStudy: 'Nubank deployed Devin across 1,000+ engineers for large-scale migration work' },
  { id: 'bugs', name: 'Bug Fixes & Maintenance', percent: 15, multiplier: 4, source: 'Cognition 2025 Performance Review \u2014 4x efficiency on bug resolution', caseStudy: 'Gumroad uses Devin for triage and first-pass bug fixes across their entire codebase' },
  { id: 'tests', name: 'Testing & QA', percent: 12, multiplier: 3, source: 'Cognition 2025 Performance Review \u2014 3x test writing efficiency', caseStudy: 'Litera achieved 93% faster regression cycles with Devin-written tests' },
  { id: 'security', name: 'Security Remediation', percent: 8, multiplier: 15, source: 'Enterprise security deployments \u2014 20x efficiency, conservative estimate: 15x', caseStudy: 'Enterprise customers report vulnerability remediation dropping from days to hours' },
  { id: 'reviews', name: 'Code Reviews', percent: 10, multiplier: 3, source: 'Cognition 2025 Performance Review \u2014 3x review efficiency', caseStudy: 'Devin handles initial review passes with an 85% PR merge rate across deployments' },
]

// === COMPONENT ===

export default function EnterpriseFlow() {
  const [totalEngineers, setTotalEngineers] = useState(500)
  const [costBracket, setCostBracket] = useState(78)
  const [contractorSpend, setContractorSpend] = useState(2000000)
  const [plannedHires, setPlannedHires] = useState(20)
  const [expandedRows, setExpandedRows] = useState([])

  // === FORMAT HELPERS ===

  function formatMillions(value) {
    const absVal = Math.abs(value)
    if (absVal >= 1000000) return '$' + (value / 1000000).toFixed(1).replace('.0', '') + 'M'
    if (absVal >= 1000) return '$' + Math.round(value / 1000) + 'K'
    return '$' + Math.round(value)
  }

  function formatContractorSpend(value) {
    if (value === 0) return '$0'
    if (value < 1000000) return '$' + (value / 1000).toFixed(0) + 'K'
    return '$' + (value / 1000000).toFixed(1).replace('.0', '') + 'M'
  }

  // === CALCULATIONS ===

  const hourlyRate = costBracket
  const reviewOverhead = 0.20
  const devinHourlyRate = 9
  const monthlyHoursPerEngineer = 160

  const categoryResults = CATEGORIES.map(cat => {
    const monthlyHours = totalEngineers * monthlyHoursPerEngineer * (cat.percent / 100)
    const currentMonthlyCost = monthlyHours * hourlyRate
    const devinHours = monthlyHours / cat.multiplier
    const devinLaborCost = devinHours * devinHourlyRate
    const reclaimedHours = monthlyHours - devinHours
    const reviewCost = reclaimedHours * reviewOverhead * hourlyRate
    const withDevinMonthlyCost = devinLaborCost + reviewCost
    const monthlySavings = currentMonthlyCost - withDevinMonthlyCost
    return {
      ...cat,
      monthlyHours: Math.round(monthlyHours),
      currentMonthlyCost,
      withDevinMonthlyCost,
      monthlySavings,
      annualSavings: monthlySavings * 12,
      currentAnnualCost: currentMonthlyCost * 12,
      withDevinAnnualCost: withDevinMonthlyCost * 12,
    }
  })

  const totalCurrentAnnual = categoryResults.reduce((sum, c) => sum + c.currentAnnualCost, 0)
  const totalWithDevinAnnual = categoryResults.reduce((sum, c) => sum + c.withDevinAnnualCost, 0)
  const totalAnnualSavings = categoryResults.reduce((sum, c) => sum + c.annualSavings, 0)

  const annualDevinFees = categoryResults.reduce((sum, c) => {
    const devinHours = c.monthlyHours / c.multiplier
    return sum + (devinHours * devinHourlyRate * 12)
  }, 0)

  const totalMonthlyHoursReclaimed = categoryResults.reduce((sum, c) => sum + (c.monthlyHours - c.monthlyHours / c.multiplier), 0)
  const fteEquivalent = Math.round(totalMonthlyHoursReclaimed / monthlyHoursPerEngineer)

  const contractorReplaceLow = Math.min(contractorSpend * 0.4, totalAnnualSavings * 0.4)
  const contractorReplaceHigh = Math.min(contractorSpend * 0.7, totalAnnualSavings * 0.6)

  const absorbedHires = Math.min(Math.round(fteEquivalent * 0.5), Math.round(plannedHires * 0.5))
  const recruitingSavings = absorbedHires * 50000

  const paybackDays = totalAnnualSavings > 0 ? Math.max(1, Math.round((annualDevinFees / totalAnnualSavings) * 365)) : 365

  const devinCostPerEngineerMonth = Math.round(annualDevinFees / 12 / totalEngineers)

  const year1NetValue = totalAnnualSavings + recruitingSavings
  const year3Projected = totalAnnualSavings + (totalAnnualSavings * 1.1) + (totalAnnualSavings * 1.21) + recruitingSavings

  // === RENDER ===

  return (
    <>
      {/* STEP 1: INPUTS */}
      <section style={{ backgroundColor: '#10131C', padding: '80px 24px 64px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <div style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#8A94A6', marginBottom: '12px' }}>ORGANIZATION PROFILE</div>
            <h2 style={{ fontSize: '30px', fontWeight: 400, color: '#F2F5FA', marginBottom: '12px' }}>Tell us about your engineering organization</h2>
            <p style={{ fontSize: '14px', color: '#8A94A6' }}>We&apos;ll estimate Devin&apos;s impact using industry benchmarks and real deployment data</p>
          </div>

          <div style={{ backgroundColor: '#181B28', border: '1px solid #252836', borderRadius: '16px', padding: '32px' }}>
            <div className="enterprise-input-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
              {/* LEFT COLUMN */}
              <div>
                <SliderWithGreen
                  label="Total engineering headcount"
                  value={totalEngineers}
                  onChange={(e) => setTotalEngineers(Number(e.target.value))}
                  min={100}
                  max={10000}
                  step={50}
                  displayValue={totalEngineers.toLocaleString()}
                />

                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: 400, color: '#BAD7F5', marginBottom: '8px' }}>
                    Average fully-loaded engineer cost
                  </label>
                  <select
                    value={costBracket}
                    onChange={(e) => setCostBracket(Number(e.target.value))}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', fontSize: '14px', fontWeight: 400, color: '#F2F5FA', backgroundColor: '#181B28', border: '1px solid #252836', outline: 'none', cursor: 'pointer' }}
                    onFocus={(e) => { e.currentTarget.style.borderColor = '#21C19A' }}
                    onBlur={(e) => { e.currentTarget.style.borderColor = '#252836' }}
                  >
                    {ENTERPRISE_COST_OPTIONS.map(opt => (
                      <option key={opt.value} value={opt.value} style={{ backgroundColor: '#181B28' }}>{opt.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* RIGHT COLUMN */}
              <div>
                <SliderWithGreen
                  label="Annual spend on contractors & outsourcing"
                  value={contractorSpend}
                  onChange={(e) => setContractorSpend(Number(e.target.value))}
                  min={0}
                  max={20000000}
                  step={100000}
                  displayValue={formatContractorSpend(contractorSpend)}
                />
                <div style={{ fontSize: '12px', color: '#555E70', marginTop: '-12px', marginBottom: '20px' }}>
                  Contractors, outsourced development, staff augmentation
                </div>

                <SliderWithGreen
                  label="Planned engineering hires next year"
                  value={plannedHires}
                  onChange={(e) => setPlannedHires(Number(e.target.value))}
                  min={0}
                  max={500}
                  step={5}
                  displayValue={plannedHires.toString()}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STEP 3: EXECUTIVE SUMMARY */}
      <section style={{ backgroundColor: '#141825', padding: '64px 24px', borderTop: '1px solid #252836' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#8A94A6', marginBottom: '12px' }}>EXECUTIVE SUMMARY</div>
          <h2 style={{ fontSize: '28px', fontWeight: 400, color: '#F2F5FA', marginBottom: '8px' }}>
            Devin&apos;s <GradientText>Impact</GradientText> on Your Organization
          </h2>
          <p style={{ fontSize: '13px', color: '#8A94A6' }}>Based on industry benchmarks &mdash; 65% of engineering time is spent on work Devin can accelerate</p>
        </div>

        {/* THREE HEADLINE CARDS */}
        <div className="enterprise-headline-cards" style={{ display: 'flex', gap: '16px', maxWidth: '900px', margin: '0 auto' }}>
          {/* Card 1 - LARGEST */}
          <div style={{
            backgroundColor: '#181B28', border: '1px solid #252836', borderRadius: '16px', padding: '32px',
            flex: 1, transition: 'border-color 0.2s ease',
          }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#363A4D' }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#252836' }}
          >
            <div style={{ fontSize: '56px', fontWeight: 500 }}><GradientText>{formatMillions(totalAnnualSavings)}</GradientText></div>
            <div style={{ fontSize: '15px', color: '#F2F5FA', marginTop: '8px' }}>Projected Annual Savings</div>
            <div style={{ fontSize: '13px', color: '#8A94A6', marginTop: '4px' }}>Net of Devin costs and review overhead</div>
          </div>

          {/* Card 2 */}
          <div style={{
            backgroundColor: '#181B28', border: '1px solid #252836', borderRadius: '16px', padding: '28px',
            flex: 1, transition: 'border-color 0.2s ease',
          }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#363A4D' }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#252836' }}
          >
            <div style={{ fontSize: '36px', fontWeight: 500 }}><GradientText>{fteEquivalent} engineers</GradientText></div>
            <div style={{ fontSize: '14px', color: '#F2F5FA', marginTop: '8px' }}>Capacity Unlocked</div>
            <div style={{ fontSize: '13px', color: '#8A94A6', marginTop: '4px' }}>Equivalent engineering capacity freed for feature work</div>
          </div>

          {/* Card 3 - CONDITIONAL */}
          <div style={{
            backgroundColor: '#181B28', border: '1px solid #252836', borderRadius: '16px', padding: '28px',
            flex: 1, transition: 'border-color 0.2s ease',
          }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#363A4D' }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#252836' }}
          >
            {contractorSpend > 0 ? (
              <>
                <div style={{ fontSize: '36px', fontWeight: 500 }}><GradientText>{formatMillions(contractorReplaceLow)}&ndash;{formatMillions(contractorReplaceHigh)}</GradientText></div>
                <div style={{ fontSize: '14px', color: '#F2F5FA', marginTop: '8px' }}>Potential Contractor Replacement</div>
                <div style={{ fontSize: '13px', color: '#8A94A6', marginTop: '4px' }}>40&ndash;70% of current contractor spend, depending on scope</div>
              </>
            ) : (
              <>
                <div style={{ fontSize: '36px', fontWeight: 500 }}><GradientText>${devinCostPerEngineerMonth}/mo</GradientText></div>
                <div style={{ fontSize: '14px', color: '#F2F5FA', marginTop: '8px' }}>Devin Cost Per Engineer</div>
                <div style={{ fontSize: '13px', color: '#8A94A6', marginTop: '4px' }}>Affordable at any engineering scale</div>
              </>
            )}
          </div>
        </div>

        {/* STEP 4: HIRING IMPACT */}
        {plannedHires > 0 && (
          <div style={{
            backgroundColor: '#181B28', borderLeft: '3px solid #21C19A', borderRadius: '12px',
            padding: '24px', maxWidth: '900px', margin: '40px auto 0',
          }}>
            <div className="enterprise-hiring-impact" style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
              <div style={{ flex: '0 0 70%' }}>
                <div style={{ fontSize: '18px', fontWeight: 400, color: '#F2F5FA', marginBottom: '8px' }}>Hiring Impact</div>
                <div style={{ fontSize: '15px', color: '#BAD7F5', lineHeight: 1.6 }}>
                  Devin can absorb the equivalent of <GradientText style={{ fontWeight: 700 }}>{absorbedHires}</GradientText> of your {plannedHires} planned hires
                </div>
                <div style={{ fontSize: '14px', color: '#8A94A6', marginTop: '4px' }}>
                  Saving approximately {formatMillions(recruitingSavings)} in year-1 recruiting and onboarding costs
                </div>
                <div style={{ fontSize: '12px', color: '#555E70', marginTop: '8px' }}>
                  Assumes ~50% of planned hires address scaling and maintenance work Devin can handle
                </div>
              </div>
              <div style={{ flex: '0 0 30%', textAlign: 'center' }}>
                <div style={{ fontSize: '48px' }}><GradientText>{absorbedHires}</GradientText></div>
                <div style={{ fontSize: '13px', color: '#8A94A6' }}>hires absorbed</div>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* STEP 5: ORGANIZATIONAL BREAKDOWN TABLE */}
      <section style={{ backgroundColor: '#10131C', padding: '40px 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#8A94A6', marginBottom: '12px' }}>ORGANIZATIONAL BREAKDOWN</div>
          <h2 style={{ fontSize: '24px', fontWeight: 400, color: '#F2F5FA', marginBottom: '8px' }}>Impact by Engineering Function</h2>
          <p style={{ fontSize: '13px', color: '#8A94A6' }}>Click any row to see methodology and sources</p>
        </div>

        <div style={{ maxWidth: '900px', margin: '0 auto', backgroundColor: '#181B28', border: '1px solid #252836', borderRadius: '16px', overflow: 'hidden' }}>
          {/* Table header */}
          <div style={{ display: 'flex', padding: '14px 24px', backgroundColor: '#1E2235' }}>
            <div style={{ flex: 4, fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#8A94A6' }}>Function</div>
            <div style={{ flex: 2, fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#8A94A6', textAlign: 'right' }}>Current Annual Cost</div>
            <div style={{ flex: 2, fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#8A94A6', textAlign: 'right' }}>With Devin</div>
            <div style={{ flex: 2, fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#8A94A6', textAlign: 'right' }}>Annual Savings</div>
          </div>

          {/* Category rows */}
          {categoryResults.map((cat, index) => {
            const isExpanded = expandedRows.includes(cat.id)
            const isLast = index === categoryResults.length - 1
            return (
              <div key={cat.id}>
                <div
                  onClick={() => setExpandedRows(prev => prev.includes(cat.id) ? prev.filter(id => id !== cat.id) : [...prev, cat.id])}
                  style={{
                    display: 'flex', alignItems: 'center', padding: '16px 24px', cursor: 'pointer',
                    borderBottom: isLast && !isExpanded ? 'none' : '1px solid #252836',
                    backgroundColor: index % 2 === 0 ? '#181B28' : '#10131C',
                    transition: 'background 0.2s ease',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#1E2235' }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = index % 2 === 0 ? '#181B28' : '#10131C' }}
                >
                  <div style={{ flex: 4, fontSize: '14px', color: '#F2F5FA', display: 'flex', alignItems: 'center' }}>
                    <span style={{ color: '#555E70', marginRight: '8px' }}>{isExpanded ? '\u25BE' : '\u25B8'}</span>
                    {cat.name}
                  </div>
                  <div style={{ flex: 2, fontSize: '14px', color: '#8A94A6', textAlign: 'right' }}>{formatMillions(cat.currentAnnualCost)}</div>
                  <div style={{ flex: 2, fontSize: '14px', color: '#21C19A', textAlign: 'right' }}>{formatMillions(cat.withDevinAnnualCost)}</div>
                  <div style={{ flex: 2, fontSize: '14px', fontWeight: 500, color: '#F2F5FA', textAlign: 'right' }}>{formatMillions(cat.annualSavings)}</div>
                </div>

                {/* Expanded detail */}
                {isExpanded && (
                  <div style={{
                    backgroundColor: '#10131C', padding: '16px 24px 16px 40px',
                    borderBottom: '1px solid #252836',
                  }}>
                    <div style={{ fontSize: '13px', color: '#BAD7F5', marginBottom: '6px' }}>
                      Efficiency: {cat.multiplier}x &mdash; {cat.source}
                    </div>
                    <div style={{ fontSize: '13px', color: '#8A94A6', marginBottom: '6px' }}>
                      Your org: {totalEngineers.toLocaleString()} engineers &times; {cat.percent}% time = {cat.monthlyHours.toLocaleString()} hrs/month &times; ${hourlyRate}/hr = {formatMillions(cat.currentAnnualCost)}/year
                    </div>
                    <div style={{ fontSize: '13px', color: '#555E70', fontStyle: 'italic' }}>
                      {cat.caseStudy}
                    </div>
                  </div>
                )}
              </div>
            )
          })}

          {/* Total row */}
          <div style={{
            display: 'flex', padding: '16px 24px', backgroundColor: '#1E2235',
            borderTop: '2px solid #252836', fontWeight: 500,
          }}>
            <div style={{ flex: 4, fontSize: '14px', color: '#F2F5FA' }}>Total Devin-Eligible Work</div>
            <div style={{ flex: 2, fontSize: '14px', color: '#8A94A6', textAlign: 'right' }}>{formatMillions(totalCurrentAnnual)}</div>
            <div style={{ flex: 2, fontSize: '14px', color: '#21C19A', textAlign: 'right' }}>{formatMillions(totalWithDevinAnnual)}</div>
            <div style={{ flex: 2, fontSize: '14px', color: '#F2F5FA', textAlign: 'right' }}>{formatMillions(totalAnnualSavings)}</div>
          </div>

          {/* Equivalent row */}
          <div style={{ backgroundColor: '#181B28', padding: '14px 24px', textAlign: 'center' }}>
            <span style={{ fontSize: '14px', color: '#BAD7F5' }}>
              Equivalent to adding {fteEquivalent} engineers to your feature teams &mdash; without hiring
            </span>
          </div>
        </div>
      </section>

      {/* STEP 6: INVESTMENT ANALYSIS */}
      <section style={{ backgroundColor: '#10131C', padding: '40px 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#8A94A6', marginBottom: '12px' }}>INVESTMENT ANALYSIS</div>
        </div>

        <div className="enterprise-investment-cards" style={{ display: 'flex', gap: '16px', maxWidth: '900px', margin: '0 auto' }}>
          {/* Card 1 - Payback Period */}
          <div style={{
            backgroundColor: '#181B28', border: '1px solid #252836', borderRadius: '16px', padding: '32px',
            flex: 1, textAlign: 'center', transition: 'border-color 0.2s ease',
          }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#363A4D' }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#252836' }}
          >
            <div style={{ fontSize: '14px', color: '#8A94A6', marginBottom: '16px' }}>Your Devin investment pays for itself in</div>
            <div style={{ fontSize: '48px', fontWeight: 500 }}><GradientText>{paybackDays} days</GradientText></div>
            <div style={{ fontSize: '13px', color: '#555E70', marginTop: '12px' }}>Most enterprise software deployments take 6&ndash;18 months for positive ROI</div>
          </div>

          {/* Card 2 - Projections */}
          <div style={{
            backgroundColor: '#181B28', border: '1px solid #252836', borderRadius: '16px', padding: '32px',
            flex: 1, transition: 'border-color 0.2s ease',
          }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#363A4D' }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#252836' }}
          >
            <div style={{ fontSize: '16px', fontWeight: 400, color: '#F2F5FA', marginBottom: '20px' }}>Return on Investment</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '14px', color: '#8A94A6' }}>Year 1 Net Value</span>
              <span style={{ fontSize: '24px' }}><GradientText>{formatMillions(year1NetValue)}</GradientText></span>
            </div>
            <div style={{ borderTop: '1px solid #252836', margin: '12px 0' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '14px', color: '#8A94A6' }}>3-Year Cumulative Value</span>
              <span style={{ fontSize: '24px' }}><GradientText>{formatMillions(year3Projected)}</GradientText></span>
            </div>
            <div style={{ fontSize: '12px', color: '#555E70', marginTop: '16px' }}>Year 2-3 assumes 10% annual engineering cost growth</div>
          </div>
        </div>
      </section>

      {/* STEP 7: DEPLOYMENT READINESS */}
      <section style={{ backgroundColor: '#10131C', padding: '40px 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#8A94A6', marginBottom: '12px' }}>DEPLOYMENT READINESS</div>
        </div>

        <div className="enterprise-badges" style={{ display: 'flex', gap: '16px', maxWidth: '900px', margin: '0 auto' }}>
          {[
            { emoji: '\uD83D\uDD12', title: 'SOC 2 Type II', subtitle: 'Audited and certified' },
            { emoji: '\uD83C\uDFE2', title: 'VPC Deployment', subtitle: 'Runs in your private cloud' },
            { emoji: '\uD83D\uDD11', title: 'SAML/OIDC SSO', subtitle: 'Enterprise identity management' },
            { emoji: '\uD83D\uDCCB', title: 'Zero Data Retention', subtitle: 'Your code stays yours' },
          ].map((badge, i) => (
            <div key={i} style={{
              backgroundColor: '#181B28', border: '1px solid #252836', borderRadius: '16px', padding: '20px',
              flex: 1, textAlign: 'center', transition: 'border-color 0.2s ease',
            }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#363A4D' }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#252836' }}
            >
              <div style={{ fontSize: '24px', marginBottom: '8px' }}>{badge.emoji}</div>
              <div style={{ fontSize: '14px', fontWeight: 500, color: '#F2F5FA' }}>{badge.title}</div>
              <div style={{ fontSize: '12px', color: '#8A94A6', marginTop: '4px' }}>{badge.subtitle}</div>
            </div>
          ))}
        </div>
      </section>

      {/* STEP 8: CUSTOMER EVIDENCE */}
      <section style={{ backgroundColor: '#10131C', padding: '40px 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#8A94A6', marginBottom: '12px' }}>CUSTOMER EVIDENCE</div>
          <h2 style={{ fontSize: '22px', fontWeight: 400, color: '#F2F5FA' }}>Trusted by engineering organizations worldwide</h2>
        </div>

        <div className="enterprise-evidence-cards" style={{ display: 'flex', gap: '16px', maxWidth: '900px', margin: '0 auto' }}>
          {[
            { company: 'Nubank', stat: '8\u201312x', statLabel: 'migration efficiency', desc: 'Deployed across 1,000+ engineers for large-scale system modernization' },
            { company: 'Ita\u00FA', stat: 'Strategic', statLabel: 'AI investment', desc: 'Global-scale financial services firm investing in AI-powered engineering' },
            { company: 'Litera', stat: '93%', statLabel: 'faster regression cycles', desc: 'Shipping new products faster with Devin handling testing and QA' },
          ].map((card, i) => (
            <div key={i} style={{
              backgroundColor: '#181B28', border: '1px solid #252836', borderRadius: '16px', padding: '24px',
              flex: 1, transition: 'border-color 0.2s ease',
            }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#363A4D' }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#252836' }}
            >
              <div style={{ fontSize: '18px', fontWeight: 500, color: '#F2F5FA', marginBottom: '12px' }}>{card.company}</div>
              <div style={{ fontSize: '28px' }}><GradientText>{card.stat}</GradientText></div>
              <div style={{ fontSize: '13px', color: '#8A94A6', marginTop: '4px' }}>{card.statLabel}</div>
              <div style={{ fontSize: '13px', color: '#555E70', marginTop: '12px' }}>{card.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* STEP 9: NEXT STEP CTA */}
      <section style={{ backgroundColor: '#10131C', padding: '40px 24px 40px' }}>
        <div style={{
          backgroundColor: '#181B28', border: '1px solid #252836', borderRadius: '16px', padding: '32px',
          maxWidth: '900px', margin: '0 auto', transition: 'border-color 0.2s ease',
        }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#363A4D' }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#252836' }}
        >
          <div className="enterprise-cta-layout" style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
            <div style={{ flex: '0 0 60%' }}>
              <h3 style={{ fontSize: '22px', fontWeight: 400, color: '#F2F5FA', marginBottom: '12px' }}>Ready to explore Devin Enterprise?</h3>
              <p style={{ fontSize: '14px', color: '#8A94A6', lineHeight: 1.6, marginBottom: '12px' }}>
                Based on your organization profile, our team can prepare a custom deployment plan including:
              </p>
              <div style={{ fontSize: '14px', color: '#BAD7F5', lineHeight: 2.0 }}>
                Pilot team selection and success criteria<br />
                Integration timeline and technical requirements<br />
                Security and compliance review<br />
                ROI milestones and measurement framework
              </div>
            </div>
            <div style={{ flex: '0 0 40%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <a
                href="https://cognition.ai/contact"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-block', backgroundColor: '#21C19A', color: '#10131C', borderRadius: '999px',
                  padding: '14px 28px', fontWeight: 500, fontSize: '15px', textDecoration: 'none',
                  transition: 'background-color 0.2s ease',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#1AA886' }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#21C19A' }}
              >
                Request a Deployment Plan
              </a>
              <div style={{ marginTop: '12px' }}>
                <a
                  href="https://devin.ai/enterprise"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ fontSize: '13px', color: '#8A94A6', textDecoration: 'none' }}
                >
                  Or explore Devin Enterprise &rarr;
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
