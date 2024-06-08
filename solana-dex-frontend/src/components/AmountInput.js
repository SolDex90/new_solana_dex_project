import React from 'react';

const AmountInput = ({ value, onChange, placeholder, readOnly = false }) => (
  <input
    type="number"
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    className="amount-input"
    readOnly={readOnly}
  />
);

export default AmountInput;
