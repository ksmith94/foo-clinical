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
    await setup('/Patient/123');
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

  test('Tabs exist', async () => {
    await setup('/Practitioner/123');
    await waitFor(() => screen.getByText('Timeline'));

    expect(screen.getByText('Timeline')).toBeDefined();
  });

  test('Patient header', async () => {
    await setup('/Patient/123');
    await waitFor(() => screen.getByTestId('patient-header'));

    expect(screen.getByTestId('patient-header')).toBeInTheDocument();
  });

  test('Not found', async () => {
    await setup('Patient/not-found');
    await waitFor(() => screen.getByText('Resource Not Found'));
    expect(screen.getByText('Resource not found')).toBeInTheDocument();
  });

  test('Details render', async () => {
    await setup('/Patient/123/details');
    await waitFor(() => screen.queryAllByText('Name'));
    expect(screen.queryAllByText('Name')[0]).toBeInTheDocument();
  });

  test('Patient timeline renders', async () => {
    await setup('/Patient/123/timeline');
    await waitFor(() => screen.getAllByText('Timeline'));

    expect(screen.getByText('Timeline')).toBeInTheDocument();
  });

  test('Encounter timeline renders', async () => {
    await setup('/Encounter/123/timeline');
    await waitFor(() => screen.getAllByText('Timeline'));

    expect(screen.getByText('Timeline')).toBeInTheDocument();
  });

  test('Service request timeline renders', async () => {
    await setup('/ServiceRequest/123/timeline');
    await waitFor(() => screen.getAllByText('Timeline'));

    expect(screen.getByText('Timeline')).toBeInTheDocument();
  });

  test('Default timeline renders', async () => {
    await setup('/Practitioner/123/timeline');
    await waitFor(() => screen.getAllByText('Timeline'));

    expect(screen.getByText('Timeline')).toBeInTheDocument();
  });

  test('History renders', async () => {
    await setup('/Patient/123/history');
    await waitFor(() => screen.getByText('History'));

    expect(screen.getByText('History')).toBeInTheDocument();
  });

  test('Blame renders', async () => {
    await setup('/Patient/123/blame');
    await waitFor(() => screen.getByText('Blame'));

    expect(screen.getByText('Blame')).toBeInTheDocument();
  });

  test('Edit renders', async () => {
    await setup('/Patient/123/edit');
    await waitFor(() => screen.getByText('Edit'));

    expect(screen.getByText('Edit')).toBeInTheDocument();
  });

  test('JSON renders', async () => {
    await setup('/Patient/123/json');
    await waitFor(() => screen.getByTestId('resource-json'));

    expect(screen.getByTestId('resource-json')).toBeInTheDocument();
  });

  test('Click on tab', async () => {
    await setup('/Patient/123/details');
    await waitFor(() => screen.getAllByText('Name'));

    await act(async () => {
      fireEvent.click(screen.getByText('History'));
    });

    expect(screen.getByText('History')).toHaveClass('selected');
  });
});
