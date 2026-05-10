import React, { useState } from 'react'
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  createColumnHelper,
  flexRender,
} from '@tanstack/react-table'
import type { SortingState, ColumnFiltersState } from '@tanstack/react-table'

// TanStack Table（headless）: UIは完全自前実装
// フィルタリングロジックはすべてライブラリが担い、UIは自由に組める

type User = {
  id: number
  name: string
  age: number
  role: string
  department: string
  status: 'active' | 'inactive'
}

const data: User[] = [
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

const columnHelper = createColumnHelper<User>()
const columns = [
  columnHelper.accessor('name',       { header: '名前',       enableColumnFilter: true }),
  columnHelper.accessor('age',        { header: '年齢',       enableColumnFilter: false }),
  columnHelper.accessor('role',       { header: '役割',       enableColumnFilter: true }),
  columnHelper.accessor('department', { header: '部署',       enableColumnFilter: true }),
  columnHelper.accessor('status',     { header: 'ステータス', enableColumnFilter: true }),
]

export default function App() {
  const [globalFilter, setGlobalFilter] = useState('')
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [sorting, setSorting] = useState<SortingState>([])

  const table = useReactTable({
    data,
    columns,
    state: { globalFilter, columnFilters, sorting },
    onGlobalFilterChange: setGlobalFilter,
    onColumnFiltersChange: setColumnFilters,
    onSortingChange: setSorting,
    globalFilterFn: 'includesString',
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 5 } },
  })

  return (
    <div style={{ padding: 24, fontFamily: 'sans-serif', fontSize: 14 }}>
      <input
        style={{
          padding: '6px 12px', border: '1px solid #d1d5db', borderRadius: 6,
          marginBottom: 16, width: 280, outline: 'none',
        }}
        placeholder="グローバル検索（全カラム対象）..."
        value={globalFilter}
        onChange={(e) => setGlobalFilter(e.target.value)}
      />

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          {table.getHeaderGroups().map((hg) => (
            <tr key={hg.id}>
              {hg.headers.map((header) => (
                <th
                  key={header.id}
                  style={{
                    textAlign: 'left', padding: '8px 12px',
                    background: '#f9fafb', borderBottom: '2px solid #e5e7eb',
                  }}
                >
                  <div
                    style={{ cursor: 'pointer', userSelect: 'none', marginBottom: 4 }}
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    {flexRender(header.column.columnDef.header, header.getContext())}
                    {header.column.getIsSorted() === 'asc'  ? ' ↑' :
                     header.column.getIsSorted() === 'desc' ? ' ↓' : ' ↕'}
                  </div>
                  {header.column.getCanFilter() && (
                    <input
                      style={{
                        width: '90%', padding: '3px 6px', fontSize: 12,
                        border: '1px solid #d1d5db', borderRadius: 4,
                      }}
                      placeholder={`${flexRender(header.column.columnDef.header, header.getContext())}で絞込`}
                      value={String(header.column.getFilterValue() ?? '')}
                      onChange={(e) => header.column.setFilterValue(e.target.value)}
                    />
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
              {row.getVisibleCells().map((cell) => {
                const val = cell.getValue()
                return (
                  <td key={cell.id} style={{ padding: '9px 12px' }}>
                    {cell.column.id === 'status' ? (
                      <span style={{
                        padding: '2px 8px', borderRadius: 9999, fontSize: 12,
                        background: val === 'active' ? '#dcfce7' : '#f3f4f6',
                        color:      val === 'active' ? '#15803d' : '#6b7280',
                      }}>
                        {String(val)}
                      </span>
                    ) : flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 16 }}>
        <button
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          style={{ padding: '4px 12px', borderRadius: 6, border: '1px solid #d1d5db', cursor: 'pointer' }}
        >
          前へ
        </button>
        <span style={{ color: '#6b7280', fontSize: 13 }}>
          {table.getState().pagination.pageIndex + 1} / {table.getPageCount()} ページ
          （{table.getFilteredRowModel().rows.length} 件）
        </span>
        <button
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          style={{ padding: '4px 12px', borderRadius: 6, border: '1px solid #d1d5db', cursor: 'pointer' }}
        >
          次へ
        </button>
      </div>
    </div>
  )
}
