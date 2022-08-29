import { MockClient } from '@medplum/mock';
import { MedplumProvider } from '@medplum/react';
import { act, render, waitFor, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import React from 'react';
import { SchedulePage } from './SchedulePage';

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

describe('Schedule page', () => {
  test('Appointments render', async () => {
    const date = new Date();
    await setup();
    await waitFor(() => screen.getByText(date.toDateString()));

    expect(screen.getByText(date.toDateString())).toBeInTheDocument();
  });
});
