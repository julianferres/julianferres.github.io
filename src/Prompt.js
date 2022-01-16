import "./Terminal.css";
import { getColourCommand } from "./utils/getColorCommand";

export default function Prompt(props) {
  return (
    <div className="input-container">
      <div className="prompt">
        <p className="arrow">➜</p>
        <p className="directory">&nbsp;~&nbsp;</p>
      </div>
      <form onSubmit={props.onSubmitCommand}>
        <input
          key={props.id}
          ref={props.terminalInputRef}
          style={{ color: getColourCommand(props.currentCommand) }}
          type="text"
          className="command-input"
          autoFocus={true}
          value={props.currentCommand}
          disabled={props.disabled}
          onChange={(e) => props.setCurrentCommand(e.target.value)}
          onBlur={({ target }) => target.focus()}
        />
      </form>
    </div>
  );
}
