import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Table, Button } from 'react-bootstrap';
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
  const navigate = useNavigate();
  const dispatch = useDispatch()  //A function that takes a selector function as its first argument. The selector function is responsible for selecting a part of the Redux store's state or computing derived data.
  const usersredux = useSelector(state => state.users.users) // select a state from a redux store

  useEffect(() => {
    // Fetch users from the API when the component mounts
    fetchUser()
  }, []);

  const fetchUser = async () => {

    await axios.get('http://localhost:5001/api/user/getallusers', { 
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true 
    })
      .then(response => {
        const data = response.data;
        // setUsers(data); 
        console.log(data);
        dispatch(getUser(response.data))
      })

      .catch(error => {
        console.error(error.status)
        console.error("There was an error fetching the users!", error);
        navigate("/login")  //Temporary exit
      });
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
      const response = await axios.delete(`http://localhost:5001/api/user/deleteuser/${id}`, {
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
                {usersredux.map((user, index) => (
                  <tr key={index}>
                    <td>{user.firstName}</td>
                    <td>{user.lastName}</td>
                    <td>{user.email}</td>
                    <td>{user.phone}</td>
                    <td>
                      <img
                        src={
                          // user.profileImage
                          `http://localhost:5001/uploads/${user.profileImage}`
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
                ))}
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
