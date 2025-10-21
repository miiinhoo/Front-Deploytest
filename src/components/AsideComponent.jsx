import { OrderList,BuyerList,PlanList,StockList } from '../arrays/MainArrays';
import { Link, useLocation } from 'react-router-dom';

const AsideComponent = ({ orderAside, buyerAside, planAside, stockAside }) => {
    const location = useLocation();

    const renderList = (list) => {
        return list.map(item => (
            <li
                key={item.id}
                className={location.pathname === `/${item.path}` ? "selected" : ""} // orderAsdie배열orbuyerAside배열의 path값과 일치하는 location경로에 들어올시 해당 요소에 selected클래스 추가.
            >
                <Link to={item.path}>
                    {item.name}
                </Link>
            </li>
        ));
    };

    return (
        <>
            {orderAside && renderList(OrderList)}
            {buyerAside && renderList(BuyerList)}
            {planAside && renderList(PlanList)}
            {stockAside && renderList(StockList)}
        </>
    );
}

export default AsideComponent;
