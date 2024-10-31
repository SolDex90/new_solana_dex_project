import React, { useState } from 'react';
import { auth } from '../firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const signUp = () => {
    createUserWithEmailAndPassword(auth, email, password).catch(error => console.error(error));
  };

  const logIn = () => {
    signInWithEmailAndPassword(auth, email, password).catch(error => console.error(error));
  };

  const logOut = () => {
    signOut(auth).catch(error => console.error(error));
  };

  return (
    <div>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={signUp}>Sign Up</button>
      <button onClick={logIn}>Log In</button>
      <button onClick={logOut}>Log Out</button>
    </div>
  );
};

export default Auth;
