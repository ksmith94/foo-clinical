import { Reference, Resource } from '@medplum/fhirtypes';
import { MockClient } from '@medplum/mock';
import { MedplumProvider } from '@medplum/react';
import { act, render, screen } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { ResourceHeader } from './ResourceHeader';

let medplum: MockClient;

async function setup(resource: Resource | Reference): Promise<void> {
  medplum = new MockClient();
  await act(async () => {
    render(
      <MemoryRouter>
        <MedplumProvider medplum={medplum}>
          <ResourceHeader resource={resource} />
        </MedplumProvider>
      </MemoryRouter>
    );
  });
}

describe('Resource header', () => {
  test('No resource', async () => {
    await setup({});
    const nullHeader = screen.queryByTestId('resource-header');
    expect(nullHeader).not.toBeInTheDocument();
  });
});
