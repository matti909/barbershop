import { google } from 'googleapis';
import type { calendar_v3 } from 'googleapis';

export interface BookingData {
  service: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  date: string;
  time: string;
  notes?: string;
}

export class GoogleCalendarService {
  private calendar: calendar_v3.Calendar;

  constructor() {
    const auth = new google.auth.OAuth2(
      import.meta.env.GOOGLE_CLIENT_ID,
      import.meta.env.GOOGLE_CLIENT_SECRET,
      import.meta.env.GOOGLE_REDIRECT_URI
    );

    auth.setCredentials({
      refresh_token: import.meta.env.GOOGLE_REFRESH_TOKEN,
    });

    this.calendar = google.calendar({ version: 'v3', auth });
  }

  async createBooking(booking: BookingData): Promise<calendar_v3.Schema$Event> {
    const { service, customerName, customerEmail, customerPhone, date, time, notes } = booking;

    // Combinar fecha y hora
    const startDateTime = new Date(`${date}T${time}:00`);

    // Calcular duración según el servicio (en minutos)
    const durations: { [key: string]: number } = {
      'solo-barba': 30,
      'solo-corte': 45,
      'barba-corte': 75,
    };

    const duration = durations[service] || 60;
    const endDateTime = new Date(startDateTime.getTime() + duration * 60000);

    const serviceNames: { [key: string]: string } = {
      'solo-barba': 'Solo Barba',
      'solo-corte': 'Solo Corte',
      'barba-corte': 'Barba y Corte',
    };

    const event: calendar_v3.Schema$Event = {
      summary: `${serviceNames[service]} - ${customerName}`,
      description: `
Servicio: ${serviceNames[service]}
Cliente: ${customerName}
Teléfono: ${customerPhone}
Email: ${customerEmail}
${notes ? `Notas: ${notes}` : ''}
      `.trim(),
      start: {
        dateTime: startDateTime.toISOString(),
        timeZone: 'America/Argentina/Buenos_Aires',
      },
      end: {
        dateTime: endDateTime.toISOString(),
        timeZone: 'America/Argentina/Buenos_Aires',
      },
      attendees: [
        { email: customerEmail },
      ],
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'email', minutes: 24 * 60 }, // 1 día antes
          { method: 'popup', minutes: 60 }, // 1 hora antes
        ],
      },
      colorId: '5', // Color amarillo/ámbar
    };

    try {
      const response = await this.calendar.events.insert({
        calendarId: import.meta.env.GOOGLE_CALENDAR_ID || 'primary',
        requestBody: event,
        sendUpdates: 'all', // Enviar notificación al cliente
      });

      return response.data;
    } catch (error) {
      console.error('Error creating calendar event:', error);
      throw error;
    }
  }

  async checkAvailability(date: string, time: string): Promise<boolean> {
    const startDateTime = new Date(`${date}T${time}:00`);
    const endDateTime = new Date(startDateTime.getTime() + 15 * 60000); // +15 min para verificar

    try {
      const response = await this.calendar.events.list({
        calendarId: import.meta.env.GOOGLE_CALENDAR_ID || 'primary',
        timeMin: startDateTime.toISOString(),
        timeMax: endDateTime.toISOString(),
        singleEvents: true,
      });

      return (response.data.items?.length || 0) === 0;
    } catch (error) {
      console.error('Error checking availability:', error);
      return false;
    }
  }
}
