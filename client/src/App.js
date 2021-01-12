import React, {useState,useEffect} from "react";
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Appnavbar from './components/Navbar';
import Products from './components/Products';
import Add from "./components/Add";

function App() {

  const [products, setProducts] = useState([]);
  const [user, setUser] = useState({name:'',token:''});

  const getProducts = () =>{
    fetch('https://basic--rest-api.herokuapp.com/products')
        .then(response => response.json())
        .then(data => {  
          setProducts(data);
        });

  }
  
  useEffect(function effectFunction() {
    const loggedUser = JSON.parse(localStorage.getItem('User'));
    if(loggedUser)
      setUser(loggedUser)
    getProducts();
  }, []);


  return (
    <div>
        <Appnavbar getUser={[user, setUser]} />
        { user.token? <Add getProducts={getProducts}/>: <h4 className="container mt-5">Please login to add, edit or delete a product details</h4>}
        <Products products={products} getProducts={getProducts} user={user.token}/>
    </div>
  );
}

export default App;
