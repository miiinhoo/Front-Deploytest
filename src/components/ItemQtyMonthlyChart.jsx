import { useEffect, useMemo, useState } from "react";
import { Chart } from "react-google-charts";
import { fetchItemQtyMonthlyAll, fetchItemQtyMonthlyByYm } from "../api/salesApi";

export default function ItemQtyMonthlyChart({ defaultYm, topN = 10 }) {
  const [months, setMonths] = useState([]);     // ["2025-09","2025-10",...]
  const [ym, setYm] = useState(defaultYm || "");
  const [rows, setRows] = useState([]);
  const [err, setErr] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const all = await fetchItemQtyMonthlyAll();
        const uniq = Array.from(new Set(all.map(r => String(r.ym)))).sort();
        setMonths(uniq);
        setYm(prev => prev || uniq.at(-1) || ""); // 기본 최신월
      } catch (e) {
        setErr(e?.message || "month list load error");
      }
    })();
  }, []);

  useEffect(() => {
    if (!ym) return;
    (async () => {
      try {
        const r = await fetchItemQtyMonthlyByYm(ym);
        setRows(r.slice(0, topN));
        setErr(null);
      } catch (e) {
        setErr(e?.message || "chart load error");
      }
    })();
  }, [ym, topN]);

  const data = useMemo(() => ([
    ["상품", "판매수량"],
    ...rows.map(r => [String(r.itemName ?? ""), Number(r.qty ?? 0)]),
  ]), [rows]);

  const options = {
    title: `상품별 월 판매수량 Top${topN} (납품완료 기준)`,
    legend: { position: "none" },
    hAxis: { title: "상품" },
    vAxis: { title: "수량" },
    chartArea: { left: 60, top: 40, width: "80%", height: "70%" },
  };

  return (
    <div className="card">
      <div className="toolbar">
        <label>월 선택</label>
        <select value={ym} onChange={e => setYm(e.target.value)}>
          {months.map(m => <option key={m} value={m}>{m}</option>)}
        </select>
      </div>
      {err ? (
        <div className="error">월 {ym} 데이터 로딩 실패: {err}</div>
      ) : data.length <= 1 ? (
        <div>해당 월 데이터가 없습니다.</div>
      ) : (
        <Chart chartType="ColumnChart" width="100%" height="320px" data={data} options={options}/>
      )}
    </div>
  );
}
