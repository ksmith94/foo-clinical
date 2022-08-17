import { Bundle, OperationOutcome, Questionnaire, Resource } from '@medplum/fhirtypes';
import {
  Button,
  DefaultResourceTimeline,
  EncounterTimeline,
  Form,
  PatientTimeline,
  ResourceBlame,
  ResourceForm,
  ResourceHistoryTable,
  ResourceTable,
  ServiceRequestTimeline,
  TextArea,
  useMedplum,
} from '@medplum/react';
import { useNavigate } from 'react-router-dom';
import React from 'react';
import { stringify } from '@medplum/core';

export interface ResourceTabProps {
  name: string;
  resource: Resource;
  resourceHistory: Bundle;
  questionnaires: Bundle<Questionnaire>;
  onSubmit: (resource: Resource) => void;
  outcome?: OperationOutcome;
}

export function ResourceTab(props: ResourceTabProps): JSX.Element | null {
  const navigate = useNavigate();
  const medplum = useMedplum();
  const { resourceType, id } = props.resource;
  switch (props.name) {
    case 'details':
      return <ResourceTable value={props.resource} />;
    case 'history':
      return <ResourceHistoryTable history={props.resourceHistory} />;
    case 'blame':
      return <ResourceBlame history={props.resourceHistory} />;
    case 'timeline':
      if (props.resource.resourceType === 'Patient') {
        return <PatientTimeline patient={props.resource} />;
      }
      if (props.resource.resourceType === 'Encounter') {
        return <EncounterTimeline encounter={props.resource} />;
      }
      if (props.resource.resourceType === 'ServiceRequest') {
        return <ServiceRequestTimeline serviceRequest={props.resource} />;
      }
      return <DefaultResourceTimeline resource={props.resource} />;
    case 'edit':
      return (
        <ResourceForm
          defaultValue={props.resource}
          onSubmit={props.onSubmit}
          onDelete={() => navigate(`/${resourceType}/${id}/delete`)}
        />
      );
    case 'delete':
      return (
        <>
          <p>Are you sure you want to delete this {resourceType}?</p>
          <Button
            danger={true}
            onClick={() => {
              medplum.deleteResource(resourceType, id as string).then(() => navigate(`/${resourceType}`));
            }}
          >
            Delete
          </Button>
        </>
      );
    case 'json':
      return (
        <Form
          onSubmit={(formData: Record<string, string>) => {
            props.onSubmit(JSON.parse(formData.resource));
          }}
        >
          <TextArea
            testid="resource-json"
            name="resource"
            monospace={true}
            style={{ height: 400 }}
            defaultValue={stringify(props.resource, true)}
          />
          <Button type="submit">OK</Button>
        </Form>
      );
  }
  return null;
}
