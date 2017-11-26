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
      const { isGuestConnected, messages } = this.state;
      const { command, payload } = JSON.parse(event.data);
      console.log("On message", command, payload);

      switch (command) {
        case "hello":
          if (!isGuestConnected) {
            this.setState({
              isGuestTyping: false,
              isGuestConnected: true,
              guestNick: payload.nick
            });
            this.hello();
          }
          break;
        case "quit":
          this.setState({
            isGuestTyping: false,
            isGuestConnected: false,
            guestNick: undefined
          });
          break;
        case "typing":
          this.setState({
            isGuestTyping: true
          });
          break;
        case "message": {
          const updatedMessages = [
            ...messages,
            {
              message: payload.message,
              isThinking: payload.isThinking,
              isReceived: true
            },
          ];
          this.setState({
            isGuestTyping: false,
            messages: updatedMessages
          });
          this.updateHistoryCache(updatedMessages);
          break;
        }
        case "undo": {
          const updatedMessages = messages.slice(0, -1);
          this.setState({
            isGuestTyping: false,
            messages: updatedMessages
          });
          this.updateHistoryCache(updatedMessages);
          break;
        }
        case "fadelast": {
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
          break;
        }
        case "setnick":
          this.setState({
            isGuestTyping: false,
            guestNick: payload.nick
          });
          break;
      }

    })
  }

  componentWillUnmount() {
    this.socket.close();
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

  sendMessage({message, isThinking=false}) {
    const { messages } = this.state;
    this.send({
      command: "message",
      message,
      isThinking
    });
    const updatedMessages = [
      ...messages,
      {
        message,
        isThinking,
        isReceived: false
      },
    ];
    this.setState({
      messages: updatedMessages
    });
    this.updateHistoryCache(updatedMessages);
  }

  deleteLastMessage() {
    const { messages } = this.state;
    this.send({
      command: "undo",
    });
    const updatedMessages = messages.slice(0, -1);
    this.setState({
      messages: updatedMessages
    });
    this.updateHistoryCache(updatedMessages);
  }

  fadeLastMessage() {
    const { messages } = this.state;
    if (messages.length > 0) {
      this.send({
        command: "fadelast",
      });
      const [lastMessage] = messages.slice(-1);
      const updatedMessages = [
        ...messages.slice(0, -1),
        {
          ...lastMessage,
          isFaded: true
        },
      ];
      this.setState({
        messages: updatedMessages
      });
      this.updateHistoryCache(updatedMessages);
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