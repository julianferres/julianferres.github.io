import { useState, useEffect, useRef } from "react";
import "./Terminal.css";
import ConditionalTerminalHeader from "./ConditionalTerminalHeader";
import Prompt from "./Prompt";
import Delayed from "./utils/Delayed";
import CommandList from "./CommandList";

export default function Terminal() {
  const [pastCommands, setPastCommands] = useState([]);
  const [currentCommand, setCurrentCommand] = useState("");
  const terminalInputRef = useRef();

  const onSubmitCommand = (e) => {
    e.preventDefault();

    setTimeout(function () {
      setPastCommands([...pastCommands, currentCommand]);
      setCurrentCommand("");
      e.target.reset();
    }, 150); // Simulate console delay

    //scroll to bottom
  };

  useEffect(() => {
    terminalInputRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [pastCommands, terminalInputRef]);

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
          <CommandList pastCommands={pastCommands} />
          <div className="input-container">
            <Prompt />
            <form onSubmit={onSubmitCommand}>
              <input
                ref={terminalInputRef}
                type="text"
                className="command-input"
                autoFocus={true}
                onChange={(e) => setCurrentCommand(e.target.value)}
                onBlur={({ target }) => target.focus()}
              />
            </form>
          </div>
        </Delayed>
      </div>
    </div>
  );
}
