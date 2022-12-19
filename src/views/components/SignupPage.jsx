import { Skeleton } from 'antd';
import { Suspense, lazy } from 'react';

const Login = lazy(()=>import ('./signup'));
const styles = {backgroundColor:"#f4976c", height:"100%" }
const LoginPage = ()=>{

    return (
        <>
            <div style={{ ...styles }}>
            <div className="row no-gutters" style={{ margin:"0" }}>
                <div className="col-12 col-sm-6 ml-md-6 col-lg-6" >
                    <Suspense fallback={<><Skeleton/><Skeleton/><Skeleton/></>}>
                        <Login/>
                    </Suspense>
                </div>
                <div className="col-12 col-sm-6 ml-md-6 col-lg-6" style={{ backgroundImage:"url(/img/login.png)", backgroundSize:"contain", backgroundRepeat:"no-repeat"}} loading="lazy">
                </div>
            </div>
            </div>
            
        </>
    );
}
export default LoginPage;