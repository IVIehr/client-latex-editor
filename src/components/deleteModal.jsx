/* eslint-disable react/prop-types */
import { XIcon } from "../assets/svg";

const ModalDelete = ({ handleDelete, deleteModal, setDeleteModal, name }) => {
  const close = () => {
    setDeleteModal(false);
  };

  if (!deleteModal) {
    return null;
  }

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <div className="flex flex-wrap">
          <button className="focus:outline-0 ml-auto" onClick={close}>
            <XIcon className="w-4 h-4" />
          </button>
        </div>
        <div className="flex items-center">
          <div className="px-[23px]">{`Are you sure you want to delete "${name}" ?`}</div>
        </div>
        <div className="dialog-content__action-part modal-action mt-[30px]">
          <>
            <button
              className="bg-[#673AB7] leading-[22px] px-[23px] py-[9px] text-white mr-3 border-0 focus:outline-0"
              onClick={handleDelete}
            >
              Delete
            </button>
            <button
              className="hover:bg-[#673AB7] hover:text-white leading-[22px] px-[23px] py-[9px] text-[#673AB7] border-0 focus:outline-0"
              type="button"
              onClick={close}
            >
              Cancel
            </button>
          </>
        </div>
      </div>
    </div>
  );
};

export default ModalDelete;
