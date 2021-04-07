import React, { useEffect, useState } from 'react'
import {
  Alert,
  Button,
  Image,
  Modal,
  InputGroup,
  FormControl,
} from 'react-bootstrap'
import axios, { baseURL } from '../../axios'
import { Redirect } from 'react-router'
import { ListGroup } from 'react-bootstrap'
import { MDBContainer } from 'mdbreact'
import Group from '../groups/Group'
import SportList from '../SportList'
import '../scrollbar.css'

/*******************************************************************************
 * CreateGameForm Component
 * Modal for creating a new game in the Dashboard or GroupInfo Component
 *******************************************************************************/

function CreateGameForm({ showGameModal, handleClose, group }) {
  const scrollContainerStyle = {
    width: '450px',
    maxHeight: '200px',
    marginTop: '10px',
  }

  //Contains the state of the name and description input
  const [state, setState] = useState({
    title: '',
    description: '',
  })
  const [gameId, setGameId] = useState('') //The gameId of the created game for redirecting the user
  const [submit, setSubmit] = useState(false) //Redirect the user when the game is created
  const [groups, setGroups] = useState([]) //Contains a list of groups the user can select to create the game inside
  const [selectedGroup, setSelectedGroup] = useState('') //Contains the id of the selected group
  const [selectedGroupPrivate, setSelectedGroupPrivate] = useState(false)
  const [selectedGroupCompetitive, setSelectedGroupCompetitive] = useState(true)
  const [openGame, setOpenGame] = useState(false) //Select whether the game should be open or group game
  const [privateGame, setPrivateGame] = useState(false) //Select whether the game should be private or public
  const [competitiveGame, setCompetitiveGame] = useState(true) //Select whether the game should be competitive
  const [error, setError] = useState('') //Contains the error message if the user provides an incorrect field
  const [selectedCheckbox, setSelectedCheckbox] = useState('')
  const [showPrivateInfo, setShowPrivateInfo] = useState(false)
  const [showCompetitiveInfo, setShowCompetitiveInfo] = useState(false)

  //Get all groups where the user has permission to createGames
  useEffect(() => {
    axios.get('/api/v1/groups/createGames').then((res) => {
      console.log(res.data.data)
      setGroups(res.data.data)
    })
    if (group) {
      setSelectedGroup(group._id)
    }
  }, [group])

  //Set the state of title and description
  const handleChange = (e) => {
    const { id, value } = e.target
    setState((prevState) => ({ ...prevState, [id]: value }))
  }

  //Handle changes to open game, private and competitive options
  const selectOpenGame = () => {
    setOpenGame(!openGame)
    setSelectedCheckbox('')
  }
  const handlePrivateChange = (e) => {
    setPrivateGame(e.target.checked)
  }
  const handleCompetitiveChange = (e) => {
    setCompetitiveGame(e.target.checked)
  }

  const handleCheckBox = (sport) => {
    if (selectedCheckbox === sport) {
      setSelectedCheckbox('')
    } else {
      setSelectedCheckbox(sport)
    }
  }

  function selectGroup(group) {
    setSelectedGroup(group._id)
    setSelectedGroupPrivate(group.private)
    setSelectedGroupCompetitive(group.competitive)
  }

  //Create the game with the information provided by the user
  const createGame = () => {
    if (!openGame) {
      const gameData = {
        title: state.title,
        description: state.description,
        group: selectedGroup,
        private: privateGame,
        competitive: competitiveGame,
        sport: selectedCheckbox,
      }
      if (selectedGroup === '') {
        setError('Please select a group')
      } else if (selectedCheckbox === '') {
        setError('Please select a sport')
      } else {
        axios
          .post(`/api/v1/games/${selectedGroup}`, gameData)
          .then((res) => {
            setGameId(res.data.data._id)
            setSubmit(true)
          })
          .catch((err) => {
            const error = err.response.data.error.split(': ')[2]
            setError(error)
          })
      }
    } else {
      const gameData = {
        title: state.title,
        description: state.description,
        sport: selectedCheckbox,
      }
      axios
        .post(`/api/v1/games/open`, gameData)
        .then((res) => {
          setGameId(res.data.data._id)
          setSubmit(true)
        })
        .catch((err) => {
          const error = err.response.data.error.split(': ')[2]
          setError(error)
        })
    }
  }

  return (
    <Modal show={showGameModal} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Create new game</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {/* Input for the game title */}
        {error === '' ? null : <Alert variant={'danger'}>{error}</Alert>}
        <label>Game Title</label>
        <InputGroup className='mb-3'>
          <FormControl
            onChange={handleChange}
            id='title'
            value={state.title}
            placeholder='(6 - 30 characters)'
          ></FormControl>
        </InputGroup>
        {/* Input for the game description */}
        <label>Game Description</label>
        <InputGroup className='mb-3'>
          <FormControl
            onChange={handleChange}
            id='description'
            value={state.description}
            placeholder='(optional)'
          ></FormControl>
        </InputGroup>
        {/* Only display the current group if the user creates game inside the GroupInfo component */}
        {group ? (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <label>Select a sport: </label>
            {group.sports.map((sport) => (
              <div style={{ display: 'flex', alignItems: 'center' }}>
                {selectedCheckbox === sport ? (
                  <input
                    type='checkbox'
                    onChange={() => handleCheckBox(sport)}
                    checked={true}
                    style={{ marginLeft: '10px' }}
                  />
                ) : (
                  <input
                    type='checkbox'
                    onChange={() => handleCheckBox(sport)}
                    checked={false}
                    style={{ marginLeft: '10px' }}
                  />
                )}
                <Image
                  src={`${baseURL}/uploads/${sport}.png`}
                  style={{ maxHeight: '30px', maxWidth: '30px' }}
                />
                <p style={{ marginTop: '12px' }}>{sport}</p>
              </div>
            ))}
          </div>
        ) : (
          <div>
            {/* Display a list of groups if the user creates game inside the Dashboard component */}
            {openGame ? (
              <div>
                <label>Select a sport: </label>
                <Button
                  style={{
                    float: 'right',
                    borderRadius: '5px',
                    marginBottom: '10px',
                  }}
                  onClick={() => selectOpenGame()}
                  variant='dark'
                >
                  Group Game
                </Button>
              </div>
            ) : (
              <div>
                <label>Group: </label>
                <Button
                  style={{
                    float: 'right',
                    borderRadius: '5px',
                    marginBottom: '10px',
                  }}
                  onClick={() => selectOpenGame()}
                  variant='dark'
                >
                  Open Game
                </Button>
              </div>
            )}
            {openGame ? (
              <SportList
                createOpenGame={true}
                updateSports={setSelectedCheckbox}
              />
            ) : (
              <div>
                <MDBContainer>
                  <ListGroup
                    className='scrollbar scrollbar-primary mx-auto'
                    style={scrollContainerStyle}
                  >
                    {groups.map((group) =>
                      selectedGroup === group._id ? (
                        <ListGroup.Item
                          style={{ backgroundColor: 'lightblue' }}
                          onClick={() => selectGroup(group)}
                          key={group._id}
                        >
                          <Group group={group} disableHover={true} />
                        </ListGroup.Item>
                      ) : (
                        <ListGroup.Item
                          style={{ backgroundColor: 'white' }}
                          onClick={() => selectGroup(group)}
                          key={group._id}
                        >
                          <Group group={group} disableHover={true} />
                        </ListGroup.Item>
                      )
                    )}
                    {groups.length < 1 ? (
                      <ListGroup.Item>
                        <p style={{ textAlign: 'center' }}>
                          You do not belong to any groups or do not have
                          permission to create games
                        </p>
                      </ListGroup.Item>
                    ) : null}
                  </ListGroup>
                </MDBContainer>
                {groups.map((group) =>
                  selectedGroup === group._id ? (
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      <label>Select a sport: </label>
                      {group.sports.map((sport) => (
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          {selectedCheckbox === sport ? (
                            <input
                              type='checkbox'
                              onChange={() => handleCheckBox(sport)}
                              checked={true}
                              style={{ marginLeft: '10px' }}
                            />
                          ) : (
                            <input
                              type='checkbox'
                              onChange={() => handleCheckBox(sport)}
                              checked={false}
                              style={{ marginLeft: '10px' }}
                            />
                          )}
                          <Image
                            src={`${baseURL}/uploads/${sport}.png`}
                            style={{ maxHeight: '30px', maxWidth: '30px' }}
                          />
                          <p style={{ marginTop: '12px' }}>{sport}</p>
                        </div>
                      ))}
                    </div>
                  ) : null
                )}
              </div>
            )}
          </div>
        )}
        {/* Checkboxes for selecting private and competitive games */}
        <InputGroup>
          {/* If the user creates a game inside GroupInfo disable the checkbox if the group is private */}
          {group ? (
            <InputGroup.Checkbox
              onChange={handlePrivateChange}
              defaultChecked={group.private}
              disabled={group.private}
            />
          ) : null}
          {/* If the user creates a game inside Dashboard disable the checkbox if the group is private */}
          {group === undefined && selectedGroupPrivate ? (
            <InputGroup.Checkbox
              onChange={handlePrivateChange}
              defaultChecked={true}
              disabled={true}
            />
          ) : null}
          {/* If the user creates a game inside Dashboard enable the checkbox if the group is not private */}
          {group === undefined && !selectedGroupPrivate ? (
            <InputGroup.Checkbox onChange={handlePrivateChange} />
          ) : null}
          <InputGroup.Prepend>
            <InputGroup.Text>Private</InputGroup.Text>
          </InputGroup.Prepend>
          <Image
            as={InputGroup.Append}
            src={`${baseURL}/uploads/question-circle-regular.svg`}
            style={{
              maxHeight: '25px',
              marginTop: '10px',
              marginLeft: '5px',
              color: 'blue',
              cursor: 'pointer',
            }}
            onClick={() => setShowPrivateInfo(!showPrivateInfo)}
          />
          {showPrivateInfo ? (
            <Alert variant='info'>
              Private games will not be shown in the group, map or search bar
            </Alert>
          ) : null}
        </InputGroup>
        <InputGroup>
          {/* If the user creates a game inside GroupInfo disable the checkbox if the group is not competitive */}
          {group ? (
            <InputGroup.Checkbox
              defaultChecked={true && group.competitive}
              disabled={!group.competitive}
              onChange={handleCompetitiveChange}
            />
          ) : null}
          {/* If the user creates a game inside Dashboard disable the checkbox if the selected group is not competitive */}
          {group === undefined && !selectedGroupCompetitive ? (
            <InputGroup.Checkbox
              defaultChecked={false}
              disabled={true}
              onChange={handleCompetitiveChange}
            />
          ) : null}
          {/* If the user creates a game inside Dashboard enable the checkbox if the group is competitive */}
          {group === undefined && selectedGroupCompetitive ? (
            <InputGroup.Checkbox
              defaultChecked={true}
              onChange={handleCompetitiveChange}
            />
          ) : null}
          <InputGroup.Append>
            <InputGroup.Text>Competitive</InputGroup.Text>
          </InputGroup.Append>
          <Image
            as={InputGroup.Append}
            src={`${baseURL}/uploads/question-circle-regular.svg`}
            style={{
              maxHeight: '25px',
              marginTop: '10px',
              marginLeft: '5px',
              color: 'blue',
              cursor: 'pointer',
            }}
            onClick={() => setShowCompetitiveInfo(!showCompetitiveInfo)}
          />
          {showCompetitiveInfo ? (
            <Alert variant='info'>
              Competitive games have teams and will update wins and losses when
              finished
            </Alert>
          ) : null}
        </InputGroup>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant='success'
          onClick={createGame}
          style={{ borderRadius: '5px' }}
        >
          Create Game
        </Button>
      </Modal.Footer>
      {submit ? <Redirect to={`/api/v1/games/${gameId}`} /> : null}
    </Modal>
  )
}

export default CreateGameForm
