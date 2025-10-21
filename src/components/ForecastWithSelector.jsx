import React, { useEffect, useState } from "react";
import { getItems } from "../api/forecastAPI";
import ForecastCard from "./ForecastCard";

export default function ForecastWithSelector({ defaultHorizon = 12 }) {
  const [items, setItems] = useState([]);
  const [itemNo, setItemNo] = useState(null);
  const [horizon, setHorizon] = useState(defaultHorizon);

  useEffect(() => {
    (async () => {
      try {
        const list = await getItems();      // [{ itemNo, itemName }, ...]
        setItems(list);
        if (list?.length) setItemNo(list[0].itemNo); // 첫 항목 자동 선택
      } catch {
        setItems([]);
      }
    })();
  }, []);

  const selected = items.find(i => i.itemNo === itemNo);

  return (
    <>
      {/* 1) 아이템 드롭다운 (맨 위) */}
      <div
        className="selector-row"
        style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 12 }}
      >
        {/* 아이템 선택 */}
        <select
          value={itemNo ?? ""}
          onChange={(e) => setItemNo(Number(e.target.value))}
          style={{ padding: 8, borderRadius: 8, minWidth: 220 }}
        >
          {items.map(it => (
            <option key={it.itemNo} value={it.itemNo}>
              {it.itemName ?? `Item #${it.itemNo}`}
            </option>
          ))}
        </select>

        {/* 예측 주기 선택 */}
        <select
          value={horizon}
          onChange={(e) => setHorizon(Number(e.target.value))}
          style={{ padding: 8, borderRadius: 8 }}
        >
          {[4, 8, 12, 16, 24].map(w => (
            <option key={w} value={w}>{w}주</option>
          ))}
        </select>
      </div>

      {/* 2) 예측 카드 (헤더: 제목·설명 한 줄 → 차트) */}
      {itemNo && (
        <ForecastCard
          itemNo={itemNo}
          horizon={horizon}
          title={`판매량 예측: ${selected?.itemName ?? `Item #${itemNo}`}`}
        />
      )}
    </>
  );
}
