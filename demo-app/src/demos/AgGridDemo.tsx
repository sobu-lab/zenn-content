import React, { useState, useRef } from 'react'
import { AgGridReact } from 'ag-grid-react'
import type { ColDef, GridReadyEvent } from 'ag-grid-community'
import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community'
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-quartz.css'
import { users } from '../data'
import type { User } from '../data'

ModuleRegistry.registerModules([AllCommunityModule])

const columnDefs: ColDef<User>[] = [
  { field: 'name',       headerName: '名前',       filter: 'agTextColumnFilter',   floatingFilter: true },
  { field: 'age',        headerName: '年齢',       filter: 'agNumberColumnFilter', floatingFilter: true, width: 100 },
  { field: 'role',       headerName: '役割',       filter: 'agSetColumnFilter',    floatingFilter: true },
  { field: 'department', headerName: '部署',       filter: 'agSetColumnFilter',    floatingFilter: true },
  {
    field: 'status', headerName: 'ステータス', filter: 'agSetColumnFilter', floatingFilter: true,
    cellRenderer: (params: { value: string }) => {
      const isActive = params.value === 'active'
      return `<span style="padding:2px 8px;border-radius:9999px;font-size:12px;background:${isActive ? '#dcfce7' : '#f3f4f6'};color:${isActive ? '#15803d' : '#6b7280'}">${params.value}</span>`
    },
  },
]

export default function AgGridDemo() {
  const gridRef = useRef<AgGridReact>(null)
  const [quickFilter, setQuickFilter] = useState('')

  return (
    <div style={{ padding: 24 }}>
      <input
        style={{ padding: '6px 12px', border: '1px solid #d1d5db', borderRadius: 6, marginBottom: 12, width: 280, outline: 'none' }}
        placeholder="クイック検索（全カラム対象）..."
        value={quickFilter}
        onChange={(e) => setQuickFilter(e.target.value)}
      />
      <div className="ag-theme-quartz" style={{ height: 440 }}>
        <AgGridReact
          ref={gridRef}
          rowData={users}
          columnDefs={columnDefs}
          quickFilterText={quickFilter}
          pagination
          paginationPageSize={5}
          paginationPageSizeSelector={[5, 10, 15]}
          onGridReady={(_params: GridReadyEvent) => gridRef.current?.api.sizeColumnsToFit()}
          defaultColDef={{ sortable: true, resizable: true }}
        />
      </div>
    </div>
  )
}
