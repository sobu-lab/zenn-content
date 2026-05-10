import React, { useState } from 'react'
import { Table, Input, Space, Badge } from 'antd'
import type { TableColumnsType } from 'antd'
import 'antd/dist/reset.css'
import { users } from '../data'
import type { User } from '../data'

const uniqueFilters = (key: keyof User) =>
  [...new Set(users.map((d) => d[key]))].map((v) => ({ text: String(v), value: v }))

export default function AntdDemo() {
  const [search, setSearch] = useState('')

  const filtered = users.filter(
    (row) =>
      search === '' ||
      Object.values(row).some((v) =>
        String(v).toLowerCase().includes(search.toLowerCase())
      )
  )

  const columns: TableColumnsType<User> = [
    { title: '名前', dataIndex: 'name', sorter: (a, b) => a.name.localeCompare(b.name) },
    { title: '年齢', dataIndex: 'age',  sorter: (a, b) => a.age - b.age },
    {
      title: '役割', dataIndex: 'role',
      filters: uniqueFilters('role'), filterSearch: true,
      onFilter: (value, record) => record.role === value,
    },
    {
      title: '部署', dataIndex: 'department',
      filters: uniqueFilters('department'),
      onFilter: (value, record) => record.department === value,
    },
    {
      title: 'ステータス', dataIndex: 'status',
      filters: [{ text: 'Active', value: 'active' }, { text: 'Inactive', value: 'inactive' }],
      onFilter: (value, record) => record.status === value,
      render: (s: string) => <Badge status={s === 'active' ? 'success' : 'default'} text={s} />,
    },
  ]

  return (
    <div style={{ padding: 24 }}>
      <Space direction="vertical" style={{ width: '100%' }}>
        <Input.Search
          placeholder="全カラム横断検索"
          allowClear
          onChange={(e) => setSearch(e.target.value)}
          style={{ width: 300 }}
        />
        <Table
          columns={columns}
          dataSource={filtered.map((d) => ({ ...d, key: d.id }))}
          pagination={{ pageSize: 5, showTotal: (total) => `全 ${total} 件` }}
          size="middle"
        />
      </Space>
    </div>
  )
}
