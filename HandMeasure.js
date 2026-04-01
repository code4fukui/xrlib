export class HandMeasure {
  constructor(THREE, renderer, scene, camera) {
    this.THREE = THREE;
    this.camera = camera;
    this.rightHand = renderer.xr.getHand(0);
    this.leftHand = renderer.xr.getHand(1);

    // 線
    this.linePositions = new Float32Array(6);
    this.lineGeo = new THREE.BufferGeometry();
    this.lineGeo.setAttribute("position", new THREE.BufferAttribute(this.linePositions, 3));
    const lineMat = new THREE.LineBasicMaterial({ color: 0xff0000 });
    this.handLine = new THREE.Line(this.lineGeo, lineMat);
    scene.add(this.handLine);

    // ラベル
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 128;
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas;

    this.labelTex = new THREE.CanvasTexture(canvas);
    const labelMat = new THREE.SpriteMaterial({ map: this.labelTex, transparent: true });
    this.label = new THREE.Sprite(labelMat);
    this.label.scale.set(0.12, 0.03, 1); // 12cm x 3cm
    scene.add(this.label);

    renderer.updates ??= [];
    renderer.updates.push(this);
  }
  getJoint(hand, name) {
    return hand.joints?.[name] || hand.getObjectByName(name);
  }
  update(delta) {
    const rightTip = this.getJoint(this.rightHand, "index-finger-tip");
    const leftTip  = this.getJoint(this.leftHand, "index-finger-tip");

    if (!rightTip || !leftTip || !rightTip.visible || !leftTip.visible) {
      this.handLine.visible = false;
      this.label.visible = false;
      return;
    }

    const p1 = new this.THREE.Vector3().setFromMatrixPosition(rightTip.matrixWorld);
    const p2 = new this.THREE.Vector3().setFromMatrixPosition(leftTip.matrixWorld);

    // 線更新
    this.linePositions[0] = p1.x;
    this.linePositions[1] = p1.y;
    this.linePositions[2] = p1.z;
    this.linePositions[3] = p2.x;
    this.linePositions[4] = p2.y;
    this.linePositions[5] = p2.z;
    this.lineGeo.attributes.position.needsUpdate = true;
    this.handLine.visible = true;

    // 距離表示（WebXR/three.js では通常メートル扱い）
    const distM = p1.distanceTo(p2);
    const distCM = distM * 100;

    // 中点にラベル
    const mid = new this.THREE.Vector3().addVectors(p1, p2).multiplyScalar(0.5);
    this.label.position.copy(mid);
    this.label.quaternion.copy(this.camera.quaternion);
    this.label.visible = true;

    const canvas = this.canvas;
    const ctx = this.ctx;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "rgba(0,0,0,0.6)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#fff";
    ctx.font = "bold 64px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(`${distCM.toFixed(1)} cm`, canvas.width / 2, canvas.height / 2);
    this.labelTex.needsUpdate = true;
  }
};
