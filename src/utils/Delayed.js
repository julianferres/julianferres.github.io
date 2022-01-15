import PropTypes from "prop-types";
import { useState, useRef, useEffect } from "react";

function useDidMount() {
  const didMountRef = useRef(true);

  useEffect(() => {
    didMountRef.current = false;
  }, []);
  return didMountRef.current;
}

function Delayed(props) {
  const didMount = useDidMount();
  const [hidden, setHidden] = useState(true);

  useEffect(() => {
    if (didMount) {
      setTimeout(() => {
        setHidden(false);
      }, props.waitBeforeShow);
    }
  }, [didMount, props.waitBeforeShow]);

  return hidden ? <></> : props.children;
}

Delayed.propTypes = {
  waitBeforeShow: PropTypes.number.isRequired,
};

export default Delayed;
