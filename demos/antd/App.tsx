import React, { useState } from 'react'
import { Table, Input, Space, Badge } from 'antd'
import type { TableColumnsType } from 'antd'
import 'antd/dist/reset.css'

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

const uniqueFilters = (key: keyof User) =>
  [...new Set(data.map((d) => d[key]))].map((v) => ({ text: String(v), value: v }))

export default function App() {
  const [search, setSearch] = useState('')

  const filtered = data.filter(
    (row) =>
      search === '' ||
      Object.values(row).some((v) =>
        String(v).toLowerCase().includes(search.toLowerCase())
      )
  )

  const columns: TableColumnsType<User> = [
    {
      title: '名前',
      dataIndex: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: '年齢',
      dataIndex: 'age',
      sorter: (a, b) => a.age - b.age,
    },
    {
      title: '役割',
      dataIndex: 'role',
      filters: uniqueFilters('role'),
      filterSearch: true,
      onFilter: (value, record) => record.role === value,
    },
    {
      title: '部署',
      dataIndex: 'department',
      filters: uniqueFilters('department'),
      onFilter: (value, record) => record.department === value,
    },
    {
      title: 'ステータス',
      dataIndex: 'status',
      filters: [
        { text: 'Active',   value: 'active'   },
        { text: 'Inactive', value: 'inactive' },
      ],
      onFilter: (value, record) => record.status === value,
      render: (status: string) => (
        <Badge
          status={status === 'active' ? 'success' : 'default'}
          text={status}
        />
      ),
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
