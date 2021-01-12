import React, { useState,useEffect } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Input, FormFeedback } from 'reactstrap';


const Edit = (props) => {
  const {product, getProducts} = props;

  const [modal, setModal] = useState(false);
  const [formValue, setFormValue] = useState({name:product.title,price:product.price});
  const [productImg, setProductImg] = useState(product.productImg);
  const [error, setError] = useState({name:'',price:''})
  const [serverErr, setServerErr] = useState('');

  useEffect(() => { if(haveErrors())
                    validateForm() }, [formValue]);
  
  const toggle = () => { setModal(!modal)
                          setError({})
                          setFormValue({name:product.title,price:product.price})
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
        console.log(name)
        checkErrors.name = 'Please enter the name'
        formisValid = false
    }

    if (!price || !(/[1-9]{1,2}(\.d{0,2})?$/.test(price))) 
    {console.log('here')
        checkErrors.price = 'Please enter the valid price'
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
  
  
  const edit = (e) => {
    const{name,price} = formValue;
    e.preventDefault();
    if(validateForm()) {
      const form = new FormData();
      form.append("title",name);
      form.append("price",price);
      form.append("productImg",productImg);

      const authToken = JSON.parse(localStorage.getItem('User')).token;
      let uri = `https://basic--rest-api.herokuapp.com/products/${product._id}`;

      fetch(uri, {
          headers: {
            'Authorization': `Bearer ${authToken}`
          },
          method: "PATCH",
          body: form,
          })
          .then(response => response.json()) 
          .then(json => {if(json.product) {
                          setModal(!modal);
                          if(serverErr) setServerErr('');
                             getProducts()
                        }else{
                          setServerErr(json.message);
                        }
          })
          .catch(err => {console.log(err)
                         setServerErr('server error')});
    }
  }
 
  return (
    <div>
      <Button color="info" onClick={toggle} className="my-3 mr-2 pr-4 pl-4"> Edit</Button>
      <Modal isOpen={modal} toggle={toggle}>
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
              <FormGroup>
                  <Label for="productImg">Product image</Label>
                  <Input type="file" name="productImg" id="productImg" onChange={handleProductImg}/>
              </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={edit}> Edit </Button>{' '}
          <Button color="secondary" onClick={toggle}>Cancel</Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}

export default Edit;