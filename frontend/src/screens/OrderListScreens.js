import { useEffect} from 'react';
import {LinkContainer} from 'react-router-bootstrap'
import { useNavigate } from 'react-router-dom';
import {Table, Button} from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../components/Loader';
import Message from '../components/Message';
import {listOrders} from '../actions/orderActions'

function OrderListScreens() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    
    const orderList = useSelector(state => state.orderList)
    const {loading, error, orders} = orderList
     
    const userLogin = useSelector(state => state.userLogin)
    const {userInfo} = userLogin




    useEffect(() => {
        if (userInfo && userInfo.isAdmin) {
            dispatch(listOrders())
        } else {
            navigate('/login')
        }
        
    }, [dispatch, navigate, userInfo])

 
    return (
        <div>
            <h1>Orders</h1>
            {loading ? (<Loader/>) : error ? (<Message variant="danger">{error}</Message>) : (
                <Table striped hover responsive className='table-sm'>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>USER</th>
                            <th>DATE</th>
                            <th>TOTAL</th>
                            <th>PAID</th>
                            <th>DELIVERED</th>
                        </tr>
                    </thead>

                    <tbody>
                        {orders.map(order => (
                            <tr key={order._id}>
                                <td>{order._id}</td>
                                <td>{order.user && order.user.name}</td>
                                <td>{order.created_at.substring(0, 10)}</td>
                                <td>{order.total_price}</td>

                                <td>{order.is_paid ? (
                                        order.paid_at.substring(0, 10)
                                    ) : (
                                        <i className='fas fa-times' style={{color: 'red'}}></i>
                                    )}
                                </td>  

                                <td>{order.is_delivered ? (
                                        order.is_delivered.toString().substring(0, 10)
                                    ) : (
                                        <i className='fas fa-times' style={{color: 'red'}}></i>
                                    )}
                                </td>  
                            
                            <td>
                                <LinkContainer to={`/order/${order._id}`}>
                                    <Button variant='btn btn-light' className='btn-sm'>
                                        Details
                                    </Button>
                                </LinkContainer>
    
                            </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}
        </div>
    )
}

export default OrderListScreens