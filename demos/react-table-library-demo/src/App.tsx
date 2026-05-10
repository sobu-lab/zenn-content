import React, { Suspense, useState, useEffect, lazy } from 'react'

const AntdDemo     = lazy(() => import('./demos/AntdDemo'))
const MuiDemo      = lazy(() => import('./demos/MuiDemo'))
const ShadcnDemo   = lazy(() => import('./demos/ShadcnDemo'))
const ChakraDemo   = lazy(() => import('./demos/ChakraDemo'))
const TanstackDemo = lazy(() => import('./demos/TanstackDemo'))
const AgGridDemo   = lazy(() => import('./demos/AgGridDemo'))

const demos = [
  {
    hash: 'antd',
    label: 'Ant Design',
    desc: 'チェックボックス式ドロップダウンフィルター・filterSearch対応。設定量が少なく即戦力。',
    component: AntdDemo,
  },
  {
    hash: 'mui',
    label: 'MUI DataGrid',
    desc: 'GridToolbar でフィルターパネルとクイックフィルターを一括有効化。Material Design。',
    component: MuiDemo,
  },
  {
    hash: 'shadcn',
    label: 'shadcn/ui',
    desc: 'TanStack Table + shadcn/ui スタイル。UIの自由度が高くTailwind環境に最適。',
    component: ShadcnDemo,
  },
  {
    hash: 'chakra',
    label: 'Chakra UI',
    desc: 'TanStack Table + Chakra UI コンポーネント。useMemo によるメモ化が必須。',
    component: ChakraDemo,
  },
  {
    hash: 'tanstack',
    label: 'TanStack Table',
    desc: '完全ヘッドレス。カラムヘッダー内にフィルター入力を配置した自前実装例。',
    component: TanstackDemo,
  },
  {
    hash: 'ag-grid',
    label: 'AG Grid Community',
    desc: 'フローティングフィルター + agSetColumnFilter（Excelライク）。無料で最高機能。',
    component: AgGridDemo,
  },
]

function getHash() {
  return window.location.hash.replace('#', '')
}

function Header({ onBack }: { onBack?: () => void }) {
  return (
    <div style={{ background: '#1e293b', padding: '12px 24px', display: 'flex', alignItems: 'center', gap: 12 }}>
      {onBack && (
        <button
          onClick={onBack}
          style={{ background: 'none', border: '1px solid #475569', borderRadius: 6, color: '#94a3b8', padding: '4px 10px', cursor: 'pointer', fontSize: 13 }}
        >
          ← 一覧へ
        </button>
      )}
      <h1 style={{ color: 'white', margin: 0, fontSize: 17, fontWeight: 600 }}>
        React テーブルライブラリ比較デモ
      </h1>
    </div>
  )
}

function DemoList() {
  return (
    <>
      <Header />
      <div style={{ padding: 32, maxWidth: 900, margin: '0 auto' }}>
        <p style={{ color: '#64748b', marginBottom: 24, fontSize: 14 }}>
          フィルタリング・検索・ソート・ページネーションの実装例。各カードをクリックしてデモを確認できます。
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 }}>
          {demos.map((demo) => (
            <a
              key={demo.hash}
              href={`#${demo.hash}`}
              style={{ textDecoration: 'none' }}
            >
              <div style={{
                border: '1px solid #e2e8f0', borderRadius: 10, padding: 20,
                background: 'white', cursor: 'pointer',
                transition: 'box-shadow 0.15s',
              }}
                onMouseEnter={(e) => (e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)')}
                onMouseLeave={(e) => (e.currentTarget.style.boxShadow = 'none')}
              >
                <div style={{ fontWeight: 700, fontSize: 15, color: '#1e293b', marginBottom: 8 }}>
                  {demo.label}
                </div>
                <div style={{ fontSize: 13, color: '#64748b', lineHeight: 1.6 }}>
                  {demo.desc}
                </div>
                <div style={{ marginTop: 14, fontSize: 12, color: '#3b82f6', fontWeight: 500 }}>
                  デモを見る →
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </>
  )
}

function DemoPage({ hash }: { hash: string }) {
  const demo = demos.find((d) => d.hash === hash)
  if (!demo) return <DemoList />
  const Demo = demo.component

  return (
    <>
      <Header onBack={() => { window.location.hash = '' }} />
      <div style={{ padding: '8px 24px', background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
        <span style={{ fontSize: 14, fontWeight: 600, color: '#374151' }}>{demo.label}</span>
        <span style={{ fontSize: 13, color: '#94a3b8', marginLeft: 12 }}>{demo.desc}</span>
      </div>
      <Suspense fallback={<div style={{ padding: 40, textAlign: 'center', color: '#94a3b8' }}>読み込み中...</div>}>
        <Demo />
      </Suspense>
    </>
  )
}

export default function App() {
  const [hash, setHash] = useState(getHash)

  useEffect(() => {
    const onHashChange = () => setHash(getHash())
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  return (
    <div style={{ fontFamily: 'sans-serif', minHeight: '100vh', background: '#f8fafc' }}>
      {hash ? <DemoPage hash={hash} /> : <DemoList />}
    </div>
  )
}
