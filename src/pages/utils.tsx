import { Patient, Reference, Resource, Specimen } from '@medplum/fhirtypes';

export function getPatient(resource: Resource): Patient | Reference<Patient> | undefined {
  if (resource.resourceType === 'Patient') {
    return resource;
  }
  if (
    resource.resourceType === 'DiagnosticReport' ||
    resource.resourceType === 'Encounter' ||
    resource.resourceType === 'Observation' ||
    resource.resourceType === 'ServiceRequest'
  ) {
    return resource.subject as Reference<Patient>;
  }
  return undefined;
}

export function getSpecimen(resource: Resource): Specimen | Reference<Specimen> | undefined {
  if (resource.resourceType === 'Specimen') {
    return resource;
  }
  if (resource.resourceType === 'Observation') {
    return resource.specimen;
  }
  if (resource.resourceType === 'DiagnosticReport' || resource.resourceType === 'ServiceRequest') {
    return resource.specimen?.[0];
  }
  return undefined;
}
