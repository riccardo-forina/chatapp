import React, { Component } from 'react';
import WithConnection from "./containers/WithConnection";
import Messages from "./components/Messages";
import Message from "./components/Message";
import MessageInput from "./components/MessageInput";
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);

    this.onSendMessage = this.onSendMessage.bind(this);
  }

  onSendMessage({
    message,
    sendMessage,
    setNick,
    deleteLastMessage,
    fadeLastMessage,
    setCountdown
  }) {
    message = message.slice(0, -1); // get rid of the newline

    if (message.startsWith("/")) {
      const [command, ...args] = message.slice(1).split(" ");
      switch (command) {
        case "nick":
          const [nick] = args;
          if (nick && nick.length > 0) {
            setNick(nick);
          }
          break;
      }
    } else {
      sendMessage({
        message
      });
    }
  }

  render() {
    return (
      <WithConnection
        render={({
          myNick,
          messages,
          isGuestConnected,
          isGuestTyping,
          guestNick,
          setNick,
          sendTypingFeedback,
          sendMessage,
          deleteLastMessage,
          fadeLastMessage,
          setCountdown,
        }) => (
          <div className="App">
            <div className="App-header">
              { isGuestConnected
                ? <span>Hi {myNick}, you are chatting with <strong>{guestNick}</strong></span>
                : <span>No user connected :(</span> }
              { isGuestTyping && <i>Typing a message...</i>}
            </div>
            <div className="App-body">
              <Messages>
                { messages.map((props, idx) =>
                  <Message key={idx} {...props} />) }
              </Messages>
            </div>
            <div className="App-footer">
              <MessageInput
                enabled={isGuestConnected}
                onBeginTyping={_ => sendTypingFeedback()}
                onSend={(message) => this.onSendMessage({
                  message,
                  sendMessage,
                  setNick,
                  deleteLastMessage,
                  fadeLastMessage,
                  setCountdown
                })}
              />
            </div>
          </div>

        )}
      />
    );
  }
}

export default App;
