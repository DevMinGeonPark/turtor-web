import React from 'react';

interface Event {
  id: string;
  title: string;
  date: string;
  type: 'payment' | 'class';
}

interface CalendarProps {
  events: Event[];
}

export const EduCalendar: React.FC<CalendarProps> = ({ events }) => {
  const isPaymentDue = (date: string) => 
    events.some(event => event.type === 'payment' && event.date === date);

  return (
    <div className="calendar">
      {events.map(event => (
        <div 
          key={event.id} 
          className={`event ${event.type === 'payment' ? 'payment' : 'class'}`}
        >
          <h3>{event.title}</h3>
          <p>{new Date(event.date).toLocaleDateString()}</p>
        </div>
      ))}
    </div>
  );
}; 