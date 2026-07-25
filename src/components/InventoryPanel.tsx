import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { fetchConsumables, fetchSpares } from '../api'

function statusClass(status: string) {
  const s = status.toLowerCase()
  if (s.includes('low') || s.includes('due') || s.includes('critical')) return 'status-low'
  if (s.includes('adequate') || s.includes('ok') || s.includes('good')) return 'status-ok'
  return 'status-neutral'
}

function InventoryPanel() {
  const [tab, setTab] = useState<'consumables' | 'spares'>('consumables')

  const { data: consumables, isLoading: loadingConsumables } = useQuery({
    queryKey: ['consumables'],
    queryFn: fetchConsumables,
    enabled: tab === 'consumables',
  })

  const { data: spares, isLoading: loadingSpares } = useQuery({
    queryKey: ['spares'],
    queryFn: fetchSpares,
    enabled: tab === 'spares',
  })

  return (
    <div className="inventory-panel">
      <h3>System Inventory Monitor</h3>
      <div className="inventory-tabs">
        <button
          className={tab === 'consumables' ? 'tab-active' : ''}
          onClick={() => setTab('consumables')}
        >
          Consumables
        </button>
        <button
          className={tab === 'spares' ? 'tab-active' : ''}
          onClick={() => setTab('spares')}
        >
          Spares
        </button>
      </div>

      <div className="inventory-list">
        {tab === 'consumables' && loadingConsumables && <p className="loading-text">Loading...</p>}
        {tab === 'consumables' &&
          consumables?.map((item) => (
            <div key={item.item_id} className="inventory-row">
              <span className="inventory-name">{item.consumable_item_name}</span>
              <span className={`inventory-status ${statusClass(item.status)}`}>
                {item.status}
              </span>
            </div>
          ))}

        {tab === 'spares' && loadingSpares && <p className="loading-text">Loading...</p>}
        {tab === 'spares' &&
          spares?.map((item) => (
            <div key={item.spare_id} className="inventory-row">
              <span className="inventory-name">
                {item.spare_item_name}
                {item.months_remaining !== null && (
                  <span className="inventory-sub"> ({item.months_remaining}mo left)</span>
                )}
              </span>
              <span className={`inventory-status ${statusClass(item.status)}`}>
                {item.status}
              </span>
            </div>
          ))}
      </div>
    </div>
  )
}

export default InventoryPanel