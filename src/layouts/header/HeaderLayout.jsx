import WoodenMainLogo from "../../WoodenMainLogo.png";
import { Link } from "react-router-dom";
import { NavBar } from "../../arrays/MainArrays";
import useCustomLogin from "../../hook/useCustomLogin";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import UserInfoCard from "./UserInfoCard";

const HeaderLayout = ( {
// GuideMenuLayout
children,
//--------
currentNavID,
handleNavClick,
navigate,
setOpenSideSet,
} ) => {


const {doLogout,loginState,moveToLogin} = useCustomLogin();

const isLogin = useSelector(state => state.login.isLogin);
const location = useLocation();



const userName = useSelector( state => state.login.user );

useEffect(() => {
    
    if ( !isLogin && location.pathname !== "/login" && location.pathname !== "/join") {
        moveToLogin();
    }
    console.log(userName);
    // filteredUserInfo();
}, [navigate, isLogin, location]);



return(
<>
    <header>
        <div className="logo">
                <h1>
                    <Link to = "/">
                        <img src={WoodenMainLogo} alt="MainLogo" className="mainLogo" />
                    </Link>
                </h1>
            </div>
            <nav>
                <ul className="header-ul">
                    { NavBar.map(data => (
                        <li key={data.id} 
                        className={currentNavID === data.id ? "selected":""}
                        onClick={() => {
                            if (loginState){
                                handleNavClick(data);
                                navigate(data.path)
                            }
                            else{ alert("로그인이 필요합니다.");
                                navigate("/login")
                            }
                        }
                        }  
                        >
                        <Link to={data.path} className="nav-items">{data.name}</Link>
                        </li>
                    ))}
                    
                </ul>
                {/* 수정 10-02 */}
                <div className="side-tab">
                    <p className="user-content">    {/*테스트*/}
                    
                    <UserInfoCard 
                    loginState={loginState}
                    doLogout={doLogout}
                    userName={userName}
                    />
                    </p>
                    <Link onClick = { (e)=> {
                        e.preventDefault()
                        setOpenSideSet(true);
                        }}
                        className="hamburger">
                        <span>{/*햄버거메뉴*/}</span>
                        <span>{/*햄버거메뉴*/}</span>
                        <span>{/*햄버거메뉴*/}</span>
                    </Link>
            </div> 
        </nav>
        <>
            {children}
        </>
    </header>
</>
);
}
export default HeaderLayout;