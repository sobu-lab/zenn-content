import React, { useState } from 'react'
import {
  useReactTable, getCoreRowModel, getFilteredRowModel,
  getSortedRowModel, getPaginationRowModel, createColumnHelper, flexRender,
} from '@tanstack/react-table'
import type { SortingState } from '@tanstack/react-table'
import { users } from '../data'
import type { User } from '../data'

const columnHelper = createColumnHelper<User>()
const columns = [
  columnHelper.accessor('name',       { header: '名前' }),
  columnHelper.accessor('age',        { header: '年齢' }),
  columnHelper.accessor('role',       { header: '役割' }),
  columnHelper.accessor('department', { header: '部署' }),
  columnHelper.accessor('status',     { header: 'ステータス' }),
]

const s = {
  input: { padding: '6px 12px', border: '1px solid #e2e8f0', borderRadius: 6, outline: 'none', width: 280, marginBottom: 16 } as const,
  table: { width: '100%', borderCollapse: 'collapse' as const },
  th: { textAlign: 'left' as const, padding: '10px 12px', borderBottom: '1px solid #e2e8f0', fontWeight: 500, color: '#374151', cursor: 'pointer', userSelect: 'none' as const },
  td: { padding: '10px 12px', borderBottom: '1px solid #f1f5f9' },
  badge: (s: string) => ({ display: 'inline-block', padding: '2px 8px', borderRadius: 9999, fontSize: 12, fontWeight: 500, background: s === 'active' ? '#dcfce7' : '#f1f5f9', color: s === 'active' ? '#16a34a' : '#6b7280' }),
  btn: (disabled: boolean) => ({ padding: '4px 12px', border: '1px solid #e2e8f0', borderRadius: 6, background: disabled ? '#f8fafc' : 'white', cursor: disabled ? 'default' : 'pointer', color: disabled ? '#94a3b8' : '#374151' }),
}

export default function ShadcnDemo() {
  const [globalFilter, setGlobalFilter] = useState('')
  const [sorting, setSorting] = useState<SortingState>([])

  const table = useReactTable({
    data: users, columns,
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

  return (
    <div style={{ padding: 24, fontFamily: 'sans-serif', fontSize: 14 }}>
      <input
        style={s.input} placeholder="全カラム横断検索..."
        value={globalFilter} onChange={(e) => setGlobalFilter(e.target.value)}
      />
      <table style={s.table}>
        <thead>
          {table.getHeaderGroups().map((hg) => (
            <tr key={hg.id}>
              {hg.headers.map((h) => (
                <th key={h.id} style={s.th} onClick={h.column.getToggleSortingHandler()}>
                  {flexRender(h.column.columnDef.header, h.getContext())}
                  {h.column.getIsSorted() === 'asc' ? ' ↑' : h.column.getIsSorted() === 'desc' ? ' ↓' : ' ↕'}
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
                  {cell.column.id === 'status'
                    ? <span style={s.badge(String(cell.getValue()))}>{String(cell.getValue())}</span>
                    : flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 16 }}>
        <button style={s.btn(!table.getCanPreviousPage())} onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>前へ</button>
        <span style={{ color: '#6b7280', fontSize: 13 }}>{table.getState().pagination.pageIndex + 1} / {table.getPageCount()} ページ</span>
        <button style={s.btn(!table.getCanNextPage())} onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>次へ</button>
      </div>
    </div>
  )
}
