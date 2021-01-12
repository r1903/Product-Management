import React, { useState } from 'react';
import Signup from "./Signup";
import Login from "./Login";
import Logout from "./Logout";
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav
} from 'reactstrap';

const Appnavbar = (props) => {
  
  const[user] = props.getUser
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen(!isOpen);

  return (
    <div>
      <Navbar color="dark" dark expand="md">
        <NavbarBrand href="/">Product Management</NavbarBrand>
        <NavbarToggler onClick={toggle} />
        <Collapse isOpen={isOpen} navbar className="mr-0">
          <Nav className="ml-auto" navbar>
            {!user.token && <Signup getUser={props.getUser}/>}
            {!user.token && <Login getUser={props.getUser}/>}
            {user.token && <div className="text-white mt-2 mr-3">{`Welcome ${user.name}`}</div>} 
            {user.token && <Logout getUser={props.getUser}/>}
          </Nav>
        </Collapse>
      </Navbar>
    </div>
  );
}

export default Appnavbar;