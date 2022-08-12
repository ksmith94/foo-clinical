import { MockClient } from '@medplum/mock';
import { MedplumProvider } from '@medplum/react';
import React from 'react';
import { render, waitFor, screen, cleanup } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { act } from 'react-dom/test-utils';
import { HomePage } from './HomePage';

let medplum: MockClient;

describe('HomePage', () => {
  async function setup(url: string): Promise<void> {
    medplum = new MockClient();
    await act(async () => {
      render(
        <MedplumProvider medplum={medplum}>
          <MemoryRouter initialEntries={[url]} initialIndex={0}>
            <Routes>
              <Route path="" element={<HomePage />} />
            </Routes>
          </MemoryRouter>
        </MedplumProvider>
      );
    });
  }

  afterEach(() => {
    cleanup();
  });

  test('Patients render', async () => {
    await setup('');
    await waitFor(() => screen.getByText('Patients'));

    expect(screen.getByText('Patients')).toBeInTheDocument();
  });

  test('Practitioners render', async () => {
    await setup('');
    await waitFor(() => screen.getByText('Practitioners'));

    expect(screen.getByText('Practitioners')).toBeInTheDocument();
  });

  test('Organizations render', async () => {
    await setup('');
    await waitFor(() => screen.getByText('Organizations'));

    expect(screen.getByText('Organizations')).toBeInTheDocument();
  });
});
