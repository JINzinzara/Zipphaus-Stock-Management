import { useState } from 'react'

const LOCATIONS = [
  { id: 'loc_01', name: 'PA South' },
  { id: 'loc_02', name: 'PA North' },
  { id: 'loc_03', name: 'SCMO1' },
  { id: 'loc_04', name: 'SCMO2' },
  { id: 'loc_05', name: 'AV' },
  { id: 'loc_06', name: 'LAN' },
]

function Login({ onLogin }) {
  const [isManager, setIsManager] = useState(false)
  const [locationId, setLocationId] = useState('')
  const [pin, setPin] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async () => {
    const body = isManager ? { pin } : { location_id: locationId, pin }

    const res = await fetch('http://localhost:3001/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

    const data = await res.json()

    if (data.success) {
      onLogin(data.user)
    } else {
      setError(data.message)
    }
  }

  return (
    <div>
      <h1>Zipphaus</h1>

      {!isManager && (
        <select value={locationId} onChange={e => setLocationId(e.target.value)}>
          <option value="">지점 선택</option>
          {LOCATIONS.map(loc => (
            <option key={loc.id} value={loc.id}>{loc.name}</option>
          ))}
        </select>
      )}

      <input
        type="password"
        placeholder="PIN 입력"
        value={pin}
        onChange={e => setPin(e.target.value)}
      />

      <button onClick={handleSubmit}>로그인</button>

      <button onClick={() => setIsManager(!isManager)}>
        {isManager ? '직원으로 로그인' : '매니저로 로그인'}
      </button>

      {error && <p>{error}</p>}
    </div>
  )
}

export default Login