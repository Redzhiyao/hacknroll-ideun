// C:\Users\User\Downloads\ideun v1\src\windows\characterSelect\main.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import { setSettings } from "../../shared/store/settings";

declare global {
  interface Window {
    ideun?: {
      closeCharacterSelect?: () => void;
    };
  }
}

function item(path: string) {
  return `/items/${encodeURIComponent(path)}`.replace(/%2F/g, "/");
}

function character(pathFromCharacters: string) {
  return `/characters/${pathFromCharacters
    .split("/")
    .map(encodeURIComponent)
    .join("/")}`;
}

function ButtonImg(props: {
  normal: string;
  hover: string;
  alt: string;
  onClick?: () => void;
  width?: string;
}) {
  const [hov, setHov] = React.useState(false);

  return (
    <img
      src={hov ? props.hover : props.normal}
      alt={props.alt}
      draggable={false}
      onClick={props.onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        width: props.width ?? "72%",
        maxWidth: 300,
        cursor: "pointer",
        userSelect: "none",
        WebkitUserDrag: "none",
        WebkitAppRegion: "no-drag",
      }}
    />
  );
}

function CharacterSelect() {
  const bg = item("page background.svg");
  const leftBtn = item("left button.svg");
  const rightBtn = item("right button.svg");
  const selectBtn = item("select button.svg");
  const selectBtnHover = item("select button hover.svg");

  const angelName = character("angel eye/angel.svg");
  const angelFrames = [
    character("angel eye/angel normal state/angel normal A.svg"),
    character("angel eye/angel normal state/angel normal B.svg"),
    character("angel eye/angel normal state/angel normal C.svg"),
    character("angel eye/angel normal state/angel normal D.svg"),
  ];

  const yaongName = character("yaong/yaong.svg");
  const yaongFrames = [
    character("yaong/yaong normal state/yaong normal A.svg"),
    character("yaong/yaong normal state/yaong normal B.svg"),
    character("yaong/yaong normal state/yaong normal C.svg"),
    character("yaong/yaong normal state/yaong normal D.svg"),
  ];

  const characters = [
    { id: "angel-normal-a" as const, nameSvg: angelName, frames: angelFrames },
    { id: "yaong-normal-a" as const, nameSvg: yaongName, frames: yaongFrames },
  ];

  const [idx, setIdx] = React.useState(0);
  const [frame, setFrame] = React.useState(0);

  React.useEffect(() => {
    const fps = 2.5;
    const ms = Math.floor(1000 / fps);
    const t = window.setInterval(() => setFrame((f) => (f + 1) % 4), ms);
    return () => window.clearInterval(t);
  }, []);

  const current = characters[idx];

  const onPrev = () => setIdx((i) => (i - 1 + characters.length) % characters.length);
  const onNext = () => setIdx((i) => (i + 1) % characters.length);

  const onSelect = async () => {
    await setSettings({ characterId: current.id });
    window.ideun?.closeCharacterSelect?.();
  };

  return (
    <div style={{ width: "100vw", height: "100vh", background: "#0b0b0b", display: "grid", placeItems: "center" }}>
      <div style={{ width: "min(520px, 96vw)", aspectRatio: "9 / 16", position: "relative", display: "grid", placeItems: "center" }}>
        <img
          src={bg}
          alt="background"
          draggable={false}
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "contain", userSelect: "none", WebkitUserDrag: "none", WebkitAppRegion: "no-drag" }}
        />

        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "8%", WebkitAppRegion: "drag", zIndex: 10 }} />

        <div style={{ position: "relative", width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", paddingTop: "80%", paddingBottom: "10%", gap: 18, WebkitAppRegion: "no-drag" }}>
          <div style={{ width: "100%", display: "grid", gridTemplateColumns: "1fr 2fr 1fr", alignItems: "center", padding: "0 10%" }}>
            <img src={leftBtn} alt="prev" draggable={false} onClick={onPrev} style={{ width: 56, justifySelf: "start", cursor: "pointer", userSelect: "none", WebkitUserDrag: "none" }} />
            <img src={current.frames[frame]} alt="character" draggable={false} style={{ width: "100%", maxWidth: 180, justifySelf: "center", objectFit: "contain", imageRendering: "pixelated", userSelect: "none", WebkitUserDrag: "none" }} />
            <img src={rightBtn} alt="next" draggable={false} onClick={onNext} style={{ width: 56, justifySelf: "end", cursor: "pointer", userSelect: "none", WebkitUserDrag: "none" }} />
          </div>

          <img src={current.nameSvg} alt="name" draggable={false} style={{ width: "36%", maxWidth: 180, marginTop: 10, userSelect: "none", WebkitUserDrag: "none" }} />

          <div style={{ width: "100%", display: "grid", placeItems: "center", marginTop: 10 }}>
            <ButtonImg normal={selectBtn} hover={selectBtnHover} alt="select" onClick={onSelect} width="66%" />
          </div>
        </div>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <CharacterSelect />
  </React.StrictMode>
);