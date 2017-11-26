import React, { Component } from "react";
import PropTypes from "prop-types";

export default class WithChat extends Component {
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
      myNick =
        localStorage.getItem("nick") || `User ${userId}`;
      messages = JSON.parse(serializedMessages);
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

    this.onSocketMessage = this.onSocketMessage.bind(this);
    this.hello = this.hello.bind(this);
    this.setNick = this.setNick.bind(this);
    this.sendTypingFeedback = this.sendTypingFeedback.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
    this.deleteLastMessage = this.deleteLastMessage.bind(this);
    this.fadeLastMessage = this.fadeLastMessage.bind(this);
    this.setCountdown = this.setCountdown.bind(this);
  }

  componentDidMount() {
    this.socket = new WebSocket(`ws://${document.location.hostname}:8080`)

    this.socket.addEventListener("open", this.hello);

    this.socket.addEventListener("message", this.onSocketMessage)
  }

  componentWillUnmount() {
    this.socket.close();
  }

  onSocketMessage(event) {
    const { command, payload } = JSON.parse(event.data);
    console.log("On message", command, payload);

    switch (command) {
      case "hello":
        this.onHello(payload)
        break;
      case "quit":
        this.onQuit();
        break;
      case "typing":
        this.onTyping()
        break;
      case "message":
        this.onMessage({...payload, isReceived: true});
        break;
      case "undo":
        this.onUndo(payload);
        break;
      case "fadelast":
        this.onFadeLast()
        break;
      case "setnick":
        this.onSetGuestNick(payload);
        break;
    }
  }

  onHello({ nick }) {
    const { isGuestConnected } = this.state;
    if (!isGuestConnected) {
      this.setState({
        isGuestTyping: false,
        isGuestConnected: true,
        guestNick: nick
      });
      this.hello();
    }
  }

  onQuit() {
    this.setState({
      isGuestTyping: false,
      isGuestConnected: false,
      guestNick: undefined
    });
  }

  onTyping() {
    this.setState({
      isGuestTyping: true
    });
  }

  onMessage({ message, isThinking, isHighlighted, isReceived }) {
    const { messages } = this.state;
    const updatedMessages = [
      ...messages,
      {
        message,
        isThinking,
        isHighlighted,
        isReceived,
      },
    ];
    this.setState({
      isGuestTyping: false,
      messages: updatedMessages
    });
  }

  onUndo() {
    const { messages } = this.state;
    const updatedMessages = messages.slice(0, -1);
    this.setState({
      isGuestTyping: false,
      messages: updatedMessages
    });
    this.updateHistoryCache(updatedMessages);
  }

  onFadeLast() {
    const { messages } = this.state;
    const [lastMessage] = messages.slice(-1);
    const updatedMessages = [
      ...messages.slice(0, -1),
      {
        ...lastMessage,
        isFaded: true
      },
    ];
    this.setState({
      isGuestTyping: false,
      messages: updatedMessages
    });
    this.updateHistoryCache(updatedMessages);
  }

  onSetGuestNick({ nick }) {
    this.setState({
      isGuestTyping: false,
      guestNick: nick
    });
  }

  updateHistoryCache(messages) {
    localStorage.setItem("history",
      JSON.stringify(messages.slice(-10)));
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
    localStorage.setItem("nick", nick);
  }

  sendTypingFeedback() {
    this.send({
      command: "typing",
    });
  }

  sendMessage({message, isThinking=false, isHighlighted=false}) {
    this.send({
      command: "message",
      message,
      isThinking,
      isHighlighted
    });
    this.onMessage({ message, isThinking, isHighlighted, isReceived: false });
  }

  deleteLastMessage() {
    this.send({
      command: "undo",
    });
    this.onUndo();
  }

  fadeLastMessage() {
    const { messages } = this.state;
    if (messages.length > 0) {
      this.send({
        command: "fadelast",
      });
      this.onFadeLast();
    }
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