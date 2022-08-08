import { Resource, OperationOutcome, Bundle, Questionnaire } from '@medplum/fhirtypes';
import {
  Document,
  ErrorBoundary,
  Loading,
  MedplumLink,
  PatientTimeline,
  ResourceBlame,
  ResourceForm,
  ResourceHistoryTable,
  ResourceTable,
  Tab,
  TabList,
  TabPanel,
  TabSwitch,
  useMedplum,
} from '@medplum/react';
import React, { useState, useCallback, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './MirrorPage.css';
import { PatientHeader } from './PatientHeader';
import { getPatient } from './utils';

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

  function onSubmit(newResource: Resource): void {
    medplum.updateResource(newResource).then(loadResource).catch(setError);
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
  const patient = getPatient(value);
  return (
    <>
      {patient && <PatientHeader patient={patient} />}
      <TabList value={currentTab} onChange={onTabChange}>
        {tabs.map((t) => (
          <Tab key={t} name={t.toLowerCase()} label={t} />
        ))}
      </TabList>
      {currentTab !== 'editor' && (
        <Document>
          {error && <pre data-testid="error">{JSON.stringify(error, undefined, 2)}</pre>}
          <TabSwitch value={currentTab}>
            <TabPanel name={currentTab}>
              <ErrorBoundary>
                <ResourceTab
                  name={currentTab.toLowerCase()}
                  resource={value}
                  resourceHistory={historyBundle}
                  questionnaires={questionnaires as Bundle<Questionnaire>}
                  onSubmit={onSubmit}
                  outcome={error}
                />
              </ErrorBoundary>
            </TabPanel>
          </TabSwitch>
        </Document>
      )}
    </>
  );
}

interface ResourceTabProps {
  name: string;
  resource: Resource;
  resourceHistory: Bundle;
  questionnaires: Bundle<Questionnaire>;
  onSubmit: (resource: Resource) => void;
  outcome?: OperationOutcome;
}

function ResourceTab(props: ResourceTabProps): JSX.Element | null {
  const navigate = useNavigate();
  // const medplum = useMedplum();
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
      return null;
    case 'edit':
      return (
        <ResourceForm
          defaultValue={props.resource}
          onSubmit={props.onSubmit}
          onDelete={() => navigate(`/${resourceType}/${id}/delete`)}
        />
      );
  }
  return null;
}
