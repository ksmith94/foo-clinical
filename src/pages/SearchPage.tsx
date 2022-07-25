import {
  DEFAULT_SEARCH_COUNT,
  Filter,
  parseSearchDefinition,
  SearchRequest,
  SortRule,
  formatSearchQuery,
} from '@medplum/core';
import { ResourceType, UserConfiguration } from '@medplum/fhirtypes';
import { Loading, MemoizedSearchControl, useMedplum } from '@medplum/react';
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export function SearchPage(): JSX.Element {
  const medplum = useMedplum();
  const navigate = useNavigate();
  const [search, setSearch] = useState<SearchRequest>();
  const location = useLocation();

  useEffect(() => {
    const parsedSearch = parseSearchDefinition(location.pathname + location.search);
    const populatedSearch = addDefaultSearchValues(parsedSearch, medplum.getUserConfiguration());

    if (
      location.pathname === `/${populatedSearch.resourceType}` &&
      location.search === formatSearchQuery(populatedSearch)
    ) {
      saveLastSearch(populatedSearch);
      setSearch(populatedSearch);
    } else {
      navigate(`/${populatedSearch.resourceType}${formatSearchQuery(populatedSearch)}`);
    }
  }, [medplum, location, navigate]);

  if (!search?.resourceType || !search.fields || search.fields.length === 0) {
    return <Loading />;
  }

  return (
    <MemoizedSearchControl
      checkboxesEnabled={true}
      search={search}
      userConfig={medplum.getUserConfiguration()}
      onClick={(e) => navigate(`/${e.resource.resourceType}/${e.resource.id}`)}
      onChange={(e) => {
        navigate(`/${search.resourceType}${formatSearchQuery(e.definition)}`);
      }}
      onNew={search.resourceType === 'Bot' ? undefined : () => navigate(`/${search.resourceType}/new`)}
      onDelete={(ids: string[]) => {
        if (window.confirm('Are you sure you want to delete this resource?')) {
          medplum.invalidateSearches(search.resourceType as ResourceType);
          medplum
            .executeBatch({
              resourceType: 'Bundle',
              type: 'batch',
              entry: ids.map((id) => ({
                request: {
                  method: 'DELETE',
                  urls: `${search.resourceType}/${id}`,
                },
              })),
            })
            .then(() => setSearch({ ...search }));
        }
      }}
    />
  );
}

function addDefaultSearchValues(search: SearchRequest, config: UserConfiguration | undefined): SearchRequest {
  const resourceType = search.resourceType || getDefaultResourceType(config);
  const fields = search.fields ?? getDefaultFields(resourceType);
  const filters = search.filters ?? (!search.resourceType ? getDefaultFilters(resourceType) : undefined);
  const sortRules = search.sortRules ?? getDefaultSortRules(resourceType);
  const offset = search.offset ?? 0;
  const count = search.count ?? DEFAULT_SEARCH_COUNT;

  return {
    ...search,
    resourceType,
    fields,
    filters,
    sortRules,
    offset,
    count,
  };
}

function getDefaultResourceType(config: UserConfiguration | undefined): string {
  return (
    localStorage.getItem('defaultResourceType') ||
    config?.option?.find((o) => o.id === 'defaultResourceType')?.valueString ||
    'Patient'
  );
}

export function getDefaultFields(resourceType: string): string[] {
  const lastSearch = getLastSearch(resourceType);
  if (lastSearch?.fields) {
    return lastSearch.fields;
  }
  const fields = ['id', '_lastUpdated'];
  switch (resourceType) {
    case 'Patient':
      fields.push('name', 'birthDate', 'gender');
      break;
    case 'AccessPolicy':
    case 'Bot':
    case 'ClientApplication':
    case 'Practitioner':
    case 'Project':
    case 'Organization':
    case 'Questionnaire':
    case 'UserConfiguration':
      fields.push('name');
      break;
    case 'CodeSystem':
    case 'ValueSet':
      fields.push('name', 'title', 'status');
      break;
    case 'Condition':
      fields.push('subject', 'code', 'clinicalStatus');
      break;
    case 'Device':
      fields.push('manufacturer', 'deviceName', 'patient');
      break;
    case 'DeviceDefinition':
      fields.push('manufacturer[x]', 'deviceName');
      break;
    case 'DeviceRequest':
      fields.push('code[x]', 'subject');
      break;
    case 'DiagnosticReport':
    case 'Observation':
      fields.push('subject', 'code', 'status');
      break;
    case 'Encounter':
      fields.push('subject');
      break;
    case 'ServiceRequest':
      fields.push('subject', 'code', 'status', 'orderDetail');
      break;
    case 'Subscription':
      fields.push('criteria');
      break;
    case 'User':
      fields.push('email');
      break;
  }
  return fields;
}

function getDefaultFilters(resourceType: string): Filter[] | undefined {
  return getLastSearch(resourceType)?.filters;
}

function getDefaultSortRules(resourceType: string): SortRule[] {
  const lastSearch = getLastSearch(resourceType);
  if (lastSearch?.sortRules) {
    return lastSearch.sortRules;
  }
  return [{ code: '_lastUpdated', descending: true }];
}

function getLastSearch(resourceType: string): SearchRequest | undefined {
  const value = localStorage.getItem(resourceType + '-defaultSearch');
  return value ? (JSON.parse(value) as SearchRequest) : undefined;
}

function saveLastSearch(search: SearchRequest): void {
  localStorage.setItem('defaultResourceType', search.resourceType);
  localStorage.setItem(search.resourceType + '-defaultSearch', JSON.stringify(search));
}
