import React, { useState } from 'react'
import { InputGroup, ListGroup, Image } from 'react-bootstrap'
import { MDBContainer } from 'mdbreact'
import './scrollbar.css'
import { baseURL } from '../axios'
import classes from './SportList.module.css'

/************************************************************************************
 * SportList Component
 * Container component with a list of all invites a user has received inside UserInfo
 ************************************************************************************/

function SportList({ updateSports, sports, createOpenGame }) {
  const scrollContainerStyle = { width: '350px', maxHeight: '200px' }
  const sportList = [
    'Badminton',
    'Baseball',
    'Basketball',
    'Curling',
    'Football',
    'Hockey',
    'Lacrosse',
    'Soccer',
    'Tennis',
    'Volleyball',
  ]
  const [selectedCheckbox, setSelectedCheckbox] = useState('')
  function handleCheckbox(sport) {
    let newSportsList = sports
    if (!sports.includes(sport)) {
      newSportsList.push(sport)
    } else {
      newSportsList.splice(newSportsList.indexOf(sport), 1)
    }
    updateSports(newSportsList)
  }

  const handleOpenCheckbox = (sport) => {
    if (selectedCheckbox === sport) {
      setSelectedCheckbox('')
      updateSports('')
    } else {
      setSelectedCheckbox(sport)
      updateSports(sport)
    }
  }

  return (
    <div>
      {createOpenGame ? (
        <MDBContainer>
          <ListGroup
            className='scrollbar scrollbar-primary mx-auto'
            style={scrollContainerStyle}
          >
            {sportList.map((sport) => (
              <ListGroup.Item key={sport} style={{ height: '50px' }}>
                <InputGroup className={classes.InputGroup}>
                  <InputGroup.Prepend>
                    <Image
                      src={`${baseURL}/uploads/${sport}.png`}
                      className={classes.SportIcon}
                    />
                  </InputGroup.Prepend>
                  <InputGroup.Text className={classes.Input}>
                    {sport}
                  </InputGroup.Text>
                  <InputGroup.Append>
                    {selectedCheckbox === sport ? (
                      <input
                        type='checkbox'
                        className={classes.Checkbox}
                        onChange={() => handleOpenCheckbox(sport)}
                        checked={true}
                      />
                    ) : (
                      <input
                        type='checkbox'
                        className={classes.Checkbox}
                        onChange={() => handleOpenCheckbox(sport)}
                        checked={false}
                      />
                    )}
                  </InputGroup.Append>
                </InputGroup>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </MDBContainer>
      ) : (
        <MDBContainer>
          <ListGroup
            className='scrollbar scrollbar-primary mx-auto'
            style={scrollContainerStyle}
          >
            {sportList.map((sport) => (
              <ListGroup.Item key={sport} style={{ height: '50px' }}>
                <InputGroup className={classes.InputGroup}>
                  <InputGroup.Prepend>
                    <Image
                      src={`${baseURL}/uploads/${sport}.png`}
                      className={classes.SportIcon}
                    />
                  </InputGroup.Prepend>
                  <InputGroup.Text className={classes.Input}>
                    {sport}
                  </InputGroup.Text>
                  <InputGroup.Append>
                    {sports.includes(sport) ? (
                      <input
                        type='checkbox'
                        className={classes.Checkbox}
                        onClick={() => handleCheckbox(sport)}
                        defaultChecked
                      />
                    ) : (
                      <input
                        type='checkbox'
                        className={classes.Checkbox}
                        onClick={() => handleCheckbox(sport)}
                      />
                    )}
                  </InputGroup.Append>
                </InputGroup>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </MDBContainer>
      )}
    </div>
  )
}

export default SportList
