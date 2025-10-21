import './Modal.scss';
import CloseBtnComponent from './CloseBtnComponent';

const ModalComponent = ({onClose,isOpen,onConfirm,title,children}) => {
    
    return(
        <>
            <div className={"back-modal"+ (isOpen ? " show":"")}></div>
            <div className={"modal"+ (isOpen ? " show":"")}>
            
            <CloseBtnComponent onClose={onClose}/>
            <div className="modal-wrapper">
                <h3 className="modal-title">{title}</h3>
                {children}
            </div> 
        </div>
        </>
        
    )
}
export default ModalComponent;