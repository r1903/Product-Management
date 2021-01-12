import React, { useState, useEffect } from 'react';
import { Alert, Button, Modal, ModalHeader, ModalBody, ModalFooter,Form, FormGroup, Label, Input,FormFeedback } from 'reactstrap';


const Login = (props) => {
  const [, setUser] = props.getUser;

  const [modal, setModal] = useState(false);
  const [formValue, setFormValue] = useState({email:'', password:''});
  const [error, setError] = useState({email:'', password:''});
  const [serverErr, setServerErr] = useState('');

  useEffect(() => { if(haveErrors())
                    validateForm() }, [formValue])

  const toggle = () => {setModal(!modal)
                        setError({email:'',password:''})
                        setFormValue({email:'',password:''})
                        setServerErr('')
                      };

  const handleChange = (e) => { const { name, value } = e.target;

                                setFormValue({...formValue,[name]: value});}                          

  const validateForm = () => {

    const {email,password} = formValue;
    let checkErrors = {};
    let formisValid = true ;


    if (!email || !(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))) 
    {
      console.log(email)
      checkErrors.email = 'Please enter the valid Email address'
      formisValid = false
    }

    if (!password || password.trim().length < 8) 
    {
      checkErrors.password = 'Password length should have atlest 8 charcters'
      formisValid = false
    }

    setError(checkErrors)
    return formisValid;

  }

  const haveErrors = () => {
    let haveError = false;
    Object.keys(error).forEach((key) => {
      if (error[key].length > 0) {
        haveError = true;
      }
    });
    return haveError;
  };


  const login = (e) => {
    e.preventDefault();

    if(validateForm()){
    let uri = 'https://basic--rest-api.herokuapp.com/user/login';
    fetch(uri, {
        headers: {'Content-Type':'application/json'},
        method: "POST",
        body: JSON.stringify(formValue),
        })
        .then(response => response.json()) 
        .then(json => { if(json.token){
          const loggedUser = {name:json.user,token:json.token};
          setUser(loggedUser);
          localStorage.setItem('User', JSON.stringify(loggedUser));
          setModal(!modal);
        }else{
          setServerErr((json.message));
        }
                      
                })
        .catch(err => console.log(err));

     }
    }

  return (
    <div>
      <Button color="link text-white" onClick={toggle}>Login</Button>
      <Modal isOpen={modal} toggle={toggle} >
        <ModalHeader toggle={toggle}>Login form</ModalHeader>
        <ModalBody>
          {serverErr && <Alert color="danger">{serverErr}</Alert>}
          <Form>
              {!error.email && <FormGroup>
                  <Label for="email">Email</Label>
                  <Input type="text" name="email" id="email" placeholder="Email Id" value={formValue.email} onChange={handleChange}/>
              </FormGroup>}
              {error.email && <FormGroup>
                  <Label for="email">Email</Label>
                  <Input invalid type="text" name="email" id="email" placeholder="Email Id" value={formValue.email} onChange={handleChange}/>
                  <FormFeedback>{error.email}</FormFeedback>
              </FormGroup>}
              {!error.password && <FormGroup>
                  <Label for="password">Password</Label>
                  <Input type="text" name="password" id="password" placeholder="Password" value={formValue.password} onChange={handleChange}/>
              </FormGroup>}
              {error.password && <FormGroup>
                  <Label for="password">Password</Label>
                  <Input invalid type="text" name="password" id="password" placeholder="Password" value={formValue.password} onChange={handleChange}/>
                  <FormFeedback>{error.password}</FormFeedback>
              </FormGroup>}
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={login}>Login</Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}

export default Login;