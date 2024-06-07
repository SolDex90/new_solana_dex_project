import React, { useEffect } from 'react';
import axios from 'axios';

const TestFetch = () => {
  useEffect(() => {
    console.log('useEffect triggered'); // Debug log to verify useEffect is running

    const fetchTokens = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/tokens'); // Ensure correct URL
        console.log('Fetched tokens:', response.data); // Log fetched tokens
      } catch (error) {
        console.error('Error fetching tokens:', error); // Log any errors
      }
    };

    fetchTokens();
  }, []);

  return <div>Check the console for logs.</div>;
};

export default TestFetch;
