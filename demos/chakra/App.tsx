import React, { useState } from 'react'
import {
  ChakraProvider,
  Box,
  Input,
  Badge,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Flex,
  Button,
  Text,
  Select,
} from '@chakra-ui/react'
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

const roles = [...new Set(data.map((d) => d.role))]

const columnHelper = createColumnHelper<User>()
const columns = [
  columnHelper.accessor('name',       { header: '名前' }),
  columnHelper.accessor('age',        { header: '年齢' }),
  columnHelper.accessor('role',       { header: '役割' }),
  columnHelper.accessor('department', { header: '部署' }),
  columnHelper.accessor('status',     { header: 'ステータス' }),
]

function DataTable() {
  const [globalFilter, setGlobalFilter] = useState('')
  const [roleFilter, setRoleFilter] = useState('')
  const [sorting, setSorting] = useState<SortingState>([])

  const filtered = roleFilter ? data.filter((d) => d.role === roleFilter) : data

  const table = useReactTable({
    data: filtered,
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

  return (
    <Box p={6}>
      <Flex gap={3} mb={4}>
        <Input
          placeholder="全カラム横断検索..."
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          maxW={280}
        />
        <Select
          placeholder="役割で絞り込み"
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          maxW={200}
        >
          {roles.map((r) => (
            <option key={r} value={r}>{r}</option>
          ))}
        </Select>
      </Flex>

      <TableContainer>
        <Table variant="simple" size="sm">
          <Thead>
            {table.getHeaderGroups().map((hg) => (
              <Tr key={hg.id}>
                {hg.headers.map((header) => (
                  <Th
                    key={header.id}
                    cursor="pointer"
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    {flexRender(header.column.columnDef.header, header.getContext())}
                    {header.column.getIsSorted() === 'asc'  ? ' ↑' :
                     header.column.getIsSorted() === 'desc' ? ' ↓' : ''}
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
                    {cell.column.id === 'status' ? (
                      <Badge colorScheme={cell.getValue() === 'active' ? 'green' : 'gray'}>
                        {String(cell.getValue())}
                      </Badge>
                    ) : (
                      flexRender(cell.column.columnDef.cell, cell.getContext())
                    )}
                  </Td>
                ))}
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>

      <Flex align="center" gap={3} mt={4}>
        <Button
          size="sm"
          onClick={() => table.previousPage()}
          isDisabled={!table.getCanPreviousPage()}
        >
          前へ
        </Button>
        <Text fontSize="sm" color="gray.600">
          {table.getState().pagination.pageIndex + 1} / {table.getPageCount()} ページ
        </Text>
        <Button
          size="sm"
          onClick={() => table.nextPage()}
          isDisabled={!table.getCanNextPage()}
        >
          次へ
        </Button>
      </Flex>
    </Box>
  )
}

export default function App() {
  return (
    <ChakraProvider>
      <DataTable />
    </ChakraProvider>
  )
}
