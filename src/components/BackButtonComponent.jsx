import './Modal.scss';

const BackButtonComponent = ({onClick, text, type}) => {
  
  return(
    <div className='backbtn-wrapper'>
      <button type={type}
      onClick={onClick}
      className="backbtn">
        {text}
      </button>
    </div>
  )
}
export default BackButtonComponent;