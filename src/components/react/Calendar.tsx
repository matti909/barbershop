import { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock } from 'lucide-react';

interface CalendarProps {
  onSelectDateTime: (date: string, time: string) => void;
  selectedDate?: string;
  selectedTime?: string;
}

export default function Calendar({ onSelectDateTime, selectedDate, selectedTime }: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'calendar' | 'time'>('calendar');

  const timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '14:00', '14:30', '15:00', '15:30',
    '16:00', '16:30', '17:00', '17:30', '18:00', '18:30'
  ];

  const months = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const daysOfWeek = ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];

    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }

    return days;
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(newDate.getMonth() - 1);
      } else {
        newDate.setMonth(newDate.getMonth() + 1);
      }
      return newDate;
    });
  };

  const isDateDisabled = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today || date.getDay() === 0;
  };

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const handleDateSelect = (date: Date) => {
    if (isDateDisabled(date)) return;

    const dateString = formatDate(date);
    if (selectedTime) {
      onSelectDateTime(dateString, selectedTime);
    }
    setViewMode('time');
  };

  const handleTimeSelect = (time: string) => {
    if (selectedDate) {
      onSelectDateTime(selectedDate, time);
    }
    setViewMode('calendar');
  };

  const days = getDaysInMonth(currentDate);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      {viewMode === 'calendar' ? (
        <>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900 flex items-center space-x-2">
              <CalendarIcon className="h-5 w-5 text-amber-500" />
              <span>Seleccionar Fecha</span>
            </h3>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigateMonth('prev')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              >
                <ChevronLeft className="h-5 w-5 text-gray-600" />
              </button>
              <span className="text-lg font-semibold text-gray-900 min-w-[140px] text-center">
                {months[currentDate.getMonth()]} {currentDate.getFullYear()}
              </span>
              <button
                onClick={() => navigateMonth('next')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              >
                <ChevronRight className="h-5 w-5 text-gray-600" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1 mb-2">
            {daysOfWeek.map(day => (
              <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {days.map((day, index) => (
              <button
                key={index}
                onClick={() => day && handleDateSelect(day)}
                disabled={!day || isDateDisabled(day)}
                className={`
                  aspect-square flex items-center justify-center text-sm font-medium rounded-lg transition-colors duration-200
                  ${!day ? 'invisible' : ''}
                  ${day && isDateDisabled(day)
                    ? 'text-gray-300 cursor-not-allowed'
                    : day && selectedDate === formatDate(day)
                    ? 'bg-amber-500 text-black'
                    : day
                    ? 'text-gray-900 hover:bg-amber-100 cursor-pointer'
                    : ''
                  }
                `}
              >
                {day?.getDate()}
              </button>
            ))}
          </div>

          {selectedDate && (
            <div className="mt-6 text-center">
              <button
                onClick={() => setViewMode('time')}
                className="bg-amber-500 hover:bg-amber-600 text-black font-semibold px-6 py-2 rounded-lg transition-colors duration-300"
              >
                Seleccionar Horario
              </button>
            </div>
          )}
        </>
      ) : (
        <>
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => setViewMode('calendar')}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors duration-200"
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Volver al calendario</span>
            </button>
            <h3 className="text-xl font-semibold text-gray-900 flex items-center space-x-2">
              <Clock className="h-5 w-5 text-amber-500" />
              <span>Seleccionar Horario</span>
            </h3>
          </div>

          {selectedDate && (
            <div className="text-center mb-6">
              <p className="text-gray-600">Fecha seleccionada:</p>
              <p className="text-lg font-semibold text-gray-900">
                {new Date(selectedDate + 'T00:00:00').toLocaleDateString('es-ES', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
          )}

          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
            {timeSlots.map(time => (
              <button
                key={time}
                onClick={() => handleTimeSelect(time)}
                className={`
                  py-3 px-4 text-sm font-medium rounded-lg border transition-colors duration-200
                  ${selectedTime === time
                    ? 'bg-amber-500 text-black border-amber-500'
                    : 'bg-white text-gray-700 border-gray-200 hover:bg-amber-50 hover:border-amber-300'
                  }
                `}
              >
                {time}
              </button>
            ))}
          </div>

          <div className="mt-6 text-center text-sm text-gray-500">
            <p>Horarios disponibles de Lunes a Sábado</p>
            <p>Domingos cerrado</p>
          </div>
        </>
      )}
    </div>
  );
}
