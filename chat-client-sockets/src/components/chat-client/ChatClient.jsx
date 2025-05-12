import React, { useState, useEffect } from 'react';
import './chatClient.css';
import io from 'socket.io-client';
import Picker from 'emoji-picker-react';

const socket = io('https://chat-server-edwin-dev.onrender.com/');

export const ChatClient = () => {
  const [message, setMessage] = useState('');
  const [username, setUserName] = useState('Machine');
  const [showPicker, setShowPicker] = useState(false);
  const [listMessages, setListMessages] = useState([
    {
      body: "Bienvenidos",
      user: "Machine",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

    }
  ]);

  const onEmojiClick = (emojiObject) => {
    setMessage(prev => prev + emojiObject.emoji);
    setShowPicker(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newMsg = {
      body: message,
      user: username,
      timestamp
    };

    socket.emit('message', newMsg);
    setListMessages(prev => [...prev, newMsg]);
    setMessage('');
  };

  useEffect(() => {
    const receiveMessage = msg => {
      setListMessages(prev => [...prev, msg]);
    };
    socket.on('message', receiveMessage);

    return () => socket.off('message', receiveMessage);
  }, []);

  return (
    <>
      <input
        onChange={e => setUserName(e.target.value)}
        className='txt-username'
        type="text"
        placeholder='username'
      />

      <div className='div-chat'>
        {listMessages.map((msg, idx) => {
          const isOwn = msg.user === username;
          return (
            <div key={idx} className={`chat-bubble ${isOwn ? 'own' : 'other'}`}>
              <div className='chat-content'>
                <span className='chat-user'>{msg.user}:</span> {msg.body}
              </div>
              <div className='chat-time'>{msg.timestamp}</div>
            </div>
          );
        })}
      </div>

      <form onSubmit={handleSubmit} className="form">
        <span className="title">Mi chat</span>
        <p className="description">Enviar mensaje</p>
        <div className='div-type-chat'>
          <img
            className="emoji-icon"
            src="https://icons.getbootstrap.com/assets/icons/emoji-smile.svg"
            onClick={() => setShowPicker(!showPicker)}
          />
          {showPicker && <Picker className="prueba" onEmojiClick={onEmojiClick} />}
          <input
            value={message}
            placeholder="Mensaje"
            onChange={e => setMessage(e.target.value)}
            type="text"
            name="text"
            className="input-style"
          />
          <button type="submit">Enviar ➢</button>
        </div>
      </form>
    </>
  );
};
