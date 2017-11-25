import React from "react";
import PropTypes from "prop-types";
import classnames from "classnames";
import "./Message.css";

const Message = ({ message, isReceived, isFaded, isThinking, isDeleted }) => {
  const cs = classnames("Message", {
    "is-sent": !isReceived,
    "is-received": isReceived,
    "is-faded": isFaded,
    "is-thinking": isThinking,
    "is-deleted": isDeleted
  })
  return (
    <div className={cs}>
      <div className="Message-bubble">
        { message }
      </div>
    </div>
  );
};

Message.propTypes = {
  message: PropTypes.string.isRequired,
  isReceived: PropTypes.bool.isRequired,
  isFaded: PropTypes.bool,
  isThinking: PropTypes.bool,
  isDeleted: PropTypes.bool
};

Message.defaultProps = {
  isFaded: false,
  isThinking: false,
  isDeleted: false
};

export default Message;