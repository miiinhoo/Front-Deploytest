import { useState, useEffect, useRef, useMemo } from "react";

export default function SeachComponent ({

  value,                      // 외부에서 제어
  defaultValue = "",          // 내부 상태로 시작
  onChange,                   // 입력값이 바뀔 때 즉시 통지
  onDebounced,                // 디바운스 후 서버 호출 등 실행
  delay = 300,                // 디바운스 ms (기본 300)
  placeholder = "검색",       
  minLength = 0,              // 설정 길이 미만이면 onDebounced 호출 안 함
  autoFocus = false,           
  className = "border rounded px-3 py-2 w-full",

}) {
  const isContrlled = useMemo(() => value !== undefined, [value]);  // 리렌더 될때 불필요한 재계산 방지

  const [inner, setInner] = useState(defaultValue);

  const val = isContrlled ? value : inner;

  const timerRef = useRef(null);

  // 입력 변경
  const handleChange = (e) => {
    const v = e.target.value;
    if (!isContrlled) setInner(v);
    onChange?.(v);

    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      const trimmed = v.trim();

      if (trimmed.length >= minLength) onDebounced?.(trimmed);
      else onDebounced?.(""); // 짧으면 빈검색으로 처리
    }, delay);
  };

  useEffect(() => () => timerRef.current && clearTimeout(timerRef.current), []);

  return (
    <input 
      type="search"
      role="searchbox"
      aria-label="검색"
      value={val}
      onChange={handleChange}
      autoFocus={autoFocus}
      className={className}
    />
  );
};