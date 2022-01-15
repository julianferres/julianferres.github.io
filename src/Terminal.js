import "./Terminal.css";
import ConditionalTerminalHeader from "./ConditionalTerminalHeader";
import Prompt from "./Prompt";
import Delayed from "./utils/Delayed";

export default function Terminal() {
  return (
    <div className="terminal">
      <ConditionalTerminalHeader />
      <div className="terminal-body">
        <p>Welcome to Julian Ferres' webpage</p>
        <Delayed waitBeforeShow={800}>
          <p>Second Welcome to Julian Ferres' webpage</p>
        </Delayed>
        <Delayed waitBeforeShow={1800}>
          <p>Third Welcome to Julian Ferres' webpage </p>
        </Delayed>
        <Delayed waitBeforeShow={2000}>
          <div className="input-container">
            <Prompt />
            <input
              type="text"
              className="command-input"
              autoFocus={true}
              onBlur={({ target }) => target.focus()}
            />
          </div>
        </Delayed>
      </div>
    </div>
  );
}
