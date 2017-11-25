import React, { Component } from 'react';
import WithConnection from "./containers/WithConnection";
import Messages from "./components/Messages";
import Message from "./components/Message";
import './App.css';

class App extends Component {
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
          </div>

        )}
      />
    );
  }
}

export default App;
