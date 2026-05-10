---
title: "Reactテーブルライブラリ6選：フィルタリング・検索UXと無料範囲を徹底比較"
emoji: "📊"
type: "tech"
topics: ["react", "typescript", "frontend"]
published: false
---

## はじめに

Reactでテーブルを実装するとき、「どのライブラリを使えばいいか」は悩ましい選択です。特に**フィルタリング・検索機能**は、管理画面や業務アプリで頻繁に求められる機能であり、ライブラリによって実装コストと使いやすさが大きく異なります。

この記事では以下6ライブラリを、実際に使い比べた経験をもとに比較します。

- **Ant Design（antd）**
- **MUI（Material UI）DataGrid**
- **shadcn/ui**（+ TanStack Table）
- **Chakra UI**
- **TanStack Table**（headless）
- **AG Grid Community**

## 比較の観点

1. **フィルタリング・検索のUX** — 操作感・直感性・設定の書きやすさ
2. **無料でできること・できないこと** — 商用プロジェクト採用前の確認事項
3. **実装コスト** — コード量とセットアップの難易度

## インタラクティブデモ

6ライブラリを同一データで動かせるデモを用意しました。実際に操作して比較できます。

https://sobu-lab.github.io/zenn-content/

## サンプルデータ

各デモで共通のユーザー一覧（15件）を使います。

| カラム | 型 | フィルター種別 |
|---|---|---|
| 名前 | string | グローバル検索対象 |
| 年齢 | number | 数値範囲フィルター |
| 役割 | enum | セット/チェックボックスフィルター |
| 部署 | enum | セット/チェックボックスフィルター |
| ステータス | active/inactive | セット/チェックボックスフィルター |

---

## Ant Design（antd）

### 概要

antdのTableは**フィルタリング機能が最初から充実**しています。`filters` + `onFilter`でカラムフィルターを定義し、`filterSearch: true`を追加するだけでフィルタードロップダウン内に検索ボックスが現れます。グローバル検索はInputコンポーネントと組み合わせて実装します。

設定量が少なく、エンドユーザーの操作感も直感的。フロントエンドに慣れていないメンバーが多いチームでも扱いやすいです。

### デモ

👉 [デモを開く](https://sobu-lab.github.io/zenn-content/#antd)

### 実装のポイント

```tsx
// カラムフィルター（無料）
{
  title: '役割',
  dataIndex: 'role',
  filters: roles.map((r) => ({ text: r, value: r })),
  filterSearch: true,   // ドロップダウン内に検索ボックスが追加される
  onFilter: (value, record) => record.role === value,
}

// グローバル検索（無料・自前実装）
const filtered = data.filter((row) =>
  Object.values(row).some((v) =>
    String(v).toLowerCase().includes(searchText.toLowerCase())
  )
)
```

### 無料範囲

| 機能 | 無料 |
|---|---|
| カラムソート | ✅ |
| カラムフィルター（ドロップダウン） | ✅ |
| フィルター内検索（filterSearch） | ✅ |
| カスタムフィルターUI | ✅ |
| グローバル検索 | ✅（自前実装） |
| ページネーション | ✅ |

**全機能が無料。** antd はMITライセンスです。

---

## MUI DataGrid

### 概要

MUI DataGridは**無料（Community）と有料（Pro）で機能差**があります。ただし無料でも`GridToolbar`を追加するだけでフィルターパネルとクイックフィルター（全体検索）が一度に有効になります。実装コストはantdと同水準で低いです。

有料が必要になるのは「1カラムに複数条件をAND/ORで組み合わせる」ケースです。多くの業務アプリでは無料版で十分カバーできます。

### デモ

👉 [デモを開く](https://sobu-lab.github.io/zenn-content/#mui)

### 実装のポイント

```tsx
import { DataGrid, GridToolbar } from '@mui/x-data-grid'

<DataGrid
  rows={data}
  columns={columns}
  slots={{ toolbar: GridToolbar }}
  slotProps={{ toolbar: { showQuickFilter: true } }}
  initialState={{
    pagination: { paginationModel: { pageSize: 5 } },
  }}
/>
```

これだけでフィルター・クイックフィルター・ページネーションが揃います。

### 無料範囲

| 機能 | Community（無料） | Pro（$180/dev/年） |
|---|---|---|
| カラムソート | ✅ | ✅ |
| カラムフィルター（単一条件） | ✅ | ✅ |
| クイックフィルター（全体検索） | ✅ | ✅ |
| 複数条件フィルター（AND/OR） | ❌ | ✅ |
| ページネーション | ✅ | ✅ |
| 列グループ | ❌ | ✅ |

---

## shadcn/ui

### 概要

shadcn/uiはnpmパッケージではなく**コンポーネントをプロジェクトにコピーして使う**スタイルです。テーブルはTanStack Tableのラッパーとして提供されており、フィルタリングロジックはTanStack Table、UIはshadcn/uiのコンポーネントで構成します。

自由度が高い反面、antdやMUIと比べてコード量は増えます。デザインを細かくカスタマイズしたいプロジェクトに向いています。

### デモ

👉 [デモを開く](https://sobu-lab.github.io/zenn-content/#shadcn)

### 実装のポイント

```tsx
const table = useReactTable({
  data,
  columns,
  getCoreRowModel: getCoreRowModel(),
  getFilteredRowModel: getFilteredRowModel(),
  getSortedRowModel: getSortedRowModel(),
  getPaginationRowModel: getPaginationRowModel(),
  state: { globalFilter, sorting, pagination },
  onGlobalFilterChange: setGlobalFilter,
  globalFilterFn: 'includesString',
})
```

### 無料範囲

| 機能 | 無料 |
|---|---|
| 全機能 | ✅（MIT） |

全機能無料。UIコンポーネントはコピー後に自由に編集できます。

---

## Chakra UI

### 概要

Chakra UIの`Table`は**スタイリングのみ**のコンポーネントです。フィルタリングやソートのロジックは一切持っていないため、TanStack Tableと組み合わせて使います。shadcn/uiと同じアプローチですが、Chakra UIのデザインシステムをすでに使っているプロジェクトで採用するケースが多いです。

### デモ

👉 [デモを開く](https://sobu-lab.github.io/zenn-content/#chakra)

### 実装のポイント

```tsx
import { Table } from '@chakra-ui/react'
// Table.Root / Table.Header / Table.Row / Table.Cell を TanStack Table の
// getHeaderGroups() / getRowModel() と組み合わせて描画する
```

### ハマりどころ：useMemo が必須

TanStack Tableに渡す`data`は**毎レンダーで同じ参照を返す必要があります**。フィルター処理などで新しい配列を生成する場合、`useMemo`でメモ化しないとTanStack Tableがデータ変更を検知し続けて無限ループになります。

```tsx
// ❌ 毎レンダーで新しい配列が生成され、無限ループになる
const filtered = roleFilter ? data.filter((d) => d.role === roleFilter) : data

// ✅ useMemo で参照を安定させる
const filtered = useMemo(
  () => roleFilter ? data.filter((d) => d.role === roleFilter) : data,
  [roleFilter]
)
```

antdやMUIではこのような落とし穴はなく、TanStack Tableを直接扱う組み合わせ特有の注意点です。

### 無料範囲

| 機能 | 無料 |
|---|---|
| 全機能 | ✅（MIT） |

---

## TanStack Table

### 概要

TanStack Table（旧React Table）は**完全ヘッドレス**なテーブルライブラリです。UIを一切持たず、フィルタリング・ソート・ページネーションのロジックのみを提供します。すべてのUIを自前で実装する必要がありますが、その分どんなデザインシステムにも適合します。

shadcn/uiやChakra UIが内部でTanStack Tableを使っている、いわばエンジン部分にあたります。

### デモ

👉 [デモを開く](https://sobu-lab.github.io/zenn-content/#tanstack)

### 実装のポイント

```tsx
// カラム定義にフィルター機能を追加
const columns = [
  columnHelper.accessor('role', {
    header: '役割',
    filterFn: 'equalsString',
  }),
]

// フィルター入力をヘッダーに追加（UIは自前）
{header.column.getCanFilter() && (
  <input
    value={String(header.column.getFilterValue() ?? '')}
    onChange={(e) => header.column.setFilterValue(e.target.value)}
  />
)}
```

### 無料範囲

| 機能 | 無料 |
|---|---|
| 全機能 | ✅（MIT） |

---

## AG Grid Community

### 概要

AG Grid Communityは**無料でも最も高機能なフィルタリングUI**を提供します。各カラムヘッダーの直下に常時表示される「フローティングフィルター」、テキスト・数値・セット（enum）対応のフィルタータイプが全て無料で使えます。列定義に数行追加するだけで動作し、業務アプリ向けの完成度があります。

大量データのパフォーマンスも優秀で、「とにかく機能が欲しい」ときの第一候補です。

### デモ

👉 [デモを開く](https://sobu-lab.github.io/zenn-content/#ag-grid)

### 実装のポイント

```tsx
const columnDefs = [
  { field: 'name', filter: 'agTextColumnFilter', floatingFilter: true },
  { field: 'age',  filter: 'agNumberColumnFilter', floatingFilter: true },
  { field: 'role', filter: 'agSetColumnFilter', floatingFilter: true },
]

<AgGridReact
  rowData={data}
  columnDefs={columnDefs}
  pagination
  paginationPageSize={5}
/>
```

### 無料範囲

| 機能 | Community（無料） | Enterprise（要ライセンス） |
|---|---|---|
| テキストフィルター | ✅ | ✅ |
| 数値フィルター | ✅ | ✅ |
| セットフィルター（enum） | ✅ | ✅ |
| フローティングフィルター | ✅ | ✅ |
| フィルターツールパネル | ❌ | ✅ |
| 高度なフィルター（AND/OR UI） | ❌ | ✅ |
| ページネーション | ✅ | ✅ |

---

## 総合比較

### フィルタリング・検索UX

| ライブラリ | グローバル検索 | カラムフィルター | UX充実度 | 実装コスト |
|---|---|---|---|---|
| antd | ✅ 自前実装 | ✅ ビルトイン | ★★★★☆ | 低 |
| MUI DataGrid | ✅ クイックフィルター | ✅ ビルトイン | ★★★★☆ | 低 |
| shadcn/ui | ✅ TanStack | ✅ 自前実装 | ★★★☆☆ | 中〜高 |
| Chakra UI | ✅ TanStack | ✅ 自前実装 | ★★☆☆☆ | 高（useMemo 必須） |
| TanStack Table | ✅ ビルトイン | ✅ ビルトイン | ★★☆☆☆ | 高 |
| AG Grid | ✅ クイックサーチ | ✅ フローティング | ★★★★★ | 低 |

### 無料範囲まとめ

| ライブラリ | 無料で使える範囲 | 有料が必要になるケース |
|---|---|---|
| antd | フィルタリング機能すべて | なし |
| MUI DataGrid | 単一条件フィルター、クイックフィルター | AND/OR複数条件フィルター |
| shadcn/ui | すべて | なし |
| Chakra UI | すべて | なし |
| TanStack Table | すべて | なし |
| AG Grid | カラムフィルター・フローティングフィルター | フィルターパネル・高度なフィルターUI |

---

## どれを選ぶか

### すぐ使えるものが欲しい → **antd**
セットアップが最短で、フィルター機能も豊富。デザインシステムも一体で使えるためスピード重視の開発に向く。

### Material Designベースのプロジェクト → **MUI DataGrid**
MUIを既に使っているなら統合がスムーズ。無料範囲で多くのケースはカバーできる。

### デザインの自由度を最優先 → **shadcn/ui + TanStack Table**
UIを細かくコントロールしたい場合のベストコンビ。Tailwind CSS環境との相性が良い。

### 業務アプリで最高のフィルターUX → **AG Grid Community**
無料でもフローティングフィルター・セットフィルターが使えて完成度が高い。大量データにも強い。

### UIライブラリ非依存でロジックだけ欲しい → **TanStack Table**
デザインシステムが既に決まっていてテーブルロジックだけ必要なとき。
