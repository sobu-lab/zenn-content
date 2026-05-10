import React, { Suspense, useState, useEffect, lazy } from 'react'

const AntdDemo     = lazy(() => import('./demos/AntdDemo'))
const MuiDemo      = lazy(() => import('./demos/MuiDemo'))
const ShadcnDemo   = lazy(() => import('./demos/ShadcnDemo'))
const ChakraDemo   = lazy(() => import('./demos/ChakraDemo'))
const TanstackDemo = lazy(() => import('./demos/TanstackDemo'))
const AgGridDemo   = lazy(() => import('./demos/AgGridDemo'))

const GITHUB_BASE = 'https://github.com/sobu-lab/zenn-content/blob/main/demos/react-table-library-demo/src/demos'

const tabs = [
  { label: 'Ant Design',     hash: 'antd',     file: 'AntdDemo.tsx',     component: AntdDemo     },
  { label: 'MUI DataGrid',   hash: 'mui',      file: 'MuiDemo.tsx',      component: MuiDemo      },
  { label: 'shadcn/ui',      hash: 'shadcn',   file: 'ShadcnDemo.tsx',   component: ShadcnDemo   },
  { label: 'Chakra UI',      hash: 'chakra',   file: 'ChakraDemo.tsx',   component: ChakraDemo   },
  { label: 'TanStack Table', hash: 'tanstack', file: 'TanstackDemo.tsx', component: TanstackDemo },
  { label: 'AG Grid',        hash: 'ag-grid',  file: 'AgGridDemo.tsx',   component: AgGridDemo   },
]

function getIndexFromHash() {
  const hash = window.location.hash.replace('#', '')
  const i = tabs.findIndex((t) => t.hash === hash)
  return i >= 0 ? i : 0
}

export default function App() {
  const [active, setActive] = useState(getIndexFromHash)

  useEffect(() => {
    const onHashChange = () => setActive(getIndexFromHash())
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  const Demo = tabs[active].component

  return (
    <div style={{ fontFamily: 'sans-serif', minHeight: '100vh' }}>
      <div style={{ background: '#1e293b', padding: '12px 24px', display: 'flex', alignItems: 'center', gap: 16 }}>
        <a href="/zenn-content/" style={{ color: '#94a3b8', fontSize: 13, textDecoration: 'none' }}>← 一覧へ</a>
        <h1 style={{ color: 'white', margin: 0, fontSize: 17, fontWeight: 600, flex: 1 }}>React Table Library Demo</h1>
        <a
          href={`${GITHUB_BASE}/${tabs[active].file}`}
          target="_blank"
          rel="noreferrer"
          style={{ color: '#94a3b8', fontSize: 12, textDecoration: 'none', border: '1px solid #475569', borderRadius: 5, padding: '3px 10px', whiteSpace: 'nowrap' }}
        >
          コードを見る
        </a>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', borderBottom: '1px solid #e2e8f0', background: '#f8fafc', padding: '0 16px' }}>
        {tabs.map((tab, i) => (
          <a
            key={tab.hash}
            href={`#${tab.hash}`}
            style={{
              padding: '10px 16px', textDecoration: 'none', fontSize: 13,
              borderBottom: active === i ? '2px solid #3b82f6' : '2px solid transparent',
              color: active === i ? '#3b82f6' : '#64748b',
              fontWeight: active === i ? 600 : 400,
              marginBottom: -1, whiteSpace: 'nowrap',
            }}
          >
            {tab.label}
          </a>
        ))}
      </div>
      <Suspense fallback={<div style={{ padding: 40, textAlign: 'center', color: '#94a3b8' }}>読み込み中...</div>}>
        <Demo />
      </Suspense>
    </div>
  )
}
