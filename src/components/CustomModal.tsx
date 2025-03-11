import { ReactNode, CSSProperties, forwardRef } from "react";

interface ModalProps {
  children: ReactNode; // Specifies that the component accepts nested elements
  id: string; // An ID to open and close the modal
  title?: string; // Optional modal title
  style?: CSSProperties; // Optional inline styles
}

/**
 * Create a modal that has a title and a close button
 * @prop {ReactNode} children
 * @prop {string} title - Title of the modal
 * @prop {string} id - HTML ID of the modal. This ID must match with a selector opening it.
 * @prop {CSSProperties} style - Optional inline styles
 * @returns React Component
 */
const CustomModal = forwardRef<HTMLDivElement, ModalProps>(
  ({ children, title, id, style }, ref) => {
    return (
      <div className="modal fade" id={id} style={style} ref={ref}>
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="group-modal-label">
                {title}
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            {children}
            {/* <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>
            </div> */}
          </div>
        </div>
      </div>
    );
  }
);

CustomModal.displayName = "CustomModal"; // Set a display name for the component

export default CustomModal;
