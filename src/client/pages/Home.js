import React from 'react';
import { Helmet } from 'react-helmet';

import { useDocumentData } from 'react-firebase-hooks/firestore';
import firebase from '../../firebase/clientApp';

const Home = () => {
  // Fetching data from Firestore
  const db = firebase.firestore();
  const [value, loading, error] = useDocumentData(
    db.collection('test').doc('testId'),
    { snapshotListenOptions: { includeMetadataChanges: true } }
  );

  if (error) console.error(new Error(JSON.stringify(error)));

  return (
    <>
      <Helmet>
        <title>React & Firebase Starter</title>
        <meta
          name="description"
          content="This is a default page from React & Firebase Starter. Change this content by editing App.js."
        />
        <link rel="canonical" href="http://mysite.com/example" />
      </Helmet>
      <main>
        <div className="pt-10 sm:pt-16 lg:pt-8 lg:pb-14">
          <div className="mx-auto max-w-7xl lg:px-8">
            <div className="lg:grid lg:grid-cols-2 lg:gap-8">
              <div className="mx-auto max-w-md px-4 sm:max-w-2xl sm:px-6 sm:text-center lg:px-0 lg:text-left lg:flex lg:items-center">
                <div className="lg:py-24">
                  <h1 className="mt-4 text-4xl tracking-tight font-extrabold text-white sm:mt-5 sm:text-6xl lg:mt-6 xl:text-6xl">
                    <span className="block">React & Firebase</span>
                    <span className="pb-3 block sm:pb-5">
                      <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-200 to-cyan-400">
                        Starter
                      </span>
                      <span>💞</span>
                    </span>
                  </h1>
                  <p className="text-base text-gray-300 sm:text-xl lg:text-lg xl:text-xl">
                    Let&apos;s see if Firestore is set up correctly:
                  </p>
                  <p className="font-bold text-base text-gray-300 sm:text-xl lg:text-lg xl:text-xl">
                    {loading && 'Loading...'}
                    {(error || (!loading && !value)) &&
                      'Nope. You might want to check out the docs for project setup.'}
                    {value && `Yep! ${value.testValue}`}
                  </p>
                  <div className="mt-10 sm:mt-12">
                    <a
                      href="https://github.com/codebusters-ca/react-firebase-starter#react--firebase-starter"
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center mr-6 px-2.5 py-1.5 rounded-md shadow bg-gradient-to-r from-teal-500 to-cyan-600 text-white font-medium hover:from-teal-600 hover:to-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-400 focus:ring-offset-gray-900"
                    >
                      Quick Start Guide
                    </a>
                    <a
                      href="https://www.codebusters.ca/articles/"
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center px-2.5 py-1.5 rounded-md shadow text-base font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-400"
                    >
                      Firebase Tips
                    </a>
                  </div>
                </div>
              </div>
              <div className="mt-12 -mb-16 sm:-mb-48 lg:m-0 lg:relative bg-gray-900">
                <div className="mx-auto max-w-md px-4 sm:max-w-2xl sm:px-6 lg:max-w-none lg:px-0">
                  {/* Illustration taken from Lucid Illustrations: https://lucid.pixsellz.io/ */}
                  <img
                    className="w-full lg:absolute lg:inset-y-0 lg:left-0 lg:h-full lg:w-auto lg:max-w-none"
                    src="https://tailwindui.com/img/component-images/cloud-illustration-teal-cyan.svg"
                    alt=""
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;
