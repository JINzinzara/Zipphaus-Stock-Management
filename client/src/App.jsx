import { useState } from 'react'
import Login from './pages/Login'
import Inventory from './pages/Inventory'
import InventoryHistory from './pages/InventoryHistory'
import Order from './pages/Order'
import OrderHistory from './pages/OrderHistory'

const STAFF_TABS = ['Inventory', 'Inventory History', 'Order', 'Order History']
const MANAGER_TABS = [...STAFF_TABS, 'Manager Overview']

function App() {
  const [user, setUser] = useState(null)
  const [activeTab, setActiveTab] = useState('Inventory')

  if (!user) {
    return <Login onLogin={setUser} />
  }

  const tabs = user.role === 'manager' ? MANAGER_TABS : STAFF_TABS

  const renderPage = () => {
    switch (activeTab) {
      case 'Inventory': return <Inventory />
      case 'Inventory History': return <InventoryHistory />
      case 'Order': return <Order />
      case 'Order History': return <OrderHistory />
      default: return <h2>Manager Overview</h2>
    }
  }

  return (
    <div>
      <p>{user.name} ({user.role})</p>
      <button onClick={() => setUser(null)}>로그아웃</button>

      <nav>
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </nav>

      {renderPage()}
    </div>
  )
}

export default App