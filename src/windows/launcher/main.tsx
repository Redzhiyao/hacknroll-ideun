import React from "react";
import ReactDOM from "react-dom/client";

const onSelectCharacter = () => {
  window.ideun?.openCharacterSelect?.();
};

declare global {
  interface Window {
    ideun?: {
      openCharacterSelect?: () => void;
      openSettingsFromLauncher?: () => void;
      quit?: () => void;
    };
  }
}

function img(path: string) {
  // assets are in public/items => served at /items/...
  return `/items/${encodeURIComponent(path)}`.replace(/%2F/g, "/");
}

function ButtonImg(props: {
  normal: string;
  hover: string;
  alt: string;
  onClick?: () => void;
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
        width: "72%",
        maxWidth: 320,
        cursor: "pointer",
        userSelect: "none",
        WebkitUserDrag: "none",
      }}
    />
  );
}

function Launcher() {
  const bg = img("page background.svg");
  const logo = img("ideun logo.png");
  const word = img("ideun.svg");

  const selectBtn = img("select character button.svg");
  const selectBtnHover = img("select character button hover.svg");

  const settingsBtn = img("settings button.svg");
  const settingsBtnHover = img("settings button hover.svg");

  const exitBtn = img("exit button.svg");
  const exitBtnHover = img("exit button hover.svg");

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        background: "#0b0b0b",
        display: "grid",
        placeItems: "center",
        overflow: "hidden",
      }}
    >
      {/* Phone frame container */}
      <div
        style={{
          width: "min(420px, 92vw)",
          aspectRatio: "9 / 16",
          position: "relative",
          display: "grid",
          placeItems: "center",
        }}
      >
        {/* Background SVG (phone frame) */}
        <img
          src={bg}
          alt="background"
          draggable={false}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "contain",
            userSelect: "none",
            WebkitUserDrag: "none",
          }}
        />

        {/* Content layer */}
        <div
          style={{
            position: "relative",
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            paddingTop: "90%",
            paddingBottom: "8%",
            gap: 18,
          }}
        >
          <img
            src={logo}
            alt="ideun logo"
            draggable={false}
            style={{
              width: "18%",
              minWidth: 66,
              maxWidth: 98,
              userSelect: "none",
              WebkitUserDrag: "none",
            }}
          />

          <img
            src={word}
            alt="ideun"
            draggable={false}
            style={{
              width: "34%",
              minWidth: 100,
              maxWidth: 180,
              userSelect: "none",
              WebkitUserDrag: "none",
              marginTop: 4,
              marginBottom: 18,
            }}
          />

          <div style={{ display: "flex", flexDirection: "column", gap: 14, width: "100%", alignItems: "center" }}>
            <ButtonImg
              normal={selectBtn}
              hover={selectBtnHover}
              alt="select character"
              onClick={() => window.ideun?.openCharacterSelect?.()}
            />

            <ButtonImg
              normal={settingsBtn}
              hover={settingsBtnHover}
              alt="settings"
              onClick={() => window.ideun?.openSettingsFromLauncher?.()}
            />

            <ButtonImg
              normal={exitBtn}
              hover={exitBtnHover}
              alt="exit"
              onClick={() => window.ideun?.quit?.()}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Launcher />
  </React.StrictMode>
);
