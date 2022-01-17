import { useState, useEffect, useRef } from "react";
import "./Terminal.css";
import ConditionalTerminalHeader from "./ConditionalTerminalHeader";
import Prompt from "./Prompt";
import Delayed from "./utils/Delayed";
import CommandList from "./CommandList";

export default function Terminal() {
  const [pastCommands, setPastCommands] = useState(["help"]);
  const [currentCommand, setCurrentCommand] = useState("");
  const terminalInputRef = useRef();

  const executeCommand = (command) => {
    if (command === "clear") {
      // clear the terminal
      setPastCommands([]);
      setCurrentCommand("");
      return;
    }
    setPastCommands([...pastCommands, command]);
    setCurrentCommand("");
  };

  const onSubmitCommand = (e) => {
    e.preventDefault();

    setTimeout(function () {
      executeCommand(currentCommand);
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
        <Delayed waitBeforeShow={500}>
          <CommandList pastCommands={pastCommands} />
        </Delayed>
        <Delayed waitBeforeShow={1000}>
          <Prompt
            currentCommand={currentCommand}
            disabled={false}
            id={"input"}
            onSubmitCommand={onSubmitCommand}
            setCurrentCommand={setCurrentCommand}
            terminalInputRef={terminalInputRef}
          />
        </Delayed>
      </div>
    </div>
  );
}
