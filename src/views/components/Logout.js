import { useContext } from "react";
import { useCookies } from "react-cookie";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { UserContext } from "../../hooks/UserContext";
import { LOGOUT } from "../../store/actions";
const Logout = ()=>{

    const [,,removeCookie] = useCookies([]);
    const history = useHistory();
    const [, setRole] = useContext(UserContext);
    const dispatch = useDispatch();
    
    
    dispatch({type:LOGOUT});
    removeCookie("smailToken");
    removeCookie("smailRefreshToken");
    removeCookie("principal_id");
    removeCookie("principal_first_name");
    removeCookie("principal_last_name");
    removeCookie("principal_email");
    removeCookie("principal_avatar");
    removeCookie("principal_role");
    
    setRole(null);

    history.push("/");

    return (<>there is an error in this page</>)
}
export default Logout;