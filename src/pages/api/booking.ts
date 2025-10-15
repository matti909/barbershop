import type { APIRoute } from 'astro';
import { GoogleCalendarService } from '../../lib/googleCalendar';

export const POST: APIRoute = async ({ request }) => {
  try {
    const bookingData = await request.json();

    // Validar datos
    if (!bookingData.service || !bookingData.customerName || !bookingData.customerEmail ||
        !bookingData.date || !bookingData.time) {
      return new Response(
        JSON.stringify({ error: 'Faltan datos requeridos' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const calendarService = new GoogleCalendarService();

    // Verificar disponibilidad
    const isAvailable = await calendarService.checkAvailability(
      bookingData.date,
      bookingData.time
    );

    if (!isAvailable) {
      return new Response(
        JSON.stringify({ error: 'Este horario ya no está disponible' }),
        { status: 409, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Crear evento en Google Calendar
    const event = await calendarService.createBooking(bookingData);

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Reserva creada exitosamente',
        eventId: event.id,
        eventLink: event.htmlLink,
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error processing booking:', error);
    return new Response(
      JSON.stringify({
        error: 'Error al procesar la reserva',
        details: error instanceof Error ? error.message : 'Unknown error',
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
