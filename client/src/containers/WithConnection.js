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

    this.hello = this.hello.bind(this);
    this.setNick = this.setNick.bind(this);
    this.sendTypingFeedback = this.sendTypingFeedback.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
    this.deleteLastMessage = this.deleteLastMessage.bind(this);
    this.fadeLastMessage = this.fadeLastMessage.bind(this);
    this.setCountdown = this.setCountdown.bind(this);
  }

  componentDidMount() {
    this.socket = new WebSocket("ws://localhost:8080")

    this.socket.addEventListener("open", this.hello);

    this.socket.addEventListener("message", (event) => {
      const { isGuestConnected } = this.state;
      const { command, payload } = JSON.parse(event.data);
      console.log("On message", command, payload);

      switch (command) {
        case "hello":
          if (!isGuestConnected) {
            this.setState({
              isGuestConnected: true,
              guestNick: payload.nick
            });
            this.hello();
          }
          break;
        case "quit":
          this.setState({
            isGuestConnected: false,
            guestNick: undefined
          });
          break;
        case "typing":
          this.setState({
            isGuestTyping: true
          });
          break;
        case "setnick":
          this.setState({
            guestNick: payload.nick
          });
          break;
      }

    })
  }

  componentWillUnmount() {
    this.socket.close();
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

  hello() {
    const { myNick } = this.state;
    this.send({
      command: "hello",
      nick: myNick
    });
  }

  setNick(nick) {
    this.send({
      command: "setnick",
      nick
    });
    this.setState({
      myNick: nick
    });
  }

  sendTypingFeedback() {
    this.send({
      command: "typing",
    });

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