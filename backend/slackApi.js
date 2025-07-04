const axios = require('axios');

const token = process.env.SLACK_BOT_TOKEN;

  if (!token) {
    throw new Error('Slack Bot Token not found. Please set the SLACK_BOT_TOKEN environment variable.');
  }

// This function fetches the list of public channels from Slack.
// https://api.slack.com/methods/conversations.list
async function getChannels() {
  const url = 'https://slack.com/api/conversations.list';


  try {
    const response = await axios.get(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      params: {
        exclude_archived: true,
        limit: 999,
        types: 'public_channel,private_channel,mpim,im'
      }
    });

    if (response.data.ok) {
      // We are filtering to return only the channel's id and name.
      return response.data.channels.map(channel => ({
        id: channel.id,
        name: channel.name,
      }));
    } else {
      // Handle Slack API errors (e.g., invalid_auth, not_authed)
      throw new Error(`Slack API error: ${response.data.error}`);
    }
  } catch (error) {
    console.error('Error fetching channels from Slack:', error.message);
    // Re-throw the error to be caught by the route handler
    throw error;
  }
}

const FILTER_WHOLE_MESSAGE_TERMS = [
  'has joined the channel',
  'has left the channel'
]

// This function fetches the message history of a conversation.
// https://api.slack.com/methods/conversations.history
async function getChannelMessages(channelId) {
  const url = 'https://slack.com/api/conversations.history';

  if (!channelId) {
    throw new Error('Channel ID is required.');
  }

  try {
    const response = await axios.get(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      params: {
        channel: channelId,
        // You can add other parameters here, like 'limit' to control the number of messages
      }
    });

    if (response.data.ok) {
      // We are filtering to return only the essential message data.
      return response.data.messages
        .filter(message => {
          return !FILTER_WHOLE_MESSAGE_TERMS.some(x => message.text.indexOf(x) !== -1)
        })
        .map(message => ({
        user: message.user,
        text: message.text,
        ts: message.ts,
      }));
    } else {
      throw new Error(`Slack API error: ${response.data.error}`);
    }
  } catch (error) {
    console.error(`Error fetching messages for channel ${channelId}:`, error.message);
    throw error;
  }
}

module.exports = { getChannels, getChannelMessages };
