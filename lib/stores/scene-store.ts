import { proxy } from "valtio";

export const sceneState = proxy({
  pointer: { x: 0, y: 0 },
  scroll: 0,
  reducedMotion: false,
  webglReady: false,
  quality: "high" as "high" | "medium" | "low",
});

export function setScenePointer(x: number, y: number) {
  sceneState.pointer.x = x;
  sceneState.pointer.y = y;
}

export function setSceneScroll(value: number) {
  sceneState.scroll = value;
}

export function setReducedMotion(value: boolean) {
  sceneState.reducedMotion = value;
}

export function setWebglReady(value: boolean) {
  sceneState.webglReady = value;
}
