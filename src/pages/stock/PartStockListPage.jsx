import { useEffect, useState, useMemo } from "react";
import { useCRUD } from "../../hook/useCRUD";
import { getPartStockList } from "../../api/partStockApi";
import { initForms } from "../../arrays/TableArrays";
import { PartStockListArray } from "../../arrays/PartStockListArray";
import { partOrderArrays } from "../../arrays/partOrderArrays";
import { getCompletedPartOrders } from "../../api/PartOrderAPI";
import SearchComponent from "../../components/SearchComponent";
import BackButtonComponent from "../../components/BackButtonComponent";
import { useNavigate } from "react-router-dom";

const PartStockListPage = () => {
  const navigate = useNavigate();
  const { items, setItems } = useCRUD({
    initFormData: () => ({ ...initForms.partStock }),
  });
  const [completed, setCompleted] = useState([]);
  const [loading, setLoading] = useState(false);

  // 부품 재고 검색
  const [psQ, setPsQ] = useState("");
  const [psTerm, setPsTerm] = useState("");

  // 입고 완료 검색
  const [rcQ, setRcQ] = useState("");
  const [rcTerm, setRcTerm] =useState("");

  useEffect (() => {
    (async () => {
      try {
        const data = await getPartStockList();
        setItems(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error(e);
        setItems([]);
      }
    })();
  }, [setItems]);

  // 전체 새로고침
  const reloadAll = async () => {
    setLoading(true);
    try {
      const [stocks, parts] = await Promise.all([
        getPartStockList(),
        getCompletedPartOrders(),
      ]);
      setItems(Array.isArray(stocks) ? stocks : []);
      setCompleted(Array.isArray(parts) ? parts : []);
    } catch (e) {
      console.error(e);
      setItems([]);
      setCompleted([]);
      alert(e?.response?.data?.message || e?.response?.data?.error || "목록을 가져오지 못했습니다");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { reloadAll(); }, []);

  const safeItems = Array.isArray(items) ? items : [];
  const safeCompleted = Array.isArray(completed) ? completed : [];

  // 재고 표 필터 (부품명/재고ID)
  const filteredStocks = useMemo(() => {
  const t = (psTerm || "").trim().toLowerCase();
  if (!t) return safeItems;
  return safeItems.filter(r => {
    const name = (r.partName || "").toLowerCase();
    const id   = String(r.psNo || "");
    return name.includes(t) || id.includes(t);
  });
  }, [safeItems, psTerm]);

  // 입고완료 표 필터 (거래처/부품명/발주번호)
  const filteredReceived = useMemo(() => {
    const t = (rcTerm || "").trim().toLowerCase();
    if (!t) return safeCompleted;
    return safeCompleted.filter(r => {
      const sup  = (r.supplier || r.buyerName || "").toLowerCase();
      const name = (r.partName || "").toLowerCase();
      const no   = String(r.poNo || "");
      return sup.includes(t) || name.includes(t) || no.includes(t);
  });
  }, [safeCompleted, rcTerm]);

  return (
    <div className="page-wrapper">
      <BackButtonComponent text="< 이전페이지" onClick={() => navigate(-1)} />
      <h2 style={{ textAlign: "center" }}>부품 재고 현황</h2>
      

      <div className="top-searchbar">
        <SearchComponent
          value={psQ}
          onChange={setPsQ}
          onDebounced={setPsTerm}
          delay={300}
          placeholder="재고 검색 (부품명/재고ID)"
        />
        <button onClick={reloadAll} className="refresh">
        {loading ? "새로고침..." : "새로고침"}
      </button>
      </div>

      <div className="table-wrapper stock">
        <table className="w-full border-collapse border">
        <thead>
          <tr className="bg-gray-100">
            {PartStockListArray.map((col) => (
              <th
                key={col.id}
                className={`border px-2 py-1 ${
                  col.align === "right" ? "text-right" : "text-left"
                }`}
                style={{ width: col.width }}
              >
                {col.content}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filteredStocks.length ? (
            filteredStocks.map((row, index) => (
              <tr key={row.psNo ?? `${row.partName}-${index}`}>
                {PartStockListArray.map((col) => {
                  const val = row[col.clmn];
                  return (
                    <td key={`${row.psNo ?? index}-${col.id}`}
                        className={`border px-2 py-1 ${col.align === "right" ? "text-right" : ""}`}>
                          {typeof val === "number" ? val.toLocaleString() : val ?? ""}
                    </td>
                  )
                })}
              </tr>
            ))
          ) : (
            <tr>
              <td
                className="border px-2 py-6 text-center"
                colSpan={PartStockListArray.length}
              >
                데이터가 없습니다.
              </td>
            </tr>
          )}
        </tbody>
      </table>
      </div>
      

      <h3 className="text-xl font-semibold mb-2">입고완료 리스트</h3>

      <div className="top-searchbar">
        <SearchComponent
          value={rcQ}
          onChange={setRcQ}
          onDebounced={setRcTerm}
          delay={300}
          placeholder="입고완료 검색 (거래처/부품명/발주번호)"
        />
        
      </div>
      
      <div className="table-wrapper stock">
            <table>
        <thead>
          <tr className="bg-gray-100">
            {partOrderArrays.map(col => (
              <th
                key={col.id}
                className={`border px-2 py-1 ${col.align === "right" ? "text-right" : "text-left"}`}
              >
                {col.content}
              </th>
              ))}
          </tr>
          </thead>

          <tbody>
            {filteredReceived.length ? (
              filteredReceived.map(row => (
                <tr key={row.poNo}>
                  {partOrderArrays.map(col => {
                    const v = row[col.clmn];
                    const text = typeof v === "number" ? Number(v).toLocaleString() : (v ?? "");
                    return (
                      <td
                        key={`${row.poNo}-${col.id}`}
                        className={`border px-2 py-1 ${col.align === "right" ? "text-right" : ""}`}
                      >
                        {text}
                      </td>
                    );
                  })}
                </tr>
              ))
            ) : (
                
                <tr>
                  <td className="border px-2 py-6 text-center" colSpan={partOrderArrays.length}>
                    입고완료 내역이 없습니다.
                  </td>
                </tr>
                )}                
          </tbody>
      </table>
      </div>
      
    </div>
  );
};

export default PartStockListPage;
