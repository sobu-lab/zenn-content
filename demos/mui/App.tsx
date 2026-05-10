import React from 'react'
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import { DataGrid, GridToolbar } from '@mui/x-data-grid'
import type { GridColDef } from '@mui/x-data-grid'

type User = {
  id: number
  name: string
  age: number
  role: string
  department: string
  status: string
}

const rows: User[] = [
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

const columns: GridColDef[] = [
  { field: 'name',       headerName: '名前',       width: 150 },
  { field: 'age',        headerName: '年齢',       width: 80,  type: 'number' },
  { field: 'role',       headerName: '役割',       width: 130 },
  { field: 'department', headerName: '部署',       width: 110 },
  {
    field: 'status',
    headerName: 'ステータス',
    width: 130,
    renderCell: (params) => (
      <Chip
        label={params.value}
        color={params.value === 'active' ? 'success' : 'default'}
        size="small"
      />
    ),
  },
]

export default function App() {
  return (
    <Box sx={{ height: 480, p: 3 }}>
      {/* ※ 複数条件フィルター（AND/OR）は Pro が必要 */}
      <DataGrid
        rows={rows}
        columns={columns}
        slots={{ toolbar: GridToolbar }}
        slotProps={{ toolbar: { showQuickFilter: true } }}
        initialState={{
          pagination: { paginationModel: { pageSize: 5 } },
        }}
        pageSizeOptions={[5, 10]}
        disableRowSelectionOnClick
      />
    </Box>
  )
}
