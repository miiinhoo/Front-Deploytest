import { lazy,Suspense } from "react";
import BasicLayout from "../layouts/BasicLayout";
import OrderRouter from "./OrderRouter";
import BuyerRouter from "./BuyerRouter";
import PlanRouter from "./PlanRouter";
import StockRouter from "./StockRouter";
import ProtectedRouter from "./protected/ProtectedRouter";

const {createBrowserRouter} = require("react-router-dom");

const UserLogin = lazy(() => import('../pages/user/UserLogin'))
const WoodenMain = lazy(() => import("../pages/WoodenMainPage"))
const UserJoin = lazy(() => import("../pages/user/UserJoin"))
const Loading = <div>Loading...</div>

const root = createBrowserRouter([
    {
        path:'',
        element: <BasicLayout/>,
        children:[
            {
                path:"",
                element:
                <ProtectedRouter>
                    <WoodenMain/>
                </ProtectedRouter>
            },
            {
                path:"login",
                element: <Suspense fallback={Loading}><UserLogin/></Suspense>
            },
            {
                path:"join",
                element: <Suspense fallback={Loading}><UserJoin/></Suspense>
            },
            {
                path:"order",
                children: OrderRouter(),
            },
            {
                path:"buyer",
                children: BuyerRouter(),
            },
            {
                path:"plan",
                children: PlanRouter(),
            },
            {
                path:"stock",
                children: StockRouter(),
            }
            
        ]
    },
]);
export default root;

