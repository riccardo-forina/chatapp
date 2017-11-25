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
    throw "TODO";
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
            <Messages>
              { messages.map(({ id, ...props}) =>
                <Message key={id} {...props} />) }
            </Messages>
            <MessageInput
              enabled={isGuestConnected}
              onBeginTyping={_ => this.sendTypingFeedback()}
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

        )}
      />
    );
  }
}

export default App;
