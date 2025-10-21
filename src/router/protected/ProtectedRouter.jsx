import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';



const ProtectedRouter = ({children}) => {
  const isLogin = useSelector(state => state.login.isLogin);

  if(!isLogin){
    return <Navigate replace to = "login"/>
  }

  return children;
}
export default ProtectedRouter;