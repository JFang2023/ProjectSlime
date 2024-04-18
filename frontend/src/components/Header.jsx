import { Navbar, Nav, Container, NavDropdown, Badge } from 'react-bootstrap';
import { FiShoppingCart, FiUser } from "react-icons/fi";
import { RiAdminLine } from "react-icons/ri";
import { LinkContainer } from 'react-router-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useLogoutMutation } from '../slices/usersApiSlice';
import { logout } from '../slices/authSlice';
import SearchBox from './SearchBox';
import logo from '../assets/logo.png';
import { resetCart } from '../slices/cartSlice';
import './Header.css';

const Header = () => {
  const { cartItems } = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [logoutApiCall] = useLogoutMutation();

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      dispatch(resetCart());
      navigate('/login');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <header>
      <Navbar bg='primary' variant='light' expand='lg' collapseOnSelect>
        <Container>
          {/* Brand name, logo & home page button*/}
          <LinkContainer to='/'>
            <Navbar.Brand>
              <img src={logo} alt='ProjectSlime' className='logo' /> {/* apply custom class for logo */}
              <span className='brand-name'>Slime</span> {/* apply custom class for brand name */}
            </Navbar.Brand>
          </LinkContainer>
          <Navbar.Toggle aria-controls='basic-navbar-nav' />

          <Navbar.Collapse id='basic-navbar-nav'>
            <Nav className='ms-auto'>
              {/* Category */}
              <NavDropdown title='Categories' id='categories-dropdown'>
                <LinkContainer to='/category/Camera'>
                  <NavDropdown.Item>Camera</NavDropdown.Item>
                </LinkContainer>
                <LinkContainer to='/category/Computers & Tablets'>
                  <NavDropdown.Item>Computers & Tablets</NavDropdown.Item>
                </LinkContainer>
                <LinkContainer to='/category/Headphones'>
                  <NavDropdown.Item>Headphones</NavDropdown.Item>
                </LinkContainer>
                <LinkContainer to='/category/iPhone'>
                  <NavDropdown.Item>iPhone</NavDropdown.Item>
                </LinkContainer>
                <LinkContainer to='/category/Video Games'>
                  <NavDropdown.Item>Video Games</NavDropdown.Item>
                </LinkContainer>
              </NavDropdown>

              {/* Search */}
              <SearchBox />

              {/* User */}
              {userInfo ? (
                <NavDropdown title={userInfo.name} id='username'>
                  <LinkContainer to='/profile'>
                    <NavDropdown.Item>Profile</NavDropdown.Item>
                  </LinkContainer>
                  <NavDropdown.Item onClick={logoutHandler}>Logout</NavDropdown.Item>
                </NavDropdown>
              ) : (
                <LinkContainer to='/login'>
                  <Nav.Link>
                    <FiUser />
                  </Nav.Link>
                </LinkContainer>
              )}

              {/* Admin */}
              {userInfo && userInfo.isAdmin && (
                <NavDropdown title= {<RiAdminLine />} id='adminmenu'>
                  <LinkContainer to='/admin/orderlist'>
                    <NavDropdown.Item>
                      Orders
                    </NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to='/admin/productlist'>
                    <NavDropdown.Item>
                      Products
                    </NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to='/admin/userlist'>
                    <NavDropdown.Item>
                      Users
                    </NavDropdown.Item>
                  </LinkContainer>
                </NavDropdown>
              )}

              {/* Cart */}
              <LinkContainer to='/cart'>
                <Nav.Link>
                  <FiShoppingCart />
                  {cartItems.length > 0 && (
                    <Badge pill bg='success' style={{ marginLeft: '5px' }}>
                      {cartItems.reduce((a, c) => a + c.qty, 0)}
                    </Badge>
                  )}
                </Nav.Link>
              </LinkContainer>

            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;
