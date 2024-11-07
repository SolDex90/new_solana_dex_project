import React, { useState, useEffect } from 'react';

const Tutorials = () => {
  const [tutorials, setTutorials] = useState([]);

  useEffect(() => {
    const fetchTutorials = async () => {
      // Fetch or load tutorials data here
      const tutorialData = [
        { title: 'How to Trade', link: '#' },
        { title: 'Understanding Order Types', link: '#' },
        // Add more tutorials as needed
      ];
      setTutorials(tutorialData);
    };

    fetchTutorials();
  }, []);

  return (
    <div>
      <h2>Tutorials</h2>
      <ul>
        {tutorials.map((tutorial, index) => (
          <li key={index}>
            <a href={tutorial.link}>{tutorial.title}</a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Tutorials;
