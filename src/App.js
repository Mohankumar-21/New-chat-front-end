
import { Outlet } from 'react-router-dom';
import './App.css';
import { SocketProvider } from './context/SocketContext';
function App() {
  return (
    <div>
    <SocketProvider token={localStorage.getItem('token')}>
      <Outlet />
      </SocketProvider>
    </div>
  );
}

export default App;
