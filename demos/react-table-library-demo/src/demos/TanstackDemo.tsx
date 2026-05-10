import React, { useState } from 'react'
import {
  useReactTable, getCoreRowModel, getFilteredRowModel,
  getSortedRowModel, getPaginationRowModel, createColumnHelper, flexRender,
} from '@tanstack/react-table'
import type { SortingState, ColumnFiltersState } from '@tanstack/react-table'
import { users } from '../data'
import type { User } from '../data'

const columnHelper = createColumnHelper<User>()
const columns = [
  columnHelper.accessor('name',       { header: '名前',       enableColumnFilter: true }),
  columnHelper.accessor('age',        { header: '年齢',       enableColumnFilter: false }),
  columnHelper.accessor('role',       { header: '役割',       enableColumnFilter: true }),
  columnHelper.accessor('department', { header: '部署',       enableColumnFilter: true }),
  columnHelper.accessor('status',     { header: 'ステータス', enableColumnFilter: true }),
]

export default function TanstackDemo() {
  const [globalFilter, setGlobalFilter] = useState('')
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [sorting, setSorting] = useState<SortingState>([])

  const table = useReactTable({
    data: users, columns,
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
        style={{ padding: '6px 12px', border: '1px solid #d1d5db', borderRadius: 6, marginBottom: 16, width: 280, outline: 'none' }}
        placeholder="グローバル検索（全カラム対象）..."
        value={globalFilter}
        onChange={(e) => setGlobalFilter(e.target.value)}
      />
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          {table.getHeaderGroups().map((hg) => (
            <tr key={hg.id}>
              {hg.headers.map((h) => (
                <th key={h.id} style={{ textAlign: 'left', padding: '8px 12px', background: '#f9fafb', borderBottom: '2px solid #e5e7eb' }}>
                  <div style={{ cursor: 'pointer', userSelect: 'none', marginBottom: 4 }} onClick={h.column.getToggleSortingHandler()}>
                    {flexRender(h.column.columnDef.header, h.getContext())}
                    {h.column.getIsSorted() === 'asc' ? ' ↑' : h.column.getIsSorted() === 'desc' ? ' ↓' : ' ↕'}
                  </div>
                  {h.column.getCanFilter() && (
                    <input
                      style={{ width: '90%', padding: '3px 6px', fontSize: 12, border: '1px solid #d1d5db', borderRadius: 4 }}
                      placeholder="絞込..."
                      value={String(h.column.getFilterValue() ?? '')}
                      onChange={(e) => h.column.setFilterValue(e.target.value)}
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
                    {cell.column.id === 'status'
                      ? <span style={{ padding: '2px 8px', borderRadius: 9999, fontSize: 12, background: val === 'active' ? '#dcfce7' : '#f3f4f6', color: val === 'active' ? '#15803d' : '#6b7280' }}>{String(val)}</span>
                      : flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 16 }}>
        <button onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()} style={{ padding: '4px 12px', borderRadius: 6, border: '1px solid #d1d5db', cursor: 'pointer' }}>前へ</button>
        <span style={{ color: '#6b7280', fontSize: 13 }}>{table.getState().pagination.pageIndex + 1} / {table.getPageCount()} ページ（{table.getFilteredRowModel().rows.length} 件）</span>
        <button onClick={() => table.nextPage()} disabled={!table.getCanNextPage()} style={{ padding: '4px 12px', borderRadius: 6, border: '1px solid #d1d5db', cursor: 'pointer' }}>次へ</button>
      </div>
    </div>
  )
}
