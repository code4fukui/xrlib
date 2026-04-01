export const getSpatialCapabilities = () => {
  return {
    model: "HTMLModelElement" in window,
    webxr: "xr" in navigator,
    touch: navigator.maxTouchPoints > 0,
  };
};
export const isVisionPro = () => {
  const caps = getSpatialCapabilities();
  return caps.model && caps.webxr;
};
export const getVisionProOffset = () => isVisionPro() ? 1.50 : 0;
