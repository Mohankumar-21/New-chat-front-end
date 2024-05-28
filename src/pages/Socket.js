

import io from 'socket.io-client';

const socket = io(process.env.REACT_APP_BACKEND_URL, {
  auth: {
    token: localStorage.getItem('token')
  }
});

export default socket;
