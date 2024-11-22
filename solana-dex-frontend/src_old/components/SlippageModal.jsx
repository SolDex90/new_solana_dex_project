import React from 'react';
import Modal from 'react-modal';
import '../styles/slippage.css';

Modal.setAppElement('#root'); // Adjust the selector if your app root element is different

const SlippageModal = ({ isOpen, onRequestClose, slippage, setSlippage }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Slippage Tolerance"
      className="modal"
      overlayClassName="overlay"
    >
      <h4>Slippage Tolerance</h4>
      <div className="slippage-options">
        {[0.1, 0.5, 1].map((value) => (
          <button
            key={value}
            className={`slippage-option ${slippage === value ? 'selected' : ''}`}
            onClick={() => setSlippage(value)}
          >
            {value}%
          </button>
        ))}
        <div className="custom-slippage">
          <label>Custom</label>
          <input
            type="number"
            value={slippage}
            onChange={(e) => setSlippage(parseFloat(e.target.value))}
            className="custom-slippage-input"
          />
          <span>%</span>
        </div>
      </div>
      <button onClick={onRequestClose} className="save-button">Save</button>
    </Modal>
  );
};

export default SlippageModal;
