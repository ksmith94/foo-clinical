import { getReferenceString } from '@medplum/core';
import { ErrorBoundary, Header, useMedplum } from '@medplum/react';
import React from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { LandingPage } from './pages/LandingPage';
import { PatientPage } from './pages/PatientPage';
import { ProfilePage } from './pages/ProfilePage';
import { ResourceApplicationPage } from './pages/ResourceApplicationPage';
import { SearchPage } from './pages/SearchPage';
import { SignInPage } from './pages/SignInPage';

export function App(): JSX.Element | null {
  const navigate = useNavigate();
  const medplum = useMedplum();

  if (medplum.isLoading()) {
    return null;
  }

  const profile = medplum.getProfile();

  return (
    <>
      {profile && (
        <Header
          bgColor="#0D9488"
          title="MyCompany"
          onLogo={() => navigate('/')}
          onProfile={() => navigate(`/${getReferenceString(profile)}`)}
          onSignOut={() => {
            medplum.signOut();
            navigate('/signin');
          }}
          config={medplum.getUserConfiguration()}
        />
      )}
      <ErrorBoundary>
        <Routes>
          <Route path="/" element={profile ? <HomePage /> : <LandingPage />} />
          <Route path="/signin" element={<SignInPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/Patient/:id" element={<PatientPage />} />
          <Route path="/:resourceType/:id" element={<ResourceApplicationPage />} />
          <Route path="/:resourceType" element={<SearchPage />} />
        </Routes>
      </ErrorBoundary>
    </>
  );
}
