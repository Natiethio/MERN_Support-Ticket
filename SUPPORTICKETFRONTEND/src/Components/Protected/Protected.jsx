import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from "../../Context/AuthContext";
import { Spinner } from 'react-bootstrap';
function Protected(props) {
    let Cmp =  props.Cmp
    const { auth, logout, isAuthenticated, loading  } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
      if (!loading && !isAuthenticated) {
        // Redirect to /Login only if authentication check is complete and user is not authenticated
        navigate("/Login");
      }
    }, [loading, isAuthenticated, navigate]);

    if (loading) {
      // Show a spinner while loading user data
      return (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      );
    }

  return (
      <div>
        <Cmp/>
      </div>
  );
}
export default Protected