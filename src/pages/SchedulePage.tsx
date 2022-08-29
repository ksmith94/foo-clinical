import React, { useState } from 'react';
import { Calendar } from './Calendar';
import { SlotDisplay } from './SlotDisplay';
import './SchedulePage.css';
import { useMedplum } from '@medplum/react';
import { Slot } from '@medplum/fhirtypes';

export function SchedulePage(): JSX.Element | null {
  const medplum = useMedplum();
  const [slots] = useState<Slot[]>(medplum.searchResources('Slot').read());
  const [date, setDate] = useState<Date>(new Date());

  return (
    <div className="schedule-page">
      <Calendar onClick={setDate} />
      <SlotDisplay date={date} slots={slots} />
    </div>
  );
}
