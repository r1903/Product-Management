import React from 'react';
import {
  Card, CardImg,  CardBody,
  CardTitle, Button,Col
} from 'reactstrap';
import Edit from "./Edit";

const Product = ({product,getProducts,user}) => {
const {productImg,title,price,_id} = product;

const deleteProduct = () =>{
  const authToken = JSON.parse(localStorage.getItem('User')).token;

  fetch(`https://basic--rest-api.herokuapp.com/products/${_id}`,
        { headers: {
          'Authorization': `Bearer ${authToken}`
          }, 
          method: "DELETE"
        })
        .then(response => { console.log(response.status); 
                            getProducts()})
        .catch(err => console.log(err));

}


  return (
    <Col sm="6" lg="3" className="mt-5">
      <Card>
        <CardImg top src={productImg} alt={productImg} className="card-img-top" />
        <CardBody>
        <div className="d-flex justify-content-between">
          <CardTitle tag="h5" className="mb-0">{title}</CardTitle>
          <CardTitle tag="h5" className="mb-0" >{`${price}£`}</CardTitle>
         </div> 
          <div className="d-flex justify-content-center mt-2">
          {user && <Edit getProducts={getProducts} product={product}/>} 
          {user && <Button color="danger" className="my-3 ml-2" onClick={deleteProduct}>Delete</Button>}
          </div>
        </CardBody>
      </Card>
    </Col>
    
  );
};

export default Product;