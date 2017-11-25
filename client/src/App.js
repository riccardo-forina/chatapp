import React, { Component } from 'react';
import WithConnection from "./containers/WithConnection";
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Welcome to React</h1>
        </header>
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
            messages.map((m, idx) => <p key={idx}>{m}</p>)
          )}
        />
      </div>
    );
  }
}

export default App;
