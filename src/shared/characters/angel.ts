// C:\Users\User\Downloads\ideun v1\src\shared\characters\angel.ts
import type { CharacterPack } from "./index";

function c(pathFromCharacters: string) {
  return `/characters/${pathFromCharacters
    .split("/")
    .map(encodeURIComponent)
    .join("/")}`;
}

export function angelPack(): CharacterPack {
  return {
    key: "angel",
    floatFrames: [
      c("angel eye/angel floating state/angel animation A.svg"),
      c("angel eye/angel floating state/angel animation B.svg"),
      c("angel eye/angel floating state/angel animation C.svg"),
      c("angel eye/angel floating state/angel animation D.svg"),
    ],
    blinkFrames: [
      c("angel eye/blinking reminder/angel blink A.svg"),
      c("angel eye/blinking reminder/angel blink B.svg"),
      c("angel eye/blinking reminder/angel blink C.svg"),
      c("angel eye/blinking reminder/angel blink D.svg"),
    ],
    angryFrames: [
      c("angel eye/angry state/angel angry A.svg"),
      c("angel eye/angry state/angel angry B.svg"),
      c("angel eye/angry state/angel angry C.svg"),
      c("angel eye/angry state/angel angry D.svg"),
    ],
    furiousFrames: [
      c("angel eye/furious state/angel angry A.svg"),
      c("angel eye/furious state/angel angry B.svg"),
      c("angel eye/furious state/angel angry C.svg"),
      c("angel eye/furious state/angel angry D.svg"),
    ],
  };
}
