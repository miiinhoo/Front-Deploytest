import { useEffect, useState } from "react";
import { Chart } from "react-google-charts";
import { fetchMonthlyRevenue } from "../api/salesApi";

export default function MonthlySalesChart() {
  const [rows, setRows] = useState([]);
  const [err, setErr] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const r = await fetchMonthlyRevenue();
        setRows(r);
      } catch (e) {
        setErr(e?.message || "load error");
      }
    })();
  }, []);

  const data = [
    ["월", "판매수익"],
    ...rows.map(r => [String(r.ym ?? ""), Number(r.total ?? 0)]),
  ];

  const options = {
    title: "월별 판매수익 (납품완료 기준)",
    legend: { position: "none" },
    curveType: "function",
    hAxis: { title: "월", slantedText: true, slantedTextAngle: 45 },
    vAxis: { title: "원" },
    chartArea: { left: 60, top: 40, width: "80%", height: "70%" },
  };

  if (err) return <div className="card error">월별 매출 로딩 실패: {err}</div>;
  if (rows.length === 0) return <div className="card">데이터가 없습니다.</div>;

  return (
    <div className="card">
      <Chart chartType="LineChart" width="100%" height="320px" data={data} options={options}/>
    </div>
  );
}
