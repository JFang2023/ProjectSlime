import React from 'react';
import { Row, Col } from 'react-bootstrap';
import { useGetProductsByCategoryQuery } from '../slices/productsApiSlice';
import Product from '../components/Product';
import Loader from '../components/Loader';
import Message from '../components/Message';

const CategoryScreen = ({ match }) => {
    const { category } = match.params;
  
    // fetch products by category
    const { data, error, isLoading } = useGetProductsByCategoryQuery(category);
  
    if (isLoading) {
      return <Loader />;
    }
  
    if (error) {
      return <Message variant='danger'>{error.message}</Message>;
    }
  
    // creat product list
    return (
      <div>
        <h1>{category}</h1>
        <Row>
          {data.map((product) => (
            <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
              <Product product={product} />
            </Col>
          ))}
        </Row>
      </div>
    );
  };

  export default CategoryScreen;
  