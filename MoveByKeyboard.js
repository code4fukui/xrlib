import { OrbitControls } from "three/addons/controls/OrbitControls.js";

export class MoveByKeyboard {
  constructor(THREE, renderer, camera) {
    this.THREE = THREE;
    const dom = renderer.domElement;
    this.camera = camera;
    // =============== マウス操作（OrbitControls） ===============
    const controls = new OrbitControls(camera, dom);
    this.controls = controls;
    // 使いやすい初期設定
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.enablePan = true;
    controls.enableZoom = true;
    controls.rotateSpeed = 0.8;
    controls.zoomSpeed = 0.8;
    controls.panSpeed = 0.8;
    // 初期注視点（必要に応じて調整）
    controls.target.set(0, 0, 0);
    controls.update();

    camera.position.set(0, 0, .1);

    // =============== キーボード移動（WASD/矢印 + Q/E 上下） ===============
    const keyState = new Set();
    this.keyState = keyState;
    this.boost = false; // Shift で加速
    // 初期位置を覚えておく（Rでリセット）
    const camHome = {
      position: camera.position.clone(),
      target: controls.target.clone(),
    };

    const onKey = (down) => (e) => {
      // IME中などの誤作動防止
      if (["INPUT", "TEXTAREA"].includes(document.activeElement?.tagName)) return;
      if (down) {
        keyState.add(e.code);
      } else {
        keyState.delete(e.code);
      }
      this.boost = keyState.has("ShiftLeft") || keyState.has("ShiftRight");
      // Rでカメラをリセット
      if (down && e.code === "KeyR") {
        camera.position.copy(camHome.position);
        controls.target.copy(camHome.target);
        controls.update();
      }
    };
    window.addEventListener("keydown", onKey(true));
    window.addEventListener("keyup", onKey(false));

    // 右クリックメニューの誤発火を避けたい場合は有効化
    dom.addEventListener("contextmenu", (e) => e.preventDefault());

    renderer.updates ??= [];
    renderer.updates.push(this);
  }
  updateKeyboardMove(delta) {
    const camera = this.camera;
    const controls = this.controls;

    // 毎フレームの移動処理（カメラの向き基準で前後左右・上下）
    const tmpForward = new this.THREE.Vector3();
    const tmpRight = new this.THREE.Vector3();
    const worldUp = new this.THREE.Vector3(0, 1, 0);

    const keyState = this.keyState;
    if (keyState.size === 0) return;

    // 基本速度（シーンスケールに合わせ微調整）
    const base = 0.6; // 単位/秒
    const speed = base * (this.boost ? 3 : 1) * delta;

    // カメラの視線方向から水平前方/右方ベクトルを作る
    camera.getWorldDirection(tmpForward);
    tmpForward.y = 0; // 水平成分だけ
    if (tmpForward.lengthSq() > 0) tmpForward.normalize();

    tmpRight.copy(tmpForward).cross(worldUp).normalize();

    // 入力
    let move = new this.THREE.Vector3();
    if (keyState.has("KeyW") || keyState.has("ArrowUp"))    move.add(tmpForward);
    if (keyState.has("KeyS") || keyState.has("ArrowDown"))  move.sub(tmpForward);
    if (keyState.has("KeyD") || keyState.has("ArrowRight")) move.add(tmpRight);
    if (keyState.has("KeyA") || keyState.has("ArrowLeft"))  move.sub(tmpRight);
    if (keyState.has("KeyE") || keyState.has("PageUp"))     move.add(worldUp);
    if (keyState.has("KeyQ") || keyState.has("PageDown"))   move.sub(worldUp);

    if (move.lengthSq() === 0) return;
    move.normalize().multiplyScalar(speed);

    // カメラ位置と注視点を同じだけ動かす＝等速移動
    camera.position.add(move);
    controls.target.add(move);
    controls.update();
  }
  update(delta) {
    this.updateKeyboardMove(delta);  // ← キーボード移動
    this.controls.update();          // ← マウス操作の慣性
  }
};
