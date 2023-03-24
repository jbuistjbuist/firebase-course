import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { updateUser } from '../../firebase/index';

const ProfileForm = ({ userDoc, isCurrentUser, adminMode }) => {
  // Form fields
  const [inputs, setInputs] = useState({
    displayName: userDoc.displayName || '',
    about: userDoc.about || '',
  });

  const handleChange = (event) => {
    const { name, value } = event.target;

    setInputs({
      ...inputs,
      [name]: value,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!inputs.displayName.length) {
      return toast.error('Username cannot be empty');
    }

    return updateUser(userDoc.uid, inputs);
  };

  return (
    <form onSubmit={(e) => handleSubmit(e)} className="space-y-8">
      <div className="space-y-8">
        <div>
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            {(!(isCurrentUser || adminMode) &&
              `${userDoc.displayName}'s Profile`) ||
              'Profile'}
          </h3>
          {(isCurrentUser || adminMode) && (
            <p className="mt-1 text-sm text-gray-500">
              This information will be displayed publicly so be careful what you
              share.
            </p>
          )}
        </div>

        <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
          <div className="sm:col-span-4">
            <label
              htmlFor="displayName"
              className="block text-sm font-medium text-gray-700"
            >
              Name
            </label>
            <div className="mt-1 flex rounded-md shadow-sm">
              <input
                type="text"
                name="displayName"
                id="displayName"
                value={inputs.displayName}
                onChange={(e) => handleChange(e)}
                className="flex-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full min-w-0 rounded-md sm:text-sm border-gray-300"
              />
            </div>
          </div>

          <div className="sm:col-span-6">
            <label
              htmlFor="about"
              className="block text-sm font-medium text-gray-700"
            >
              About
            </label>
            <div className="mt-1">
              <textarea
                id="about"
                name="about"
                placeholder="Write a few sentences about yourself."
                rows={3}
                value={inputs.about}
                onChange={(e) => handleChange(e)}
                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border border-gray-300 rounded-md"
              />
            </div>
          </div>
        </div>
      </div>

      {!(isCurrentUser || adminMode) && (
        <p className="mt-6 text-sm text-gray-500">
          ⚠️You are not authorized to edit this profile, but we left this form
          here to demonstrate how Firestore security rules protect the data. Try
          saving some changes and open the console to see the error message.
        </p>
      )}

      <div className="pt-5 flex justify-end">
          <button
            type="submit"
            className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {!(isCurrentUser || adminMode) ? '⚠️ Save': 'Save'}
          </button>
      </div>
    </form>
  );
};

export default ProfileForm;
