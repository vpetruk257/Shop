import { useDispatch, useSelector } from "react-redux";
import { Nav, Navbar, Container, NavDropdown,} from "react-bootstrap"
import { LinkContainer } from 'react-router-bootstrap';
import { logout } from "../actions/userActions";
import SearchBox from "./SearchBox";

function Header() {
  const userLogin = useSelector(state => state.userLogin)
  const {userInfo} = userLogin

  const dispatch = useDispatch()

  const logoutHandler = () => {
    dispatch(logout())
  }
   return (
    <header>
        <Navbar bg="dark" variant="dark" expand="lg">
        <Container fluid>
          <LinkContainer to="/">
            <Navbar.Brand>ProShop</Navbar.Brand>
          </LinkContainer>
            
            <Navbar.Toggle aria-controls="ProShor" />
            <Navbar.Collapse id="navbarScroll">
            <SearchBox/>
            <Nav
                className="me-auto my-2 my-lg-0"
                style={{ maxHeight: '100px' }}
                navbarScroll
            >
                 <LinkContainer to="/cart">
                    <Nav.Link><i className="fas fa-shopping-cart"></i>Cart</Nav.Link>
                 </LinkContainer>

                {userInfo ? (
                  <NavDropdown title={userInfo.name} id="username">
                    <LinkContainer to='/profile'> 
                      <NavDropdown.Item>Profile</NavDropdown.Item>
                    </LinkContainer>
                    <NavDropdown.Item onClick={logoutHandler}>Logout</NavDropdown.Item>
                  </NavDropdown>
                ): (
                  <LinkContainer to="/login">
                  <Nav.Link><i className="fas fa-user"></i>Login</Nav.Link>  
                </LinkContainer>
                 
                )}

                {userInfo && userInfo.isAdmin && (
                   <NavDropdown title='Admin' id="adminmenu">
                    <LinkContainer to='/admin/userlist'> 
                    <NavDropdown.Item>Users</NavDropdown.Item>
                  </LinkContainer>

                  <LinkContainer to='/admin/productlist'>
                    <NavDropdown.Item>Products</NavDropdown.Item>
                  </LinkContainer>

                  <LinkContainer to='/admin/orderslist'>
                    <NavDropdown.Item>Orders</NavDropdown.Item>
                  </LinkContainer>


                </NavDropdown>
                
                )}

              
            </Nav>
            </Navbar.Collapse>
      </Container>
    </Navbar>
    </header>
  )
}

export default Header