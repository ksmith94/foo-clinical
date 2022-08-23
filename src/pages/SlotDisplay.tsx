import { Slot } from '@medplum/fhirtypes';
import { Document } from '@medplum/react';
import React from 'react';

export interface SlotProps {
  date: Date;
  slots: Slot[];
}

export function SlotDisplay(props: SlotProps): JSX.Element | null {
  const todaySlots = filterSlotsByDate(props.slots);
  const todayTimeSlots = getSlotTimeDisplay(todaySlots);
  return (
    <div className="slot-list">
      <Document>
        <h1>{props.date.toDateString()}</h1>
        {todayTimeSlots.map((slot) => (
          <ul>
            <li>
              {slot.start} – {slot.end}
              <ul>
                <li>{slot.appointmentType?.text}</li>
                <li>{slot.comment}</li>
              </ul>
            </li>
          </ul>
        ))}
      </Document>
    </div>
  );
}

function filterSlotsByDate(slots: Slot[]): Slot[] {
  const result: Slot[] = [];
  slots.filter((slot) => {
    if (slot.start) {
      if (new Date(slot.start).getDate() === new Date().getDate()) {
        result.push(slot);
      }
    }
  });
  return result;
}

function getSlotTimeDisplay(slots: Slot[]): Slot[] {
  const result: Slot[] = [];
  slots.map((slot) => {
    if (slot.start && slot.end) {
      slot.start = new Date(slot.start).toLocaleTimeString();
      slot.end = new Date(slot.end).toLocaleTimeString();
      result.push(slot);
    }
  });
  return result;
}
