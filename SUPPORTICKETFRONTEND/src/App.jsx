import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import React, { useContext, useEffect } from 'react';
import Register from './Components/Register/Register';
import AuthProvider, { AuthContext } from "./Context/AuthContext";
import Protected from './Components/Protected/Protected';
import Dashboard from './Components/Dashboard/Dashboard';
import UpdateUser from './Components/UpdateUser/UpdateUser';
import Nomatch from './Components/Nomatch/Nomatch';
import Login from './Components/Login/Login';
import User from './Components/User/User';
import MyTickets from './Components/MyTickets/MyTickets';
import AllTickets from './Components/AllTickets/AllTickets';
import useTokenRenewal from './hooks/useTokenRenewal';

function AppWithTokenRenewal() {
  const { isAuthenticated, isLoggedout, setIsLoggedout } = useContext(AuthContext);

  // Invoke the token renewal logic when authenticated
  if (isAuthenticated) {
    useTokenRenewal();
  }

//   useEffect(() => {
//     if (isAuthenticated) {
//         useTokenRenewal();
//     }
// }, [isAuthenticated]);

  return null; // No UI rendering required
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<User />} />
      <Route path="/my_tickets" element={<Protected Cmp={MyTickets} />} />
      <Route path="/all_tickets" element={<Protected Cmp={AllTickets} />} />
      <Route path="/dashboard" element={<Protected Cmp={Dashboard} />} />
      <Route path="/updateuser/:id" element={<Protected Cmp={UpdateUser} />} />
      <Route path="/Register" element={<Register />} />
      <Route path="/Login" element={<Login />} />
      <Route path="*" element={<Nomatch />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppWithTokenRenewal />
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
