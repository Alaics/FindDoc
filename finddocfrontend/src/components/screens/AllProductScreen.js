import React, {useState,useEffect} from 'react';
import { useDispatch,useSelector } from 'react-redux';
import {Row,Col} from "react-bootstrap";
import Product from '../Product';
import { listProducts } from '../../actions/productActions';
import Loader from '../Loader';
import Message from '../Message';

function AllProductScreen() {
    const dispatch = useDispatch();
    const productList = useSelector((state)=>state.productList);
    const {error,loading,products} =productList
    useEffect(()=>{
        dispatch(listProducts());
    },[dispatch])

    return (
        <div>

            {loading ?(
                <Loader />
            ):error ?(
              <Message variant='danger'>{error}</Message>
            ):
            
            <Row>
               {products.map((product)=>(
                   <Col key={product._id} sm={12} md={6} lg={4} xl={3}>

                       {/* <h3>{product.name}</h3> */}
                       <Product  product={product}/>
                   </Col>
               ))} 
            </Row>
            
            
            }
            
        </div>
    )
}

export default AllProductScreen
