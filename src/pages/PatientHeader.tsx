import { calculateAgeString } from '@medplum/core';
import { Patient, Reference } from '@medplum/fhirtypes';
import { Avatar, HumanNameDisplay, Scrollable, useResource } from '@medplum/react';
import React from 'react';

interface PatientHeaderProps {
  patient: Patient | Reference<Patient>;
}

export function PatientHeader(props: PatientHeaderProps): JSX.Element | null {
  const patient = useResource(props.patient);
  if (!patient) {
    return null;
  }

  return (
    <Scrollable className="medplum-surface" height={74}>
      <div className="medplum-patient-header" data-testid="patient-header">
        <Avatar value={patient} size="large" />
        <dl>
          <dt>Name</dt>
          <dd>{patient.name ? <HumanNameDisplay value={patient.name?.[0]} options={{ use: false }} /> : '[blank]'}</dd>
        </dl>
        {patient.birthDate && (
          <>
            <dl>
              <dt>DoB</dt>
              <dd>{patient.birthDate}</dd>
            </dl>
            <dl>
              <dt>Age</dt>
              <dd>{calculateAgeString(patient.birthDate)}</dd>
            </dl>
          </>
        )}
        {patient.gender && (
          <dl>
            <dt>Gender</dt>
            <dd>{patient.gender}</dd>
          </dl>
        )}
        {patient.address && (
          <dl>
            <dt>State</dt>
            <dd>{patient.address?.[0]?.state}</dd>
          </dl>
        )}
      </div>
    </Scrollable>
  );
}
