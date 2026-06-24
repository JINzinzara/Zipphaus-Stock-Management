import { useState, useEffect } from 'react'

function InventoryHistory({ user }) {
  const [history, setHistory] = useState([])
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    const url = user.role === 'manager'
      ? 'http://localhost:3001/api/inventory/history'
      : `http://localhost:3001/api/inventory/history?location_id=${user.location_id}`

    fetch(url)
      .then(res => res.json())
      .then(data => setHistory(data))
  }, [])

  if (selected) return (
    <div>
      <button onClick={() => setSelected(null)}>← 뒤로</button>
      <h2>Inventory History</h2>
      <p>{selected.date} · {selected.frequency}</p>
      {selected.counts.map(c => (
        <div key={c.item_id}>
          <span>{c.item_id}</span>
          <span> — box: {c.box}, ct: {c.ct}</span>
        </div>
      ))}
    </div>
  )

  return (
    <div>
      <h2>Inventory History</h2>
      {history.length === 0 && <p>기록이 없습니다</p>}
      {history.map(record => (
        <div key={record.id} onClick={() => setSelected(record)}>
          <p>{record.date} · {record.frequency} · {record.location_id}</p>
        </div>
      ))}
    </div>
  )
}

export default InventoryHistory