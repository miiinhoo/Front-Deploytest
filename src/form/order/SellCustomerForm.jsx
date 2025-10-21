
import { sellCustomerArray } from "../../arrays/SellerCustomerArray";


const SellCustomerForm = ({ formData, onClose, onSubmit,onChange,children }) => {
  
  return (
    <div className="form-wrapper">
      {sellCustomerArray.slice(1).map((data, idx) => (
        <div className="form-content" key={idx}>
          <p>
            <span className="form-child">{data.content}</span>
            <input
              type={data.input}
              name={data.clmn}
              value={formData[data.clmn] || ""}
              onChange={onChange}
            />
            
          </p>
        </div>
      ))}
      {children}
    </div>
  );
};

export default SellCustomerForm;
