import React, { useState, useEffect } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter,Form, FormGroup, Label, Input, FormFeedback } from 'reactstrap';


const Add = (props) => {

  const [modal, setModal] = useState(false);
  const [formValue, setFormValue] = useState({name:'',price:''});
  const [productImg, setProductImg] = useState('');
  const [error, setError] = useState({name:'',price:'',productImg:''})
  const [serverErr, setServerErr] = useState('');
  
  useEffect(() => { 
    if(haveErrors())
                    validateForm() 
                  }, [formValue]);
  
  const toggle = () => { setModal(!modal)
                        setError({})
                        setFormValue({name:'',price:''})
                        if(serverErr) setServerErr('')};

  const handleChange = (e) => { const { name, value } = e.target;
                                  setFormValue({...formValue,[name]: value});
                                }

  const handleProductImg = (e) => setProductImg(e.target.files[0]);


  const validateForm = () => {

    const {name,price} = formValue;
    let checkErrors = {};
    let formisValid = true ;

    if (!name || name.trim().length < 3) 
    {
        checkErrors.name = 'Please enter the name'
        formisValid = false
    }

    if (!price || !(/[1-9]{1,2}(\.d{0,2})?$/.test(price)))  
    {
        checkErrors.price = 'Please enter the valid price'
        formisValid = false
    }

    if (!productImg) 
    {
        checkErrors.productImg = 'Please upload a product image'
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

  const add = (e) => {
    const{name, price} = formValue;
    e.preventDefault();

    if(validateForm()) {
      const form = new FormData();
      form.append("title",name);
      form.append("price",price);
      form.append("productImg",productImg);
      
      const authToken = JSON.parse(localStorage.getItem('User')).token;

      let uri = 'https://basic--rest-api.herokuapp.com/products';
      fetch(uri, {
          headers: {
              'Authorization': `Bearer ${authToken}`
          },
          method: "POST",
          body: form,
          })
          .then(response => response.json()) 
          .then(json => { if(json.product) {
                              setModal(!modal);
                              if(serverErr) setServerErr('');
                              props.getProducts()
                          }else{
                            setServerErr(json.message);
                          }
                })
          .catch(err => console.log(err));
      }
    }

  return (
    <div className="container">
      <Button color="info" className="mt-4" onClick={toggle}>Add Product</Button>
      <Modal isOpen={modal} toggle={toggle} >
        <ModalHeader toggle={toggle}>New Product</ModalHeader>
        <ModalBody>
        <Form>
            {!error.name && <FormGroup>
                <Label for="name">Product Name</Label>
                <Input type="text" name="name" id="name" placeholder="product name" value={formValue.name} onChange={handleChange}/>
            </FormGroup>}
            {error.name && <FormGroup>
                <Label for="name">Product Name</Label>
                <Input invalid type="text" name="name" id="name" placeholder="product name" value={formValue.name} onChange={handleChange}/>
                <FormFeedback>{error.name}</FormFeedback>
            </FormGroup>}
            {!error.price && <FormGroup>
                <Label for="price">Product Price</Label>
                <Input type="text" name="price" id="price" placeholder="product price" value={formValue.price} onChange={handleChange}/>
            </FormGroup>}
            {error.price && <FormGroup>
                <Label for="price">Product Price</Label>
                <Input invalid type="text" name="price" id="price" placeholder="product price" value={formValue.price} onChange={handleChange}/>
                <FormFeedback>{error.price}</FormFeedback>
            </FormGroup>}
            {!error.productImg && <FormGroup>
                <Label for="productImg">Product image</Label>
                <Input type="file" name="productImg" id="productImg" onChange={handleProductImg}/>
            </FormGroup>}
            {error.productImg && <FormGroup>
                <Label for="productImg">Product image</Label>
                <Input invalid type="file" name="productImg" id="productImg" onChange={handleProductImg}/>
                <FormFeedback>{error.productImg}</FormFeedback>
            </FormGroup>}
        </Form>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={add}>Add</Button>{' '}
          <Button color="secondary" onClick={toggle}>Cancel</Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}

export default Add;