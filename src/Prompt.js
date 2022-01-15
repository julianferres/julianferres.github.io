import "./Terminal.css";

export default function Prompt() {
  return (
    <div className="prompt">
      <p className="arrow">➜</p>
      <p className="directory">&nbsp;~&nbsp;</p>
    </div>
  );
}
