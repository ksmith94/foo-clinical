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
import { OperationOutcome, Patient } from '@medplum/fhirtypes';

describe('MirrorPage', () => {
  async function setup(url: string, medplum = new MockClient()): Promise<void> {
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

  test('Renders a patient', async () => {
    await setup('/Patient/123');
    await waitFor(() => screen.getAllByText('Alice Smith'));

    expect(screen.queryAllByText('Alice Smith')).toBeDefined();
  });

  test('Get tabs', async () => {
    const tabs = ['Timeline', 'Details', 'Edit', 'History', 'Blame', 'JSON'];
    expect(getTabs('Patient')).toEqual(tabs);
    expect(getTabs('DiagnosticReport')).toEqual([...tabs, 'Report']);
    expect(getTabs('Questionnaire')).toEqual([...tabs, 'Preview', 'Builder']);
    expect(getTabs('PlanDefinition')).toEqual([...tabs, 'Apply', 'Builder']);
    expect(getTabs('Bot')).toEqual([...tabs, 'Editor']);
    expect(getTabs('RequestGroup')).toEqual([...tabs, 'Checklist']);
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
    await setup('/Patient/not-found');
    await waitFor(() => screen.getByText('Resource Not Found'));
    expect(screen.getByText('Resource Not Found')).toBeInTheDocument();
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

  test('Delete button prompts user', async () => {
    const confirm = 'Are you sure you want to delete this Patient?';
    await setup('/Patient/123/edit');
    await waitFor(() => screen.getByText('Delete'));
    expect(screen.getByText('Delete')).toBeInTheDocument();

    await act(async () => {
      fireEvent.click(screen.getByText('Delete'));
    });

    await waitFor(() => screen.getByText(confirm));
    expect(screen.getByText(confirm)).toBeInTheDocument();
  });

  test('Delete button, OK', async () => {
    const medplum = new MockClient();
    const patient = await medplum.createResource<Patient>({
      resourceType: 'Patient',
    });

    await setup(`/Patient/${patient.id}/delete`, medplum);
    await waitFor(() => screen.getByText('Delete'));

    await act(async () => {
      fireEvent.click(screen.getByText('Delete'));
    });

    try {
      await medplum.readResource('Patient', patient.id as string);
      fail('Should have thrown');
    } catch (err) {
      expect((err as OperationOutcome).id).toEqual('not-found');
    }
  });

  test('JSON renders', async () => {
    await setup('/Patient/123/json');
    await waitFor(() => screen.getByTestId('resource-json'));

    expect(screen.getByTestId('resource-json')).toBeInTheDocument();
  });

  test('JSON submit', async () => {
    await setup('/Patient/123/json');
    await waitFor(() => screen.getByTestId('resource-json'));

    await act(async () => {
      fireEvent.change(screen.getByTestId('resource-json'), {
        target: { value: '{"resourceType":"Patient", "id":"123"}' },
      });
    });

    await act(async () => {
      fireEvent.click(screen.getByText('OK'));
    });

    expect(screen.getByTestId('resource-json')).toBeInTheDocument();
  });

  test('Renders null', async () => {
    await setup('/Patient/123/no-tab');
    await waitFor(() => screen.getByRole('tabpanel'));

    expect(screen.getByRole('tabpanel')).toBeEmptyDOMElement();
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
