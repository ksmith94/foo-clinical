import { formatGivenName } from '@medplum/core';
import { HumanName, Organization, Patient, Practitioner } from '@medplum/fhirtypes';
import { Avatar, Document, Loading, ResourceBadge, useMedplum, useMedplumProfile } from '@medplum/react';
import React from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';

export function HomePage(): JSX.Element {
  const medplum = useMedplum();
  const profile = useMedplumProfile() as Practitioner;
  const patients: Patient[] = medplum.searchResources('Patient').read();
  const practitioners: Practitioner[] = medplum.searchResources('Practitioner').read();
  const organizations: Organization[] = medplum.searchResources('Organization').read();

  if (!patients) {
    return <Loading />;
  }

  return (
    <>
      <h1>
        <Avatar value={profile} />
        Welcome {formatGivenName(profile.name?.[0] as HumanName)}
      </h1>
      <div className="homepage">
        <Document data-testid="patients">
          <h2>
            <Link to="/Patient">Patients</Link>
          </h2>
          <div className="resources">
            {patients.slice(0, 8).map((e) => (
              <div key={e.id}>
                <ResourceBadge link={true} value={e} />
              </div>
            ))}
            <div className="additional-links">
              <Link to="/Patient">(See All)</Link>
              <Link to="/Patient/new">Add new patient</Link>
            </div>
          </div>
        </Document>
        <Document data-testid="practitioners">
          <h2>
            <Link to="/Practitioner">Practitioners</Link>
          </h2>
          <div className="resources">
            {practitioners.slice(0, 8).map((e) => (
              <div key={e.id}>
                <ResourceBadge link={true} value={e} />
              </div>
            ))}
            <div className="additional-links">
              <Link to="/Practitioner">(See All)</Link>
              <Link to="/Practitioner/new">Add new practitioner</Link>
            </div>
          </div>
        </Document>
        <Document data-testid="organizations">
          <h2>
            <Link to="/Organization">Organizations</Link>
          </h2>
          <div className="resources">
            {organizations.slice(0, 8).map((e) => (
              <div key={e.id}>
                <ResourceBadge link={true} value={e} />
              </div>
            ))}
            <div className="additional-links">
              <Link to="/Organization">(See All)</Link>
              <Link to="/Organization/new">Add new organization</Link>
            </div>
          </div>
        </Document>
      </div>
    </>
  );
}
