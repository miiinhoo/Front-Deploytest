import { Navigate, useNavigate } from "react-router-dom"
import {useDispatch, useSelector} from "react-redux";
import { loginPostAsync, logout } from "../slice/loginSlice";



const useCustomLogin = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const loginState = useSelector(state => state.login.isLogin); // < 로그인 상태
  const isLoggedIn = loginState.id ? true : false; // < 로그인 여부

  const doLogin = async (loginParam) => {
    const action = await dispatch(loginPostAsync(loginParam));
    return action.payload;
  }
  const doLogout = () => { // < 로그아웃 함수
    dispatch(logout());
  }
  const moveToPath = (path) => { // <  페이지 이동
    navigate({pathname:path}, {replace:true});
  }
  const moveToLogin = () => { // 로그인 페이지로 이동
    navigate({pathname: '/login'}, {replace:true});
  }
  const moveToLoginReturn = () => { // < 로그인 페이지로 이동 컴포넌트
    return <Navigate replace to ="/login" /> 
  }

  return {loginState, isLoggedIn, doLogin, doLogout, moveToPath, moveToLogin, moveToLoginReturn}
}
export default useCustomLogin;