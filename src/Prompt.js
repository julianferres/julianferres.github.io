import "./Terminal.css";
import { getColourCommand } from "./utils/getColorCommand";

export default function Prompt(props) {
  return (
    <div className="input-container">
      <div className="prompt">
        <p className="arrow">➜</p>
        <p className="directory">&nbsp;~&nbsp;</p>
      </div>
      <form onSubmit={props.onSubmitCommand} style={{ flex: 1 }}>
        <input
          autoFocus={true}
          className="command-input"
          disabled={props.disabled}
          key={props.id}
          onBlur={({ target }) => target.focus()}
          onChange={(e) => props.setCurrentCommand(e.target.value)}
          ref={props.terminalInputRef}
          spellCheck={false}
          style={{ color: getColourCommand(props.currentCommand) }}
          type="text"
          value={props.currentCommand}
        />
      </form>
    </div>
  );
}
