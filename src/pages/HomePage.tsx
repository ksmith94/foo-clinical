import { formatGivenName } from '@medplum/core';
import { HumanName, Patient, Practitioner } from '@medplum/fhirtypes';
import { Document, Loading, ResourceBadge, useMedplum, useMedplumProfile } from '@medplum/react';
import React from 'react';
import { Link } from 'react-router-dom';

export function HomePage(): JSX.Element {
  const medplum = useMedplum();
  const profile = useMedplumProfile() as Practitioner;
  const patients: Patient[] = medplum.searchResources('Patient').read();

  if (!patients) {
    return <Loading />;
  }

  return (
    <Document data-testid="home-page">
      <h1>Welcome {formatGivenName(profile.name?.[0] as HumanName)}</h1>
      <h2>
        <Link to="/Patient">Patients</Link>
      </h2>
      {patients.map((e) => (
        <div key={e.id}>
          <ResourceBadge link={true} value={e} />
        </div>
      ))}
    </Document>
  );
}
