import { useState } from "react";

export default function InlineSelectCell({

  rowKey,       // PK
  value,        // 현재 값
  options = [], // [승인대기,승인완료] 배열
  onPatch,      // async (id, nextVal) => Promise<void>
  stopRowClick = true,
  disabled = false,
  className = "",
}) {
  const [saving, setSaving] = useState(false);

  const handleChange = async (e) => {
    const next = e.target.value;
    
    if (next === (value ?? "")) return; // 변경 없음 -> 종료
    setSaving(true);
    try { 
      await onPatch(rowKey, next); 
    }
    finally { 
      setSaving(false); 
    }
  };
  
  return (
    <select 
      className={className}
      value={value ?? ""}
      disabled={disabled || saving}
      onClick={stopRowClick ? (e) => e.stopPropagation() : undefined}
      onChange={handleChange}>
        
        {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
    </select>
  );
}