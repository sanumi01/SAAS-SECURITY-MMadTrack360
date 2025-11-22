import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import './styles/globals.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Navigate to='/dashboard' replace />} />
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='/security' element={<Dashboard />} />
        <Route path='/users' element={<Dashboard />} />
        <Route path='/analytics' element={<Dashboard />} />
        <Route path='/activity' element={<Dashboard />} />
        <Route path='/reports' element={<Dashboard />} />
        <Route path='/billing' element={<Dashboard />} />
        <Route path='/settings' element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
