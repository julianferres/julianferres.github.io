import Prompt from "./Prompt";

const valid_commands = ["about", "clear", "help"];

const getCommandBody = (command) => {
  if (command === "about") {
    return (
      <>
        <p>
          Hi! I'm Julian, a Software Engineer and incoming Full-time Employee at
          Facebook, London.
          <br />
          <br />
        </p>
        <p>
          My specialty is designing and implementing large and scalable
          distributed systems and infrastructure. <br />
          <br />
          I'm also very interested in Full Stack Development, specially in the
          MERN stack. <br />
          In my spare time, I enjoy doing{" "}
          <a
            target="_blank"
            rel="noreferrer"
            className="paragraph-href"
            href="https://codeforces.com/profile/julianferres"
          >
            Competitive programming
          </a>
        </p>
      </>
    );
  }
  if (command === "help") {
    return "help";
  }
  return <p>comand not found:&nbsp;{command}</p>;
};

const getOutputColor = (command) => {
  // get the value from commandMap or "wrong command" if not found
  return valid_commands.includes(command) ? "rgb(238, 238, 238)" : "#ff5b5b";
};

const getCommandOutput = (command, index) => {
  const commandBody = getCommandBody(command);

  return (
    <div key={index}>
      <Prompt currentCommand={command} disabled={true} id={index} />
      <li key={index} style={{ color: getOutputColor(command) }}>
        {commandBody}
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
