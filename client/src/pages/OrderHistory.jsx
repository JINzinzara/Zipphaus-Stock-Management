import { useState, useEffect } from 'react'

function OrderHistory({ user }) {
  const [history, setHistory] = useState([])
  const [selected, setSelected] = useState(null)
  const [vendorItems, setVendorItems] = useState({})

  useEffect(() => {
    // 품목 목록 불러오기 (item_id → 이름 변환용)
    fetch('http://localhost:3001/api/inventory/items')
      .then(res => res.json())
      .then(data => {
        const itemMap = {}
        data.forEach(({ items }) => {
          items.forEach(item => {
            itemMap[item.id] = item.name
          })
        })
        setVendorItems(itemMap)
      })

    // 발주 기록 불러오기
    const url = user.role === 'manager'
      ? 'http://localhost:3001/api/orders/history'
      : `http://localhost:3001/api/orders/history?location_id=${user.location_id}`

    fetch(url)
      .then(res => res.json())
      .then(data => setHistory(data))
  }, [])

  if (selected) return (
    <div>
      <button onClick={() => setSelected(null)}>← 뒤로</button>
      <h2>Order History</h2>
      <p>{selected.date} · {selected.location_id}</p>
      {selected.items.filter(i => i.qty > 0).length === 0
        ? <p>발주 없음</p>
        : selected.items
            .filter(i => i.qty > 0)
            .map(i => (
                <div key={i.item_id}>
                    <span>{vendorItems[i.item_id] || i.item_id}</span>
                    <span> — {i.qty} box</span>
                </div>
                ))
    }
    </div>
  )

  return (
    <div>
      <h2>Order History</h2>
      {history.length === 0 && <p>발주 기록이 없습니다</p>}
      {history.map(record => (
        <div key={record.id} onClick={() => setSelected(record)}>
          <p>{record.date} · {record.location_id}</p>
        </div>
      ))}
    </div>
  )
}

export default OrderHistory