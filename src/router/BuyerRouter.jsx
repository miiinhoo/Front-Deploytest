// Buyer라우터
import { lazy, Suspense, } from 'react';
import { Navigate } from 'react-router-dom';



const BuyerRouter = () => {
    const PartList = lazy(() => import('../pages/buyer/PartListPage'));
    const BuyerCustomer = lazy(() => import('../pages/buyer/BuyerListPage'))
    const PartOrder = lazy(() => import("../pages/buyer/PartOrderListPage"))
    
    const Loading = <div>Loading...</div>

    return[
        {
            path:"",
            element:<Navigate replace to = "buyercustomer"/>
        },
        {
            path:'partlist',
            element: <Suspense fallback={Loading}><PartList/></Suspense>
        },
        {
            path:'buyercustomer',
            element: <Suspense fallback={Loading}><BuyerCustomer/></Suspense>
        },
        {
            path: "partorder",
            element: <Suspense fallback={Loading}><PartOrder/></Suspense>,
        },
    ]
}
export default BuyerRouter;