import React, { useState, useRef } from 'react'
import { AgGridReact } from 'ag-grid-react'
import type { ColDef, GridReadyEvent } from 'ag-grid-community'
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-quartz.css'

type User = {
  id: number
  name: string
  age: number
  role: string
  department: string
  status: string
}

const rowData: User[] = [
  { id: 1,  name: '田中 太郎',   age: 28, role: 'エンジニア', department: '開発',     status: 'active'   },
  { id: 2,  name: '鈴木 花子',   age: 34, role: 'デザイナー', department: 'デザイン', status: 'inactive' },
  { id: 3,  name: '山田 次郎',   age: 25, role: 'マーケター', department: 'マーケ',   status: 'active'   },
  { id: 4,  name: '佐藤 美咲',   age: 41, role: 'PM',         department: '企画',     status: 'active'   },
  { id: 5,  name: '高橋 健一',   age: 29, role: 'エンジニア', department: 'インフラ', status: 'inactive' },
  { id: 6,  name: '伊藤 陽子',   age: 36, role: 'デザイナー', department: 'デザイン', status: 'active'   },
  { id: 7,  name: '渡辺 浩二',   age: 31, role: 'エンジニア', department: '開発',     status: 'active'   },
  { id: 8,  name: '中村 さくら', age: 27, role: 'マーケター', department: 'マーケ',   status: 'inactive' },
  { id: 9,  name: '小林 大輔',   age: 45, role: 'PM',         department: '企画',     status: 'active'   },
  { id: 10, name: '加藤 裕子',   age: 33, role: 'エンジニア', department: '開発',     status: 'active'   },
  { id: 11, name: '吉田 拓也',   age: 38, role: 'デザイナー', department: 'デザイン', status: 'active'   },
  { id: 12, name: '山本 愛',     age: 22, role: 'エンジニア', department: 'インフラ', status: 'inactive' },
  { id: 13, name: '松本 信二',   age: 44, role: 'PM',         department: '企画',     status: 'active'   },
  { id: 14, name: '井上 恵子',   age: 30, role: 'マーケター', department: 'マーケ',   status: 'active'   },
  { id: 15, name: '木村 隆司',   age: 26, role: 'エンジニア', department: '開発',     status: 'inactive' },
]

const columnDefs: ColDef<User>[] = [
  {
    field: 'name',
    headerName: '名前',
    filter: 'agTextColumnFilter',
    floatingFilter: true,
  },
  {
    field: 'age',
    headerName: '年齢',
    filter: 'agNumberColumnFilter',
    floatingFilter: true,
    width: 100,
  },
  {
    field: 'role',
    headerName: '役割',
    filter: 'agSetColumnFilter',   // enum に最適：チェックボックスで複数選択
    floatingFilter: true,
  },
  {
    field: 'department',
    headerName: '部署',
    filter: 'agSetColumnFilter',
    floatingFilter: true,
  },
  {
    field: 'status',
    headerName: 'ステータス',
    filter: 'agSetColumnFilter',
    floatingFilter: true,
    cellRenderer: (params: { value: string }) => {
      const isActive = params.value === 'active'
      return `<span style="
        padding: 2px 8px; border-radius: 9999px; font-size: 12px;
        background: ${isActive ? '#dcfce7' : '#f3f4f6'};
        color: ${isActive ? '#15803d' : '#6b7280'};
      ">${params.value}</span>`
    },
  },
]

export default function App() {
  const gridRef = useRef<AgGridReact>(null)
  const [quickFilter, setQuickFilter] = useState('')

  const onGridReady = (_params: GridReadyEvent) => {
    gridRef.current?.api.sizeColumnsToFit()
  }

  return (
    <div style={{ padding: 24 }}>
      <input
        style={{
          padding: '6px 12px', border: '1px solid #d1d5db', borderRadius: 6,
          marginBottom: 12, width: 280, outline: 'none',
        }}
        placeholder="クイック検索（全カラム対象）..."
        value={quickFilter}
        onChange={(e) => setQuickFilter(e.target.value)}
      />
      <div
        className="ag-theme-quartz"
        style={{ height: 460 }}
      >
        <AgGridReact
          ref={gridRef}
          rowData={rowData}
          columnDefs={columnDefs}
          quickFilterText={quickFilter}
          pagination
          paginationPageSize={5}
          paginationPageSizeSelector={[5, 10, 15]}
          onGridReady={onGridReady}
          defaultColDef={{ sortable: true, resizable: true }}
        />
      </div>
    </div>
  )
}
