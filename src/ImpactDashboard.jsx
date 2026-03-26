import { useMemo, useRef, useEffect } from 'react'
import { useCountUp } from 'react-countup'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LabelList,
  LineChart,
  Line,
  Area,
  ReferenceLine,
  CartesianGrid,
} from 'recharts'

const HOURS_PER_ENGINEER_PER_MONTH = 160
const REVIEW_OVERHEAD = 0.20
const DEVIN_COST_PER_HOUR = 9

const HOURLY_RATES = {
  '$100K\u2013$125K': 54,
  '$125K\u2013$150K': 66,
  '$150K\u2013$175K': 78,
  '$175K\u2013$200K': 90,
  '$200K+': 108,
}

const EFFICIENCY_MULTIPLIERS = [8, 4, 3, 15, 3]

const CATEGORY_NAMES = [
  'Migrations & Refactoring',
  'Bug Fixes & Tickets',
  'Writing & Maintaining Tests',
  'Security & Vulnerability Fixes',
  'Code Reviews',
]

const SHORT_CHART_NAMES = [
  'Migrations',
  'Bug Fixes',
  'Tests',
  'Security',
  'Reviews',
]

function formatDollars(value) {
  return '$' + Math.round(value).toLocaleString('en-US')
}

function MetricCard({ icon, value, suffix, label, sublabel, decimals = 0, prefix = '' }) {
  const countUpRef = useRef(null)
  const numberRef = useRef(null)
  const prevValue = useRef(value)
  const { update } = useCountUp({
    ref: countUpRef,
    start: 0,
    end: value,
    duration: 1.5,
    separator: ',',
    decimals,
    prefix,
    suffix: suffix || '',
  })

  useEffect(() => {
    if (prevValue.current !== value) {
      const el = numberRef.current
      if (el) {
        el.style.opacity = '0.8'
        const timer = setTimeout(() => { el.style.opacity = '1' }, 300)
        prevValue.current = value
        update(value)
        return () => clearTimeout(timer)
      }
      prevValue.current = value
      update(value)
    }
  }, [value, update])

  return (
    <div
      style={{
        backgroundColor: '#181B28',
        border: '1px solid #252836',
        borderRadius: '16px',
        padding: '24px',
        transition: 'border-color 0.2s ease',
        cursor: 'default',
      }}
      onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#363A4D' }}
      onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#252836' }}
    >
      <div style={{ fontSize: '20px', marginBottom: '12px' }}>{icon}</div>
      <div
        ref={numberRef}
        className="gradient-text-green-cyan"
        style={{
          fontSize: '28px',
          fontWeight: 500,
          marginBottom: '4px',
          transition: 'opacity 0.3s ease',
        }}
      >
        <span ref={countUpRef} />
      </div>
      <div style={{ fontSize: '13px', fontWeight: 400, color: '#8A94A6', marginTop: '4px' }}>{label}</div>
      {sublabel && (
        <div style={{ fontSize: '11px', color: '#555E70', marginTop: '4px' }}>{sublabel}</div>
      )}
    </div>
  )
}

function CustomTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    return (
      <div style={{
        padding: '12px',
        borderRadius: '8px',
        fontSize: '12px',
        backgroundColor: '#181B28',
        border: '1px solid #252836',
      }}>
        <p style={{ fontWeight: 400, color: '#F2F5FA', marginBottom: '4px' }}>{label}</p>
        {payload.map((entry) => (
          <p key={entry.name} style={{ color: entry.color, margin: '2px 0' }}>
            {entry.name}: {formatDollars(entry.value)}
          </p>
        ))}
      </div>
    )
  }
  return null
}

function BarLabel({ x, y, width, value }) {
  return (
    <text
      x={x + width + 8}
      y={y + 10}
      fill="#8A94A6"
      fontSize={12}
      textAnchor="start"
    >
      {formatDollars(value)}
    </text>
  )
}

function formatYAxisTick(value) {
  if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`
  if (value >= 1000) return `$${Math.round(value / 1000)}K`
  return `$${value}`
}

function ProjectionTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    return (
      <div style={{
        padding: '12px',
        borderRadius: '8px',
        fontSize: '12px',
        backgroundColor: '#181B28',
        border: '1px solid #252836',
      }}>
        <p style={{ fontWeight: 400, color: '#F2F5FA', marginBottom: '4px' }}>{label}</p>
        {payload.filter(entry => entry.dataKey !== 'savings').map((entry) => (
          <p key={entry.name} style={{ color: entry.color || entry.stroke, margin: '2px 0' }}>
            {entry.name}: {formatDollars(entry.value)}
          </p>
        ))}
      </div>
    )
  }
  return null
}

function ProjectionSection({ totalMonthlySavings, totalDevinMonthlyCost, roi }) {
  const projectionData = useMemo(() => {
    const data = []
    let cumulativeSavings = 0
    for (let month = 1; month <= 12; month++) {
      const cumulativeInvestment = totalDevinMonthlyCost * month
      if (month === 1) {
        cumulativeSavings += totalMonthlySavings * 0.5
      } else if (month === 2) {
        cumulativeSavings += totalMonthlySavings * 0.75
      } else {
        cumulativeSavings += totalMonthlySavings
      }
      data.push({
        name: `Mo ${month}`,
        investment: Math.round(cumulativeInvestment),
        savings: Math.round(cumulativeSavings),
      })
    }
    return data
  }, [totalMonthlySavings, totalDevinMonthlyCost])

  const breakevenMonth = useMemo(() => {
    for (let i = 0; i < projectionData.length; i++) {
      if (projectionData[i].savings > projectionData[i].investment) {
        return i + 1
      }
    }
    return null
  }, [projectionData])

  const netValue = projectionData.length > 0
    ? projectionData[11].savings - projectionData[11].investment
    : 0

  return (
    <div style={{ marginBottom: '56px' }}>
      <div style={{
        fontSize: '13px',
        fontWeight: 400,
        color: '#8A94A6',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        marginBottom: '8px',
      }}>PROJECTION</div>
      <h3 style={{
        fontSize: '20px',
        fontWeight: 400,
        color: '#F2F5FA',
        marginBottom: '24px',
      }}>Cumulative Value Over <span className="gradient-text-blue-green">12 Months</span></h3>
      <div style={{
        padding: '24px',
        borderRadius: '16px',
        backgroundColor: '#181B28',
        border: '1px solid #252836',
      }}>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={projectionData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
            <defs>
              <linearGradient id="savingsGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#21C19A" stopOpacity={0.12} />
                <stop offset="100%" stopColor="#21C19A" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="#252836" strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="name"
              tick={{ fill: '#8A94A6', fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: '#8A94A6', fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={formatYAxisTick}
            />
            <Tooltip content={<ProjectionTooltip />} />
            <Legend wrapperStyle={{ color: '#8A94A6', fontSize: 13, paddingTop: 12 }} />
            <Area
              dataKey="savings"
              fill="url(#savingsGradient)"
              stroke="none"
              name="Cumulative Savings"
              legendType="none"
            />
            <Line
              type="monotone"
              dataKey="investment"
              stroke="#363A4D"
              strokeDasharray="5 5"
              strokeWidth={2}
              dot={false}
              name="Cumulative Investment"
            />
            <Line
              type="monotone"
              dataKey="savings"
              stroke="#21C19A"
              strokeWidth={2}
              dot={false}
              name="Cumulative Savings"
            />
            {breakevenMonth && (
              <ReferenceLine
                x={`Mo ${breakevenMonth}`}
                stroke="#8A94A6"
                strokeDasharray="3 3"
                label={{
                  value: 'Breakeven',
                  position: 'top',
                  fill: '#8A94A6',
                  fontSize: 11,
                }}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
      <p style={{ fontSize: '14px', color: '#BAD7F5', marginTop: '16px' }}>
        By month 12, your projected net value is{' '}
        <span className="gradient-text-blue-green" style={{ fontWeight: 500 }}>
          {formatDollars(netValue)}
        </span>
        {' '}&mdash; a{' '}
        <span className="gradient-text-blue-green" style={{ fontWeight: 500 }}>
          {Math.round(roi)}%
        </span>
        {' '}return on your Devin investment.
      </p>
    </div>
  )
}

export default function ImpactDashboard({ teamSize, costBracket, timeAllocation }) {
  const hourlyRate = HOURLY_RATES[costBracket] || 78

  const categoryData = useMemo(() => {
    return CATEGORY_NAMES.map((name, i) => {
      const categoryPercent = timeAllocation[i]
      const multiplier = EFFICIENCY_MULTIPLIERS[i]

      const currentMonthlyHours = teamSize * HOURS_PER_ENGINEER_PER_MONTH * (categoryPercent / 100)
      const hoursWithDevin = currentMonthlyHours / multiplier
      const hoursReclaimedRaw = currentMonthlyHours - hoursWithDevin
      const hoursReclaimed = hoursReclaimedRaw * (1 - REVIEW_OVERHEAD)

      const currentMonthlyCost = currentMonthlyHours * hourlyRate
      const devinMonthlyCost = hoursWithDevin * DEVIN_COST_PER_HOUR
      const monthlySavings = currentMonthlyCost - devinMonthlyCost

      return {
        name,
        shortName: SHORT_CHART_NAMES[i],
        currentMonthlyHours,
        hoursWithDevin,
        hoursReclaimed,
        currentMonthlyCost,
        devinMonthlyCost,
        monthlySavings,
        categoryPercent,
      }
    })
  }, [teamSize, hourlyRate, timeAllocation])

  const totals = useMemo(() => {
    const totalHoursReclaimed = categoryData.reduce((sum, c) => sum + c.hoursReclaimed, 0)
    const totalMonthlySavings = categoryData.reduce((sum, c) => sum + c.monthlySavings, 0)
    const totalDevinMonthlyCost = categoryData.reduce((sum, c) => sum + c.devinMonthlyCost, 0)
    const annualSavings = totalMonthlySavings * 12
    const capacityUnlocked = totalHoursReclaimed / HOURS_PER_ENGINEER_PER_MONTH
    const roi = totalDevinMonthlyCost > 0
      ? (totalMonthlySavings / totalDevinMonthlyCost) * 100
      : 0

    return { totalHoursReclaimed, totalMonthlySavings, totalDevinMonthlyCost, annualSavings, capacityUnlocked, roi }
  }, [categoryData])

  const recommendedPilot = useMemo(() => {
    let best = categoryData[0]
    for (let i = 1; i < categoryData.length; i++) {
      if (categoryData[i].categoryPercent > best.categoryPercent) {
        best = categoryData[i]
      }
    }
    return best
  }, [categoryData])

  const chartData = useMemo(() => {
    return categoryData.map((c) => ({
      name: c.shortName,
      Current: Math.round(c.currentMonthlyCost),
      'With Devin': Math.round(c.devinMonthlyCost),
    }))
  }, [categoryData])

  return (
    <section style={{ marginBottom: '56px' }}>
      {/* Section Heading */}
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <div style={{
          fontSize: '13px',
          fontWeight: 400,
          color: '#8A94A6',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          marginBottom: '8px',
        }}>RESULTS</div>
        <h2 style={{
          fontSize: '22px',
          fontWeight: 400,
          color: '#F2F5FA',
          letterSpacing: '-0.01em',
          marginBottom: '8px',
        }}>Your <span className="gradient-text-blue-green">Impact Report</span></h2>
        <p style={{ fontSize: '14px', fontWeight: 400, color: '#8A94A6' }}>
          Based on real efficiency data from Devin enterprise deployments
        </p>
      </div>

      {/* 2x2 Metric Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '16px',
        marginBottom: '56px',
      }}>
        <MetricCard
          icon={"\u23F1\uFE0F"}
          value={Math.round(totals.totalHoursReclaimed)}
          suffix=" hrs/mo"
          label="Hours Reclaimed Per Month"
        />
        <MetricCard
          icon={"\uD83D\uDCB0"}
          value={Math.round(totals.annualSavings)}
          prefix="$"
          label="Annual Cost Savings"
        />
        <MetricCard
          icon={"\uD83D\uDC69\u200D\uD83D\uDCBB"}
          value={parseFloat(totals.capacityUnlocked.toFixed(1))}
          suffix=" engineers"
          label="Capacity Unlocked"
          sublabel="equivalent full-time engineers freed up for feature work"
          decimals={1}
        />
        <MetricCard
          icon={"\uD83D\uDCC8"}
          value={Math.round(totals.roi)}
          suffix="%"
          label="Return on Investment"
        />
      </div>

      {/* Cost Comparison Bar Chart */}
      <div style={{ marginBottom: '56px' }}>
        <div style={{
          fontSize: '13px',
          fontWeight: 400,
          color: '#8A94A6',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          marginBottom: '8px',
        }}>COST COMPARISON</div>
        <h3 style={{
          fontSize: '20px',
          fontWeight: 400,
          color: '#F2F5FA',
          marginBottom: '24px',
        }}>Monthly Cost: Your Team vs. Devin</h3>
        <div style={{
          padding: '24px',
          borderRadius: '16px',
          backgroundColor: '#181B28',
          border: '1px solid #252836',
        }}>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={chartData}
              layout="vertical"
              margin={{ top: 5, right: 80, left: 10, bottom: 5 }}
            >
              <XAxis type="number" hide />
              <YAxis
                dataKey="name"
                type="category"
                width={100}
                tick={{ fill: '#8A94A6', fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} cursor={false} />
              <Legend
                wrapperStyle={{ color: '#8A94A6', fontSize: 13, paddingTop: 12 }}
              />
              <Bar dataKey="Current" fill="#363A4D" barSize={16} radius={[0, 4, 4, 0]}>
                <LabelList content={<BarLabel />} />
              </Bar>
              <Bar dataKey="With Devin" fill="#21C19A" barSize={16} radius={[0, 4, 4, 0]}>
                <LabelList content={<BarLabel />} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 12-Month Value Projection */}
      <ProjectionSection
        totalMonthlySavings={totals.totalMonthlySavings}
        totalDevinMonthlyCost={totals.totalDevinMonthlyCost}
        roi={totals.roi}
      />

      {/* Recommended Pilot */}
      <div style={{ marginBottom: '56px' }}>
        <div style={{
          fontSize: '13px',
          fontWeight: 400,
          color: '#8A94A6',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          marginBottom: '8px',
        }}>RECOMMENDATION</div>
        <div style={{
          backgroundColor: '#181B28',
          border: '1px solid #252836',
          borderLeft: '3px solid #21C19A',
          borderRadius: '16px',
          padding: '24px',
        }}>
          <h3 style={{
            fontSize: '18px',
            fontWeight: 400,
            color: '#F2F5FA',
            marginBottom: '12px',
          }}>
            {"\uD83C\uDFAF"} Recommended Pilot: {recommendedPilot.name}
          </h3>
          <div style={{ fontSize: '14px', fontWeight: 400, color: '#BAD7F5', lineHeight: 1.7 }}>
            <p style={{ marginBottom: '8px' }}>
              Based on your team&apos;s profile, <span style={{ fontWeight: 500, color: '#F2F5FA' }}>{recommendedPilot.name.toLowerCase()}</span> offers the highest-impact starting point.
            </p>
            <p style={{ marginBottom: '8px' }}>
              Your team currently spends <span style={{ fontWeight: 500, color: '#F2F5FA' }}>{Math.round(recommendedPilot.currentMonthlyHours)} hrs/month</span> on this.
            </p>
            <p style={{ marginBottom: '8px' }}>
              With Devin, this drops to <span style={{ fontWeight: 500, color: '#F2F5FA' }}>{Math.round(recommendedPilot.hoursWithDevin)} hrs/month</span> — reclaiming <span style={{ fontWeight: 500, color: '#21C19A' }}>{Math.round(recommendedPilot.hoursReclaimed)} hours</span>.
            </p>
            <p style={{ marginBottom: '8px' }}>
              Estimated monthly Devin cost for this category: <span style={{ fontWeight: 500, color: '#F2F5FA' }}>{formatDollars(recommendedPilot.devinMonthlyCost)}</span>
            </p>
            <p>
              Monthly savings: <span style={{ fontWeight: 500, color: '#21C19A' }}>{formatDollars(recommendedPilot.monthlySavings)}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Sources */}
      <div style={{
        marginTop: '32px',
        borderTop: '1px solid #252836',
        paddingTop: '16px',
        paddingBottom: '80px',
      }}>
        <div style={{ fontSize: '12px', color: '#555E70', lineHeight: 1.6 }}>
          Efficiency data sourced from published Cognition case studies including Nubank (8-12x migration efficiency), enterprise security deployments (20x vulnerability remediation), and Devin&apos;s 2025 Performance Review. Conservative estimates used throughout. Learn more at{' '}
          <a href="https://cognition.ai" target="_blank" rel="noopener noreferrer" style={{ color: '#555E70', textDecoration: 'underline' }}>
            cognition.ai
          </a>
        </div>
      </div>
    </section>
  )
}
