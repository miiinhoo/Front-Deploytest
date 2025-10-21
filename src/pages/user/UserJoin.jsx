import "./UserLogin.scss";
import { useEffect, useState } from "react";
import { getUserInfo,createUserInfo } from "../../api/user/signupAPI";
import ButtonComponent from "../../components/ButtonComponent";
import { useCRUD } from "../../hook/useCRUD";
import { initForms } from "../../arrays/TableArrays";
import { UserArrays } from "../../arrays/user/UserArrays";
import { useNavigate } from "react-router-dom";

const api = {
  getAll: getUserInfo,
  create : createUserInfo,
}
export default function UserJoin(){
  const [ pw, setPw ] = useState(false);
  const [ checkPw, setCheckPw ] = useState(false);
  const [ input, setInput ] = useState("");
  const [ ckinput,setCkInput ] = useState(""); 
  const [ onFocus, setOnFocus ] = useState(false);
  const navigate = useNavigate();


  const passwordChecked = (e) => {
    const data = e.target.value;
    setInput(data);
    setPw(!!data);
    if(!data){
      setCkInput("");
    }
  }

  const checkingUserPw = (e) => {
    const data = e.target.value;
    setCkInput(data);
  }

  useEffect(() => {
    if(pw) setCheckPw( input === ckinput );
  },[pw,ckinput,input])

  const {
    formData,
    handleCreate,
    handleChange,
  } = useCRUD({
    initFormData:() => initForms.signup,
    keyField: "userNo",
    api
  })



  return(
    <div className="page-wrapper login">
      <div className="login-content">
        <div className="loginpage-wrapper">
        <h1>JOIN</h1>
        <form action="">
        { UserArrays.slice(0,4).map((list,idx) => (
          <label htmlFor="" 
          name={list.name}
          key={idx}
          >
            { list.value === "password" ? 
            <>
            <input type={list.type} 
            name={list.value}
            placeholder={list.name}
            onChange={(e) => {passwordChecked(e); handleChange(e);}}
            />
            <p style={{ 
              position:"absolute",
              top:"-20px",
              right:"31%",
              color:"red",
              fontSize:"13px"}}
              >
                비밀번호는 8자이상이여야 합니다.
              </p>
            </>
            
            : list.value === "checkPassword" ? 
            <>
            <input type={list.type} 
            name={list.value}
            onChange={checkingUserPw}
            placeholder={list.name}
            onFocus={() => setOnFocus(true)}
            onBlur={() => setOnFocus(false)}
            disabled={!pw}
            />
            <p 
            className={"isChecking"+(onFocus ? " float":"") + (checkPw ? " rightPw":" wrongPw")}
            >
              {checkPw ? "비밀번호 일치": "비밀번호 불일치"}
            </p>
            </>
            :
            <input type={list.type} 
            name={list.value}
            value={formData[list.value] || ""}
            placeholder={list.name}
            onChange={handleChange}
            />
            }
          </label>
          
        ))}
        
        <ButtonComponent text={"회원가입"} onClick={
          (e) => 
          {e.preventDefault();
            handleCreate();
            navigate("/login");
          }
          } disable={!checkPw}
          cln={"join"}
          style={{right:"52%",bottom:"7%"}}/>
          <ButtonComponent text={"로그인창으로"}
          onClick={(e) => {e.preventDefault(); navigate("/login")}}
          cln={"login"} style={{right:"22%",bottom:"7%"}}/>
      </form>
      </div>
      
      
    </div>
      </div>
      
  )
}
