export default function CommandList(props) {
  return (
    <ul>
      {props.pastCommands.map((command, index) => (
        <li key={index}>{command}</li>
      ))}
    </ul>
  );
}
