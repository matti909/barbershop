import { useState } from 'react';
import { Mail, Calendar, Scissors } from 'lucide-react';
import CalendarComponent from './Calendar';

export default function BookingForm() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [bookingData, setBookingData] = useState({
    service: '',
    barber: 'principal',
    date: '',
    time: '',
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    notes: ''
  });

  const services = [
    { id: 'solo-barba', name: 'Solo Barba', duration: '30 min', price: 15 },
    { id: 'solo-corte', name: 'Solo Corte', duration: '45 min', price: 20 },
    { id: 'barba-corte', name: 'Barba y Corte', duration: '75 min', price: 32 }
  ];

  const barbers = [
    { id: 'principal', name: 'Barbero Principal', specialty: 'Especialista en todos los estilos' }
  ];

  const handleServiceSelect = (serviceId: string) => {
    setBookingData(prev => ({ ...prev, service: serviceId }));
    setStep(2);
  };

  const handleDateTimeSelect = (date: string, time: string) => {
    setBookingData(prev => ({ ...prev, date, time }));
    setStep(3);
  };

  const handleCustomerInfo = (field: string, value: string) => {
    setBookingData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/booking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al crear la reserva');
      }

      alert(`¡Reserva realizada con éxito!

Recibirás un email de confirmación con los detalles.
También puedes ver tu evento aquí: ${data.eventLink}`);

      // Resetear formulario
      setBookingData({
        service: '',
        barber: 'principal',
        date: '',
        time: '',
        customerName: '',
        customerPhone: '',
        customerEmail: '',
        notes: ''
      });
      setStep(1);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al procesar la reserva');
      console.error('Booking error:', err);
    } finally {
      setLoading(false);
    }
  };

  const selectedService = services.find(s => s.id === bookingData.service);
  const selectedBarber = barbers[0];

  return (
    <section id="booking" className="py-20 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Reserva tu Cita
          </h2>
          <p className="text-xl text-gray-600">
            Sigue estos simples pasos para agendar tu cita con nosotros
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between max-w-2xl mx-auto">
            {['Servicio', 'Fecha & Hora', 'Tus Datos'].map((stepName, index) => (
              <div key={stepName} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
                      step > index + 1
                        ? 'bg-green-500 text-white shadow-lg'
                        : step === index + 1
                        ? 'bg-amber-500 text-black shadow-lg scale-110'
                        : 'bg-gray-300 text-gray-600'
                    }`}
                  >
                    {step > index + 1 ? '✓' : index + 1}
                  </div>
                  <span className="mt-2 text-xs sm:text-sm font-medium text-gray-600 text-center">
                    {stepName}
                  </span>
                </div>
                {index < 2 && (
                  <div
                    className={`h-0.5 flex-1 mx-2 transition-all duration-300 ${
                      step > index + 1 ? 'bg-green-500' : 'bg-gray-300'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8">
          {/* Step 1: Service Selection */}
          {step === 1 && (
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
                <Scissors className="h-6 w-6 text-amber-500" />
                <span>Selecciona tu Servicio</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {services.map(service => (
                  <button
                    key={service.id}
                    onClick={() => handleServiceSelect(service.id)}
                    className="p-6 border-2 border-gray-200 rounded-xl hover:border-amber-500 hover:bg-amber-50 transition-colors duration-300 text-left"
                  >
                    <h4 className="text-xl font-bold text-gray-900 mb-2">{service.name}</h4>
                    <div className="flex justify-between items-center text-sm text-gray-600 mb-4">
                      <span>{service.duration}</span>
                      <span className="text-lg font-bold text-amber-500">${service.price}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Date & Time Selection */}
          {step === 2 && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
                  <Calendar className="h-6 w-6 text-amber-500" />
                  <span>Fecha y Hora</span>
                </h3>
                <button
                  onClick={() => setStep(1)}
                  className="text-amber-600 hover:text-amber-700 text-sm font-medium"
                >
                  Cambiar servicio
                </button>
              </div>

              <div className="bg-amber-50 p-4 rounded-lg mb-6">
                <p className="text-amber-800">
                  <span className="font-semibold">{selectedService?.name}</span> con {selectedBarber?.name}
                </p>
              </div>

              <CalendarComponent
                onSelectDateTime={handleDateTimeSelect}
                selectedDate={bookingData.date}
                selectedTime={bookingData.time}
              />

              {bookingData.date && bookingData.time && (
                <div className="mt-6 text-center">
                  <button
                    onClick={() => setStep(3)}
                    className="bg-amber-500 hover:bg-amber-600 text-black font-semibold px-8 py-3 rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg"
                  >
                    Continuar
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Step 3: Customer Information */}
          {step === 3 && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
                  <Mail className="h-6 w-6 text-amber-500" />
                  <span>Tus Datos</span>
                </h3>
                <button
                  onClick={() => setStep(2)}
                  className="text-amber-600 hover:text-amber-700 text-sm font-medium"
                >
                  Cambiar fecha/hora
                </button>
              </div>

              {/* Booking Summary */}
              <div className="bg-gray-50 p-6 rounded-lg mb-6">
                <h4 className="font-semibold text-gray-900 mb-3">Resumen de tu reserva:</h4>
                <div className="space-y-2 text-sm">
                  <p><span className="font-medium">Servicio:</span> {selectedService?.name}</p>
                  <p><span className="font-medium">Barbero:</span> {selectedBarber?.name}</p>
                  <p><span className="font-medium">Fecha:</span> {bookingData.date}</p>
                  <p><span className="font-medium">Hora:</span> {bookingData.time}</p>
                  <p><span className="font-medium">Precio:</span> ${selectedService?.price}</p>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-6">
                  <p className="font-medium">Error:</p>
                  <p>{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre Completo *
                    </label>
                    <input
                      type="text"
                      required
                      value={bookingData.customerName}
                      onChange={(e) => handleCustomerInfo('customerName', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      placeholder="Tu nombre completo"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Teléfono *
                    </label>
                    <input
                      type="tel"
                      required
                      value={bookingData.customerPhone}
                      onChange={(e) => handleCustomerInfo('customerPhone', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      placeholder="+54 11 1234-5678"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={bookingData.customerEmail}
                    onChange={(e) => handleCustomerInfo('customerEmail', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="tu@email.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notas Adicionales (Opcional)
                  </label>
                  <textarea
                    value={bookingData.notes}
                    onChange={(e) => handleCustomerInfo('notes', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    rows={3}
                    placeholder="Alguna preferencia especial o comentario..."
                  />
                </div>

                <div className="text-center">
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-amber-500 hover:bg-amber-600 text-black font-semibold px-12 py-4 rounded-lg transition-all duration-300 text-lg hover:scale-105 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Procesando...' : 'Confirmar Reserva'}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
