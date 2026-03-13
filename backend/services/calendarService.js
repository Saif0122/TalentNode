const { google } = require('googleapis');
const User = require('../models/User');

/**
 * Service to handle Google Calendar operations
 */
class CalendarService {
  constructor() {
    this.oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI || 'http://localhost:5001/api/auth/google/callback'
    );
  }

  /**
   * Sets the credentials for the OAuth2 client
   * @param {Object} tokens - { access_token, refresh_token, expiry_date }
   */
  setCredentials(tokens) {
    this.oauth2Client.setCredentials(tokens);
  }

  /**
   * Refreshes the access token using the refresh token
   * @param {string} userId - The ID of the user whose token needs refreshing
   * @returns {Promise<Object>} The updated tokens
   */
  async refreshAccessToken(userId) {
    const user = await User.findById(userId).select('+googleRefreshToken');
    if (!user || !user.googleRefreshToken) {
      throw new Error('No refresh token available for this user');
    }

    this.oauth2Client.setCredentials({
      refresh_token: user.googleRefreshToken
    });

    const { tokens } = await this.oauth2Client.refreshAccessToken();
    
    // Update user tokens in DB
    user.googleAccessToken = tokens.access_token;
    user.googleTokenExpiry = new Date(tokens.expiry_date);
    if (tokens.refresh_token) {
      user.googleRefreshToken = tokens.refresh_token;
    }
    await user.save();

    return tokens;
  }

  /**
   * Creates a Google Calendar event
   * @param {Object} eventDetails - { summary, description, start, end, attendees }
   * @returns {Promise<Object>} The created event data
   */
  async createEvent(eventDetails) {
    const calendar = google.calendar({ version: 'v3', auth: this.oauth2Client });

    const event = {
      summary: eventDetails.summary,
      description: eventDetails.description,
      start: {
        dateTime: eventDetails.start,
        timeZone: 'UTC', 
      },
      end: {
        dateTime: eventDetails.end,
        timeZone: 'UTC',
      },
      attendees: eventDetails.attendees || [],
      conferenceData: {
        createRequest: {
          requestId: `talentnode-${Date.now()}`,
          conferenceSolutionKey: { type: 'hangoutsMeet' },
        },
      },
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'email', minutes: 24 * 60 },
          { method: 'popup', minutes: 30 },
        ],
      },
    };

    const response = await calendar.events.insert({
      calendarId: 'primary',
      resource: event,
      conferenceDataVersion: 1,
      sendUpdates: 'all',
    });

    return response.data;
  }

  /**
   * Updates an existing Google Calendar event
   * @param {string} eventId - The Google Event ID
   * @param {Object} eventDetails - The fields to update
   */
  async updateEvent(eventId, eventDetails) {
    const calendar = google.calendar({ version: 'v3', auth: this.oauth2Client });

    await calendar.events.patch({
      calendarId: 'primary',
      eventId: eventId,
      resource: eventDetails,
      sendUpdates: 'all',
    });
  }

  /**
   * Deletes an existing Google Calendar event
   * @param {string} eventId - The Google Event ID
   */
  async deleteEvent(eventId) {
    const calendar = google.calendar({ version: 'v3', auth: this.oauth2Client });

    await calendar.events.delete({
      calendarId: 'primary',
      eventId: eventId,
      sendUpdates: 'all',
    });
  }
}

module.exports = new CalendarService();
