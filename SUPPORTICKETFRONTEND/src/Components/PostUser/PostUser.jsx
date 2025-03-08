import React , { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Form, Button } from 'react-bootstrap'
import "./PostUser.css"
import axios from 'axios'

const PostUser = () => {

  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  //const [errors, setErrors] = useState({});
  
  // const [formData , setFormData] = useState({
  //   name: "",
  //   email: "",
  //   phone: ""
  // })




 const navigate = useNavigate();

  const handelInputChange= (event)=>{
    const {name,value} = event.target;
    setFormData({
     ...formData,
     [name]:value,
    });
   }

  const handelSubmit= async(e)=>{
   e.preventDefault();
   //setErrors({}); // Clear previous errors
   console.log("name",name)
   console.log("email",email)
   console.log("phone", phone)

   const formdata = new FormData();
   formdata.append("name",name)
   formdata.append("email", email)
   formdata.append("phone",phone)

   try{
     const response = await axios.post("http://localhost:5001/api/user/adduser",formdata, {
      headers:{
        "Content-Type": "application/json",
      }
     })
     
     console.log(response.data)
     navigate("/")
  
   } catch(error){
    // if (error.response && error.response.data.errors) {
    //   setErrors(error.response.data.errors); // Set validation errors
    // }
    console.error(error.message)
   }
  }

  return (
   <>
     <div className="center-form">
       <h1>Register</h1>
       <Form onSubmit={handelSubmit}>
          <Form.Group controlId='formBasicName'>
            <Form.Label>Name</Form.Label>
             <Form.Control
               type="text"
               name="name"
               placeholder="Enter Your Name"
               value={name}
              //  onChange={handelInputChange}
              onChange={(e) => setName(e.target.value)}
             />
              {/* {errors.name && <div className="error">{errors.name}</div>} */}
          </Form.Group>

          <Form.Group controlId='formBasicEmail'>
            <Form.Label>Email</Form.Label>
             <Form.Control
               type="email"
               name="email"
               placeholder="Enter Your Email"
               value={email}
              //  onChange={handelInputChange}
              onChange={(e) => setEmail(e.target.value)}
             />
             {/* {errors.email && <div className="error">{errors.email}</div>} */}
          </Form.Group>

          <Form.Group controlId='formBasicPhone'>
            <Form.Label>Phone</Form.Label>
             <Form.Control
               type="text"
               name="phone"
               placeholder="Enter Your Phone"
               value={phone}
              //  onChange={handelInputChange}
              onChange={(e) => setPhone(e.target.value)}
             />
             {/* {errors.phone && <div className="error">{errors.phone}</div>} */}
          </Form.Group> 

          <Button variant="dark" type="submit" className="w-100">
             Register
          </Button>

       </Form>
     </div>
   </>
  )
}

export default PostUser
