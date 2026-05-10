import React, { Suspense, useState, lazy } from 'react'

const AntdDemo     = lazy(() => import('./demos/AntdDemo'))
const MuiDemo      = lazy(() => import('./demos/MuiDemo'))
const ShadcnDemo   = lazy(() => import('./demos/ShadcnDemo'))
const ChakraDemo   = lazy(() => import('./demos/ChakraDemo'))
const TanstackDemo = lazy(() => import('./demos/TanstackDemo'))
const AgGridDemo   = lazy(() => import('./demos/AgGridDemo'))

const tabs = [
  { label: 'Ant Design',     component: AntdDemo     },
  { label: 'MUI DataGrid',   component: MuiDemo      },
  { label: 'shadcn/ui',      component: ShadcnDemo   },
  { label: 'Chakra UI',      component: ChakraDemo   },
  { label: 'TanStack Table', component: TanstackDemo },
  { label: 'AG Grid',        component: AgGridDemo   },
]

export default function App() {
  const [active, setActive] = useState(0)
  const Demo = tabs[active].component

  return (
    <div style={{ fontFamily: 'sans-serif', minHeight: '100vh' }}>
      <div style={{ background: '#1e293b', padding: '12px 24px', display: 'flex', alignItems: 'center', gap: 16 }}>
        <a href="/zenn-content/" style={{ color: '#94a3b8', fontSize: 13, textDecoration: 'none' }}>← 一覧へ</a>
        <h1 style={{ color: 'white', margin: 0, fontSize: 17, fontWeight: 600 }}>React Table Library Demo</h1>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', borderBottom: '1px solid #e2e8f0', background: '#f8fafc', padding: '0 16px' }}>
        {tabs.map((tab, i) => (
          <button
            key={tab.label}
            onClick={() => setActive(i)}
            style={{
              padding: '10px 16px', border: 'none', background: 'none', cursor: 'pointer', fontSize: 13,
              borderBottom: active === i ? '2px solid #3b82f6' : '2px solid transparent',
              color: active === i ? '#3b82f6' : '#64748b',
              fontWeight: active === i ? 600 : 400,
              marginBottom: -1, whiteSpace: 'nowrap',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <Suspense fallback={<div style={{ padding: 40, textAlign: 'center', color: '#94a3b8' }}>読み込み中...</div>}>
        <Demo />
      </Suspense>
    </div>
  )
}
