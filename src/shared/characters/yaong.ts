// C:\Users\User\Downloads\ideun v1\src\shared\characters\yaong.ts
import type { CharacterPack } from "./index";

function c(pathFromCharacters: string) {
  return `/characters/${pathFromCharacters
    .split("/")
    .map(encodeURIComponent)
    .join("/")}`;
}

export function yaongPack(): CharacterPack {
  return {
    key: "yaong",
    floatFrames: [
      c("yaong/yaong floating state/yaong floating A.svg"),
      c("yaong/yaong floating state/yaong floating B.svg"),
      c("yaong/yaong floating state/yaong floating C.svg"),
      c("yaong/yaong floating state/yaong floating D.svg"),
    ],
    blinkFrames: [
      c("yaong/yaong blinking state/yaong blinking A.svg"),
      c("yaong/yaong blinking state/yaong blinking B.svg"),
    ],
    angryFrames: [
      c("yaong/yaong angry state/yaong angry A.svg"),
      c("yaong/yaong angry state/yaong angry B.svg"),
      c("yaong/yaong angry state/yaong angry C.svg"),
      c("yaong/yaong angry state/yaong angry D.svg"),
      c("yaong/yaong angry state/yaong angry E.svg"),
      c("yaong/yaong angry state/yaong angry F.svg"),
      c("yaong/yaong angry state/yaong angry G.svg"),
    ],
    furiousSpecial: {
      paws: c("yaong/yaong furious state/yaong paws.svg"),
      furious: c("yaong/yaong furious state/yaong furious.svg"),
    },
  };
}
