import React from 'react'
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import { DataGrid, GridToolbar } from '@mui/x-data-grid'
import type { GridColDef } from '@mui/x-data-grid'
import { users } from '../data'

const columns: GridColDef[] = [
  { field: 'name',       headerName: '名前',       width: 150 },
  { field: 'age',        headerName: '年齢',       width: 80,  type: 'number' },
  { field: 'role',       headerName: '役割',       width: 130 },
  { field: 'department', headerName: '部署',       width: 110 },
  {
    field: 'status', headerName: 'ステータス', width: 130,
    renderCell: (params) => (
      <Chip
        label={params.value}
        color={params.value === 'active' ? 'success' : 'default'}
        size="small"
      />
    ),
  },
]

export default function MuiDemo() {
  return (
    <Box sx={{ height: 480, p: 3 }}>
      <DataGrid
        rows={users}
        columns={columns}
        slots={{ toolbar: GridToolbar }}
        slotProps={{ toolbar: { showQuickFilter: true } }}
        initialState={{ pagination: { paginationModel: { pageSize: 5 } } }}
        pageSizeOptions={[5, 10]}
        disableRowSelectionOnClick
      />
    </Box>
  )
}
