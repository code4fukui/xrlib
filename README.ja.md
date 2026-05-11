# xrlib

Three.jsを用いたWebXRアプリケーション構築のためのJavaScriptモジュール集です。特にハンドトラッキングに焦点を当てています。

## デモ

- [Hand Measure](https://code4fukui.github.io/hand-xr/)

このデモは、ユーザーの人差し指間の距離をリアルタイムで測定し、表示します。

## 特徴

- **ハンドトラッキングの可視化**: リアルなメッシュ、シンプルな球体、またはボックスとして手を描画します。
- **リアルタイム測定**: 任意の2つの手の関節（デフォルトは人差し指の先端）間の距離を計算して表示するクラス。
- **デスクトップナビゲーション**: 非XR環境向けに、一人称視点（WASD）とオービットコントロールを簡単に導入できるコントローラー。
- **デバイス検出**: Apple Vision Proなどの空間コンピューティングデバイスを識別するためのヘルパー関数。
- **クイックセットアップ**: Three.jsのシーン、カメラ、レンダラー、およびXRセッションを初期化するためのボイラープレートモジュール（`egxr.js`）。

## 使い方

このライブラリは、Three.jsの依存関係の解決に`importmap`を使用し、各コンポーネントにはESモジュールを使用しています。

**1. HTMLファイルの設定:**

```html
<!DOCTYPE html>
<html>
<head>
  <title>xrlib Demo</title>
  <script type="importmap">
  {
    "imports": {
      "three": "https://code4fukui.github.io/three.js/build/three.module.js",
      "three/addons/": "https://code4fukui.github.io/three.js/examples/jsm/"
    }
  }
  </script>
</head>
<body>
  <script type="module" src="./main.js"></script>
</body>
</html>
```

**2. メインJavaScriptファイルの作成:**

```javascript
// main.js
import { THREE, scene, camera, renderer } from "https://code4fukui.github.io/egxr.js/egxr.js";
import { HandMeasure } from "./HandMeasure.js";
import { showHand } from "./showHand.js";

// トラッキングされた手のモデルをシーンに表示します。
// 第3引数を `false` に設定するとモデルを非表示にします。
showHand(renderer, scene, true);

// 人差し指間の測定ツールを初期化します。
new HandMeasure(THREE, renderer, scene, camera);

// レンダリングループを開始します。
const clock = new THREE.Clock();
renderer.setAnimationLoop(() => {
  const delta = clock.getDelta();
  
  // フレームごとの更新が必要なモジュールは自身を renderer.updates に追加します
  if (renderer.updates) {
    renderer.updates.forEach(item => item.update(delta));
  }
  
  renderer.render(scene, camera);
});
```

## モジュール

- **`egxr.js`**: 標準的なThree.jsのシーン、カメラ、レンダラー、ライト、および「Enter XR」ボタンを初期化します。`THREE`、`scene`、`camera`、`renderer`をエクスポートします。
- **`showHand.js`**: `showHand(renderer, scene, showModel?)`を提供します。可視化のために、ユーザーの手に3Dモデルをアタッチします。
- **`HandMeasure.js`**: ユーザーの人差し指間に線を描画し、距離を表示するクラス。更新処理のために、自動的に自身をレンダリングループに追加します。
- **`MoveByKeyboard.js`**: 非XR環境でのナビゲーション用クラス。マウスによるオービットコントロールとキーボード（WASD）による移動を組み合わせます。
- **`vision.js`**: デバイスの機能を検出するための `isVisionPro()` や `getVisionProOffset()` などのヘルパー関数が含まれています。

## ライセンス

[MIT](LICENSE)
