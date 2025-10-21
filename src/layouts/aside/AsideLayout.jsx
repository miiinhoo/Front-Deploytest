

const AsideLayout = ({children}) => {
  return(
    <div className = "main_aside">
        <div className="main_article">
            <ul className="aside-ul">
                {children}
            </ul> 
        </div>
    </div>
  )
}
export default AsideLayout;