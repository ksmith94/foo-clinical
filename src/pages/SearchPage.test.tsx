/**
 * @jest-environment jsdom
 */

import { Patient } from '@medplum/fhirtypes';
import { MockClient } from '@medplum/mock';
import { MedplumProvider } from '@medplum/react';
// import { test, expect } from '@jest/globals';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { SearchPage } from './SearchPage';

let medplum: MockClient;

async function setup(url = '/Patient'): Promise<void> {
  medplum = new MockClient();
  await act(async () => {
    render(
      <MedplumProvider medplum={medplum}>
        <MemoryRouter initialEntries={[url]} initialIndex={0}>
          <Routes>
            <Route path="/:resourceType/new" element={<div>Create Resource Page</div>} />
            <Route path="/:resourceType/:id" element={<div>Resource Page</div>} />
            <Route path="/:resourceType" element={<SearchPage />} />
            <Route path="/" element={<SearchPage />} />
          </Routes>
        </MemoryRouter>
      </MedplumProvider>
    );
  });
}

describe('SearchPage', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  test('Renders default page', async () => {
    await setup('/');
    await waitFor(() => screen.getByTestId('search-control'));

    const control = screen.getByTestId('search-control');
    expect(control).toBeDefined();
  });

  test('Renders with resourceType', async () => {
    await setup('/Patient');
    await waitFor(() => screen.getByTestId('search-control'));

    const control = screen.getByTestId('search-control');
    expect(control).toBeDefined();
  });

  test('Renders with resourceType and fields', async () => {
    await setup('/Patient?_fields=id,_lastUpdated,name,birthDate,gender');
    await waitFor(() => screen.getByTestId('search-control'));

    const control = screen.getByTestId('search-control');
    expect(control).toBeDefined();
  });

  test('Next page button exists', async () => {
    await setup();
    await waitFor(() => screen.getByTestId('next-page-button'));

    await act(async () => {
      fireEvent.click(screen.getByTestId('next-page-button'));
    });
  });

  test('Prev page button exists', async () => {
    await setup();
    await waitFor(() => screen.getByTestId('prev-page-button'));

    await act(async () => {
      fireEvent.click(screen.getByTestId('prev-page-button'));
    });
  });

  test('New button exists', async () => {
    await setup();
    await waitFor(() => screen.getByText('New...'));

    await act(async () => {
      fireEvent.click(screen.getByText('New...'));
    });
  });

  test('New button hidden on bot page', async () => {
    await setup('/Bot');
    await waitFor(() => screen.getByTestId('search-control'));

    expect(screen.queryByText('New...')).toBeNull();
  });

  test('Delete button, cancel', async () => {
    window.confirm = jest.fn(() => false);

    await setup();
    await waitFor(() => screen.getByText('Delete...'));

    await act(async () => {
      fireEvent.click(screen.getByText('Delete...'));
    });
  });

  test('Delete button, ok', async () => {
    const patient = await medplum.createResource<Patient>({
      resourceType: 'Patient',
    });

    window.confirm = jest.fn(() => true);

    await setup();
    await waitFor(() => screen.getByText(patient.id as string));
    await waitFor(() => screen.getByText('Delete...'));

    await act(async () => {
      fireEvent.click(screen.getByLabelText(`Checkbox for ${patient.id}`));
    });
    await act(async () => {
      fireEvent.click(screen.getByText('Delete...'));
    });

    const check = await medplum.readResource('Patient', patient.id as string);
    expect(check).toBeUndefined();

    await waitFor(() => screen.queryByText(patient.id as string) === null);
  });
});
