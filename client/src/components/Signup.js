import React, { useState,useEffect } from 'react';
import { Alert, Button, Modal, ModalHeader, ModalBody, ModalFooter,Form, FormGroup, Label, Input,FormFeedback } from 'reactstrap';


const Signup = (props) => {

    const [, setUser] = props.getUser;

    const [modal, setModal] = useState(false);
    const [formValue, setFormValue] = useState({name:'',email:'',password:'',confirmPwd:''});
    const [error, setError] = useState({name:'',email:'',password:'',confirmPwd:''})
    const [serverErr, setServerErr] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => { if(haveErrors())
                      validateForm() }, [formValue]) 


    const toggle = () => { setModal(!modal)
                            setError({})
                            setFormValue({name:'',email:'',password:'',confirmPwd:''})
                            if(serverErr) setServerErr('')
                            if(success) setSuccess('') };

    const handleChange = (e) => { const { name, value } = e.target;
                                  setFormValue({...formValue,[name]: value});
                                }   


    const validateForm = () => {

        const {name,email,password,confirmPwd} = formValue;
        let checkErrors = {};
        let formisValid = true ;

        if (!name || name.trim().length < 3) 
        {
            console.log(name)
            checkErrors.name = 'Please enter the name'
            formisValid = false
        }

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
    
        if (!confirmPwd || password !== confirmPwd) 
        {
            checkErrors.confirmPwd = 'Password and Confirm Password field should match'
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


    const signup = (e) => {

        e.preventDefault();
        
        if(validateForm()) { 
            let uri = 'https://basic--rest-api.herokuapp.com/user/signup';
            fetch( uri, {
                headers: {
                    'Content-Type':'application/json'
                },
                method: "POST",
                body: JSON.stringify(formValue),
                })
            .then(response => response.json()) 
            .then(json => { if(json.user) {
                                const createdUser = {name:json.user,token:json.token};
                                setUser(createdUser);
                                localStorage.setItem('User', JSON.stringify(createdUser));
                                setSuccess((json.message));
                                setFormValue({name:'',email:'',password:'',confirmPwd:''});
                                if(serverErr) setServerErr('');
                            }else{
                                setServerErr(json.message);  
                                }
            })
            .catch(err => console.log(err));
        }
    }    

    return (
        <div>
            <Button color="link text-white" onClick={toggle}>Sign Up</Button>
            <Modal isOpen={modal} toggle={toggle}>
                <ModalHeader toggle={toggle}>Registration form</ModalHeader>
                <ModalBody>
                {success && <Alert color="success">
                    {success}
                </Alert>}
                {serverErr && <Alert color="danger">
                    {serverErr}
                </Alert>}
                    <Form>
                        {!error.name && <FormGroup>
                            <Label for="name">Name</Label>
                            <Input type="text" name="name" id="name" placeholder="name" value={formValue.name} onChange={handleChange}/>
                        </FormGroup>}
                        {error.name && <FormGroup>
                            <Label for="name">Name</Label>
                            <Input invalid type="text" name="name" id="name" placeholder="name" value={formValue.name} onChange={handleChange}/>
                            <FormFeedback>{error.name}</FormFeedback>
                        </FormGroup>}
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
                        {!error.confirmPwd && <FormGroup>
                            <Label for="confirmPwd">Confirm Password</Label>
                            <Input type="text" name="confirmPwd" id="confirmPwd" placeholder="Confirm Password" value={formValue.confirmPwd} onChange={handleChange}/>
                        </FormGroup>}
                        {error.confirmPwd && <FormGroup>
                            <Label for="confirmPwd">Confirm Password</Label>
                            <Input invalid type="text" name="confirmPwd" id="confirmPwd" placeholder="Confirm Password" value={formValue.confirmPwd} onChange={handleChange}/>
                        <FormFeedback>{error.confirmPwd}</FormFeedback>
                        </FormGroup>}
                    </Form>
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={signup}>Sign Up</Button>
                </ModalFooter>
            </Modal>
        </div>
    );
}

export default Signup;