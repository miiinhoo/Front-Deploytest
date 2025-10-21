import { useEffect, useState, useMemo } from "react";
import { getCompletedOrders } from "../../api/OrderListAPI";
import { OrderApproveArray, ORDER_APPROVE_NUMERIC_KEYS } from "../../arrays/OrderApproveArray";
import BackButtonComponent from "../../components/BackButtonComponent";
import SearchComponent from "../../components/SearchComponent"
import { useNavigate } from "react-router-dom";

export default function OrderApprovePage() {
    const nav = useNavigate();
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(true);

    // 검색 상태
    const [q, setQ] = useState("");
    const [term, setTerm] = useState("");

    const load = async () => {
        setLoading(true);
        const data = await getCompletedOrders();
        const normalized = (data || []).map(o => {
            const qty = Number(o.orderQty ?? 0);
            const price = Number(o.orderPrice ?? 0);
            const total = Number(o.totalPrice ?? 0) || qty * price;
            return { ...o, orderQty: qty, orderPrice: price, totalPrice: total };
        });
        setRows(normalized);
        setLoading(false);
    };
    
    useEffect(() => { load(); }, []);

    const getSellerName = (r) => r?.cusComp ?? r?.customerName ?? r?.company ?? "";
    const filtered = useMemo(() => {
        const t = term.trim().toLowerCase();
        if (!t) return rows;
        return rows.filter(r => getSellerName(r).toLowerCase().includes(t));
    }, [rows, term]);

    return (
        <div className="page-wrapper">
        <BackButtonComponent text="<  이전페이지" onClick={() => nav(-1)} />
        <h2 style={{ textAlign: "center" }}>주문완료현황</h2>

        <div className="top-searchbar">
            <SearchComponent
                value={q}
                onChange={setQ}
                onDebounced={setTerm}
                delay={300}
                minLength={0}
                placeholder="판매처명 검색"
                className="border rounded px-3 py-2"
            />

            <button onClick={load} className="refresh">새로고침</button>

        </div>
        <div className="table-wrapper">
            {loading ? (
            <div style={{ textAlign: "center", padding: 20 }}>불러오는 중</div>
        ) : (
            <table>
                <thead>
                    <tr>{OrderApproveArray.map(c => <th key={c.id}>{c.label}</th>)}</tr>
            </thead>
            
            <tbody>
                {filtered.length ? filtered.map(r => (
                <tr key={r.orderNo}>
                    {OrderApproveArray.map(c => {
                    const val = r[c.key];
                    if (ORDER_APPROVE_NUMERIC_KEYS.has(c.key)) {
                    return <td key={c.id}>{Number(val ?? 0).toLocaleString()}</td>;
                    }
                    return <td key={c.id}>{val}</td>;
                })}
                </tr>
                )) : (
                
                <tr>
                    <td colSpan={OrderApproveArray.length} style={{ textAlign: "center" }}>
                    완료된 주문이 없습니다.
                    </td>
                </tr>
                )}
            </tbody>
        </table>
    )}
        </div>
        

        
    </div>
    );
}
