export default function CommandList(props) {
  return (
    <ul className="past-commands">
      {props.pastCommands.map((command, index) => (
        <li key={index}>{command}</li>
      ))}
    </ul>
  );
}
