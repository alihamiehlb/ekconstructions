import { proxy } from "valtio";

export const sceneState = proxy({
  pointer: { x: 0, y: 0 },
  scroll: 0,
});

export function setScenePointer(x: number, y: number) {
  sceneState.pointer.x = x;
  sceneState.pointer.y = y;
}

export function setSceneScroll(value: number) {
  sceneState.scroll = value;
}
