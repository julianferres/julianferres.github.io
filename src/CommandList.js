import Prompt from "./Prompt";

const commandMap = {
  about: "sobre",
  clear: "limpiar",
  help: "ayuda",
};

const getOutputColor = (command) => {
  // get the value from commandMap or "wrong command" if not found
  return commandMap[command] ? "rgb(238, 238, 238)" : "red";
};

const getCommandOutput = (command, index) => {
  return (
    <div key={index}>
      <Prompt currentCommand={command} disabled={true} id={index} />
      <li key={index} style={{ color: getOutputColor(command) }}>
        {
          // get the value from commandMap or "wrong command" if not found
          commandMap[command] || "comando incorrecto"
        }
      </li>
    </div>
  );
};

export default function CommandList(props) {
  return (
    <ul className="past-commands">
      {props.pastCommands.map((command, index) =>
        getCommandOutput(command, index)
      )}
    </ul>
  );
}
