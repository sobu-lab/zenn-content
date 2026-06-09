---
title: "タスクバーで魚を飼うアプリを、Electron→Tauriで作り直して無料のMicrosoft Storeに公開した"
emoji: "🐟"
type: "tech"
topics: ["tauri", "rust", "windows", "microsoftstore", "個人開発"]
published: false
---

## はじめに

Windows のタスクバーで熱帯魚や金魚を泳がせる小さなアプリ「Taskbar Aquarium」を作って、**無料になった Microsoft Store に個人で公開**しました。

最初は Electron で作ったのですが、配布サイズが MSIX で 99MB になってしまい、**Tauri に移植したら 3MB** まで小さくなりました。
この記事は「作って・移植して・ストアに出す」までの記録です。
特に、

- Electron/Tauri 共通で苦しんだ「タスクバー押し負け」問題
- Tauri 移植で踏んだ Rust 固有の罠
- 無料化された Microsoft Store の公開フローと、つまずきポイント

このあたりが、後から同じことをやる人の役に立てば嬉しいです。

![タスクバーで泳ぐ水槽](/images/aquarium-demo.gif)

- リポジトリ: https://github.com/sobu-lab/taskbar-aquarium-tauri
- ストアページ: https://apps.microsoft.com/detail/9PL9WTM1678K

---

## どんなアプリ？

- タスクバーの上に常時最前面で重なる、横長の水槽
- 金魚・出目金・ネオンテトラ・エンゼル・グッピーがドット絵で泳ぐ
- ドラッグで移動、左右の端をドラッグで横幅変更
- 右クリックメニューから魚の数・ピクセルサイズ・背景透過を調整
- 設定は `%APPDATA%` に保存して次回復元
- ネット通信なし・データ収集なし

---

## ドット絵を描く仕組み

凝ったライブラリは使わず、**「文字で絵を定義 → 文字を色に変換 → 1マスずつ四角を塗る」** だけです。
フロントは Electron 版・Tauri 版で共通の `src/index.html`（HTML + Canvas）です。

```js
const SPECIES = [
  { name:'goldfish',
    pal:{'1':'#ff8a3d','2':'#e3601f','3':'#ffd29a','p':'#241008'},
    map: norm([
      "................","...2......22....","22.2...2221111..",
      "222...21111111p.","2222.21111111111", /* ... */ ]) },
  // demekin / neon / angel / guppy ...
];
```

描画はこのループだけです。

```js
ctx.imageSmoothingEnabled = false; // ドットをボヤけさせない
for (let cy=0; cy<this.hh; cy++) {
  for (let cx=0; cx<this.w; cx++) {
    const col = pal[row[cx]];
    if (!col) continue;                 // 透明はスキップ
    const dx = this.dir === 1 ? cx : (this.w-1-cx); // 向き反転
    let py = oy + cy;
    if (cx < TAIL_COLS) py += ts;        // 尾びれを揺らす
    ctx.fillStyle = col;
    ctx.fillRect(ox+dx, py, 1, 1);
  }
}
```

背景・泡・水草・砂利も含めて低解像度（`pixel` 倍率）で描き、Canvas 全体を整数倍に拡大することで、全部のドットの粒をそろえています。

魚の泳ぎは群れさせず、1匹ずつ独立にふらふら泳がせています。
最初は泳ぐ層を変える瞬間にワープしてしまったので、目標の高さへ毎フレーム少しずつ近づけるようにしました。

```js
this.y0 += (this.targetY - this.y0) * Math.min(1, dt*0.7);
this.y  = this.y0 + Math.sin(this.t*this.bobF) * this.bobA;
```

---

## 最大の難所：タスクバー「押し負け」問題

タスクバー上に常時最前面ウィンドウを置くと、**タスクバーのアイコンをクリックした拍子に水槽が背面へ押し込まれて戻ってこない**ことがあります。
これは Electron でも Tauri でも遭遇しました。

### Electron 版でのもがき

 - `setAlwaysOnTop(true, 'screen-saver')` の即時適用
 - `blur` での再適用（フォーカスを持たないウィンドウなので発火しない）
 - 一定間隔の `moveTop()` …といろいろ試して

結局たどり着いた結論はこうでした。

- クリックスルー（`setIgnoreMouseEvents(true)`）にすると、ウィンドウ領域のクリックがタスクバーに届いてタスクバーが activate し、水槽が背面に回る
- **クリックスルーをやめれば**、水槽領域のクリックは水槽が吸収するので押し負けない

トレードオフとして、水槽が重なっている部分のタスクバーボタンは押せなくなりますが、アイコンの無い余白に置けば実用上は問題なし、と割り切りました。

加えて Electron は背面に回ると `requestAnimationFrame` を絞るので、`backgroundThrottling: false` でアニメ停止も止めました。

### Tauri 版での解法：Win32 を直叩き

Tauri 移植後、`set_always_on_top(true)` を繰り返し呼んでも、すでに true だと Z オーダーが再適用されず押し負けが復活しました。
そこで Windows API を直接呼んでいます。

```rust
SetWindowPos(
    hwnd, Some(HWND_TOPMOST),
    0, 0, 0, 0,
    SWP_NOACTIVATE | SWP_NOMOVE | SWP_NOSIZE, // フォーカスを奪わず位置も変えない
);
```

これを 1 秒ごとに別スレッドから呼び、押し負けても自動で前面へ復帰させます。
`SWP_NOACTIVATE` でフォーカスを奪わないのが地味に重要でした。

---

## Tauri 移植で踏んだ Rust の罠

### 1. HWND を別スレッドに渡せない

`HWND`（中身は生ポインタ）は `Send` を実装しておらず、そのままスレッドに移動できません。
`isize` にキャストして渡し、スレッド内で復元しました。

```rust
let hwnd_addr: isize = window.hwnd().ok().map(|h| h.0 as isize).unwrap_or(0);
std::thread::spawn(move || {
    let hwnd = HWND(hwnd_addr as *mut std::ffi::c_void);
    // ...
});
```

### 2. windows クレートのバージョン整合

Tauri 2.11 が内部で `windows-core 0.61` を使っているため、自分の依存も `windows = "0.61"` に合わせないと、**同じ `HWND` 型なのに別物扱いでコンパイルエラー**になります。
`SetWindowPos` のシグネチャもバージョンで変わり、0.61 では `hwndinsertafter` が `Option<HWND>` です。

### 3. `start_dragging()` が alwaysOnTop で効かない

Tauri 標準の `WebviewWindow::start_dragging()` は alwaysOnTop ウィンドウだと反応しませんでした。
仕方なく JS で `mousedown`→`mousemove` を捕捉し、Rust の `move_window` コマンドで `set_position` する自前実装に。リサイズ（`startResizeDragging('West'|'East')`）は効いたのでそちらは利用しています。

### 4. 右クリックメニューも押し負ける

`popup_menu` で出したコンテキストメニューが、例の1秒ごとの最前面復帰で背面に沈む問題が発生。
`AtomicU64` で「復帰を一時停止する時刻」を持ち、メニュー表示時に3秒停止、項目クリック時に即再開、で解決しました。

```rust
static TOPMOST_PAUSE_UNTIL: AtomicU64 = AtomicU64::new(0);
// 表示時:        pause_topmost_for(3);
// クリック時:    resume_topmost();   // on_menu_event
// 復帰ループ:    if topmost_paused() { continue; }
```

### 5. セットアップでも一回詰まる

初回ビルドで `link.exe not found`。
Rust の MSVC ターゲットには Visual Studio Build Tools の C++ ワークロードが要ります（VS Code とは別物）。

```powershell
winget install Microsoft.VisualStudio.2022.BuildTools --override "--passive --wait --add Microsoft.VisualStudio.Workload.VCTools --includeRecommended"
```

---

## なぜ Tauri に移したか：サイズ

| 項目 | Electron 版 | Tauri 版 |
|------|------------|---------|
| exe 本体 | 173MB | 9〜10MB |
| MSIX パッケージ | 99MB | **3MB** |
| ランタイム | Chromium 同梱 | OS の WebView2 |

Electron は Chromium を同梱するので最低 100MB 級になります。
Tauri は OS の WebView2 を使うため、フロント（`index.html`）をほぼ流用したまま配布サイズが約 97% 減りました。
常駐して眺め続けるアプリなので、軽さは効いてきます。

---

## Microsoft Store に無料公開する

### 登録は無料

個人開発者の登録料が無料化されていて、`storedeveloper.microsoft.com` から、クレジットカード不要・本人確認（ID＋セルフィー）だけでアカウントを作れました。
（Partner Center から直接入ると有料の旧フローになるので注意）
すべて無料・課金なしのアプリなら税務情報も不要です。

### MSIX 化は winapp CLI

Electron 版は electron-builder の appx ターゲットでしたが、Tauri 版は Microsoft 公式の **winapp CLI**（`@microsoft/winappcli`）を使いました。
Tauri の出力 exe + manifest + アセットを包むだけです。

```bash
npm run tauri build   # src-tauri/target/release/*.exe
cp src-tauri/target/release/taskbar-aquarium-tauri.exe msix/
npx winapp pack ./msix --output ./msix --manifest ./msix/Package.appxmanifest
```

manifest の `Identity`（Name / Publisher / PublisherDisplayName）は Partner Center で予約した値をそのまま埋めます。
ここが1文字でもズレると提出時に弾かれます。
MSIX デスクトップアプリは `runFullTrust` 機能が必須で、Partner Center で承認理由を聞かれるので「Win32 API で常時最前面ウィンドウを実現するため」等を素直に書きました。

### プライバシーポリシー必須

最近の Store はデスクトップアプリ全般でプライバシーポリシー URL が必須です。
（WebView2 が Edge の一部としてテレメトリを持つため）
アプリ自体が無収集でも URL の提示が要るので、`PRIVACY.md` を置いて GitHub の URL を登録しました。

### 年齢レーティング（IARC）

質問票に答えるだけで即発行。
暴力・性的表現・課金・通信を全部「なし」と答えて全年齢（3+）になりました。
発行される Global Rating ID は将来 Steam 等に出すときに使い回せます。

---

## つまずいたところ（公開フロー編）

実コードより、ここが一番役に立つかもしれません。

### 住所欄が数字だけだと弾かれた

登録時の番地欄が "complete street address" を要求していて、番地の数字だけだと通りません。
町名からローマ字で（例: `Townname-area 1234`）入れると通りました。

### 「保存できない」のは読み取り専用ページだった

公開後に説明文を直そうとして「登録情報を保存できません」と連発。
原因は、開いていたのが現在の公開状態を表示する**読み取り専用ページ**だったこと。
一度公開したアプリは「更新」から新しい提出を作り、その下書きの中で編集する必要がありました。

### AI が書いた説明文の数字が嘘だった

説明文を AI に書かせたら、パッケージサイズが「わずか3MB」と書かれていました。
Tauri 版の MSIX はたしかに約3MBですが、**仕様画面のアプリサイズ表記は9MB級**で、文脈次第で誤解を招く数字でした（Electron 版なら完全に嘘になる)。
AI はアプリの実物を測れないので、「軽量アプリらしい数字」をもっともらしく埋めます。

教訓は、**AI が書いた文章のうち「具体的な数字」だけは実物と突き合わせる**。
サイズ・価格・対応バージョン・パーセンテージは特に要注意です。
機能の説明は実装に基づくので比較的信頼できますが、数字は別腹でした。

### 価格は明示的に「無料」を選ぶ

価格ドロップダウンを未選択だと「有効な価格を設定してください」エラー。
無料でも明示選択が必要です。

---

## 公開してみた結果

公開して当日で、**自分以外のインストールがありました**。
自分は1台に1回入れただけなのに、インストール数がそれを上回っていて、誰かが見つけて入れてくれたのが分かったときは地味に感動しました。
Store の集計は「入手（ライセンス取得）」と「インストール（実際に端末に入った数）」が別指標で、反映に数日かかるらしいので継続的に確認していきます。

---

## まとめ

- タスクバーに重ねるアプリは「常時最前面・透明・フレームレス」＋「押し負け対策」で成立する
- 押し負けは、クリックを吸収する／Win32 で Z オーダーを定期復帰させる、で対処できた
- Electron → Tauri 移植で配布サイズが 99MB → 3MB に。代わりに Rust と Win32 の作法を学ぶ必要がある
- Microsoft Store は登録無料で個人でも公開までいける。詰まりやすいのは住所欄・読み取り専用ページ・**AI が書いた説明文の数字**
- 公開してみると、思っているより早く誰かが見つけてくれる

小さくても「作って・出して・誰かに届く」まで一周すると、次を作る気力が湧きます。

- リポジトリ: https://github.com/sobu-lab/taskbar-aquarium-tauri
- 開発記録（移植の詳細）: [DEVELOPMENT.md](https://github.com/sobu-lab/taskbar-aquarium-tauri/blob/main/DEVELOPMENT.md)
- Store 提出手順: [MICROSOFT_STORE.md](https://github.com/sobu-lab/taskbar-aquarium-tauri/blob/main/MICROSOFT_STORE.md)
- ストア: https://apps.microsoft.com/detail/9PL9WTM1678K
