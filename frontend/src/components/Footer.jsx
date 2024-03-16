import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer>
      <Container>
        <Row>
          <Col className='text-center py-5'>
            <p>
              Project Slime &copy; {currentYear} |{' '}
              <Link to='/privacy' className='mr-2'>Privacy</Link>
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};
export default Footer;
