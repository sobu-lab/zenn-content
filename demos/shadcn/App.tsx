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
import type { SortingState } from '@tanstack/react-table'

// shadcn/ui の DataTable パターン（TanStack Table + shadcn/ui スタイル）
// 実際のプロジェクトでは shadcn/ui の Table コンポーネントを使う
// このデモでは同等のスタイルを inline CSS で再現

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
  columnHelper.accessor('name',       { header: '名前',       enableSorting: true }),
  columnHelper.accessor('age',        { header: '年齢',       enableSorting: true }),
  columnHelper.accessor('role',       { header: '役割',       enableSorting: true }),
  columnHelper.accessor('department', { header: '部署',       enableSorting: true }),
  columnHelper.accessor('status',     { header: 'ステータス', enableSorting: true }),
]

const s = {
  container: { padding: 24, fontFamily: 'sans-serif', fontSize: 14 } as const,
  input: {
    padding: '6px 12px', border: '1px solid #e2e8f0', borderRadius: 6,
    outline: 'none', marginBottom: 16, width: 280,
  } as const,
  table: { width: '100%', borderCollapse: 'collapse' as const },
  th: {
    textAlign: 'left' as const, padding: '10px 12px',
    borderBottom: '1px solid #e2e8f0', fontWeight: 500,
    color: '#374151', cursor: 'pointer', userSelect: 'none' as const,
    whiteSpace: 'nowrap' as const,
  },
  td: { padding: '10px 12px', borderBottom: '1px solid #f1f5f9' },
  badge: (status: string) => ({
    display: 'inline-block', padding: '2px 8px', borderRadius: 9999,
    fontSize: 12, fontWeight: 500,
    background: status === 'active' ? '#dcfce7' : '#f1f5f9',
    color:      status === 'active' ? '#16a34a' : '#6b7280',
  }),
  pagination: { display: 'flex', alignItems: 'center', gap: 8, marginTop: 16 } as const,
  btn: (disabled: boolean) => ({
    padding: '4px 12px', border: '1px solid #e2e8f0', borderRadius: 6,
    background: disabled ? '#f8fafc' : 'white', cursor: disabled ? 'default' : 'pointer',
    color: disabled ? '#94a3b8' : '#374151',
  }),
}

export default function App() {
  const [globalFilter, setGlobalFilter] = useState('')
  const [sorting, setSorting] = useState<SortingState>([])

  const table = useReactTable({
    data,
    columns,
    state: { globalFilter, sorting },
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    globalFilterFn: 'includesString',
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 5 } },
  })

  const sortIcon = (id: string) => {
    const col = table.getColumn(id)
    if (!col) return ''
    return col.getIsSorted() === 'asc' ? ' ↑' : col.getIsSorted() === 'desc' ? ' ↓' : ' ↕'
  }

  return (
    <div style={s.container}>
      <input
        style={s.input}
        placeholder="全カラム横断検索..."
        value={globalFilter}
        onChange={(e) => setGlobalFilter(e.target.value)}
      />
      <table style={s.table}>
        <thead>
          {table.getHeaderGroups().map((hg) => (
            <tr key={hg.id}>
              {hg.headers.map((header) => (
                <th
                  key={header.id}
                  style={s.th}
                  onClick={header.column.getToggleSortingHandler()}
                >
                  {flexRender(header.column.columnDef.header, header.getContext())}
                  {sortIcon(header.id)}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} style={s.td}>
                  {cell.column.id === 'status' ? (
                    <span style={s.badge(String(cell.getValue()))}>
                      {String(cell.getValue())}
                    </span>
                  ) : (
                    flexRender(cell.column.columnDef.cell, cell.getContext())
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div style={s.pagination}>
        <button
          style={s.btn(!table.getCanPreviousPage())}
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          前へ
        </button>
        <span style={{ color: '#6b7280' }}>
          {table.getState().pagination.pageIndex + 1} / {table.getPageCount()} ページ
        </span>
        <button
          style={s.btn(!table.getCanNextPage())}
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          次へ
        </button>
      </div>
    </div>
  )
}
