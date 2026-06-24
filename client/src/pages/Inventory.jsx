import { useState, useEffect } from 'react'

function Inventory({ user }) {
  const [vendorItems, setVendorItems] = useState([])
  const [counts, setCounts] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [frequency, setFrequency] = useState(null)

  useEffect(() => {
    fetch('http://localhost:3001/api/inventory/items')
      .then(res => res.json())
      .then(data => setVendorItems(data))
  }, [])

  const handleCount = (itemId, field, value) => {
    if (Number(value) < 0) return
    setCounts(prev => ({
      ...prev,
      [itemId]: { ...prev[itemId], [field]: value }
    }))
  }

  const handleSubmit = async () => {
    const countList = Object.entries(counts).map(([item_id, values]) => ({
      item_id,
      box: Number(values.box) || 0,
      ct: Number(values.ct) || 0,
    }))

    const res = await fetch('http://localhost:3001/api/inventory/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        location_id: user.location_id,
        user_id: user.id,
        frequency,
        counts: countList,
      }),
    })

    const data = await res.json()
    if (data.success) setSubmitted(true)
  }

  // 주기 선택 화면
  if (!frequency) return (
    <div>
      <h2>Inventory</h2>
      <p>재고 입력 주기를 선택해주세요</p>
      <button onClick={() => setFrequency('Weekly')}>Weekly</button>
      <button onClick={() => setFrequency('Monthly')}>Monthly</button>
    </div>
  )

  // 제출 완료 화면
  if (submitted) return (
    <div>
      <h2>제출 완료!</h2>
      <p>{new Date().toLocaleDateString()} · {frequency}</p>
      {vendorItems.map(({ vendor, items }) => (
        <div key={vendor.id}>
          <h3>{vendor.name}</h3>
          {items.map(item => {
            const count = counts[item.id]
            if (!count) return null
            return (
              <div key={item.id}>
                <span>{item.name}</span>
                <span> — box: {count.box || 0}, ct: {count.ct || 0}</span>
              </div>
            )
          })}
        </div>
      ))}
    </div>
  )

  // 재고 입력 화면
  return (
    <div>
      <h2>Inventory</h2>
      <p>{new Date().toLocaleDateString()} · {frequency}</p>

      {vendorItems.map(({ vendor, items }) => (
        <div key={vendor.id}>
          <h3>{vendor.name}</h3>
          <p>{items.length} items</p>
          {items.map(item => (
            <div key={item.id}>
              <span>{item.name}</span>
              <input
                type="number"
                placeholder="box"
                min="0"
                onChange={e => handleCount(item.id, 'box', e.target.value)}
              />
              <input
                type="number"
                placeholder="ct"
                min="0"
                onChange={e => handleCount(item.id, 'ct', e.target.value)}
              />
            </div>
          ))}
        </div>
      ))}

      <button onClick={handleSubmit}>Submit</button>
    </div>
  )
}

export default Inventory