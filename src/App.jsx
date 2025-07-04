import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [channels, setChannels] = useState([]);
  const [messages, setMessages] = useState([]);

  const fetchChannels = () => {
    fetch('http://localhost:4678/channels')
      .then(response => response.json())
      .then(data => {
        setChannels(data);
      })
      .catch(error => console.error('Error fetching channels:', error));
  };

  useEffect(() => {
    fetchChannels();
  }, []);

  useEffect(() => {
    const activeChannels = channels.filter(c => c.active && !c.hidden);
    const activeChannelIds = activeChannels.map(c => c.id);

    const fetchMessages = async () => {
      const allMessages = [];
      for (const channelId of activeChannelIds) {
        try {
          const response = await fetch(`http://localhost:4678/messages/${channelId}`);
          const channelMessages = await response.json();
          const messagesWithChannel = channelMessages.map(msg => ({ ...msg, channelId }));
          allMessages.push(...messagesWithChannel);
        } catch (error) {
          console.error(`Error fetching messages for channel ${channelId}:`, error);
        }
      }
      allMessages.sort((a, b) => a.ts - b.ts);
      setMessages(allMessages);
    };

    fetchMessages();
  }, [channels]);

  const toggleChannel = async (channelId, currentStatus) => {
    try {
      await fetch(`http://localhost:4678/channel/${channelId}/active`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ payload: !currentStatus }),
      });
      fetchChannels(); // Refetch channels to get the latest state
    } catch (error) {
      console.error('Error updating channel status:', error);
    }
  };

  const hideChannel = async (channelId) => {
    try {
      await fetch(`http://localhost:4678/channel/${channelId}/hidden`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ payload: true }),
      });
      fetchChannels(); // Refetch channels to get the latest state
    } catch (error) {
      console.error('Error hiding channel:', error);
    }
  };

  const unhideChannel = async (channelId) => {
    try {
      await fetch(`http://localhost:4678/channel/${channelId}/hidden`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ payload: false }),
      });
      fetchChannels(); // Refetch channels to get the latest state
    } catch (error) {
      console.error('Error unhiding channel:', error);
    }
  };

  const visibleChannels = channels.filter(c => !c.hidden);
  const hiddenChannels = channels.filter(c => c.hidden);

  return (
    <>
      <div className="left-column">
        {visibleChannels.map(channel => (
          <button
            key={channel.id}
            className={channel.active ? 'on' : 'off'}
            onClick={() => toggleChannel(channel.id, channel.active)}
          >
            <span># {channel.name}</span>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span className="hide-icon" onClick={(e) => { e.stopPropagation(); hideChannel(channel.id); }}>-</span>
              <span
                className="channel-color-icon"
                style={{ backgroundColor: channel.color }}
              ></span>
              <span className={`status-icon ${channel.active ? 'on' : 'off'}`}></span>
            </div>
          </button>
        ))}
      </div>
      <div className="center-column">
        {messages.map(message => (
          <div
            key={message.ts}
            className="message"
            style={{ borderColor: channels.find(c => c.id === message.channelId)?.color }}
          >
            <div>
              <span className="message-user">{message.user}</span>
              <span className="message-time">
                {new Date(message.ts * 1000).toLocaleString()}
              </span>
            </div>
            <div>{message.text}</div>
          </div>
        ))}
      </div>
      <div className="right-column">
        <h4>Hidden Channels</h4>
        {hiddenChannels.map(channel => (
          <button
            key={channel.id}
            onClick={() => unhideChannel(channel.id)}
          >
            # {channel.name}
          </button>
        ))}
      </div>
    </>
  );
}

export default App;
