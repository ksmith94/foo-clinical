import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { Slot } from '@medplum/fhirtypes';
import { filterSlotsByDate, SlotDisplay, SlotProps } from './SlotDisplay';

let slotProps: SlotProps;

async function setup(): Promise<void> {
  slotProps = {
    date: new Date(),
    slots: [],
  };

  await act(async () => {
    render(<SlotDisplay slots={slotProps.slots} date={slotProps.date} />);
  });
}

describe('Slot display', () => {
  test('No appointments renders', async () => {
    await setup();
    await waitFor(() => screen.getByText(new Date().toDateString()));

    await act(async () => {
      fireEvent.click(screen.getByText(new Date().toDateString()));
    });

    expect(screen.getByText('No Appointments')).toBeInTheDocument();
  });

  test('Empty slots return nothing', async () => {
    const slots: Slot[] = [
      {
        resourceType: 'Slot',
      },
    ];

    expect(filterSlotsByDate(slots)).toStrictEqual([]);
  });
});
