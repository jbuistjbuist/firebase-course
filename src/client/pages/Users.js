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
  const [searchedUsers, setSearchedUsers] = useState(null);
  const [currentUser, setCurrentUser] = useState();

  const [currentUserData, loading1, error1] = useCollectionData(
    db.collection(USERS).where('uid', '==', user?.uid),
    {
      snapshotListenOptions: { includeMetadataChanges: true },
    }
  );

  const [userList, loading2, error2] = useCollectionData(
    db.collection(USERS).where('uid', '!=', user?.uid).limit(15),
    {
      snapshotListenOptions: { includeMetadataChanges: true },
    }
  );

  const { formData, handleFormSubmit, handleChange } = useForm();

  useEffect(() => {
    if (!user || !currentUserData) {
      return;
    }
    if (currentUserData && !currentUserData.length) {
      const profile = {
        uid: user.uid,
        isAdmin: false,
      };

      db.collection(USERS)
        .doc(user.uid)
        .set(profile, { merge: true })
        .then((res) => {
          console.log(res);
          setCurrentUser(profile);
        })
        .catch((err) => console.log(err));
    } else {
      setCurrentUser(currentUserData[0]);
    }

    setAdminMode(currentUser?.isAdmin);
  }, [currentUserData]);

  // useEffect(() => {
  //   if (!formData.search) {
  //     setSearchedUsers(null);
  //     return;
  //   }

  //   const [searchResult, loading3, error2] = useCollectionData(
  //     db.collection(USERS).where('about', '')
  //   );
  // }, [formData]);

  //upon user or userDocs change, move the current user to the first array position, and update whether they have admin status
  //use a state for the sorted array to make sure it's re-rendered when user or userData changes

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
            <label
              htmlFor="search"
              className="text-2xl leading-6 font-medium text-gray-900"
            >
              Search Users
            </label>
            <input
              type="text"
              id="search"
              name="search"
              value={formData.search || ''}
              onChange={handleChange}
              placeholder="Search by username"
            />
            <label htmlFor="isAdmin">Only Search Admins?</label>
            <input
              type="checkbox"
              id="isAdmin"
              name="isAdmin"
              value={formData.isAdmin || ''}
              onChange={handleChange}
            />
          </form>
        </Card>

        <LoadingError
          data={userList}
          loading={loading1 || loading2}
          error={error1 || error2}
        >
          {!userList?.length && !searchedUsers ? (
            <Card>
              <p className="mt-2 max-w-xl text-sm text-gray-700">
                No one here yet 👀
              </p>
            </Card>
          ) : (
            <ul className="space-y-4 lg:items-start pb-12">
              {currentUser && (
                <UserCard
                  key={`user-${currentUser.uid}`}
                  userDoc={currentUser}
                  isCurrentUser={true}
                  adminMode={adminMode}
                />
              )}
              {userList.map((userDoc) => (
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
