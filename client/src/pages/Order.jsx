import { useState, useEffect } from 'react'

function Order({ user }) {
  const [vendorItems, setVendorItems] = useState([])
  const [quantities, setQuantities] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [lastInventory, setLastInventory] = useState({})

  useEffect(() => {
    // 품목 목록 불러오기
    fetch('http://localhost:3001/api/inventory/items')
      .then(res => res.json())
      .then(data => setVendorItems(data))

    // 가장 최근 재고 제출 기록 불러오기
    fetch(`http://localhost:3001/api/inventory/history?location_id=${user.location_id}`)
      .then(res => res.json())
      .then(data => {
        if (data.length === 0) return
        const latest = data[0]
        const countMap = {}
        latest.counts.forEach(c => {
          countMap[c.item_id] = c
        })
        setLastInventory(countMap)
      })
  }, [])

  const handleQty = (itemId, value) => {
    if (Number(value) < 0) return
    setQuantities(prev => ({ ...prev, [itemId]: value }))
  }

  const handleSubmit = async () => {
    const items = Object.entries(quantities).map(([item_id, qty]) => ({
      item_id,
      qty: Number(qty) || 0,
    }))

    const res = await fetch('http://localhost:3001/api/orders/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        location_id: user.location_id,
        user_id: user.id,
        items,
      }),
    })

    const data = await res.json()
    if (data.success) setSubmitted(true)
  }

  if (submitted) return (
    <div>
      <h2>발주 완료!</h2>
      <p>{new Date().toLocaleDateString()}</p>
      {vendorItems.map(({ vendor, items }) => (
        <div key={vendor.id}>
          <h3>{vendor.name}</h3>
          {items.map(item => {
            const qty = quantities[item.id]
            if (!qty || Number(qty) === 0) return null
            return (
              <div key={item.id}>
                <span>{item.name}</span>
                <span> — {qty} {item.unit}</span>
              </div>
            )
          })}
        </div>
      ))}
    </div>
  )

  return (
    <div>
      <h2>Order</h2>
      <p>{new Date().toLocaleDateString()}</p>

      {vendorItems.map(({ vendor, items }) => (
        <div key={vendor.id}>
          <h3>{vendor.name}</h3>
          {items.map(item => {
            const current = lastInventory[item.id]
            return (
              <div key={item.id}>
                <span>{item.name}</span>
                <span> 현재재고: {current ? `${current.box}box${current.ct > 0 ? ` ${current.ct}ct` : ''}` : '미입력'}</span>
                <input
                  type="number"
                  placeholder="발주 수량"
                  min="0"
                  onChange={e => handleQty(item.id, e.target.value)}
                />
              </div>
            )
          })}
        </div>
      ))}

      <button onClick={handleSubmit}>발주 제출</button>
    </div>
  )
}

export default Order