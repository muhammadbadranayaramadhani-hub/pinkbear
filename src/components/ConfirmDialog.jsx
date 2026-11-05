import Modal from './Modal.jsx';

export default function ConfirmDialog({ title, message, confirmLabel, cancelLabel = 'Batal', onConfirm, onCancel, danger }) {
  return (
    <Modal
      title={title}
      onClose={onCancel}
      variant="center"
      className="dialog--confirm"
      footer={
        <div className="btn-row">
          <button type="button" className="btn btn--ghost" onClick={onCancel}>{cancelLabel}</button>
          <button type="button" className={`btn ${danger ? 'btn--danger' : 'btn--primary'}`} onClick={onConfirm}>{confirmLabel}</button>
        </div>
      }
    >
      <p className="confirm__msg">{message}</p>
    </Modal>
  );
}
