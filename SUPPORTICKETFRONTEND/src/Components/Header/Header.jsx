import { Navbar, Nav, Container, Spinner, Dropdown, Image } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../Context/AuthContext";
import { useContext, useEffect, useState } from "react";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useSelector } from "react-redux";
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";
import "./Header.css";


function Header() {
  const { auth, logout, isAuthenticated, loading } = useContext(AuthContext);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const user = useSelector((state) => state.users.authuser);

  useEffect(() => {
    if (auth === "admin") {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
    }
  }, [auth]);

  const navbarBg = isAdmin ? "primary" : "dark";
  const homeLink = isAdmin ? "/dashboard" : "/";

  const handleLogout = async () => {
    try {
      await logout();
      // toast.info('Your session expired. Please log in again.', {
      //   position: "top-right",
      //   autoClose: 5001,
      // });
      navigate("/Login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  // Show spinner while loading user data
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
    <Navbar bg={navbarBg} variant="dark" className="navbar">
      <Container>
        <Navbar.Brand as={Link} to={homeLink} className="nav-brand">
          Support Ticket
        </Navbar.Brand>
        <Nav className="ml-auto navbar-wrapper">
          {isAuthenticated ? (
            <>
            {
              isAdmin?(
               <>
                  <Nav.Link as={Link} to="/all_tickets" className="nav-link">All Tickets</Nav.Link>
               </>
              ):
              (
                <>
                  <Nav.Link as={Link} to="/my_tickets" className="nav-link">My Tickets</Nav.Link>
                </>
              )
            }
           
              <Dropdown show={dropdownOpen} onToggle={() => setDropdownOpen(!dropdownOpen)}>
                <Dropdown.Toggle as="button"  className={isAdmin ? "profile-btn2" : "profile-btn"} >
                  <Image
                    src={
                      // user.profileImage
                      `http://localhost:5001/uploads/${user.profileImage}`
                    }
                    roundedCircle className="profile-img" />
                  <span className="profile-name">{user?.firstName} </span>
                  {/* {dropdownOpen ? <faChevronUp /> : <faChevronDown />} */}
                </Dropdown.Toggle>
                <Dropdown.Menu className="profile-dropdown">
                  <Dropdown.ItemText className="profile-dropname"><strong>{user?.firstName} {user?.lastName}</strong></Dropdown.ItemText>
                  <Dropdown.ItemText className="profile-email">{user?.email}</Dropdown.ItemText>
                  <Dropdown.Divider />
                  <Dropdown.Item onClick={handleLogout} className="logout-btn">Logout</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </>

          ) : (
            <>
              <Nav.Link as={Link} to="/Register" className="nav-link">Register</Nav.Link>
              <Nav.Link as={Link} to="/Login" className="nav-link">Login</Nav.Link>
            </>
          )}
        </Nav>
      </Container>
    </Navbar>
  );

}

export default Header;
