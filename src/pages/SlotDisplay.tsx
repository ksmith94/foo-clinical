import { Slot } from '@medplum/fhirtypes';
import { Document } from '@medplum/react';
import React from 'react';

export interface SlotProps {
  date: Date | undefined;
  slots: Slot[];
}

export function SlotDisplay(props: SlotProps): JSX.Element | null {
  const todaySlots = filterSlotsByDate(props.slots, props.date);
  // const todayTimeSlots = getSlotTimeDisplay(todaySlots);
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

// function getSlotTimeDisplay(slots: Slot[]): Slot[] {
//   const result: Slot[] = [];
//   slots.map((slot) => {
//     if (slot.start && slot.end) {
//       slot.start = new Date(slot.start).toLocaleTimeString();
//       slot.end = new Date(slot.end).toLocaleTimeString();
//       result.push(slot);
//     }
//   });
//   return result;
// }

// function getSlotTimeDisplay(slot: Slot): Slot {
//   const result = slot;
//   if (slot.start && slot.end) {
//     result.start = new Date(slot.start).toLocaleTimeString();
//     result.end = new Date(slot.end).toLocaleTimeString();
//   }
//   return result;
// }
