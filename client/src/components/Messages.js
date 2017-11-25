import React from "react";
import classnames from "classnames";

const Messages = ({ children }) =>
  <div className={classnames("Messages", {"is-empty": React.Children.count(children) === 0 })}>
    {children}
  </div>;

export default Messages;