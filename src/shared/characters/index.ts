// C:\Users\User\Downloads\ideun v1\src\shared\characters\index.ts

export type CharacterKey = "angel" | "yaong" | "pabo";

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
import { paboPack } from "./pabo";

/**
 * Normalize ANY old characterId into a stable CharacterKey.
 * This fixes cases where you saved "Pabo", "PABO", "pabo-normal-a", etc.
 */
export function normalizeCharacterKey(characterId?: string | null): CharacterKey {
  console.log("🔍 normalizeCharacterKey received:", characterId);
  
  if (!characterId) {
    console.log("⚠️ No characterId provided, defaulting to angel");
    return "angel";
  }
  
  const raw = characterId.trim().toLowerCase();
  console.log("🔍 After trim and lowercase:", raw);

  // ✅ Handle old-style IDs with hyphens (e.g., "pabo-normal-a")
  if (raw.startsWith("pabo")) {
    console.log("✅ Matched pabo via startsWith");
    return "pabo";
  }
  if (raw.startsWith("yaong")) {
    console.log("✅ Matched yaong via startsWith");
    return "yaong";
  }
  if (raw.startsWith("angel")) {
    console.log("✅ Matched angel via startsWith");
    return "angel";
  }

  // ✅ Handle new canonical keys
  if (raw === "pabo") {
    console.log("✅ Matched pabo via exact match");
    return "pabo";
  }
  if (raw === "yaong") {
    console.log("✅ Matched yaong via exact match");
    return "yaong";
  }
  if (raw === "angel") {
    console.log("✅ Matched angel via exact match");
    return "angel";
  }

  // ✅ Fallback to includes check
  if (raw.includes("pabo")) {
    console.log("✅ Matched pabo via includes");
    return "pabo";
  }
  if (raw.includes("yaong")) {
    console.log("✅ Matched yaong via includes");
    return "yaong";
  }
  if (raw.includes("angel")) {
    console.log("✅ Matched angel via includes");
    return "angel";
  }

  // ✅ safest default
  console.log("⚠️ No match found, defaulting to angel");
  return "angel";
}

export function getPack(characterId?: string | null): CharacterPack {
  const key = normalizeCharacterKey(characterId);
  console.log("📦 getPack returning pack for key:", key);

  if (key === "pabo") return paboPack();
  if (key === "yaong") return yaongPack();
  return angelPack();
}