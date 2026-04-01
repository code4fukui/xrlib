import { XRHandModelFactory } from "three/addons/webxr/XRHandModelFactory.js";

export const showHand = (renderer, scene, modeladd = true) => {
  //const handModelFactory = new XRHandModelFactory();
  const handModelFactory = new XRHandModelFactory(null, (model) => {
    // hand model の中身がロードされた後に呼ばれる
    const handcolor = 0xffcc99; // 肌色
    model.traverse((obj) => {
      if (obj.isMesh) {
        // 共有material対策で clone
        obj.material = obj.material.clone();
        obj.material.color.set(handcolor);
        obj.material.needsUpdate = true;
        // 半透明
        //obj.material.transparent = true;
        //obj.material.opacity = 0.5;
      }
    });
  });

  for (let i = 0; i < 2; i++) {
    const hand = renderer.xr.getHand(i);
    scene.add(hand);
    if (!modeladd) continue;
    //const type = "spheres";
    //const type = "boxes";
    const type = "mesh";
    const handModel = handModelFactory.createHandModel(hand, type);
    hand.add(handModel);
  }
};
