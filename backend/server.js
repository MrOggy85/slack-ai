require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { getChannels, getChannelMessages } = require('./slackApi');

const app = express();
const PORT = 4678;

app.use(cors());

app.get('/messages/:channelId', async (req, res) => {
  try {
    const { channelId } = req.params;
    const messages = await getChannelMessages(channelId);
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/channels', async (req, res) => {
  try {
    const channels = await getChannels();
    res.json(channels);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
