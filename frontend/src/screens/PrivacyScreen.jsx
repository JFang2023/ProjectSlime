import React from 'react';
import { Row, Col } from 'react-bootstrap';

const PrivacyScreen = () => {
    return (
      <>
        <main>
          <div className="container">
            <Row className="mt-4">
              <Col>
                <h2>Privacy Policy</h2>
                What information do we collect about you? <br />
                We collect information about you when you register an account with us, your username, e-mail address, and password. <br />
                We also collect the necessary information such as address, phone number and payment details to help us deliver your order. <br />

                We currently don't collect any information for direct marketing purpose nor share any information with third party
              </Col>
            </Row>
          </div>
        </main>
      </>
    );
  };
  
  export default PrivacyScreen;