import React from 'react'
import { Image, Modal } from 'react-bootstrap'
import { baseURL } from '../axios'
import { LinkContainer } from 'react-router-bootstrap'
import classes from './ViewModal.module.css'

/****************************************************************************************
 * ViewModal Component
 * Additional modal component for viewing full request and invite messages
 ****************************************************************************************/

function ViewModal({
  showViewModal,
  closeViewModal,
  info,
  title,
  photo,
  id,
  type,
}) {
  return (
    <Modal show={showViewModal} onHide={closeViewModal}>
      <Modal.Header closeButton>
        <Modal.Title>
          <LinkContainer to={{ pathname: `/api/v1/${type}/${id}` }}>
            <div>
              <div className={classes.titlediv}>
                {type === 'invites' ? (
                  <Image
                    src={`${baseURL}/uploads/${photo}`}
                    className={classes.icon}
                  />
                ) : (
                  <Image
                    src={`${baseURL}/uploads/${photo}`}
                    className={classes.icon}
                    roundedCircle
                  />
                )}
                <label className={classes.title}>{title}</label>
              </div>
            </div>
          </LinkContainer>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div>
          <label>{info}</label>
        </div>
      </Modal.Body>
    </Modal>
  )
}

export default ViewModal
