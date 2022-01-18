import React from "react";
import { FaGithub } from "react-icons/fa";
import NavButtons from "./NavButtons";
import "./Terminal.css";

const GITHUB = "https://github.com/julianferres";
const GITHUB_SHORT = "julianferres";

const compactTitle = {
  animation: "titleAnimationCompact 500ms ease",
  justifyContent: "right", // Move title to the right when compact
  marginRight: "20px",
};
const fullSizeTitle = {
  animation: "titleAnimationFullSize 500ms ease",
};

export default function ConditionalTerminalHeader() {
  /* Manage screen width changes */
  const [width, setWidth] = React.useState(window.innerWidth);
  const breakpoint = 700;
  React.useEffect(() => {
    const handleResizeWindow = () => setWidth(window.innerWidth);
    // subscribe to window resize event "onComponentDidMount"
    window.addEventListener("resize", handleResizeWindow);
    return () => {
      // unsubscribe "onComponentDestroy"
      window.removeEventListener("resize", handleResizeWindow);
    };
  }, []);

  const compact = width < breakpoint;

  return (
    <div className="terminal-header">
      <NavButtons className="buttons" />
      <h1 className="title" style={compact ? compactTitle : fullSizeTitle}>
        <FaGithub style={{ fontSize: "16px", fontWeight: 400 }} />
        <a
          className="title-href"
          href={GITHUB}
          target="_blank"
          rel="noreferrer"
        >
          {compact ? GITHUB_SHORT : GITHUB}
        </a>
      </h1>
    </div>
  );
}
