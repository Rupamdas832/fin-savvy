import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

interface ModalProps {
  title: string;
  onClose: () => void;
  children: any;
}

const Modal = ({ title, onClose, children }: ModalProps) => {
  const handleStopPropagation = (e: any) => {
    e.stopPropagation();
  };

  return (
    <div
      className="flex items-center justify-center fixed top-0 left-0 w-full h-screen bg-black bg-opacity-80"
      onClick={onClose}
    >
      <div
        className="flex flex-col w-11/12 border bottom-1 border-black rounded-xl"
        onClick={handleStopPropagation}
      >
        <div className="flex justify-between items-center p-4 bg-slate-400 rounded-t-xl">
          <p className="text-xl font-bold">{title}</p>
          <FontAwesomeIcon
            icon={faXmark}
            className="text-xl  text-black"
            onClick={onClose}
          />
        </div>
        {children}
      </div>
    </div>
  );
};

export default Modal;
