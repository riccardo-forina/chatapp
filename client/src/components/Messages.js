import React, { Component } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";
import "./Messages.css";

export default class Messages extends Component {
  static propTypes = {
    isEmpty: PropTypes.bool
  };

  componentDidUpdate() {
    this.scrollToBottom();
  }

  componentDidMount() {
    this.scrollToBottom();
  }

  scrollToBottom() {
    this.messages.scrollTop = this.messages.scrollHeight;
  }

  render() {
    const { children, isEmpty } = this.props;
    return (
      <div className={classnames("Messages", {"is-empty": isEmpty})}>
        <div
          className="Messages-wrapper"
          ref={el => this.messages = el}
        >
          {children}
        </div>
      </div>
    );
  }
}
