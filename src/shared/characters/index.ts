// C:\Users\User\Downloads\ideun v1\src\shared\characters\index.ts

export type CharacterKey = "angel" | "yaong";

export type CharacterPack = {
  key: CharacterKey;

  // Normal idle
  floatFrames: string[];

  // Remind1 + Remind2
  blinkFrames: string[];

  // Angry
  angryFrames: string[];

  // Furious (either frame-based OR special animation)
  furiousFrames?: string[];
  furiousSpecial?: {
    paws: string;
    furious: string;
  };
};

import { angelPack } from "./angel";
import { yaongPack } from "./yaong";

export function getPack(characterId?: string | null): CharacterPack {
  const id = (characterId ?? "").toLowerCase();

  if (id.includes("yaong")) return yaongPack();
  return angelPack(); // default
}
