require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { getChannels, getChannelMessages } = require('./slackApi');
const { getAllChannels, createChannel, updateChannelActive, updateChannelHidden } = require('./database');

const app = express();
const PORT = 4678;

// Helper function to generate a random color
const getRandomColor = () => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

app.use(cors());
app.use(express.json());

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
    const [slackChannels, dbChannels] = await Promise.all([
      getChannels(),
      getAllChannels()
    ]);

    const dbChannelsMap = new Map(dbChannels.map(c => [c.channel_id, c]));
    const combinedChannels = [];

    for (const slackChannel of slackChannels) {
      let dbChannel = dbChannelsMap.get(slackChannel.id);

      if (!dbChannel) {
        const newChannelData = {
          channel_id: slackChannel.id,
          color: getRandomColor(),
          hidden: 0,
          active: 0
        };
        dbChannel = await createChannel(newChannelData);
      }

      combinedChannels.push({
        id: slackChannel.id,
        name: slackChannel.name,
        color: dbChannel.color,
        hidden: !!dbChannel.hidden,
        active: !!dbChannel.active
      });
    }

    res.json(combinedChannels);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/channel/:channelId/active', async (req, res) => {
  try {
    const { channelId } = req.params;
    const { payload } = req.body;
    await updateChannelActive(channelId, payload);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/channel/:channelId/hidden', async (req, res) => {
  try {
    const { channelId } = req.params;
    const { payload } = req.body;
    await updateChannelHidden(channelId, payload);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
