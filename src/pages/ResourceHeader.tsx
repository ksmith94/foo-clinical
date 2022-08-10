import { getDisplayString, getReferenceString } from '@medplum/core';
import { Reference, Resource } from '@medplum/fhirtypes';
import { Scrollable, useResource } from '@medplum/react';
import React from 'react';

export interface ResourceHeaderProps {
  resource: Resource | Reference<Resource>;
}

export function ResourceHeader(props: ResourceHeaderProps): JSX.Element | null {
  const resource = useResource(props.resource);
  if (!resource) {
    return null;
  }
  const entries: { key: string; value: string | undefined }[] = [{ key: 'Type', value: resource.resourceType }];

  function addEntry(key: string | undefined, value: string | undefined): void {
    if (key && value) {
      entries.push({ key, value });
    }
  }

  const name = getDisplayString(resource);
  if (name !== getReferenceString(resource)) {
    addEntry('Name', name);
  }

  if (entries.length === 1) {
    entries.push({ key: 'ID', value: resource.id });
  }

  return (
    <Scrollable className="medplum-surface" height={50}>
      <div className="medplum-resource-header">
        {entries.map((entry) => (
          <dl key={entry.key}>
            <dt>{entry.key}</dt>
            <dd>{entry.value}</dd>
          </dl>
        ))}
      </div>
    </Scrollable>
  );
}
