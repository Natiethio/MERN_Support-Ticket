import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useParams } from 'react-router-dom';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import "./UpdateUser.css"
import Header from '../Header/Header';
import { useDispatch, useSelector } from 'react-redux';
import { updateFormData, clearErrors, updateImage, setErrors } from '../../redux/userSlice';

import axios from 'axios';

const UpdateUser = () => {

  const { id } = useParams();
  const [user, setUser] = useState("");
  const [fname, setFirstName] = useState("");
  const [lname, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [Image, setImage] = useState(null);
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    fetchUserUPD();
  }, [id]);


  const fetchUserUPD = async () => {

    await axios.get(`http://localhost:5001/api/user/getuserbyid/${id}`, {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true
    })

      .then(response => {
        const usernew = response.data;
        setUser(response.data)
        setFirstName(usernew.firstName);
        setLastName(usernew.lastName);
        setEmail(usernew.email);
        setPhone(usernew.phone);
        setProfileImage(usernew.profileImage)
      })
      .catch(error => {
        console.error("There was an error fetching the user upd!", error);
      });
  }

  const handleFileChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handelUpdate = async (e) => {
    e.preventDefault();
    // console.log("first name", fname)
    // console.log("last name", lname)
    // console.log("email", email)
    // console.log("phone", phone)
    // console.log(Image)

    const formdata = new FormData();
    formdata.append("firstName", fname)
    formdata.append("lastName", lname)
    formdata.append("email", email)
    formdata.append("phone", phone)

    if (Image) {
      formdata.append("profileImage", Image);
    }

    // console.log(formdata)

    try {
      const response = await axios.post(`http://localhost:5001/api/user/updateuser/${id}`, formdata, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true
      })

      // console.log(response.data)

      navigate("/dashboard")

    }
    catch (error) {
      if (error.response && error.response.data.errors) {
        setErrors(error.response.data.errors);
      }
      console.error(error.message)
    }
  }

  const handleChange = (e) => {
    clearErrorMessage()
  };

  const clearErrorMessage = () => {
    setErrors("");
  };

  return (
    <>
      <Header />

      {/* <div className="d-flex justify-content-center align-items-center vh-100"> */}
      <Container className="mt-5">
        <Row className="justify-content-center">
          <Col md={6}>
            <div className="p-4 border rounded shadow-sm bg-white">
              <h3 className="text-center mb-4">Update Profiles</h3>

              <Form onSubmit={handelUpdate}>
                <Form.Group controlId='formBasicName' className="mt-3">
                  <Form.Label>First Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="fname"
                    placeholder="Enter Your First Name"
                    value={fname}
                    //  onChange={handelInputChange}
                    onChange={(e) => {
                      setFirstName(e.target.value)
                      handleChange()
                    }}
                  />
                  {errors.firstName && <div className="error">{errors.firstName}</div>}
                </Form.Group>

                <Form.Group controlId='formBasicName' className="mt-3">
                  <Form.Label>Last Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="lname"
                    placeholder="Enter Your Last Name"
                    value={lname}
                    //  onChange={handelInputChange}
                    onChange={(e) => {
                      setLastName(e.target.value)
                      handleChange()
                    }}
                  />
                  {errors.lastName && <div className="error">{errors.lastName}</div>}
                </Form.Group>

                <Form.Group controlId='formBasicEmail' className="mt-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    placeholder="Enter Your Email"
                    value={email}
                    //  onChange={handelInputChange}
                    onChange={(e) => {
                      setEmail(e.target.value)
                      handleChange()
                    }}
                  />
                  {errors.email && <div className="error">{errors.email}</div>}
                </Form.Group>

                <Form.Group controlId='formBasicPhone' className="mt-3">
                  <Form.Label>Phone</Form.Label>
                  <Form.Control
                    type="text"
                    name="phone"
                    placeholder="Enter Your Phone"
                    value={phone}
                    //  onChange={handelInputChange}
                    onChange={(e) => {
                      setPhone(e.target.value)
                      handleChange()
                    }}
                  />
                  {errors.phone && <div className="error">{errors.phone}</div>}
                </Form.Group>
                <div className="profile">
                  <p className='profile-name'>Profile Image:</p>
                  <img
                    src={
                      // user.profileImage
                      `http://localhost:5001/uploads/${profileImage}`
                    }
                    // src='/Images/Profile-default.png'
                    alt="Profile"
                    className="profile-image-upd"
                  />
                </div>

                <Form.Group controlId="formFile" className="mt-3">
                  <Form.Label>Profile Image(Max 5MB)</Form.Label>
                  <Form.Control type="file"
                    name='profile_pic'
                    onChange={handleFileChange}
                  />
                  {errors.profileImage && (
                    <div className="error">{errors.profileImage}</div>
                  )}
                </Form.Group>


                <Button variant="dark" type="submit" className="w-100 mt-5">
                  Update User
                </Button>

              </Form>
            </div>
          </Col>
        </Row>
      </Container>
      {/* </div> */}
    </>
  )
}

export default UpdateUser

