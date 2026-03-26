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

function formatDollars(value) {
  return '$' + Math.round(value).toLocaleString('en-US')
}

function MetricCard({ icon, value, suffix, label, sublabel, decimals = 0, prefix = '' }) {
  const countUpRef = useRef(null)
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
    update(value)
  }, [value, update])

  return (
    <div
      className="p-6 rounded-xl transition-all duration-200"
      style={{
        backgroundColor: '#111111',
        border: '1px solid #1E1E1E',
      }}
      onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#333333' }}
      onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#1E1E1E' }}
    >
      <div className="text-3xl mb-3">{icon}</div>
      <div className="text-3xl md:text-4xl font-bold mb-2" style={{ color: '#21C19A' }}>
        <span ref={countUpRef} />
      </div>
      <div className="text-sm font-medium text-white">{label}</div>
      {sublabel && (
        <div className="text-xs mt-1" style={{ color: '#A0A0A0' }}>{sublabel}</div>
      )}
    </div>
  )
}

function CustomTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    return (
      <div
        className="p-3 rounded-lg text-sm"
        style={{ backgroundColor: '#1A1A1A', border: '1px solid #333' }}
      >
        <p className="font-medium text-white mb-1">{label}</p>
        {payload.map((entry) => (
          <p key={entry.name} style={{ color: entry.color }}>
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
      fill="#A0A0A0"
      fontSize={12}
      textAnchor="start"
    >
      {formatDollars(value)}
    </text>
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
        shortName: name.length > 20 ? name.substring(0, 18) + '...' : name,
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
    <section className="pb-20">
      {/* Section Heading */}
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">Your Impact Report</h2>
        <p className="text-sm" style={{ color: '#A0A0A0' }}>
          Based on real efficiency data from Devin enterprise deployments
        </p>
      </div>

      {/* 2x2 Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
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
      <div className="mb-12">
        <h3 className="text-xl font-bold text-white mb-6">Monthly Cost: Your Team vs. Devin</h3>
        <div
          className="p-6 rounded-xl"
          style={{ backgroundColor: '#111111', border: '1px solid #1E1E1E' }}
        >
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
                width={150}
                tick={{ fill: '#A0A0A0', fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} cursor={false} />
              <Legend
                wrapperStyle={{ color: '#A0A0A0', fontSize: 12, paddingTop: 12 }}
              />
              <Bar dataKey="Current" fill="#444444" barSize={16} radius={[0, 4, 4, 0]}>
                <LabelList content={<BarLabel />} />
              </Bar>
              <Bar dataKey="With Devin" fill="#21C19A" barSize={16} radius={[0, 4, 4, 0]}>
                <LabelList content={<BarLabel />} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recommended Pilot */}
      <div
        className="p-6 rounded-xl mb-12"
        style={{
          backgroundColor: '#111111',
          borderLeft: '4px solid #21C19A',
          border: '1px solid #1E1E1E',
          borderLeftColor: '#21C19A',
          borderLeftWidth: '4px',
        }}
      >
        <h3 className="text-lg font-bold text-white mb-3">
          {"\uD83C\uDFAF"} Recommended Pilot: {recommendedPilot.name}
        </h3>
        <div className="space-y-2 text-sm" style={{ color: '#A0A0A0' }}>
          <p>
            Based on your team&apos;s profile, <span className="text-white font-medium">{recommendedPilot.name.toLowerCase()}</span> offers the highest-impact starting point.
          </p>
          <p>
            Your team currently spends <span className="text-white font-medium">{Math.round(recommendedPilot.currentMonthlyHours)} hrs/month</span> on this.
          </p>
          <p>
            With Devin, this drops to <span className="text-white font-medium">{Math.round(recommendedPilot.hoursWithDevin)} hrs/month</span> — reclaiming <span style={{ color: '#21C19A' }} className="font-medium">{Math.round(recommendedPilot.hoursReclaimed)} hours</span>.
          </p>
          <p>
            Estimated monthly Devin cost for this category: <span className="text-white font-medium">{formatDollars(recommendedPilot.devinMonthlyCost)}</span>
          </p>
          <p>
            Monthly savings: <span style={{ color: '#21C19A' }} className="font-bold">{formatDollars(recommendedPilot.monthlySavings)}</span>
          </p>
        </div>
      </div>

      {/* Sources */}
      <div className="text-xs leading-relaxed" style={{ color: '#555555' }}>
        Efficiency data sourced from published Cognition case studies including Nubank (8-12x migration efficiency), enterprise security deployments (20x vulnerability remediation), and Devin&apos;s 2025 Performance Review. Conservative estimates used throughout. Learn more at{' '}
        <a href="https://cognition.ai" target="_blank" rel="noopener noreferrer" style={{ color: '#555555', textDecoration: 'underline' }}>
          cognition.ai
        </a>
      </div>
    </section>
  )
}
