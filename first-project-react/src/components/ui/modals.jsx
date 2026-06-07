"use client";

import React, { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import { Button } from "@/components/ui/buttons";

// Manajemen state eksternal untuk trigger dari luar komponen
const modalRegistry = {
  setState: null,
  changeState(data) {
    if (this.setState) {
      this.setState((prevData) => ({ ...prevData, ...data }));
    }
  },
};

// Fungsi internal untuk menutup modal
const handleClose = () => {
  modalRegistry.changeState({ open: false });
};

const Modals = () => {
  const [data, setData] = useState({
    open: false,
    header: "ini header",
    message: "ini message",
    size: "md",
    footer: null,
    onClose: handleClose,
    closable: true,
  });

  // Daftarkan setter state ke registry eksternal setelah komponen mount
  useEffect(() => {
    modalRegistry.setState = setData;
    return () => {
      modalRegistry.setState = null; // Cleanup saat unmount
    };
  }, []);

  const styles = `
    .modal-backdrop-dark {
      opacity: 0.8 !important;
      background-color: #000;
    }
  `;

  // Tentukan fungsi penutup yang aman
  const activeCloseAction = data.closable
    ? data.onClose || handleClose
    : undefined;

  return (
    <>
      <style>{styles}</style>
      <Modal
        show={data.open}
        onHide={activeCloseAction}
        size={data.size}
        backdrop={data.closable ? "static" : true}
        keyboard={data.closable}
        centered
      >
        {/* HEADER */}
        {data.header && (
          <Modal.Header>
            <h5 className="modal-title">{data.header}</h5>
            {data.closable && (
              <button
                type="button"
                onClick={activeCloseAction}
                className="btn-close"
                aria-label="Close"
              ></button>
            )}
          </Modal.Header>
        )}

        {/* BODY */}
        <Modal.Body className="position-relative">
          {!data.header && data.closable && (
            <button
              onClick={activeCloseAction}
              className="btn btn-sm btn-light btn-icon rounded-circle position-absolute end-0 top-0 m-2"
              style={{ zIndex: 10 }}
            >
              <i className="bi bi-x-lg"></i>
            </button>
          )}
          <div>{data.message}</div>
        </Modal.Body>

        {/* FOOTER */}
        {data.footer && (
          <Modal.Footer>
            {data.closable && (
              <Button
                variant="secondary"
                outline
                className="px-4 btn-sm"
                onClick={activeCloseAction}
              >
                Cancel
              </Button>
            )}
            {data.footer}
          </Modal.Footer>
        )}
      </Modal>
    </>
  );
};

const openModal = ({
  open = true,
  message = "",
  header = "",
  size = "md",
  footer = null,
  onClose = () => {},
  closable = true,
}) => {
  if (!open) {
    handleClose();
    return;
  }

  modalRegistry.changeState({
    open,
    message,
    header,
    size,
    footer,
    closable,
    onClose: () => {
      onClose(); // Jalankan callback custom jika ada
      handleClose(); // Tutup modalnya
    },
  });
};

export default Modals;
export { openModal };
