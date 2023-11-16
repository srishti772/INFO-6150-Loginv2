import React from 'react'
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import {useState} from "react"
import axios from 'axios'
import { useNavigate } from 'react-router-dom'; 


const Login = () => {
    const navigate = useNavigate();
    const [getData,setData]=useState([
        {email:'',
    password:''},


    ]);
    const [displayerror, setError] = useState('');

    const handleSubmit=async(e)=>{
        e.preventDefault();
        console.log("hii");
        try{
            const response= await axios.post('http://localhost:8000/user/login',getData);
            const{message}=response.data;

            
                navigate('/layout');
    
        }
    
    
        catch(error){
         
    
            if (error.response.status === 400) {
                // Bad Request (validation errors)
                if (error.response.data.errors && error.response.data.errors.length > 0) {
                    setError(error.response.data.errors.join(', '));
                } else {
                    setError('Validation error');
                }
            } else if (error.response && error.response.status === 404) {
                // Not Found (invalid username or password)
                setError(error.response.data.message);
            } else {
                // Other server errors
                setError('Internal server error');
            }

         
            
            
        }

        
    }

    const container={
    
        display:'box',
        alignItems:'center',
        gap:'20px',
        width:'40%',
        marginLeft:'auto',
        marginRight:'auto',
        marginTop:'10%',
        scrollBehavior:'smooth',
        padding:'20px',
        borderRadius:'10px',
       backgroundColor:'white',
    
      }

const handleChange=(e)=>{
const {name,value}=e.target;
setData((prevData)=>({
    ...prevData,
    [name]:value,
}))

setError('');

}



  return (<>
    <div style={container}>
        
        <h1 style={{fontWeight:'bold',textAlign:'center'}}>User Login</h1>

    <Form onSubmit={handleSubmit}>
      <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label>Email address</Form.Label>
        <Form.Control type="email" name='email' placeholder="Enter email" required onChange={handleChange} value={getData.email} />
        <Form.Text className="text-muted">
          example@northeastern.edu
        </Form.Text>
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasicPassword">
        <Form.Label>Password</Form.Label>
        <Form.Control type="password"  name='password' placeholder="Password" required onChange={handleChange} value={getData.password}  />
       
      </Form.Group>
    

                        <Form.Group className="mb-3" controlId="formError">
                            <Form.Text className="text-danger" >
                                {displayerror}
                            </Form.Text>
                        </Form.Group>
                    
      <Button variant="primary" type="submit">
        Login
      </Button>



    </Form>
    </div>
    </>

  )
}

export default Login