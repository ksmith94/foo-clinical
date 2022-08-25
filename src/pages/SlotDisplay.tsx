import { Slot } from '@medplum/fhirtypes';
import { Document } from '@medplum/react';
import React from 'react';

export interface SlotProps {
  date: Date | undefined;
  slots: Slot[];
}

export function SlotDisplay(props: SlotProps): JSX.Element | null {
  const todaySlots = filterSlotsByDate(props.slots, props.date);
  if (todaySlots.length === 0) {
    return (
      <div className="slot-list">
        <Document>
          <h1>{props.date?.toDateString()}</h1>
          <p>No Appointments</p>
        </Document>
      </div>
    );
  }
  return (
    <div className="slot-list">
      <Document>
        <h1>{props.date?.toDateString()}</h1>
        {todaySlots.map((slot) => (
          <ul key={slot.id}>
            <li>
              {formatDate(slot.start)} – {formatDate(slot.end)}
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

export function filterSlotsByDate(slots: Slot[], date?: Date): Slot[] {
  const result: Slot[] = [];
  slots.filter((slot) => {
    if (slot.start) {
      if (new Date(slot.start).getDate() === date?.getDate()) {
        result.push(slot);
      }
    }
  });
  return result;
}

function formatDate(dateString: string | undefined): string | null {
  if (dateString === undefined) {
    return null;
  }
  return new Date(dateString).toLocaleTimeString();
}
