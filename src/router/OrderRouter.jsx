//< Order라우터 >
import { lazy, Suspense } from "react";
import { Navigate } from "react-router-dom";




const OrderRouter = () => {
  const Loading = <div>Loading...</div>;
  const SellerCustomerListPage = lazy(() => import("../pages/order/SellerCustomerListPage"));
  const OrderApprovePage = lazy(() => import("../pages/order/OrderApprovePage"));
  const OrderListPage = lazy(() => import("../pages/order/OrderListPage"));

  return[
    {
      path:"",
      element: <Navigate replace to ="sellercustomer"/>
    },
    {
      path: "orderlist",
      element: <Suspense fallback={Loading}><OrderListPage /></Suspense>,
    },
    {
      path: "sellercustomer",
      element: <Suspense fallback={Loading}><SellerCustomerListPage/></Suspense>
    },
    {
      path: "orderreceive",
      element: <Suspense fallback={Loading}><OrderApprovePage/></Suspense>
    }
  ]
};

export default OrderRouter;
