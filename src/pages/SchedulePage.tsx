import React, { useState } from 'react';
import { Calendar } from './Calendar';
import { SlotDisplay } from './SlotDisplay';
import './SchedulePage.css';
import { slotProps } from './SlotProps';

export function SchedulePage(): JSX.Element | null {
  const [date, setDate] = useState<Date>(new Date());
  const props = slotProps;
  return (
    <div className="schedule-page">
      <Calendar onClick={setDate} />
      <SlotDisplay date={date} slots={props.slots} />
    </div>
  );
}
