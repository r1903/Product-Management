import React from "react";
import { Container, Row} from 'reactstrap';
import Product from "./Product";

const Products = (props) => {

  return( 
    <Container className="mt-2 mb-5">
      <Row>
          {
            props.products.map(product => <Product product={product} getProducts={props.getProducts} user={props.user} key={product._id}/>)
          }
      </Row>
   </Container>
    
  )
};


export default Products;