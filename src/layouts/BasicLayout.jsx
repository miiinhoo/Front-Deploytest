import { Outlet } from "react-router-dom";
import { useEffect } from "react";
import useEvent from "../hook/useEvent";
import HeaderLayout from "./header/HeaderLayout";
import GuideMenuLayout from "./header/GuideMenuLayout";
import AsideLayout from "./aside/AsideLayout";
import AsideComponent from "../components/AsideComponent";


const BasicLayout = () => {
    const {
        setIsLoggedIn,
        currentNavID,
        isLoggedIn,
        handleNavClick,
        navigate,
        navigateAndReset,
        location,
        orderAside,
        buyerAside,
        planAside,
        stockAside,
        setOpenSideSet,
        openSideSet,
        setUserInfo,
    } = useEvent({});
    useEffect(() => {
        setUserInfo();
    },[location.pathname])

    return(
        <>
        <HeaderLayout 
        currentNavID={currentNavID}
        isLoggedIn={isLoggedIn}
        setIsLoggedIn={setIsLoggedIn}
        handleNavClick={handleNavClick}
        navigate={navigate}
        navigateAndReset={navigateAndReset}
        setOpenSideSet={setOpenSideSet}
        >
            <GuideMenuLayout
            openSideSet={openSideSet}
            setOpenSideSet={setOpenSideSet}
            />
        </HeaderLayout>
        <div className="main_content">
            <AsideLayout>
                <AsideComponent
                orderAside={orderAside} 
                buyerAside={buyerAside}
                planAside={planAside}
                stockAside={stockAside}
                isLoggedIn={isLoggedIn}
                />
            </AsideLayout>
        <div className="main_body">
            <Outlet/>        
        </div>
        </div>
        </>
    )
}
export default BasicLayout;