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
  linkedin: "https://www.linkedin.com/in/julianferres/",
  codeforces: "https://codeforces.com/profile/julianferres",
  email: "julianferres@gmail.com",
  resume: "./julianferres_resume.pdf",
};

const HelpTitle = (props) => {
  return <span className="help-title">{props.children}</span>;
};

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
            href={contactInfo.codeforces}
          >
            Competitive programming
          </a>
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
            {contactInfo.github}
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
            {contactInfo.linkedin}
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
            {contactInfo.codeforces}
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
          Available commands:
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
  return <p>comand not found:&nbsp;{command}</p>;
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
