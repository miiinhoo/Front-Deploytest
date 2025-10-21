import { useEffect } from "react";
import { UserArrays } from "../../arrays/user/UserArrays";
import ButtonComponent from "../../components/ButtonComponent";


const LoginComponent = ({
  loginParam,
  setLoginParam,
  doLogin,
  moveToPath,
  navigate,
  isLoggedIn,
  setIsLoggedIn,
}) => {
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginParam(prev => ({ ...prev, [name]: value }));
  };

  const handleClickLogin = async (e) => {
    e.preventDefault();
    console.log("현재 loginParam:", loginParam);

    const data = await doLogin(loginParam);
    console.log("서버 응답:", data);

    if (!data) return alert("서버 응답 없음");
    if (data.success === false) {
      alert(data.message);
      setIsLoggedIn(false);
    } else {
      alert("로그인 성공");
      setIsLoggedIn(true);
      moveToPath("/");
    }
  };

  useEffect(() => {
    console.log("로그인 상태 값 > " , isLoggedIn)
  },[isLoggedIn])

  return(
    <div className="loginpage-wrapper">
      <h1>LOGIN</h1>
      <form>
        {
            UserArrays.slice(1,3).map((list,idx) => (
                <div key={idx}>
                    <input type={list.type} 
                    name={list.value}
                    placeholder={list.name}
                    value={loginParam[list.value] || ""}
                    onChange={(e) => 
                      handleChange(e)}
                    />
                </div>
            ))
        }
        <div>
          <ButtonComponent 
          text={"로그인"} 
          onClick={handleClickLogin} 
          type={"submit"}
          cln="login"
          />
        <ButtonComponent 
        text={"회원가입"} 
        onClick={() => navigate("/join")}
        cln="join"
        />
        </div>
        
    </form>
    </div>
  )
}
export default LoginComponent;