import { useState, useEffect } from 'react'

function ManagerOverview() {
  const [locations, setLocations] = useState([])
  const [allInventory, setAllInventory] = useState([])
  const [allOrders, setAllOrders] = useState([])
  const [vendorItems, setVendorItems] = useState({})

  useEffect(() => {
    // 지점 목록
    fetch('http://localhost:3001/api/auth/locations')
      .then(res => res.json())
      .then(data => setLocations(data))

    // 전 지점 재고 기록
    fetch('http://localhost:3001/api/inventory/history')
      .then(res => res.json())
      .then(data => setAllInventory(data))

    // 전 지점 발주 기록
    fetch('http://localhost:3001/api/orders/history')
      .then(res => res.json())
      .then(data => setAllOrders(data))

    // 품목 목록
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
  }, [])

  // 지점별 가장 최근 재고 제출 찾기
  const getLatestInventory = (locationId) => {
    return allInventory.find(inv => inv.location_id === locationId)
  }

  return (
    <div>
      <h2>Manager Overview</h2>
      <p>전 지점 재고 현황</p>

      {locations.map(location => {
        const latest = getLatestInventory(location.id)
        const locationOrders = allOrders.filter(o => o.location_id === location.id)

        return (
          <div key={location.id}>
            <h3>{location.name}</h3>
            <p>최근 재고 제출: {latest ? `${latest.date} · ${latest.frequency}` : '없음'}</p>
            <p>총 발주 횟수: {locationOrders.length}회</p>
            {latest && (
              <details>
                <summary>재고 상세 보기</summary>
                {latest.counts.map(c => (
                  <div key={c.item_id}>
                    <span>{vendorItems[c.item_id] || c.item_id}</span>
                    <span> — {c.box}box{c.ct > 0 ? ` ${c.ct}ct` : ''}</span>
                  </div>
                ))}
              </details>
            )}
          </div>
        )
      })}
    </div>
  )
}

export default ManagerOverview