import React, { useState, useMemo } from 'react'

const MONTH_LABELS = (startYear, months) => {
  const labels = []
  let y = startYear
  let m = 1
  for (let i = 0; i < months; i++) {
    labels.push(`${y}/${String(m).padStart(2,'0')}`)
    m++
    if (m > 12) { m = 1; y++ }
  }
  return labels
}

export default function App() {
  const startYear = 1936
  const startMonth = 1

  const [initialCiv, setInitialCiv] = useState(30)
  const [initialMil, setInitialMil] = useState(0)
  const [months, setMonths] = useState(24)

  // Build plan: build civilian factories for civMonths, then build military
  const [civBuildMonths, setCivBuildMonths] = useState(6)
  const [civPerMonth, setCivPerMonth] = useState(2)
  const [milPerMonth, setMilPerMonth] = useState(3)

  const data = useMemo(() => {
    const out = []
    let civ = initialCiv
    let mil = initialMil
    for (let i = 0; i < months; i++) {
      // month i: if within civBuildMonths, add civilian builds, else military builds
      if (i < civBuildMonths) civ += civPerMonth
      else mil += milPerMonth
      out.push({
        idx: i,
        label: `${startYear}/${String((startMonth + i -1)%12 +1).padStart(2,'0')}`,
        civ: Math.round(civ*100)/100,
        mil: Math.round(mil*100)/100
      })
    }
    return out
  }, [initialCiv, initialMil, months, civBuildMonths, civPerMonth, milPerMonth])

  // Simple SVG line chart
  const Chart = ({data}) => {
    const w = Math.max(600, data.length * 30)
    const h = 240
    const pad = 40
    const max = Math.max(...data.map(d=>Math.max(d.civ,d.mil)), 1)
    const sx = i => pad + (i/(data.length-1 || 1))*(w-2*pad)
    const sy = v => h - pad - (v/max)*(h-2*pad)
    const linePath = arr => arr.map((d,i)=>`${i===0? 'M':'L'} ${sx(i)} ${sy(d)}`).join(' ')
    return (
      <svg width={w} height={h} style={{background:'#fff',border:'1px solid #eee'}}>
        {/* axes */}
        <line x1={pad} y1={h-pad} x2={w-pad} y2={h-pad} stroke="#ccc" />
        <line x1={pad} y1={pad} x2={pad} y2={h-pad} stroke="#ccc" />
        {/* civ line */}
        <path d={linePath(data.map(d=>d.civ))} fill="none" stroke="#1f77b4" strokeWidth={2} />
        {/* mil line */}
        <path d={linePath(data.map(d=>d.mil))} fill="none" stroke="#ff7f0e" strokeWidth={2} />
        {/* labels */}
        {data.map((d,i)=> (
          i%Math.ceil(data.length/12||1)===0 && <text key={i} x={sx(i)} y={h-pad+14} fontSize={10} textAnchor="middle">{d.label}</text>
        ))}
        {/* legend */}
        <rect x={w-pad-120} y={pad-28} width={110} height={26} fill="#fff" stroke="#eee" />
        <circle cx={w-pad-100} cy={pad-16} r={5} fill="#1f77b4" />
        <text x={w-pad-88} y={pad-13} fontSize={12}>Civilian</text>
        <circle cx={w-pad-40} cy={pad-16} r={5} fill="#ff7f0e" />
        <text x={w-pad-28} y={pad-13} fontSize={12}>Military</text>
      </svg>
    )
  }

  return (
    <div className="container">
      <h1>Factory build timeline</h1>
      <p>Start date: {startYear}/{String(startMonth).padStart(2,'0')}/01</p>

      <div className="controls">
        <label>Initial civilian factories: <input type="number" value={initialCiv} min="0" onChange={e=>setInitialCiv(Number(e.target.value))} /></label>
        <label>Initial military factories: <input type="number" value={initialMil} min="0" onChange={e=>setInitialMil(Number(e.target.value))} /></label>
        <label>Simulation months: <input type="number" value={months} min="1" onChange={e=>setMonths(Number(e.target.value))} /></label>

        <hr />
        <h3>Build plan</h3>
        <label>Build civilian for months: <input type="number" value={civBuildMonths} min="0" onChange={e=>setCivBuildMonths(Number(e.target.value))} /></label>
        <label>Civ factories completed per month: <input type="number" value={civPerMonth} min="0" step="0.1" onChange={e=>setCivPerMonth(Number(e.target.value))} /></label>
        <label>Mil factories completed per month (after civ phase): <input type="number" value={milPerMonth} min="0" step="0.1" onChange={e=>setMilPerMonth(Number(e.target.value))} /></label>
      </div>

      <div className="results">
        <h2>Timeline</h2>
        <Chart data={data} />
      </div>

      <footer>
        <small>Timeline shows cumulative factories by month. Adjust the build plan and simulation length as needed.</small>
      </footer>
    </div>
  )
}
