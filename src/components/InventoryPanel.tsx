import { useQuery } from '@tanstack/react-query'
import { fetchConsumables } from '../api'

function statusClass(status: string) {
  const s = status.toLowerCase()
  if (s.includes('low')) return 'status-low'
  if (s.includes('adequate') || s.includes('ok') || s.includes('good')) return 'status-ok'
  return 'status-neutral'
}

function InventoryPanel() {
  const { data: items, isLoading, error } = useQuery({
    queryKey: ['consumables'],
    queryFn: fetchConsumables,
  })

  if (isLoading) return <p className="loading-text">Loading inventory...</p>
  if (error) return <p className="loading-text">Failed to load inventory.</p>

  return (
    <div className="inventory-panel">
      <h3>System Inventory Monitor</h3>
      <div className="inventory-list">
        {items?.map((item) => (
          <div key={item.item_id} className="inventory-row">
            <span className="inventory-name">{item.consumable_item_name}</span>
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