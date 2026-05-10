import React, { useState, useMemo } from 'react'
import {
  ChakraProvider, Box, Input, Badge, Flex, Button, Text, Select,
  Table, Thead, Tbody, Tr, Th, Td, TableContainer,
} from '@chakra-ui/react'
import {
  useReactTable, getCoreRowModel, getFilteredRowModel,
  getSortedRowModel, getPaginationRowModel, createColumnHelper, flexRender,
} from '@tanstack/react-table'
import type { SortingState } from '@tanstack/react-table'
import { users } from '../data'
import type { User } from '../data'

const roles = [...new Set(users.map((d) => d.role))]
const columnHelper = createColumnHelper<User>()
const columns = [
  columnHelper.accessor('name',       { header: '名前' }),
  columnHelper.accessor('age',        { header: '年齢' }),
  columnHelper.accessor('role',       { header: '役割' }),
  columnHelper.accessor('department', { header: '部署' }),
  columnHelper.accessor('status',     { header: 'ステータス' }),
]

function TableContent() {
  const [globalFilter, setGlobalFilter] = useState('')
  const [roleFilter, setRoleFilter] = useState('')
  const [sorting, setSorting] = useState<SortingState>([])

  const filtered = useMemo(
    () => roleFilter ? users.filter((d) => d.role === roleFilter) : users,
    [roleFilter]
  )

  const table = useReactTable({
    data: filtered, columns,
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
    <Box p={6}>
      <Flex gap={3} mb={4}>
        <Input placeholder="全カラム横断検索..." value={globalFilter} onChange={(e) => setGlobalFilter(e.target.value)} maxW={280} />
        <Select placeholder="役割で絞り込み" value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} maxW={200}>
          {roles.map((r) => <option key={r} value={r}>{r}</option>)}
        </Select>
      </Flex>
      <TableContainer>
        <Table variant="simple" size="sm">
          <Thead>
            {table.getHeaderGroups().map((hg) => (
              <Tr key={hg.id}>
                {hg.headers.map((h) => (
                  <Th key={h.id} cursor="pointer" onClick={h.column.getToggleSortingHandler()}>
                    {flexRender(h.column.columnDef.header, h.getContext())}
                    {h.column.getIsSorted() === 'asc' ? ' ↑' : h.column.getIsSorted() === 'desc' ? ' ↓' : ''}
                  </Th>
                ))}
              </Tr>
            ))}
          </Thead>
          <Tbody>
            {table.getRowModel().rows.map((row) => (
              <Tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <Td key={cell.id}>
                    {cell.column.id === 'status'
                      ? <Badge colorScheme={cell.getValue() === 'active' ? 'green' : 'gray'}>{String(cell.getValue())}</Badge>
                      : flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </Td>
                ))}
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
      <Flex align="center" gap={3} mt={4}>
        <Button size="sm" onClick={() => table.previousPage()} isDisabled={!table.getCanPreviousPage()}>前へ</Button>
        <Text fontSize="sm" color="gray.600">{table.getState().pagination.pageIndex + 1} / {table.getPageCount()} ページ</Text>
        <Button size="sm" onClick={() => table.nextPage()} isDisabled={!table.getCanNextPage()}>次へ</Button>
      </Flex>
    </Box>
  )
}

export default function ChakraDemo() {
  return (
    <ChakraProvider>
      <TableContent />
    </ChakraProvider>
  )
}
