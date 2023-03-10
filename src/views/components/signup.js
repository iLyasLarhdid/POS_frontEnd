import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { useHistory } from "react-router-dom";
import { UserContext } from "../../hooks/UserContext";
import properties from "../../properties";
import { Form, Input, Button,message } from 'antd';
import { UserOutlined, LockOutlined,MailOutlined } from '@ant-design/icons';

const layout = {
    labelCol: {
        span: 24,
      },
    wrapperCol: {
      span: 24,
    },
  };
const cardStyle={ height:"100%", padding:"0", margin:"0" }
const Signup = ()=>{

    const [role,] = useContext(UserContext);
    const history = useHistory();
    const {host} = properties;
    if(role)
        history.push("/");

    const url = `${host}/api/v1/users/register`;
    const [error,setError] = useState(null);
    const [data,setData] = useState(null);
    const [isButtonLoading,setIsButtonLoading] = useState(false);

    function sleep(seconds){
        return new Promise((resolve)=>setTimeout(resolve,seconds));
    }

    const onFinish = (values) => {
        console.log('Success:', values);
        setIsButtonLoading(true);
        const firstName = values.firstName;
        const lastName = values.lastName;
        const userName = values.userName;
        const email = values.email;
        const password = values.password;
        if(values.password === values.passwordConfirmation){
        fetch(url , {
            method:"POST",
            headers:{"Content-Type" : "application/json"},
            body: JSON.stringify({firstName,lastName,userName,email,password})
        }).then(response=>{
            if(!response.ok){ throw Error("something went wrong")}
            setIsButtonLoading(false);
            return response.json()})
            .then(data=>{
                setData(data);
                setIsButtonLoading(false);
                setError(null);
                message.success("check your email for confirmation");
                sleep(1500).then(()=>{history("/login")});
            }).catch((err)=>{
                message.error("something went wrong!, try again");
                setIsButtonLoading(false);
                setError(err.message);
            })
        }
        else
            setError("wait, what... how did you get here....HELP HELP A HACKER... CALL THE FBI")
      };
    
      const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
      };

    return (
        <div className="card" style={cardStyle}>
            <div className="card-body">
            <div className="container">
            <h4>Sign Up</h4>
                {data ? <h3 className="text-success">done</h3>:""}
                {error!==null ? <b className="text-danger">{error}</b>:""}
            <Form
            name="basic"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 18 }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            {...layout}
            >
            <Form.Item
                label="first name"
                name="firstName"
                rules={[{ required: true, message: 'Please input your first name!' }]}
            >
                <Input prefix={<UserOutlined className="site-form-item-icon" />}/>
            </Form.Item>
            <Form.Item
                label="last name"
                name="lastName"
                rules={[{ required: true, message: 'Please input your last name!' }]}
            >
                <Input prefix={<UserOutlined className="site-form-item-icon" />}/>
            </Form.Item>
            <Form.Item
                label="user name"
                name="userName"
                rules={[{ required: true, message: 'Please input your user name!' }]}
            >
                <Input prefix={<UserOutlined className="site-form-item-icon" />}/>
            </Form.Item>
            <Form.Item
                label="email"
                name="email"
                rules={[{ required: true, message: 'Please input your email!' }]}
            >
                <Input prefix={<MailOutlined className="site-form-item-icon" />}/>
            </Form.Item>
            <Form.Item
                label="Password"
                name="password"
                rules={[{ required: true, message: 'Please input your password!' }]}
            >
                <Input.Password prefix={<LockOutlined className="site-form-item-icon" />} />
            </Form.Item>
            <Form.Item
                label="confirm"
                name="passwordConfirmation"
                rules={[{ required: true, message: 'Please retype your password!' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('The two passwords that you entered do not match!'));
                  },
                }),]}
            >
                <Input.Password prefix={<LockOutlined className="site-form-item-icon" />} />
            </Form.Item>

            <Form.Item>
                {isButtonLoading ? <Button type="primary" loading disabled>Loading</Button>:<Button type="primary" htmlType="submit">sign up</Button>}
            </Form.Item>
            </Form>
            <span>Already registered? <Link to="/login">login here</Link></span>
            </div>
            </div>
        </div>
    )

}
export default Signup;