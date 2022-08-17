import { formatGivenName } from '@medplum/core';
import { DiagnosticReport, HumanName, Organization, Patient, Practitioner, Schedule } from '@medplum/fhirtypes';
import { Document, Loading, Logo, ResourceBadge, useMedplum, useMedplumProfile, Scheduler } from '@medplum/react';
import React from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';

export function HomePage(): JSX.Element {
  const medplum = useMedplum();
  const profile = useMedplumProfile() as Practitioner;
  const patients: Patient[] = medplum.searchResources('Patient').read();
  const practitioners: Practitioner[] = medplum.searchResources('Practitioner').read();
  const organizations: Organization[] = medplum.searchResources('Organization').read();
  const diagnosticReports: DiagnosticReport[] = medplum.searchResources('DiagnosticReport').read();
  const profileSchedule: Schedule = {
    resourceType: 'Schedule',
    id: profile.id,
    actor: [
      {
        reference: `Practitioner/${profile.id}`,
        display: `${profile.name}`,
      },
    ],
  };

  if (!patients) {
    return <Loading />;
  }

  return (
    <>
      <Link className="profile-link" to={`/Practitioner/${profile.id}`}>
        <h1 className="profile-header">
          <Logo size={28} />
          Welcome {profile.name?.[0] ? formatGivenName(profile.name?.[0] as HumanName) : ''}
        </h1>
      </Link>
      <div className="homepage">
        <Scheduler schedule={profileSchedule}></Scheduler>
        <div className="homepage-resources">
          <Document data-testid="patients">
            <h2 className="resource-header">Patients</h2>
            <div className="resources">
              {patients.slice(0, 8).map((e) => (
                <div key={e.id}>
                  <ResourceBadge link={true} value={e} />
                </div>
              ))}
              <div className="additional-links">
                <Link to="/Patient">See All</Link>
                <Link to="/Patient/new">Add new patient</Link>
              </div>
            </div>
          </Document>
          <Document data-testid="practitioners">
            <h2 className="resource-header">Practitioners</h2>
            <div className="resources">
              {practitioners.slice(0, 8).map((e) => (
                <div key={e.id}>
                  <ResourceBadge link={true} value={e} />
                </div>
              ))}
              <div className="additional-links">
                <Link to="/Practitioner">See All</Link>
                <Link to="/Practitioner/new">Add new practitioner</Link>
              </div>
            </div>
          </Document>
          <Document data-testid="organizations">
            <h2 className="resource-header">Organizations</h2>
            <div className="resources">
              {organizations.slice(0, 8).map((e) => (
                <div key={e.id}>
                  <ResourceBadge link={true} value={e} />
                </div>
              ))}
              <div className="additional-links">
                <Link to="/Organization">See All</Link>
                <Link to="/Organization/new">Add new organization</Link>
              </div>
            </div>
          </Document>
          <Document data-testid="diagnostic-reports">
            <h2 className="resource-header">Diagnostic Reports</h2>
            <div className="resources">
              {diagnosticReports.slice(0, 8).map((e) => (
                <div key={e.id}>
                  <ResourceBadge link={true} value={e} />
                </div>
              ))}
              <div className="additional-links">
                <Link to="/DiagnosticReport">See All</Link>
                <Link to="/DiagnosticReport/new">Add new diagnostic report</Link>
              </div>
            </div>
          </Document>
        </div>
      </div>
    </>
  );
}
