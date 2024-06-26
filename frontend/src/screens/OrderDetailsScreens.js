import React, { useEffect, useState } from 'react';
import { Row, Col, ListGroup, Image, Card, Button } from 'react-bootstrap';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import Message from '../components/Message';
import Loader from '../components/Loader';
import { getOrderDetails, payOrder, deliverOrder } from '../actions/orderActions';
import { ORDER_PAY_RESET, ORDER_DELIVER_RESET } from '../constants/orderConstans';


function OrderDetailsScreens() {
    const params = useParams()
    const orderId = params.id
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [sdkReady, setSdkReady] = useState(false)

    const orderDetails = useSelector(state => state.orderDetails)
    const {order, error, loading} = orderDetails

    const orderPay = useSelector(state => state.orderPay)
    const {loading: loadingPay, success: successPay} = orderPay

    const orderDeliver = useSelector(state => state.orderDeliver)
    const {loading: loadingDeliver, success: successDeliver} = orderDeliver

    const userLogin = useSelector(state => state.userLogin)
    const {userInfo} = userLogin



    if (!loading && !error) {
      order.itemsPrice = order.orderItems.reduce((acc, item) => acc + item.price * item.qty, 0).toFixed(2); 
    }
    
    //AdXOb8vtqLFfsMiY7Cet-xsjanQ2SGQ2hU4NddHU7S_8_5dXY_MFkEttLsVrZnobFRwNJ3wbynqdCe7V



    const addPayPalScript = () => {
      const script = document.createElement('script')
      script.type = 'text/javascript'
      script.src = 'https://www.paypal.com/sdk/js?client-id=AdXOb8vtqLFfsMiY7Cet-xsjanQ2SGQ2hU4NddHU7S_8_5dXY_MFkEttLsVrZnobFRwNJ3wbynqdCe7V'
      script.async = true
      script.onload = () => {
          setSdkReady(true)
      }
      document.body.appendChild(script)
  }
    useEffect(() => {
      if(!userInfo) {
        navigate('/login')
      }
      if (!order || successPay || order._id !== Number(orderId) || successDeliver) {
          dispatch({type: ORDER_PAY_RESET})
          dispatch({type: ORDER_DELIVER_RESET})
          dispatch(getOrderDetails(orderId))  
      } else if (!order.is_paid) {
        if (!window.paypal) {
          addPayPalScript()
        } else {
          setSdkReady(true)
        }
      }
      
    }, [dispatch, order, orderId, successPay, successDeliver])
  

    const successPaymentHandler = (paymentResult) => {
      dispatch(payOrder(orderId, paymentResult))
    }

    const deliverHandler = () => {
      dispatch(deliverOrder(order))
    }

  return loading ? (
    <Loader/>
  ) : error ? (
    <Message variant="danger">{error}</Message>
  ) : (
    <div>
        <h1>Order: {order._id}</h1>
      <Row>
        <Col md={8}>
          <ListGroup variant='flush'>
            <ListGroup.Item>
              <h2>Shipping</h2>
              <p><strong>Name:</strong>{order.user.name}</p>
              <p><strong>Email: <a href={`mailto:${order.user.email}`}>{order.user.email}</a></strong></p>
              <p>
                <strong>Shipping: </strong>
                {order.shippingAddress.address},{order.shippingAddress.city},
                {'  '}
                {order.shippingAddress.postal_code},
                {' '}
                {order.shippingAddress.country}
              </p>
              {order.is_delivered ? (
                <Message variant='success'>Delivered on {order.delivered_at}</Message>
              ) :  <Message variant='warning'>Not Delivered</Message>}
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Payment Method</h2>
              <p>
                <strong>Method: </strong>
                {order.paymentMethod}
              </p>
              {order.is_paid ? (
                <Message variant='success'>Paid on {order.paid_at}</Message>
              ) :  <Message variant='warning'>Not Paid</Message>}
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Order Items</h2>
             {order.orderItems.length === 0 ? <Message variant='info'>You order is empty</Message> : (
              <ListGroup variant='flush'>
                {order.orderItems.map((item, index) => (
                  <ListGroup.Item key={index }>
                    <Row>
                      <Col md={1}>
                        <Image src={item.image} alt={item.name} fluid rounded/>
                      </Col>

                      <Col>
                        <Link to={`/product/${item.product}`}>{item.name}</Link>
                      </Col>

                      <Col md={4}>
                        {item.qty} X ${item.price} = ${(item.qty * item.price).toFixed(2)}
                      </Col>
                    </Row>
                  </ListGroup.Item>
                ))}
              </ListGroup>
             )
             }
            </ListGroup.Item>
          </ListGroup>
        </Col>

        <Col md={4}>
          <Card>
            <ListGroup variant='flush'>
              <ListGroup.Item>
                <h2>Order Summary</h2>
              </ListGroup.Item>

              <ListGroup.Item>
                  <Row>
                    <Col>Item:</Col>
                    <Col>${order.itemsPrice}</Col>
                  </Row>
              </ListGroup.Item>
              
              <ListGroup.Item>
                  <Row>
                    <Col>Shipping:</Col>
                    <Col>${order.shipping_price}</Col>
                  </Row>
              </ListGroup.Item>

              <ListGroup.Item>
                  <Row>
                    <Col>Tax:</Col>
                    <Col>${order.tex_price}</Col>
                  </Row>
              </ListGroup.Item>

              <ListGroup.Item>
                  <Row>
                    <Col>Total:</Col>
                    <Col>${order.total_price}</Col>
                  </Row>
              </ListGroup.Item>


             {!order.is_paid && (
              <ListGroup.Item>
                {loadingPay && <Loader/>}
                {!sdkReady ? (
                  <Loader/>
                ): (
                  <PayPalScriptProvider options={{"client-id": "AdXOb8vtqLFfsMiY7Cet-xsjanQ2SGQ2hU4NddHU7S_8_5dXY_MFkEttLsVrZnobFRwNJ3wbynqdCe7V"}}>
                    {/* <PayPalButtons amount={order.total_price}
                    onSuccess={successPaymentHandler}/> */}
                      <PayPalButtons
                createOrder={(data, actions) => {
                    return actions.order.create({
                        purchase_units: [
                            {
                                amount: {
                                    value: `${order.total_price}`,
                                },
                            },
                        ],
                    });
                }}
                onApprove={successPaymentHandler}
              />
                  </PayPalScriptProvider>
                  
                )}
              </ListGroup.Item>
             )}
            </ListGroup>
            {userInfo && userInfo.isAdmin && order.is_paid && !order.is_delivered && (
              <ListGroup.Item>
               {loadingDeliver && <Loader/> }
                  <Button
                    type='button'
                    className='btn btn-dark'
                    onClick={deliverHandler}
                  >
                    Mark is Delivered
                  </Button>
              </ListGroup.Item>
            )}
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default OrderDetailsScreens