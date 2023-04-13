import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { USERS } from '../../firebase/index';
import firebase from '../../firebase/clientApp';

import typesenseClient from '../../typesense/client';
import useForm from '../hooks/useForm';
import LoadingError from '../components/LoadingError';
import searchUsers from '../../typesense/search';
import { useUser } from '../components/user-context';
import Card from '../components/Card';
import UserCard from '../components/UserCard';

const Users = () => {
  const { user } = useUser();
  const db = firebase.firestore();
  const [adminMode, setAdminMode] = useState(false);
  const [searchedUsers, setSearchedUsers] = useState([]);
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
        displayName: '',
        about: '',
      };

      db.collection(USERS)
        .doc(user.uid)
        .set(profile, { merge: true })
        .then((res) => {
          console.log(res);
          setCurrentUser(profile);
          typesenseClient
            .collections('users')
            .documents()
            .create({
              id: profile.uid,
              isAdmin: profile.isAdmin,
              displayName: profile.displayName,
              about: profile.about,
            })
            .then((res) => console.log(res))
            .catch((err) => console.log(err));
        })
        .catch((err) => console.log(err));
    } else {
      setCurrentUser(currentUserData[0]);
    }

    setAdminMode(currentUser?.isAdmin);
  }, [currentUserData]);

  useEffect(() => {
    if (!formData.search) {
      setSearchedUsers(null);
      return;
    }

    searchUsers(formData.search)
      .then((results) => {
        let result = [];
        results.hits.forEach((e) => {
          result.push(e.document);
        });
        setSearchedUsers(result);
      })
      .catch((error) => console.log(error));
  }, [formData]);

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

  
          <form onSubmit={handleFormSubmit} className='flex justify-center align-middle'>
            <input
              className='rounded-lg w-11/12 sm:w-6/12 mx-auto my-0 z-10 px-4 py-1 sm:p-2 shadow-innerstrong'
              type="text"
              id="search"
              name="search"
              aria-label="search-users"
              value={formData.search || ''}
              onChange={handleChange}
              placeholder="Search by username"
            />
          </form>

        <LoadingError
          data={userList}
          loading={loading1 || loading2}
          error={error1 || error2}
        >
          {!userList?.length ? (
            <Card>
              <p className="mt-2 max-w-xl text-sm text-gray-700">
                No one here yet 👀
              </p>
            </Card>
          ) : !searchedUsers?.length ? (
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
          ) : (
            <ul className="space-y-4 lg:items-start pb-12">

              {searchedUsers.map((searchDoc) => (
                <UserCard
                  key={`user-${searchDoc.id}`}
                  userDoc={searchDoc}
                  isCurrentUser={user.uid === searchDoc.id}
                  adminMode={adminMode}
                />))}

            </ul>
          )}
        </LoadingError>
      </main>
    </>
  );
};

export default Users;
