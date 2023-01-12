import { useState, useEffect } from "react";
import Prompt from "./Prompt";
import { FaGithub, FaLinkedin, FaCode, FaEnvelope } from "react-icons/fa";
import { getOutputColor } from "./utils/getColorCommand";

const iconStyle = {
  fontSize: "14px",
  fontWeight: 400,
  color: "rgb(235, 235, 235)",
};

const contactInfo = {
  github: "https://github.com/julianferres",
  shortGithub: "Github profile",
  linkedin: "https://www.linkedin.com/in/julianferres/",
  shortLinkedin: "Linkedin profile",
  codeforces: "https://codeforces.com/profile/julianferres",
  shortCodeforces: "Codeforces profile",
  email: "julianferres@gmail.com",
  resume: "./julianferres_resume.pdf",
};

const HelpTitle = (props) => {
  return <span className="help-title">{props.children}</span>;
};

const getCommandBody = (command, compact) => {
  if (command === "about") {
    return (
      <>
        <p>
          Hey! Julian here, a Software Engineer and ex-Facebook Intern at London.
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
            href={contactInfo.codeforces}
          >
            Competitive programming
          </a>.
          <br /> <br />
          Please check out my{" "}
          <a
            target="_blank"
            rel="noreferrer"
            className="paragraph-href"
            href={contactInfo.resume}
          >
            resume
          </a>{" "}
          and{" "}
          <a
            target="_blank"
            rel="noreferrer"
            className="paragraph-href"
            href={contactInfo.github}
          >
            Github profile
          </a>{" "}
          for more information.
        </p>
      </>
    );
  }
  if (command === "contact") {
    return (
      <>
        <p className="contact-p">
          <FaGithub style={{ iconStyle }} />
          &nbsp;
          <a
            target="_blank"
            rel="noreferrer"
            className="contact-href"
            href={contactInfo.github}
          >
            {compact ? contactInfo.shortGithub : contactInfo.github}
          </a>
        </p>
        <p className="contact-p">
          <FaLinkedin style={{ iconStyle }} />
          &nbsp;
          <a
            target="_blank"
            rel="noreferrer"
            className="contact-href"
            href={contactInfo.linkedin}
          >
            {compact ? contactInfo.shortLinkedin : contactInfo.linkedin}
          </a>
        </p>
        <p className="contact-p">
          <FaCode style={{ iconStyle }} />
          &nbsp;
          <a
            target="_blank"
            rel="noreferrer"
            className="contact-href"
            href="https://codeforces.com/profile/julianferres/"
          >
            {compact ? contactInfo.shortCodeforces : contactInfo.codeforces}
          </a>
        </p>
        <p className="contact-p">
          <FaEnvelope style={{ iconStyle }} />
          &nbsp;
          <a
            target="_blank"
            rel="noreferrer"
            className="contact-href"
            href="mailto:julianferres@gmail.com"
          >
            julianferres@gmail.com
          </a>
        </p>
      </>
    );
  }
  if (command === "help") {
    return (
      <>
        <p>
          Welcome! The available commands are:
          <br /> <br />
          <HelpTitle>about</HelpTitle>
          <br />
          &nbsp;- Brief description of myself.
          <br />
          <br />
        </p>
        <p>
          <HelpTitle>contact</HelpTitle>
          <br />
          &nbsp;- My contact information.
          <br />
          <br />
        </p>
        <p>
          <HelpTitle>clear</HelpTitle>
          <br />
          &nbsp;- clears the terminal.
          <br />
          <br />
        </p>
        <p>
          <HelpTitle>help</HelpTitle>
          <br />
          &nbsp;- Brings up this help menu.
          <br />
          <br />
        </p>
      </>
    );
  }
  return <p>command not found:&nbsp;{command}</p>;
};

const getCommandOutput = (command, compact, index) => {
  const commandBody = getCommandBody(command, compact);

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
  const [width, setWidth] = useState(window.innerWidth);
  const breakpoint = 700;

  useEffect(() => {
    const handleResizeWindow = () => setWidth(window.innerWidth);
    // subscribe to window resize event "onComponentDidMount"
    window.addEventListener("resize", handleResizeWindow);
    return () => {
      // unsubscribe "onComponentDestroy"
      window.removeEventListener("resize", handleResizeWindow);
    };
  }, []);

  const compact = width < breakpoint;

  return (
    <ul className="past-commands">
      {props.pastCommands.map((command, index) =>
        getCommandOutput(command, compact, index)
      )}
    </ul>
  );
}
