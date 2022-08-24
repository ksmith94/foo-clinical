import { MockClient } from '@medplum/mock';
import { MedplumProvider } from '@medplum/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { SchedulePage } from './SchedulePage';
import React from 'react';
import { Slot } from '@medplum/fhirtypes';
import { filterSlotsByDate } from './SlotDisplay';

let medplum: MockClient;

async function setup(url = '/schedule'): Promise<void> {
  medplum = new MockClient();
  await act(async () => {
    render(
      <MedplumProvider medplum={medplum}>
        <MemoryRouter initialEntries={[url]} initialIndex={0}>
          <Routes>
            <Route path="/schedule" element={<SchedulePage />} />
          </Routes>
        </MemoryRouter>
      </MedplumProvider>
    );
  });
}

describe('Slot display', () => {
  test('Appointments render', async () => {
    const date = new Date();
    await setup();
    await waitFor(() => screen.getByText(date.toDateString()));

    expect(screen.getByText(date.toDateString())).toBeInTheDocument();
  });

  test('No appointments renders', async () => {
    await setup();
    await waitFor(() => screen.getByText('18'));

    await act(async () => {
      fireEvent.click(screen.getByText('18'));
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
