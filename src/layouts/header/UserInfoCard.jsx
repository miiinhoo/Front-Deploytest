const UserInfoCard = ({loginState,doLogout,userName}) => {

  return (
    <>
      {loginState ? 
      <>
        <p>
          <div className="userName">
            <span><strong>{userName}</strong>님 안녕하세요!</span>
          </div>
          <span
            className="loginbtn"
            onClick={() => {
            doLogout();
            alert("로그아웃 되었습니다.")
            }}
            >
                로그아웃
          </span>
        </p>
        
      </> 
    : 
        <div>로그인필요</div>
    }
      
    </>
  )
}
export default UserInfoCard;