import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { USERS } from '../../firebase/index';
import firebase from '../../firebase/clientApp';

import useForm from '../hooks/useForm';
import LoadingError from '../components/LoadingError';
import { useUser } from '../components/user-context';
import Card from '../components/Card';
import UserCard from '../components/UserCard';

const Users = () => {
  const { user } = useUser();
  const db = firebase.firestore();
  const [adminMode, setAdminMode] = useState(false);
  const [userDocs, setUserDocs] = useState();

  const [userInfo, loading, error] = useCollectionData(db.collection(USERS), {
    snapshotListenOptions: { includeMetadataChanges: true },
  });

  const {formData, handleFormSubmit, handleChange } = useForm()

  // useEffect(() => {
  //   if (!formData.search) {
  //     return
  //   }

  //   setUserDocs(db.collection(USERS).where()

  // }, [formData])

  //upon user or userDocs change, move the current user to the first array position, and update whether they have admin status
  //use a state for the sorted array to make sure it's re-rendered when user or userData changes
  useEffect(() => {
    if (user && userInfo) {
      const currUserIndex = userInfo.findIndex((u) => u.uid == user.uid)
      const currUser = userInfo[currUserIndex] || null
      setAdminMode(currUser?.isAdmin)

      const userData = [...userInfo]
      userData.splice(currUserIndex, 1)
      userData.splice(0, 0, currUser)
      setUserDocs(userData)
    }
  }, [userInfo, user]);

  return (
    <>
      <Helmet>
        <title>Users - React & Firebase Starter</title>
        <meta
          name="description"
          content="This is a default page from React & Firebase Starter. Change this content by editing Users.js."
        />
        <link rel="canonical" href="http://mysite.com/example" />
      </Helmet>

      <main>
        <Card>
          <h1 className="text-2xl leading-6 font-medium text-gray-900">
            Meet other users
          </h1>
        </Card>

        <Card>
          <form onSubmit={handleFormSubmit}>
            <label for="search" className='text-2xl leading-6 font-medium text-gray-900'>Search Users</label>
            <input type='text' id="search" name="search" value={formData.search || ""} onChange={handleChange} placeholder="Search by username"/>
            <input type='checkbox' id="isAdmin" name="isAdmin" value={formData.isAdmin || ""} onChange={handleChange} />
          </form>
        </Card>

        <LoadingError data={userDocs} loading={loading} error={error}>
          {!userDocs?.length ? (
            <Card>
              <p className="mt-2 max-w-xl text-sm text-gray-700">
                No one here yet 👀
              </p>
            </Card>
          ) : (
            <ul className="space-y-4 lg:items-start pb-12">
              {userDocs.map((userDoc) => (
                <UserCard
                  key={`user-${userDoc.uid}`}
                  userDoc={userDoc}
                  isCurrentUser={user.uid === userDoc.uid}
                  adminMode={adminMode}
                />
              ))}
            </ul>
          )}
        </LoadingError>
      </main>
    </>
  );
};

export default Users;
