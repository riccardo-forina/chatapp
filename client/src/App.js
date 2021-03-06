import React, { Component } from 'react';
import WithChat from "./containers/WithChat";
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
    deleteLastSentMessage,
    fadeLastMessage,
    setCountdown
  }) {
    message = message.slice(0, -1); // get rid of the newline

    if (message.startsWith("/")) {
      const [command, ...args] = message.slice(1).split(" ");
      switch (command) {
        case "nick": {
          const [nick] = args;
          if (nick && nick.length > 0) {
            setNick(nick);
          }
          break;
        }
        case "think": {
          const [message] = args;
          if (message && message.length > 0) {
            sendMessage({message, isThinking: true});
          }
          break;
        }
        case "highlight": {
          const [message] = args;
          if (message && message.length > 0) {
            sendMessage({message, isHighlighted: true});
          }
          break;
        }
        case "oops":
          deleteLastSentMessage();
          break;
        case "fadelast":
          fadeLastMessage();
          break;
        case "countdown": {
          let [duration, url] = args;
          duration = parseInt(duration, 10);
          if (duration && url && duration > 0 && url.length > 0 && url.match(/^http[s]?:\/\/.+/)) {
            setCountdown({duration, url});
          }
          break;
        }
      }
    } else {
      sendMessage({
        message
      });
    }
  }

  render() {
    return (
      <WithChat
        render={({
          myNick,
          messages,
          isGuestConnected,
          isGuestTyping,
          guestNick,
          countdown,
          setNick,
          sendTypingFeedback,
          sendMessage,
          deleteLastSentMessage,
          fadeLastMessage,
          setCountdown,
        }) => (
          <div className="App">
            <div className="App-header">
              { isGuestConnected
                ? <span>To: {guestNick} {isGuestTyping && <i>✍️</i>}</span>
                : <span>To: no user connected :(</span> }
            </div>
            <div className="App-body">
              <Messages isEmpty={messages.length === 0 && !isGuestTyping}>
                { messages.map((props, idx) =>
                  <Message key={idx} {...props} />) }
                {countdown &&
                  <Message
                    message={`${countdown.left}...`}
                    isThinking
                    isReceived
                  /> }
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
                  deleteLastSentMessage,
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
