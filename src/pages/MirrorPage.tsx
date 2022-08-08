import { getDisplayString } from '@medplum/core';
import { ResourceType, Resource, OperationOutcome, Bundle, Questionnaire, ServiceRequest } from '@medplum/fhirtypes';
import { Document, Loading, MedplumLink, ResourceTable, Tab, TabList, useMedplum } from '@medplum/react';
import React, { useState, useCallback, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

/**
 * This is an example of a generic "Resource Display" page.
 * It uses the Medplum `<ResourceTable>` component to display a resource.
 */
export function getTabs(resourceType: string): string[] {
  const result = ['Timeline'];
  result.push('Details', 'Edit', 'History', 'Blame', 'JSON');
  if (resourceType === 'Bot') {
    result.push('Editor');
  }

  if (resourceType === 'PlanDefinition') {
    result.push('Apply', 'Builder');
  }

  if (resourceType === 'Questionnaire') {
    result.push('Preview', 'Builder');
  }

  if (resourceType === 'DiagnosticReport') {
    result.push('Report');
  }

  if (resourceType === 'RequestGroup') {
    result.push('Checklist');
  }
  return result;
}

export function MirrorPage(): JSX.Element {
  const navigate = useNavigate();
  const medplum = useMedplum();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<OperationOutcome | undefined>();
  const [value, setValue] = useState<Resource | undefined>();
  const [historyBundle, setHistoryBundle] = useState<Bundle | undefined>();
  const [questionnaires, setQuestionnaires] = useState<Bundle<Questionnaire>>();
  const { resourceType, id, tab } = useParams() as {
    resourceType: string;
    id: string;
    tab: string;
  };
  const resource = medplum.readResource(resourceType as ResourceType, id as string).read();

  const loadResource = useCallback(() => {
    setError(undefined);
    setLoading(true);

    const requestBundle: Bundle = {
      resourceType: 'Bundle',
      type: 'batch',
      entry: [
        {
          request: {
            method: 'GET',
            url: `${resourceType}/${id}`,
          },
        },
        {
          request: {
            method: 'GET',
            url: `${resourceType}/${id}/_history`,
          },
        },
        {
          request: {
            method: 'GET',
            url: `Questionnaire?subject-type=${resourceType}`,
          },
        },
      ],
    };

    return medplum
      .executeBatch(requestBundle)
      .then((responseBundle: Bundle) => {
        if (responseBundle.entry?.[0]?.response?.status !== '200') {
          setError(responseBundle.entry?.[0]?.response as OperationOutcome);
        } else {
          setValue(responseBundle.entry?.[0]?.resource);
          setHistoryBundle(responseBundle.entry?.[1]?.resource as Bundle);
          setQuestionnaires(responseBundle.entry?.[2]?.resource as Bundle<Questionnaire>);
        }
        setLoading(false);
      })
      .catch((reason) => {
        setError(reason);
        setLoading(false);
      });
  }, [medplum, resourceType, id]);

  function onTabChange(newTab: string): void {
    const url = `/${resourceType}/${id}/${newTab}`;
    navigate(url);
  }

  function onsubmit(newResource: Resource): void {
    medplum.updateResource(newResource).then(loadResource).catch(setError);
  }

  function onStatusChange(status: string): void {
    const serviceRequest = value as ServiceRequest;
    const orderDetail = serviceRequest.orderDetail || [];
    if (orderDetail.length === 0) {
      orderDetail.push({});
    }
    if (orderDetail[0].text !== status) {
      orderDetail[0].text = status;
      onsubmit({ ...serviceRequest, orderDetail });
    }
  }

  useEffect(() => {
    loadResource();
  }, [loadResource]);

  if (loading) {
    return <Loading />;
  }

  if (!value || !historyBundle) {
    return (
      <Document>
        <h1>Resource Not Found</h1>
        <MedplumLink to={`/${resourceType}`}>Return to Search Page</MedplumLink>
      </Document>
    );
  }

  const tabs = getTabs(resourceType);
  const defaultTab = tabs[0].toLowerCase();
  const currentTab = tab || defaultTab;

  return (
    <>
      <TabList value={currentTab} onChange={onTabChange}>
        {tabs.map((t) => (
          <Tab key={t} name={t.toLowerCase()} label={t} />
        ))}
      </TabList>
      <Document>
        <h2>{getDisplayString(resource)}</h2>
        <div>
          <ResourceTable key={`${resourceType}/${id}`} value={resource} ignoreMissingValues={true} />
        </div>
      </Document>
    </>
  );
}
