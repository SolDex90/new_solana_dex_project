import React, { useState } from 'react';

const ReferralProgram = () => {
  const [referralCode, setReferralCode] = useState('YOUR_REFERRAL_CODE');
  const [referrals, setReferrals] = useState(0);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(referralCode);
    alert('Referral code copied to clipboard!');
  };

  return (
    <div>
      <h2>Referral Program</h2>
      <p>Share your referral code and earn rewards:</p>
      <div>
        <input type="text" value={referralCode} readOnly />
        <button onClick={handleCopyCode}>Copy Code</button>
      </div>
      <p>You have {referrals} referrals.</p>
    </div>
  );
};

export default ReferralProgram;
