import { OrderListArr } from "../../arrays/OrderListArrays";

const OrderListForm = ({
  formData,
  onChange,
  customer,
  itemList,
  setCustomerId,
  setItemListId,
  children,
}) => {
  
  // 상품 선택 시 단가 자동 입력
  const handleItemChange = (e) => {
    const itemId = Number(e.target.value);
    const selectedItem = itemList.find((i) => i.value === itemId);

    if (selectedItem) {
      setItemListId(itemId);
      // itemId 업데이트
      onChange({ target: { name: "itemId", value: itemId } });
      // 단가(orderPrice) 자동 입력
      onChange({ target: { name: "orderPrice", value: selectedItem.price } });
    }
  };
  // 총 금액
  const computedTotal =
    Number(formData.orderQty || 0) * Number(formData.orderPrice || 0);

  return (
    <div className="form-wrapper">
      {OrderListArr.slice(1).map((data) => (
        <div className="form-content" key={data.id}>
          <p>
            <span className="form-child">{data.content}</span>

            {/* 🔽 거래처 Select */}
            {data.clmn === "cusComp" ? (
              <select
                name="customerId"
                value={formData.customerId || ""}
                onChange={(e) => {
                  onChange({ target: { name: "customerId", value: e.target.value } });
                  setCustomerId(Number(e.target.value));
                }}
                required
              >
                <option value="">거래처 선택</option>
                {customer.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            ) : data.clmn === "itemName" ? (
              /* 🔽 상품 Select */
              <select
                name="itemId"
                value={formData.itemId || ""}
                onChange={handleItemChange}
                required
              >
                <option value="">상품 선택</option>
                {itemList.map((i) => (
                  <option key={i.value} value={i.value}>
                    {i.label}
                  </option>
                ))}
              </select>
            ) : data.clmn === "orderState" ? (
              /* 🔽 주문상태 Select */
              <select
                name="orderState"
                value={formData.orderState || ""}
                onChange={onChange}
              >
                <option value="승인대기">승인대기</option>
                <option value="승인완료">승인완료</option>
              </select>
            ) : data.clmn === "orderDeliState" ? (
              /* 🔽 납품상태 Select */
              <select
                name="orderDeliState"
                value={formData.orderDeliState || ""}
                onChange={onChange}
              >
                <option value="납품대기">납품대기</option>
                <option value="납품완료">납품완료</option>
              </select>
            ) : data.clmn === "totalPrice" ? (
              // 총 금액 = 수량 X 단가 (화면단 표시만)
              <input
                name="totalPrice"
                readOnly
                value={String(computedTotal)}
              />
            ) : (
              /* 🔽 기본 input */
              <input
                type={data.type || "text"}
                name={data.clmn}
                value={formData[data.clmn] || ""}
                onChange={onChange}
                readOnly={data.clmn === "orderPrice"} // ✅ 단가 자동 입력
              />
            )}
          </p>
        </div>
      ))}

      {children}
    </div>
  );
};

export default OrderListForm;
