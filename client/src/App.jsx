import './App.css';
import { BrowserRouter as Router, Routes, Route ,Navigate } from "react-router-dom";
import { AuthProvider } from "./Context/AuthContext";
import Login from "./component/Login";
import Dashboard from './component/Dashboard';
import CreateEvent from './component/CreateEvent';
import Navbar from './component/Navbar';
import Register from './component/Register';
import EventDetails from './component/EventDetails';
import ProtectedRoute from './component/ProtectedRoute';
import UpdateEvent from './component/UpdateEvent';
import AttendeesList from './component/AttendeeList';
import { ToastContainer } from "react-toastify";


function App() {
  const token=localStorage.getItem("token")

  return (
    <AuthProvider>
    <ToastContainer />
    <Router>
      <Navbar token={token}/>
      <Routes>
       {!token && (
          <>
          <Route path='/' element={<Login/>}></Route>
          <Route path='/register' element={<Register/>}/>
          </>
        )}


        <Route element={<ProtectedRoute/>}>
        <Route path='/' element={<Navigate to='/dashboard'/>}></Route>
        <Route path='/register' element={<Navigate to='/dashboard'/>}></Route>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path='/Create-event' element={<CreateEvent/>}/>
        <Route path='/Event-details/:id' element={<EventDetails/>}/>
        <Route path='/update-event/:id' element={<UpdateEvent/>}/>
        <Route path='/attendees-list/:id' element={<AttendeesList/>}/>
        </Route>
        
      </Routes>
    </Router>
  </AuthProvider>
  );
}

export default App;
