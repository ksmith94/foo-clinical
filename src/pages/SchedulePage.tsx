import React from 'react';
import { Calendar } from './Calendar';
import { SlotDisplay, SlotProps } from './SlotDisplay';
import './SchedulePage.css';

export function SchedulePage(): JSX.Element | null {
  const props: SlotProps = {
    date: new Date(),
    slots: [
      {
        resourceType: 'Slot',
        start: new Date(2022, 7, 23, 11, 0, 0).toISOString(),
        end: new Date(2022, 7, 23, 11, 30, 0).toISOString(),
        appointmentType: {
          text: 'Checkup',
        },
        comment: 'Annual phsyical with Kevin Smith',
      },
      {
        resourceType: 'Slot',
        start: new Date(2022, 7, 23, 13, 0, 0).toISOString(),
        end: new Date(2022, 7, 23, 14, 0, 0).toISOString(),
        appointmentType: {
          text: 'Surgery follow up',
        },
        comment: 'Post surgery follow up with Bill',
      },
      {
        resourceType: 'Slot',
        start: new Date(2022, 7, 24, 13, 0, 0).toISOString(),
        end: new Date(2022, 7, 24, 14, 0, 0).toISOString(),
        appointmentType: {
          text: 'Consultation',
        },
        comment: 'Surgical consulation for Chris',
      },
    ],
  };

  return (
    <div className="schedule-page">
      <Calendar />;
      <SlotDisplay date={props.date} slots={props.slots} />
    </div>
  );
}
