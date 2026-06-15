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

  const [initialCiv, setInitialCiv] = useState(73)
  const [initialMil, setInitialMil] = useState(15)
  const [months, setMonths] = useState(72)

  // 建設計画: まず民需を建て、その後軍需を建てる
  const [civBuildMonths, setCivBuildMonths] = useState(6)
  const [civPerMonth, setCivPerMonth] = useState(2)
  const [milPerMonth, setMilPerMonth] = useState(3)

  const [perFactoryOutput, setPerFactoryOutput] = useState(5) // 民需1基あたりの出力（＝5）
  const [buildSpeedBonusPercent, setBuildSpeedBonusPercent] = useState(0) // 建設速度ボーナス（%）
  const [civBuildCost, setCivBuildCost] = useState(3000) // 民需1基あたりの必要作業量
  const [milBuildCost, setMilBuildCost] = useState(6000) // 軍需1基あたりの必要作業量
  const [consumerGoodsPercent, setConsumerGoodsPercent] = useState(30) // 消費財に使われる民需の割合（%）
  const [maxCivPerConstruction, setMaxCivPerConstruction] = useState(20) // 1建設あたりに割り当てられる民需の最大数
  const [civQueueSlots, setCivQueueSlots] = useState(10) // 同時に割り当て可能な建設キュー数（スロット）

  const data = useMemo(() => {
    const out = []
    let civ = initialCiv
    let mil = initialMil
    let carryCiv = 0 // 建設進捗の繰越（民需）
    let carryMil = 0 // 建設進捗の繰越（軍需）

    const daysPerMonth = 30 // 簡易化: 1ヶ月を30日として計算
    const totalDays = months * daysPerMonth
    const civPhaseDays = civBuildMonths * daysPerMonth

    for (let day = 0; day < totalDays; day++) {
      // 建設利用可能な民需工場数 = 全民需工場数 - 消費財に使用される民需工場数
      const consumerCoeff = consumerGoodsPercent / 100
      const availableCiv = civ * (1 - consumerCoeff)
      // キューのスロット数と1建設あたり最大割当から、建設に割り当て可能な民需の上限を算出
      const maxAssignable = civQueueSlots * maxCivPerConstruction
      const assignedCiv = Math.min(availableCiv, maxAssignable)
      // 民需工場出力 = assignedCiv × perFactoryOutput
      const constructionOutput = assignedCiv * perFactoryOutput
      // 建設速度ボーナスを小数に
      const speedBonus = buildSpeedBonusPercent / 100
      // 1日あたりの工事進捗
      const dailyWork = constructionOutput * (1 + speedBonus)

      if (day < civPhaseDays) {
        // 民需建設
        carryCiv += dailyWork
        const built = Math.floor(carryCiv / civBuildCost)
        if (built > 0) {
          civ += built
          carryCiv -= built * civBuildCost
        }
      } else {
        // 軍需建設
        carryMil += dailyWork
        const builtM = Math.floor(carryMil / milBuildCost)
        if (builtM > 0) {
          mil += builtM
          carryMil -= builtM * milBuildCost
        }
      }

      // 月末ごとにスナップショットを取る（チャート表示用）
      if ((day + 1) % daysPerMonth === 0) {
        const monthIdx = Math.floor(day / daysPerMonth)
        const monthLabel = `${startYear}/${String((startMonth + monthIdx - 1) % 12 + 1).padStart(2, '0')}`
        out.push({
          idx: monthIdx,
          label: monthLabel,
          civ: Math.round(civ * 100) / 100,
          mil: Math.round(mil * 100) / 100,
          carryCiv: Math.round(carryCiv * 100) / 100,
          carryMil: Math.round(carryMil * 100) / 100,
          availableCiv: Math.round(availableCiv * 100) / 100,
          dailyWork: Math.round(dailyWork * 100) / 100
        })
      }
    }

    return out
  }, [initialCiv, initialMil, months, civBuildMonths, perFactoryOutput, buildSpeedBonusPercent, civBuildCost, milBuildCost, consumerGoodsPercent])

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

        <h4>建設パラメータ（調整可）</h4>
        <label>消費財に使用される民需の割合（%）: <input type="number" value={consumerGoodsPercent} min="0" max="100" step="0.1" onChange={e=>setConsumerGoodsPercent(Number(e.target.value))} />（デフォルト: 30%）</label>
        <label>民需1基あたりの出力: <input type="number" value={perFactoryOutput} min="0" step="0.1" onChange={e=>setPerFactoryOutput(Number(e.target.value))} />（通常: 5）</label>
        <label>建設速度ボーナス（%）: <input type="number" value={buildSpeedBonusPercent} min="-90" step="0.1" onChange={e=>setBuildSpeedBonusPercent(Number(e.target.value))} />（例: 0 = なし, 50 = +50%）</label>
        <label>1建設あたりに割り当てられる最大民需数: <input type="number" value={maxCivPerConstruction} min="1" step="1" onChange={e=>setMaxCivPerConstruction(Number(e.target.value))} />（デフォルト: 20）</label>
        <label>同時に割り当て可能な建設キュー数（スロット）: <input type="number" value={civQueueSlots} min="1" step="1" onChange={e=>setCivQueueSlots(Number(e.target.value))} />（デフォルト: 10）</label>
        <label>民需1基あたりの必要作業量: <input type="number" value={civBuildCost} min="1" step="1" onChange={e=>setCivBuildCost(Number(e.target.value))} />（デフォルト: 3000）</label>
        <label>軍需1基あたりの必要作業量: <input type="number" value={milBuildCost} min="1" step="1" onChange={e=>setMilBuildCost(Number(e.target.value))} />（デフォルト: 6000）</label>
      </div>

      <div className="results">
        <h2>タイムライン</h2>
        <div className="chart-wrapper">
          <Chart data={data} />
        </div>
      </div>

      <footer>
        <small>月ごとの累積工場数を表示します。建設計画とシミュレーション期間を調整してください。</small>
      </footer>
    </div>
  )
}
