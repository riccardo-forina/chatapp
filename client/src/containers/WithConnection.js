import React, { Component } from "react";
import PropTypes from "prop-types";

export default class WithConnection extends Component {
  static propTypes = {
    render: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);

    // naive new/returning user check
    let userId = localStorage.getItem("userId");
    try {
      if (!userId) {
        userId = `${new Date().getTime() + Math.random()}`
        localStorage.setItem("userId", userId);
      }
    } catch(e) {
      throw new Error(`FATAL: can't set a unique user id. ${e.message}`);
    }

    let messages = [];
    let myNick;

    // session restoring
    try {
      const serializedMessages =
        localStorage.getItem("history") || "[]";
      const serializedMyNick =
        localStorage.getItem("nick") || `"User ${userId}"`;
      messages = JSON.parse(serializedMessages);
      myNick = JSON.parse(serializedMyNick);
    } catch (e) {
      // noop
    }

    this.state = {
      userId,
      myNick,
      messages,
      isGuestConnected: false,
      isGuestTyping: false,
      guestNick: undefined,
    };

    this.setNick = this.setNick.bind(this);
    this.sendTypingFeedback = this.sendTypingFeedback.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
    this.deleteLastMessage = this.deleteLastMessage.bind(this);
    this.fadeLastMessage = this.fadeLastMessage.bind(this);
    this.setCountdown = this.setCountdown.bind(this);
  }

  componentDidMount() {
    this.socket = new WebSocket("ws://localhost:8080")

    this.socket.addEventListener("open", () => {
      const { myNick } = this.state;
      this.setNick(myNick);
    })
  }

  send({ command, ...payload}) {
    const { userId } = this.state;
    const ts = new Date().getTime();
    this.socket.send(JSON.stringify({
      ts,
      userId,
      command,
      payload
    }));
  }

  setNick(nick) {
    this.send({
      command: "setnick",
      nick
    });
    this.setState({
      myNick: nick
    })
  }

  sendTypingFeedback() {
    throw "TODO";
  }

  sendMessage(message) {
    throw "TODO";
  }

  deleteLastMessage() {
    throw "TODO";
  }

  fadeLastMessage() {
    throw "TODO";
  }

  setCountdown(duration, url) {
    throw "TODO";
  }

  render() {
    const { render } = this.props;
    const {
      myNick,
      messages,
      isGuestConnected,
      isGuestTyping,
      guestNick,
    } = this.state;

    return render({
      myNick,
      messages,
      isGuestConnected,
      isGuestTyping,
      guestNick,
      setNick: this.setNick,
      sendTypingFeedback: this.sendTypingFeedback,
      sendMessage: this.sendMessage,
      deleteLastMessage: this.deleteLastMessage,
      fadeLastMessage: this.fadeLastMessage,
      setCountdown: this.setCountdown,
    });
  }
}