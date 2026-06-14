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

  // 建設計画: まず民需を建て、その後軍需を建てる
  const [civBuildMonths, setCivBuildMonths] = useState(6)
  const [civPerMonth, setCivPerMonth] = useState(2)
  const [milPerMonth, setMilPerMonth] = useState(3)

  const data = useMemo(() => {
    const out = []
    let civ = initialCiv
    let mil = initialMil
    for (let i = 0; i < months; i++) {
      // i 月目: civBuildMonths の間は民需、そうでなければ軍需を増やす
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

  // 簡易 SVG ラインチャート
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
        {/* 軸 */}
        <line x1={pad} y1={h-pad} x2={w-pad} y2={h-pad} stroke="#ccc" />
        <line x1={pad} y1={pad} x2={pad} y2={h-pad} stroke="#ccc" />
        {/* 民需ライン */}
        <path d={linePath(data.map(d=>d.civ))} fill="none" stroke="#1f77b4" strokeWidth={2} />
        {/* 軍需ライン */}
        <path d={linePath(data.map(d=>d.mil))} fill="none" stroke="#ff7f0e" strokeWidth={2} />
        {/* x軸ラベル */}
        {data.map((d,i)=> (
          i%Math.ceil(data.length/12||1)===0 && <text key={i} x={sx(i)} y={h-pad+14} fontSize={10} textAnchor="middle">{d.label}</text>
        ))}
        {/* 凡例 */}
        <rect x={w-pad-120} y={pad-28} width={110} height={26} fill="#fff" stroke="#eee" />
        <circle cx={w-pad-100} cy={pad-16} r={5} fill="#1f77b4" />
        <text x={w-pad-88} y={pad-13} fontSize={12}>民需</text>
        <circle cx={w-pad-40} cy={pad-16} r={5} fill="#ff7f0e" />
        <text x={w-pad-28} y={pad-13} fontSize={12}>軍需</text>
      </svg>
    )
  }

  return (
    <div className="container">
      <h1>工場建設タイムライン</h1>
      <p>開始日: {startYear}/{String(startMonth).padStart(2,'0')}/01</p>

      <div className="controls">
        <label>初期民需工場数: <input type="number" value={initialCiv} min="0" onChange={e=>setInitialCiv(Number(e.target.value))} /></label>
        <label>初期軍需工場数: <input type="number" value={initialMil} min="0" onChange={e=>setInitialMil(Number(e.target.value))} /></label>
        <label>シミュレーション月数: <input type="number" value={months} min="1" onChange={e=>setMonths(Number(e.target.value))} /></label>

        <hr />
        <h3>建設計画</h3>
        <label>民需を建設する期間（月）: <input type="number" value={civBuildMonths} min="0" onChange={e=>setCivBuildMonths(Number(e.target.value))} /></label>
        <label>1か月当たりの民需完成数: <input type="number" value={civPerMonth} min="0" step="0.1" onChange={e=>setCivPerMonth(Number(e.target.value))} /></label>
        <label>（民需フェーズ後）1か月当たりの軍需完成数: <input type="number" value={milPerMonth} min="0" step="0.1" onChange={e=>setMilPerMonth(Number(e.target.value))} /></label>
      </div>

      <div className="results">
        <h2>タイムライン</h2>
        <Chart data={data} />
      </div>

      <footer>
        <small>月ごとの累積工場数を表示します。建設計画とシミュレーション期間を調整してください。</small>
      </footer>
    </div>
  )
}
