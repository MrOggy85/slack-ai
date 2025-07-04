import { useState } from 'react';
import { Link } from 'react-router-dom';
import './App.css';

function Settings() {
  const [permanentlyHidden, setPermanentlyHidden] = useState([]);
  const [inputValue, setInputValue] = useState('');

  const handleAddChannel = (e) => {
    e.preventDefault();
    if (inputValue && !permanentlyHidden.includes(inputValue)) {
      setPermanentlyHidden([...permanentlyHidden, inputValue]);
      setInputValue('');
    }
  };

  const handleRemoveChannel = (channelToRemove) => {
    setPermanentlyHidden(permanentlyHidden.filter(channel => channel !== channelToRemove));
  };

  return (
    <>
      <div className="left-column">
        <Link to="/"><button>Back to Main</button></Link>
        <h4>Settings</h4>
        <button>Hidden Channels</button>
        <button>Permanently Hide Channels</button>
      </div>
      <div className="center-column">
        <h3>Permanently Hide Channels</h3>
        <form onSubmit={handleAddChannel}>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Enter channel name"
          />
          <button type="submit">Add</button>
        </form>
        <ul>
          {permanentlyHidden.map(channel => (
            <li key={channel}>
              {channel}
              <button onClick={() => handleRemoveChannel(channel)}>-</button>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

export default Settings;
