// C:\Users\User\Downloads\ideun v1\src\shared\characters\pabo.ts

import type { CharacterPack } from "./index";

function c(pathFromCharacters: string) {
  return `/characters/${pathFromCharacters
    .split("/")
    .map(encodeURIComponent)
    .join("/")}`;
}

export function paboPack(): CharacterPack {
  return {
    key: "pabo",

    floatFrames: [
      c("pabo/pabo floating state/pabo moving A.svg"),
      c("pabo/pabo floating state/pabo moving B.svg"),
      c("pabo/pabo floating state/pabo moving C.svg"),
      c("pabo/pabo floating state/pabo moving D.svg"),
    ],

    blinkFrames: [
      c("pabo/pabo blinking state/pabo blink A.svg"),
      c("pabo/pabo blinking state/pabo blink B.svg"),
      c("pabo/pabo blinking state/pabo blink C.svg"),
      c("pabo/pabo blinking state/pabo blink D.svg"),
      c("pabo/pabo blinking state/pabo blink E.svg"),
    ],

    angryFrames: [
      c("pabo/pabo angry state/pabo angry A.svg"),
      c("pabo/pabo angry state/pabo angry B.svg"),
      c("pabo/pabo angry state/pabo angry C.svg"),
      c("pabo/pabo angry state/pabo angry D.svg"),
    ],

    furiousFrames: [
      c("pabo/pabo furious state/pabo furious A.svg"),
      c("pabo/pabo furious state/pabo furious B.svg"),
      c("pabo/pabo furious state/pabo furious C.svg"),
      c("pabo/pabo furious state/pabo furious D.svg"),
      c("pabo/pabo furious state/pabo furious E.svg"),
    ],
  };
}