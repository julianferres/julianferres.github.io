import NavButtons from "./NavButtons";
import { FaGithubSquare } from "react-icons/fa";
import "./Terminal.css";

export default function Terminal() {
  return (
    <div className="terminal">
      <div className="terminal-header">
        <NavButtons className="buttons" />
        <h1 className="title">
          <FaGithubSquare style={{ fontSize: "14px", fontWeight: 400 }} />

          <a className="title-href" href="https://github.com/julianferres">
            https://github.com/julianferres
          </a>
        </h1>
      </div>
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
