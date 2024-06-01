import React, { useState } from 'react';
import { auth } from '../firebase';
import { updateProfile, updateEmail } from 'firebase/auth';

const UserProfile = () => {
  const [displayName, setDisplayName] = useState(auth.currentUser.displayName || '');
  const [email, setEmail] = useState(auth.currentUser.email || '');

  const handleUpdateProfile = async () => {
    try {
      await updateProfile(auth.currentUser, { displayName });
      await updateEmail(auth.currentUser, email);
      alert('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  return (
    <div>
      <h2>User Profile</h2>
      <input
        type="text"
        placeholder="Display Name"
        value={displayName}
        onChange={(e) => setDisplayName(e.target.value)}
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button onClick={handleUpdateProfile}>Update Profile</button>
    </div>
  );
};

export default UserProfile;
