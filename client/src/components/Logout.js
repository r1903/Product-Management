import React from 'react';
import { Button } from 'reactstrap';

const Logout = (props) => {
  const[,setUser] = props.getUser
 
  const handleLogOut = () => { setUser({name:'',token:''});
                                localStorage.removeItem('User');
                              }

  return (
    <div>
        <Button color="link text-white pl-0" onClick={handleLogOut}>Log out</Button>  
    </div>
  );
}

export default Logout;