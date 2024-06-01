import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Notifications = () => {
  const notify = (message, type) => {
    toast(message, { type });
  };

  return (
    <div>
      <button onClick={() => notify('This is a notification!', 'info')}>
        Show Notification
      </button>
      <ToastContainer />
    </div>
  );
};

export default Notifications;
