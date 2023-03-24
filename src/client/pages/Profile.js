import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { useDocumentData } from 'react-firebase-hooks/firestore';
import { USERS, updateUser } from '../../firebase/index';
import firebase from '../../firebase/clientApp';

import { useUser } from '../components/user-context';
import LoadingError from '../components/LoadingError';
import Card from '../components/Card';
import ProfileForm from '../components/ProfileForm';

const Profile = () => {
  const { user } = useUser();
  const { uid } = useParams();

  const db = firebase.firestore();

  const [userDoc, loading, error] = useDocumentData(
    db.collection(USERS).doc(uid),
    {
      snapshotListenOptions: { includeMetadataChanges: true },
    }
  );

  // Check if current user is an admin
  const [adminMode, setAdminMode] = useState(false);

  useEffect(() => {
    if (user) {
      db.collection(USERS)
        .doc(user.uid)
        .get()
        .then((currentUser) => setAdminMode(currentUser.data().isAdmin));
    }
  }, []);

  let adminBtnBase =
    'ml-3 inline-flex justify-end py-2 px-3 border border-transparent shadow-sm text-sm font-medium rounded-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2';
  let adminBtnFormat =
    userDoc && !userDoc.isAdmin
      ? ' bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500'
      : ' bg-red-600 hover:bg-red-700 focus:ring-red-500';
  const adminBtnClasses = adminBtnBase + adminBtnFormat;

  return (
    <main>
      <Card>
        <h1 className="text-2xl leading-6 font-medium text-gray-900">
          {userDoc?.uid === user?.uid
            ? 'Edit your profile'
            : adminMode
            ? 'Edit user profile'
            : 'View profile'}
        </h1>
      </Card>

      <LoadingError data={userDoc} loading={loading} error={error}>
        {userDoc && (
          <>
            <Card>
              <ProfileForm
                userDoc={userDoc}
                isCurrentUser={userDoc.uid === user.uid}
                adminMode={adminMode}
              />
            </Card>
          </>
        )}
      </LoadingError>
      <Card>
        <h3 className="text-lg leading-5 font-medium text-gray-900">
          Admin Status
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          {userDoc && !userDoc.isAdmin ? 'No admin access' : 'Admin access'}
        </p>
        {!adminMode && (
          <p className="mt-1 text-xs text-gray-400">
            {' '}
            You are not authorized to grant or revoke admin access{' '}
          </p>
        )}
        <div className="pt-2 flex justify-end">
          <button
            type="button"
            className={adminBtnClasses}
            onClick={() =>
              updateUser(userDoc.uid, { isAdmin: !userDoc.isAdmin })
            }
          >
            {userDoc && !userDoc.isAdmin ? 'Grant' : 'Revoke'}
          </button>
        </div>
      </Card>
    </main>
  );
};

export default Profile;
