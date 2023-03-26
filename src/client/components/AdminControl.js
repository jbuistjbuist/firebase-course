import React, { useState } from 'react';

import { updateUser } from '../../firebase';

import Card from './Card';

export default function AdminControl({ adminMode, uid, isAdmin }) {
  //use state to show and hide confirmation modal
  const [showModal, setShowModal] = useState(false);

  //conditionally format button based on whether it is to grant or revoke admin access
  let adminBtnBase =
    'inline-flex justify-end py-2 px-3 border border-transparent shadow-sm text-sm font-medium rounded-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2';
  let adminBtnFormat = !isAdmin
    ? ' bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500'
    : ' bg-red-600 hover:bg-red-700 focus:ring-red-500';
  const adminBtnClasses = adminBtnBase + adminBtnFormat;

  const handleConfirm = () => {
    setShowModal(false);
    updateUser(uid, { isAdmin: !isAdmin });
  };

  return (
    <Card>
      <h3 className="text-lg leading-5 font-medium text-gray-900">
        Admin Status
      </h3>
      <p className="mt-1 text-sm text-gray-500">
        {!isAdmin ? 'Not an admin' : 'Admin access'}
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
          onClick={() => setShowModal((prev) => !prev)}
          className={adminBtnClasses}
        >
          {!isAdmin ? 'Grant' : 'Revoke'}
        </button>
      </div>

      {showModal && (
        <div
          className="flex-col flex justify-center bg-opacity-40 bg-gray-600 items-center overflow-x-hidden overflow-y-auto fixed inset-0 outline-none focus:outline-none z-10 animate-appear-mid"
          onClick={() => setShowModal(false)}
        >
          <div
            className="relative w-2/3 h-1/3 sm:w-1/3 z-30 flex flex-col justify-center items-center bg-white rounded-lg mx-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl leading-6 font-medium text-gray-900 pt-4">
              Are you sure?
            </h2>
            <div className="w-2/3 flex flex-row flex-wrap justify-center items-center gap-4 pt-8 justify-self-center">
              <button
                type="button"
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-gray-500 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-600"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className={adminBtnClasses}
                onClick={handleConfirm}
              >
                {!isAdmin ? 'Grant' : 'Revoke'}
              </button>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
