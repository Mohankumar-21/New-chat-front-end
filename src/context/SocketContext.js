import React, { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';

const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children, token }) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (token) {
      const newSocket = io('http://localhost:8001', {
        auth: {
          token: token
        }
      });
      setSocket(newSocket);
      return () => newSocket.close();
    }
  }, [token]);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};
