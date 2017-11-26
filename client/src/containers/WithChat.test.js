import React from 'react';
import ReactDOM from 'react-dom';
import WithChat from './WithChat';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<WithChat render={_ => <div />} />, div);
});

it('calls the render prop with the expected object', () => {
  const renderFn = jest.fn(_ => <div />);
  const div = document.createElement('div');
  ReactDOM.render(<WithChat render={renderFn}/>, div);
  expect(renderFn.mock.calls.length).toBe(1);
  expect(Object.keys(renderFn.mock.calls[0][0]).sort()).toEqual([
    "myNick",
    "messages",
    "isGuestConnected",
    "isGuestTyping",
    "guestNick",
    "countdown",
    "setNick",
    "sendTypingFeedback",
    "sendMessage",
    "deleteLastSentMessage",
    "fadeLastMessage",
    "setCountdown",
  ].sort());
});

it('render props defaults are sane', () => {
  const renderFn = jest.fn(_ => <div />);
  const div = document.createElement('div');
  ReactDOM.render(<WithChat render={renderFn}/>, div);
  const {
    myNick,
    messages,
    isGuestConnected,
    isGuestTyping,
    guestNick,
    countdown
  } = renderFn.mock.calls[0][0];
  expect(myNick.length).toBeGreaterThan(0);
  expect(Array.isArray(messages)).toBe(true);
  expect(isGuestConnected).toBe(false);
  expect(isGuestTyping).toBe(false);
  expect(guestNick).toBe(undefined);
  expect(countdown).toBe(undefined);
  expect(countdown).toBe(undefined);
});

it('can change nick', () => {
  const renderFn = jest.fn(_ => <div />);
  const div = document.createElement('div');
  ReactDOM.render(<WithChat render={renderFn}/>, div);
  const { setNick } = renderFn.mock.calls[0][0];
  setNick("test");
  const { myNick } = renderFn.mock.calls[1][0];
  expect(myNick).toBe("test");
});

it('nick get saved on localStorage', () => {
  expect(localStorage.getItem("nick")).toBe("test");
});

it('can send a message', () => {
  const renderFn = jest.fn(_ => <div />);
  const div = document.createElement('div');
  ReactDOM.render(<WithChat render={renderFn}/>, div);
  const { sendMessage } = renderFn.mock.calls[0][0];
  sendMessage({message: "test"});
  const { messages } = renderFn.mock.calls[1][0];
  expect(messages.length).toBe(1);
  expect(messages[0].message).toBe("test");
});

it('mesages are saved on localStorage', () => {
  const messages = JSON.parse(localStorage.getItem("history"));
  expect(messages.length).toBe(1);
  expect(messages[0].message).toBe("test");
});

it('can delete a message', () => {
  const renderFn = jest.fn(_ => <div />);
  const div = document.createElement('div');
  ReactDOM.render(<WithChat render={renderFn}/>, div);
  const { deleteLastSentMessage } = renderFn.mock.calls[0][0];
  deleteLastSentMessage();
  const { messages } = renderFn.mock.calls[1][0];
  expect(messages.length).toBe(0);
});

it('mesages are saved on localStorage after a delete', () => {
  const messages = JSON.parse(localStorage.getItem("history"));
  expect(messages.length).toBe(0);
});

