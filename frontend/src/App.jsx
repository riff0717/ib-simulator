import React, { useState, useMemo } from 'react'

export default function App() {
  const [civFactories, setCivFactories] = useState(30)
  const [consumerGoodsPercent, setConsumerGoodsPercent] = useState(30)
  const [outputPerFactory, setOutputPerFactory] = useState(5)

  const consumerPercent = consumerGoodsPercent / 100

  const results = useMemo(() => {
    const availableCivs = civFactories * (1 - consumerPercent)
    const baseConstructionPower = availableCivs * outputPerFactory
    return {
      availableCivs: Math.round(availableCivs * 100) / 100,
      baseConstructionPower: Math.round(baseConstructionPower * 100) / 100
    }
  }, [civFactories, consumerPercent, outputPerFactory])

  return (
    <div className="container">
      <h1>Factory Output Simulator</h1>

      <div className="controls">
        <label>
          Civilian factories:
          <input type="number" value={civFactories} min="0" onChange={e => setCivFactories(Number(e.target.value))} />
        </label>

        <label>
          Consumer goods (%):
          <input type="range" min="0" max="100" value={consumerGoodsPercent} onChange={e => setConsumerGoodsPercent(Number(e.target.value))} />
          <span>{consumerGoodsPercent}%</span>
        </label>

        <label>
          Output per free factory:
          <input type="number" value={outputPerFactory} min="0" step="0.1" onChange={e => setOutputPerFactory(Number(e.target.value))} />
        </label>
      </div>

      <div className="results">
        <h2>Results</h2>
        <p>Available civilian factories: <strong>{results.availableCivs}</strong></p>
        <p>Base construction power (per day): <strong>{results.baseConstructionPower}</strong></p>
      </div>

      <footer>
        <small>Adjust inputs to model different scenarios. Export and advanced features can be added later.</small>
      </footer>
    </div>
  )
}
