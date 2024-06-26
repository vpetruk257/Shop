import {useState, useEffect} from 'react';
import {Link, useParams} from 'react-router-dom'
import { useLocation, useNavigate } from 'react-router-dom';
import {Form, Button} from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../components/Loader';
import Message from '../components/Message';
import FormContainer from '../components/FormContainer';
import {detailProduct, updateProduct} from '../actions/productActions';
import { PRODUCT_UPDATE_RESET } from '../constants/productContstans';
import axios from 'axios';


function ProductEditScreens() {
    const params = useParams();
    const productId = params.id
    const [name, setName] = useState('')
    const [price, setPrice] = useState(0)
    const [image, setImage] = useState('')
    const [brand, setBrand] = useState('')
    const [category, setCategory] = useState('')
    const [countInStock, setCountInStock] = useState(0)
    const [description, setDescription] = useState('')
    const [uploading, setUploading] = useState(false)
    


    const dispatch = useDispatch()

    const location = useLocation();
    const navigate = useNavigate();
    

    
    const productDetails = useSelector(state => state.productDetails)
    const {error, loading, product} = productDetails
    

    const productUpdate = useSelector(state => state.productUpdate)
    const {error: errorUpdate, loading: loadingUpdate, success: successUpdate} = productUpdate
   


    useEffect(() => {

        if (successUpdate) {
            dispatch({type: PRODUCT_UPDATE_RESET})
            navigate('/admin/productlist')
        } else {
            if (!product.name || product._id !== Number(productId)) {
                dispatch(detailProduct(productId));
            } else {
                setName(product.name)
                setPrice(product.price)
                setImage(product.image)
                setBrand(product.brand)
                setCategory(product.category)
                setCountInStock(product.countInStock)
                setDescription(product.description)
            }
        }
        
    }, [dispatch,product, productId, navigate, successUpdate]) 

 
    const submitHandler = (e) => {
        e.preventDefault()
        dispatch(updateProduct({
            _id: productId,
            name,
            price,
            image,
            brand,
            category,
            countInStock,
            description,
        }))
        }


    const uploadFileHandler = async (e) => {
        const file = e.target.files[0]
        const formData = new FormData()

        formData.append('Image', file)
        formData.append('product_id', productId)

        setUploading(true)

        try {
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            }

            const {data} = await axios.post('http://127.0.0.1:8000/api/products/upload/', formData, config)

            setImage(data)
            setUploading(false)

        } catch(error) {
            setUploading(false)
        }
    }
    
    
  return (
    <div>
        <Link to="/admin/productlist">
            Go Back
        </Link>

        
        <FormContainer>
            <h1>Edit Product</h1>
            {loadingUpdate && <Loader/>}
            {errorUpdate && <Message variant='danger'>{errorUpdate}</Message>}
            {loading ? <Loader/> : error ? <Message variant="danger">{error}</Message>: (
                 
                <Form onSubmit={submitHandler}>
                     <Form.Group controlId='name'>
                             <Form.Label>Name</Form.Label>
                             <Form.Control  type='name' placeholder='enter name' value={name}
                             onChange={(e) => setName(e.target.value)}
                             ></Form.Control>
                </Form.Group>

             
                <Form.Group controlId='price'>
                             <Form.Label>Price</Form.Label>
                             <Form.Control  type='number' placeholder='enter price' value={price}
                             onChange={(e) => setPrice(e.target.value)}
                             ></Form.Control>
                </Form.Group>

                <Form.Group controlId='image'>
                             <Form.Label>Image</Form.Label>
                             <Form.Control  type='text' placeholder='enter image' value={image}
                             onChange={(e) => setImage(e.target.value)}
                             ></Form.Control>
                        <Form.Group controlId="formFile" className="mb-3" onChange={uploadFileHandler}>
                            <Form.Control type="file"/>
                        </Form.Group>
                        {uploading && <Loader/>}
                </Form.Group>


                <Form.Group controlId='brand'>
                             <Form.Label>Image</Form.Label>
                             <Form.Control  type='text' placeholder='enter brand' value={brand}
                             onChange={(e) => setBrand(e.target.value)}
                             ></Form.Control>
                </Form.Group>

                <Form.Group controlId='countinstock'>
                             <Form.Label>Stock</Form.Label>
                             <Form.Control  type='number' placeholder='enter Stock' value={countInStock}
                             onChange={(e) => setCountInStock(e.target.value)}
                             ></Form.Control>
                </Form.Group>


                <Form.Group controlId='category'>
                             <Form.Label>Category</Form.Label>
                             <Form.Control  type='text' placeholder='enter category' value={category}
                             onChange={(e) => setCategory(e.target.value)}
                             ></Form.Control>
                </Form.Group>

              
 
                 <br></br>
 
                     <Button type='submit' variant='btn btn-dark' onClick={submitHandler}>Update</Button>
 
                     
                 </Form>
            )}

        </FormContainer>
            
    </div>
    
  )
} 

export default ProductEditScreens