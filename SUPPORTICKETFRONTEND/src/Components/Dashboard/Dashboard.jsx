import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Table, Button, Spinner } from 'react-bootstrap';
import { PencilSquare, Trash } from 'react-bootstrap-icons'; // Import icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt, faEdit, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import './Dashboard.css';
import Header from '../Header/Header';
import ConfirmDeleteModal from '../Models/ConfirmDeleteModel.jsx';
import { useDispatch, useSelector } from 'react-redux';
import { getUser } from '../../redux/userSlice.jsx';
import { deleteUser } from '../../redux/userSlice.jsx';
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const Dashboard = () => {
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate();
  const backendURL = import.meta.env.VITE_REACT_APP_BACKEND_BASEURL;
  const backendURLocal = import.meta.env.VITE_REACT_APP_BACKEND_BASEURLocal;
  const dispatch = useDispatch()  
  const usersredux = useSelector(state => state.users.users) 

  useEffect(() => {
    
    fetchUser()
  }, []);

  const fetchUser = async () => {
    setLoading(true)
    try{
    
    const response = await axios.get(`${backendURL}/api/user/getallusers`, { 
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true 
    })

        const data = response.data;
        // setUsers(data); 
        console.log(data);
        dispatch(getUser(response.data))
      
    }
    catch(error){
        setLoading(false)
        console.error(error.status)
        console.error("There was an error fetching the users!", error);
        navigate("/login")  //Temporary exit
    }
   finally{
    setLoading(false)
   }
  }


  const axiosInstance = axios.create({
    baseURL: "http://127.0.0.1:5001/api",
    withCredentials: true, // Always include credentials
  });

  const handleDelete = async () => {
    if (!selectedUser) return;
    const id = selectedUser.id;
    const token = JSON.parse(localStorage.getItem('token'));
    try {
      const response = await axios.delete(`${backendURL}/api/user/deleteuser/${id}`, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true 
      })
      dispatch(deleteUser({id}))
      fetchUser();
      setShowModal(false);
    }

    catch (error) {
      setShowModal(false);

      toast.error("Unable To Delete!",
        {
            position: "top-right",
            autoClose: 4000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            style: { backgroundColor: "red", color: "#fff" },
        })

      console.error("There was an error deleting the user!", error);
    }
  };

  const openModal = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const closeModal = () => {
    setSelectedUser(null);
    setShowModal(false);
  };

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }


  return (
    <>
      <Header />

          <div className="dashboard-container">
            <h1 className="text-center">All Users</h1>
            <Table striped bordered hover className="dashboard-table">
              <thead>
                <tr className="">
                  <th>First Name</th>
                  <th>Last Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Profile Image</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
              {usersredux.length > 0 ? (                usersredux.map((user, index) => (
                  <tr key={index}>
                    <td>{user.firstName}</td>
                    <td>{user.lastName}</td>
                    <td>{user.email}</td>
                    <td>{user.phone}</td>
                    <td>
                      <img
                        src={
                          // user.profileImage
                          user.profileImage
                        }
                        // src='/Images/Profile-default.png'
                        alt="Profile"
                        className="profile-image"
                      />
                    </td>

                    <td className="d-flex justify-content-around action-buttons">
                      <button
                        onClick={() => openModal(user)}
                        className="btn btn-danger btn-icon btn-sm mr-2">
                        <FontAwesomeIcon icon={faTrashAlt} />
                      </button>
                      <Link to={`/updateuser/${user.id}`} className="btn btn-success btn-icon btn-sm">
                        <FontAwesomeIcon icon={faEdit} />
                      </Link>
                    </td>
                  </tr>
                ))) : (
                <tr>
                  <td colSpan="6">No User found.</td>
               </tr>
                )}

              </tbody>
            </Table>
             <ToastContainer />
          </div>
          {selectedUser && (
            <ConfirmDeleteModal
              show={showModal}
              handleClose={closeModal}
              handleDelete={handleDelete}
              userName={`${selectedUser.firstName} ${selectedUser.lastName}`}
            />
          )}

    </>
  );
}

export default Dashboard;
