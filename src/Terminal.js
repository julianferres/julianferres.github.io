import "./Terminal.css";
import ConditionalTerminalHeader from "./ConditionalTerminalHeader";

export default function Terminal() {
  return (
    <div className="terminal">
      <ConditionalTerminalHeader />
      <div className="terminal-body">
        <p>Welcome to Julian Ferres' webpage</p>
        <p>Welcome to Julian Ferres' webpage</p>
        <p>Welcome to Julian Ferres' webpage</p>
        <p>Welcome to Julian Ferres' webpage</p>
        <p>Welcome to Julian Ferres' webpage</p>
        <input
          type="text"
          className="command"
          autoFocus={true}
          onBlur={({ target }) => target.focus()}
        />
      </div>
    </div>
  );
}
