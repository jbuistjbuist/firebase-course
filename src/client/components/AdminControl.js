import React from 'react';

import { updateUser } from '../../firebase';

import Card from './Card';

export default function AdminControl({ adminMode, uid, isAdmin }) {
  let adminBtnBase =
    'ml-3 inline-flex justify-end py-2 px-3 border border-transparent shadow-sm text-sm font-medium rounded-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2';
  let adminBtnFormat = !isAdmin
    ? ' bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500'
    : ' bg-red-600 hover:bg-red-700 focus:ring-red-500';
  const adminBtnClasses = adminBtnBase + adminBtnFormat;

  return (
    <Card>
      <h3 className="text-lg leading-5 font-medium text-gray-900">
        Admin Status
      </h3>
      <p className="mt-1 text-sm text-gray-500">
        {!isAdmin ? 'No admin access' : 'Admin access'}
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
          onClick={() => updateUser(uid, { isAdmin: !isAdmin })}
          className={adminBtnClasses}
        >
          {!isAdmin ? 'Grant' : 'Revoke'}
        </button>
      </div>

    </Card>
  );
}
