import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserActivity = () => {
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await axios.get('https://api.yourdex.com/user-activity'); // Replace with your API endpoint
        setActivities(response.data);
      } catch (error) {
        console.error('Error fetching user activities:', error);
      }
    };

    fetchActivities();
  }, []);

  return (
    <div>
      <h2>Recent User Activity</h2>
      <ul>
        {activities.map((activity, index) => (
          <li key={index}>
            {activity.date}: {activity.description}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserActivity;
