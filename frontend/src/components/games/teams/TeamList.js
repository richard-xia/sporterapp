import React, { useState, useEffect } from 'react'
import { Button, Card, Image } from 'react-bootstrap'
import { MDBContainer } from 'mdbreact'
import '../../scrollbar.css'
import TeamModal from './TeamModal'
import UserList from '../../users/UserList'
import { baseURL } from '../../../axios'

/*******************************************************************************
 * TeamList Component
 * Contains a list of users on each team in the GameInfo component
 *******************************************************************************/

function TeamList({
  otherUsers,
  team1,
  team2,
  game,
  setTeam1Users,
  setTeam2Users,
  setNoTeamUsers,
  winner,
  role,
  onTeamUpdate,
}) {
  //Set the background of the winning team to light green if a winner is declared
  const [team1Color, setTeam1Color] = useState('white')
  const [team2Color, setTeam2Color] = useState('white')
  const [team1WinnerText, setTeam1WinnerText] = useState('')
  const [team2WinnerText, setTeam2WinnerText] = useState('')

  //Handles showing the modal when clicking on 'Edit team'
  const [showTeam1Modal, setShowTeam1Modal] = useState(false)
  const [showTeam2Modal, setShowTeam2Modal] = useState(false)
  const handleClose = () => {
    setShowTeam1Modal(false)
    setShowTeam2Modal(false)
  }

  //Checks if a winner is declared
  useEffect(() => {
    if (winner === 'team1') {
      setTeam1Color('lightgreen')
      setTeam2Color('#ffcccb')
      setTeam1WinnerText('Winner!')
    }
    if (winner === 'team2') {
      setTeam2Color('lightgreen')
      setTeam1Color('#ffcccb')
      setTeam2WinnerText('Winner!')
    }
  }, [winner])

  return (
    <div>
      <MDBContainer>
        {/* Team 1 List */}
        <div style={{ float: 'left' }}>
          <Card
            style={{
              marginTop: '5px',
              padding: '5px',
              backgroundColor: team1Color,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Image
                src={`${baseURL}/uploads/${team1.photo}`}
                style={{ maxHeight: '50px', maxWidth: '50px' }}
              />
              <p>{team1.name}</p>
              {!winner && role.includes('manageTeams') ? (
                <Button
                  onClick={() => setShowTeam1Modal(true)}
                  style={{ borderRadius: '5px' }}
                  variant='success'
                >
                  Edit team
                </Button>
              ) : (
                <div>
                  {winner === 'team1' ? (
                    <div>
                      <Image
                        src={`${baseURL}/uploads/trophy-solid.svg`}
                        style={{
                          height: '50px',
                          width: '50px',
                          color: 'yellow',
                        }}
                      />
                    </div>
                  ) : //
                  null}
                </div>
              )}
              <TeamModal
                otherUsers={otherUsers}
                team1={team1}
                team2={team2}
                setTeam1Users={setTeam1Users}
                setTeam2Users={setTeam2Users}
                setNoTeamUsers={setNoTeamUsers}
                currentTeam='team1'
                game={game}
                showModal={showTeam1Modal}
                handleClose={handleClose}
                onTeamUpdate={onTeamUpdate}
              />
            </div>
            <UserList users={team1.users} model={'teams'} role={''} />
          </Card>
        </div>

        {/* Team 2 List */}
        <div style={{ float: 'right' }}>
          <Card
            style={{
              marginTop: '5px',
              padding: '5px',
              backgroundColor: team2Color,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Image
                src={`${baseURL}/uploads/${team2.photo}`}
                style={{ maxHeight: '50px', maxWidth: '50px', float: 'left' }}
              />
              <p>{team2.name}</p>
              {!winner && role.includes('manageTeams') ? (
                <Button
                  style={{ float: 'right' }}
                  onClick={() => setShowTeam2Modal(true)}
                  style={{ borderRadius: '5px' }}
                  variant='success'
                >
                  Edit team
                </Button>
              ) : (
                <div>
                  {winner === 'team2' ? (
                    <div>
                      <Image
                        src={`${baseURL}/uploads/trophy-solid.svg`}
                        style={{
                          height: '50px',
                          width: '50px',
                          color: 'yellow',
                        }}
                      />
                    </div>
                  ) : //
                  null}
                </div>
              )}
              <TeamModal
                otherUsers={otherUsers}
                team1={team1}
                team2={team2}
                setTeam1Users={setTeam1Users}
                setTeam2Users={setTeam2Users}
                setNoTeamUsers={setNoTeamUsers}
                currentTeam='team2'
                game={game}
                showModal={showTeam2Modal}
                handleClose={handleClose}
                onTeamUpdate={onTeamUpdate}
              />
            </div>
            <UserList users={team2.users} model={'teams'} role={''} />
          </Card>
        </div>
      </MDBContainer>
    </div>
  )
}

export default TeamList
