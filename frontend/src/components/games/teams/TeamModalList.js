import React from 'react'
import TeamModalUser from './TeamModalUser'
import { ListGroup } from 'react-bootstrap'
import '../../scrollbar.css'

/*******************************************************************************
 * TeamModalList Component
 * Container for the list of users on each team
 *******************************************************************************/

function TeamModalList({
  otherUsers,
  team1,
  team2,
  setTeam1Users,
  setTeam2Users,
  setNoTeamUsers,
  currentTeam,
  game,
}) {
  const scrollContainerStyle = { width: '470px', maxHeight: '200px' }
  return (
    <div>
      <ListGroup
        className='scrollbar scrollbar-primary  mx-auto'
        style={scrollContainerStyle}
      >
        {/* First, list all users who do not belong to any team */}
        {otherUsers.map((user) => (
          <ListGroup.Item key={user.id}>
            <TeamModalUser
              user={user}
              otherUsers={otherUsers}
              setTeam1Users={setTeam1Users}
              setTeam2Users={setTeam2Users}
              setNoTeamUsers={setNoTeamUsers}
              currentTeam={currentTeam}
              game={game}
              team={'none'}
            />
          </ListGroup.Item>
        ))}
        {/* Second, list all users on team 1*/}
        {team1.users.map((user) => (
          <ListGroup.Item key={user.id}>
            <TeamModalUser
              user={user}
              otherUsers={otherUsers}
              setTeam1Users={setTeam1Users}
              setTeam2Users={setTeam2Users}
              setNoTeamUsers={setNoTeamUsers}
              currentTeam={currentTeam}
              game={game}
              team={'team1'}
            />
          </ListGroup.Item>
        ))}
        {/* Last, list all users on team 2*/}
        {team2.users.map((user) => (
          <ListGroup.Item key={user.id}>
            <TeamModalUser
              user={user}
              otherUsers={otherUsers}
              setTeam1Users={setTeam1Users}
              setTeam2Users={setTeam2Users}
              setNoTeamUsers={setNoTeamUsers}
              currentTeam={currentTeam}
              game={game}
              team={'team2'}
            />
          </ListGroup.Item>
        ))}
      </ListGroup>
    </div>
  )
}

export default TeamModalList
