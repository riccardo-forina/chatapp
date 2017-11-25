import React from "react";
import PropTypes from "prop-types";
import classnames from "classnames";

const MessageInput = ({ enabled, onBeginTyping, onSend }) => {
  const cs = classnames("MessageInput", {
    "is-disabled": !enabled,
  });
  return (
    <div className={cs}>
      <textarea
        disabled={!enabled}
        onChange={onBeginTyping}
        onKeyUp={ev => {
          const keycode = (ev.keyCode ? ev.keyCode : ev.which);
          if (keycode === 13) {
            onSend(ev.target.value);
            ev.target.value = "";
          }
        }}
      />
    </div>
  );
};

MessageInput.propTypes = {
  onBeginTyping: PropTypes.func,
  onSend: PropTypes.func,
  enabled: PropTypes.bool
};

MessageInput.defaultProps = {
  enabled: false,
  onBeginTyping: _ => false, // noop
  onSend: _ => false, // noop
};

export default MessageInput;