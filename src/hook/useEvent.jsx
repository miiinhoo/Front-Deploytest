import { useEffect, useState } from "react";
import { useLocation,useNavigate } from "react-router-dom";
import { pathToNavIdMap } from "../arrays/BasicLayout/NavArrays";

const useEvent = () => {

    const navigate = useNavigate();
    const location = useLocation();
    const [ asdieID, setAsideID ] = useState(null);
    const [ navID, setNavID ] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [ onHover, setOnHover ] = useState(false); 

    const activeNavMap = {
    "/order/orderlist": 1,
    "/order/sellercustomer":1,
    "/order/orderreceive":1,
    "/buyer/partlist": 2,
    "/buyer/buyercustomer": 2,
    "/buyer/partorder":2,
    "/buyer/buyerdelivery":2,
    "/plan/itemlist":3,
    "/plan/planlist": 3,
    "/plan/bomlist":3,
    "/stock/stocklist": 4,
    "/stock/partstock":4,
  };

    const asideGroups = {
        order: "/order",
        buyer: "/buyer",
        plan: "/plan",
        stock: "/stock"
    };
  const currentNavID = activeNavMap[location.pathname];
    const orderAside = location.pathname.startsWith(asideGroups.order);

    const buyerAside = location.pathname.startsWith(asideGroups.buyer);

    const planAside = location.pathname.startsWith(asideGroups.plan);

    const stockAside = location.pathname.startsWith(asideGroups.stock);

  function navigateAndReset(path){
      setAsideID(null);
      setNavID(null);
      navigate(path);
  }
   
  function handleNavClick(list){
      setNavID(list.id);
  }
    function goBackBtn(){
      navigate(-1)
    }
  
    function setUserInfo () {
      const loginStatus = localStorage.getItem("isLoggedIn");
      setIsLoggedIn(loginStatus === "true"); // 로그인 상태 불러오기
      setNavID(pathToNavIdMap[location.pathname] || null);
    }
  const [ openSideSet , setOpenSideSet ] = useState(false);

  return{
    navigate,
    location,
    asdieID,
    setAsideID,
    navID,
    setNavID,
    isLoggedIn,
    setIsLoggedIn,
    onHover,
    setOnHover,
    activeNavMap,
    asideGroups,
    currentNavID,
    orderAside,
    buyerAside,
    planAside,
    stockAside,
    navigateAndReset,
    handleNavClick,
    pathToNavIdMap,
    setUserInfo,
    openSideSet,
    setOpenSideSet,
    goBackBtn
  };
}
export default useEvent;