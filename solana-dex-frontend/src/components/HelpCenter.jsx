import React from 'react';

const HelpCenter = () => {
  const faq = [
    { question: 'How to trade?', answer: 'To trade, go to the trading page and place your order.' },
    { question: 'How to add liquidity?', answer: 'To add liquidity, go to the liquidity pools page and follow the instructions.' },
    // Add more FAQs as needed
  ];

  return (
    <div>
      <h2>Help Center</h2>
      <ul>
        {faq.map((item, index) => (
          <li key={index}>
            <strong>{item.question}</strong>
            <p>{item.answer}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HelpCenter;
