/**
 * @jest-environment jsdom
 */

import { MockClient } from '@medplum/mock';
import { render, waitFor, screen, fireEvent, act } from '@testing-library/react';
import React from 'react';
import { MedplumProvider } from '@medplum/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { MirrorPage, getTabs } from './MirrorPage';
import { SearchPage } from './SearchPage';

let medplum: MockClient;

describe('MirrorPage', () => {
  async function setup(url: string): Promise<void> {
    medplum = new MockClient();
    await act(async () => {
      render(
        <MedplumProvider medplum={medplum}>
          <MemoryRouter initialEntries={[url]} initialIndex={0}>
            <Routes>
              <Route path="/:resourceType/:id/:tab" element={<MirrorPage />} />
              <Route path="/:resourceType/:id" element={<MirrorPage />} />
              <Route path="/:resourceType" element={<SearchPage />} />
            </Routes>
          </MemoryRouter>
        </MedplumProvider>
      );
    });
  }

  test('Resource renders', async () => {
    await setup('/Practitioner/123');
    await waitFor(() => screen.getAllByText('Alice Smith'));

    expect(screen.queryAllByText('Alice Smith')).toBeDefined();
  });

  test('Get tabs', async () => {
    expect(getTabs('Patient')).toEqual(['Timeline', 'Details', 'Edit', 'History', 'Blame', 'JSON']);
    expect(getTabs('Practitioner')).toEqual(['Timeline', 'Details', 'Edit', 'History', 'Blame', 'JSON']);
    expect(getTabs('Organization')).toEqual(['Timeline', 'Details', 'Edit', 'History', 'Blame', 'JSON']);
    expect(getTabs('ServiceRequest')).toEqual(['Timeline', 'Details', 'Edit', 'History', 'Blame', 'JSON']);
    expect(getTabs('DiagnosticReport')).toEqual(['Timeline', 'Details', 'Edit', 'History', 'Blame', 'JSON', 'Report']);
    expect(getTabs('Questionnaire')).toEqual([
      'Timeline',
      'Details',
      'Edit',
      'History',
      'Blame',
      'JSON',
      'Preview',
      'Builder',
    ]);
    expect(getTabs('PlanDefinition')).toEqual([
      'Timeline',
      'Details',
      'Edit',
      'History',
      'Blame',
      'JSON',
      'Apply',
      'Builder',
    ]);
    expect(getTabs('Bot')).toEqual(['Timeline', 'Details', 'Edit', 'History', 'Blame', 'JSON', 'Editor']);
    expect(getTabs('RequestGroup')).toEqual(['Timeline', 'Details', 'Edit', 'History', 'Blame', 'JSON', 'Checklist']);
  });

  test('Tab changes', async () => {
    window.open = jest.fn();

    await setup('/Patient/123');
    await waitFor(() => screen.getByText('Timeline'));

    await act(async () => {
      fireEvent.click(screen.getByText('Details'));
    });
    expect(screen.getByText('Details')).toHaveClass('selected');
  });

  test('Tabs exist', async () => {
    await setup('/Practitioner/123');
    await waitFor(() => screen.getByText('Timeline'));

    expect(screen.getByText('Timeline')).toBeDefined();
  });
});
