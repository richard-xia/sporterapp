import React from 'react'
import axios from '../axios'
import { Form } from 'react-bootstrap'

/***********************************************************************************
 * UploadImage Component
 * Component for changing the picture of the Group, Game, Team or User
 **********************************************************************************/

const UploadImage = ({ onUploadImage }) => {
  const uploadFileHandler = async (e) => {
    const file = e.target.files[0]
    const formData = new FormData()
    formData.append('image', file)
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
    const { data } = await axios.post('/api/v1/upload', formData, config)
    const imagePath = data.split('\\')[2]
    onUploadImage(imagePath)
  }

  return (
    <>
      <Form.File
        id='image-file'
        label='Choose File'
        custom
        onChange={uploadFileHandler}
      ></Form.File>
    </>
  )
}

export default UploadImage
