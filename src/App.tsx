import { getReferenceString } from '@medplum/core';
import { ErrorBoundary, Header, useMedplum, Loading } from '@medplum/react';
import React, { Suspense } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { LandingPage } from './pages/LandingPage';
import { ProfilePage } from './pages/ProfilePage';
import { MirrorPage } from './pages/MirrorPage';
import { SearchPage } from './pages/SearchPage';
import { SignInPage } from './pages/SignInPage';

export function App(): JSX.Element | null {
  const navigate = useNavigate();
  const medplum = useMedplum();

  if (medplum.isLoading()) {
    return <Loading />;
  }

  const profile = medplum.getProfile();

  return (
    <>
      {profile && (
        <Header
          bgColor="#0D9488"
          title="FooClinical"
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
        <Suspense fallback={<Loading />}>
          <Routes>
            <Route path="" element={profile ? <HomePage /> : <LandingPage />} />
            <Route path="/signin" element={<SignInPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/:resourceType/:id/:tab" element={<MirrorPage />} />
            <Route path="/:resourceType/:id" element={<MirrorPage />} />
            <Route path="/:resourceType" element={<SearchPage />} />
          </Routes>
        </Suspense>
      </ErrorBoundary>
    </>
  );
}
