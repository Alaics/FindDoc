import React, { useEffect } from "react";
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { logout, getUserDetails } from "../actions/userActions";
import { useDispatch, useSelector } from 'react-redux';

function Header() {
  const userLogin = useSelector(state => state.userLogin);
  const { userInfo } = userLogin;
  const dispatch = useDispatch();

  const logoutHandler = () => {
    dispatch(logout());
  };

  const userDetails = useSelector(state => state.userDetails);
  const { user } = userDetails;

  useEffect(() => {
    if (userInfo) {
      dispatch(getUserDetails('profile'));
    }
  }, [dispatch, userInfo]);

  const displayName = userInfo?.name || user?.name || ""; 

  return (
    <Navbar bg="dark" variant="dark">
      <Container className="justify-content-between">
        <LinkContainer to="/">
          <Navbar.Brand>Find Doc</Navbar.Brand>
        </LinkContainer>
        
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll" className="justify-content-between">
          <Nav>
            {userInfo || user.name ? (
              <>
                <LinkContainer to="/">
                  <Nav.Link className="mx-1"><i className="fas fa-user-md"></i> Doctors</Nav.Link>
                </LinkContainer>

                <LinkContainer to="/allproduct">
                <Nav.Link className="mx-1">
                <i className="fas fa-medkit"></i> Medicines
                </Nav.Link>
              </LinkContainer>
              <LinkContainer to="/book">
                <Nav.Link className="mx-1">
                  <i className="fas fa-calendar-alt"></i> Appointment
                </Nav.Link>
              </LinkContainer>

              </>
            ) : null}
          </Nav>

          <Nav>
            {userInfo || user.name ? (
              <>
                <LinkContainer to="/cart">
                  <Nav.Link className="mx-1">
                    <i className="fas fa-cart-arrow-down"></i> 
                    Cart</Nav.Link>
                </LinkContainer>
                <NavDropdown title={displayName} id='username'>
                  <LinkContainer to='/profile'>
                    <NavDropdown.Item>Profile</NavDropdown.Item>
                  </LinkContainer>
                  <NavDropdown.Item onClick={logoutHandler}>Logout</NavDropdown.Item>
                </NavDropdown>
              </>
            ) : (
              <LinkContainer to="/login">
                <Nav.Link className="mx-3"><i className="fas fa-user"></i> Login</Nav.Link>
              </LinkContainer>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;
