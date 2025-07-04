import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [channels, setChannels] = useState([]);
  const [channelStates, setChannelStates] = useState({});

  useEffect(() => {
    fetch('http://localhost:4678/channels')
      .then(response => response.json())
      .then(data => {
        setChannels(data);
        // Initialize all channels to an "off" state
        const initialStates = {};
        data.forEach(channel => {
          initialStates[channel.id] = false;
        });
        setChannelStates(initialStates);
      })
      .catch(error => console.error('Error fetching channels:', error));
  }, []);

  const toggleChannel = (channelId) => {
    setChannelStates(prevStates => ({
      ...prevStates,
      [channelId]: !prevStates[channelId]
    }));
  };

  return (
    <>
      <div className="left-column">
        {channels.map(channel => (
          <button
            key={channel.id}
            className={channelStates[channel.id] ? 'on' : 'off'}
            onClick={() => toggleChannel(channel.id)}
          >
            <span># {channel.name}</span>
            <span className={`status-icon ${channelStates[channel.id] ? 'on' : 'off'}`}></span>
          </button>
        ))}
      </div>
      <div className="center-column">
        {/* Main content will go here */}
      </div>
      <div className="right-column">
        right
      </div>
    </>
  );
}

export default App;
