import React, { Component } from "react";
import PropTypes from "prop-types";

export default class WithConnection extends Component {
  static propTypes = {
    render: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);

    let messages = [];
    let userId;
    let myNick;
    try {
      userId =
        localStorage.getItem("userId") || `${new Date().getTime()}`;
      const serializedMessages =
        localStorage.getItem("history") || "[]";
      const serializedMyNick =
        localStorage.getItem("nick") || `User ${userId}`;
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
    const socket = new WebSocket("ws://localhost:8080")

    socket.addEventListener("open", (event) => {
      socket.send("Hello");
    })
  }

  setNick(nick) {
    throw "TODO";
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