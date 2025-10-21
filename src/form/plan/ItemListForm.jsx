
import { ItemListArrays } from "../../arrays/ItemArrays";


const ItemListForm = ({ formData, onClose, onSubmit,onChange,children }) => {

  return (
    <div className="form-wrapper">
      {ItemListArrays.slice(1).map((data, idx) => (
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

export default ItemListForm;
