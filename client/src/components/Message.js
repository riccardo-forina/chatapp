import React from "react";
import PropTypes from "prop-types";
import classnames from "classnames";
import "./Message.css";

const Message = ({ message, isReceived, isFaded, isThinking, isDeleted, isHighlighted }) => {
  const cs = classnames("Message", {
    "is-sent": !isReceived,
    "is-received": isReceived,
    "is-faded": isFaded,
    "is-thinking": isThinking,
    "is-deleted": isDeleted,
    "is-highlighted": isHighlighted,
  });
  message = message
    .replace(/\(smile\)/g, "&#128512;")
    .replace(/\(wink\)/g, "&#128521;");
  return (
    <div className={cs}>
      <div
        className="Message-bubble"
        dangerouslySetInnerHTML={{__html: message}}
      />
    </div>
  );
};

Message.propTypes = {
  message: PropTypes.string.isRequired,
  isReceived: PropTypes.bool.isRequired,
  isFaded: PropTypes.bool,
  isThinking: PropTypes.bool,
  isDeleted: PropTypes.bool,
  isHighlighted: PropTypes.bool,
};

Message.defaultProps = {
  isFaded: false,
  isThinking: false,
  isDeleted: false,
  isHighlighted: false,
};

export default Message;