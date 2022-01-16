import Prompt from "./Prompt";

const getCommandOutput = (command, index) => {
  return (
    <div key={index}>
      <Prompt currentCommand={command} disabled={true} id={index} />
      <li key={index}>{command}</li>
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
