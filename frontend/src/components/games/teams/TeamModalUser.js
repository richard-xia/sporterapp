import React from 'react'
import { Button } from 'react-bootstrap'
import axios from '../../../axios'

/*******************************************************************************
 * TeamModalUser Component
 * Options for setting the current team of every user in the game
 *******************************************************************************/

const TeamModalUser = ({
  user,
  otherUsers,
  team,
  currentTeam,
  game,
  setTeam1Users,
  setTeam2Users,
  setNoTeamUsers,
}) => {
  //Add a user who does not belong to any team (otherUsers) to the current team
  const addUserToTeam = (user) => {
    const teamInfo = {
      user: user._id,
      team: currentTeam,
    }
    axios.put(`/api/v1/games/${game}/team`, teamInfo).then((res) => {
      let otherUsersTemp = otherUsers
      otherUsersTemp.splice(otherUsersTemp.indexOf(user), 1)
      if (currentTeam === 'team1') {
        setTeam1Users(res.data.data.team1)
      }
      if (currentTeam === 'team2') {
        setTeam2Users(res.data.data.team2)
      }
      setNoTeamUsers(otherUsersTemp)
    })
  }

  //Remove a user from the current team
  const removeUserFromTeam = (user) => {
    axios
      .delete(`/api/v1/games/${game}/team`, {
        data: { user: user._id },
      })
      .then((res) => {
        let otherUsersTemp = otherUsers
        otherUsersTemp.push(user)
        if (currentTeam === 'team1') {
          setTeam1Users(res.data.data.team1)
        }
        if (currentTeam === 'team2') {
          setTeam2Users(res.data.data.team2)
        }
        setNoTeamUsers(otherUsersTemp)
      })
  }

  //Change the team of the selected user
  const changeUserTeam = (user) => {
    const teamInfo = {
      user: user._id,
      team: currentTeam,
    }
    axios.put(`/api/v1/games/${game}/team`, teamInfo).then((res) => {
      setTeam1Users(res.data.data.team1)
      setTeam2Users(res.data.data.team2)
    })
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      <p>{user.name}</p>
      {currentTeam === 'team1' ? (
        <div>
          {team === 'none' ? (
            <Button
              onClick={() => addUserToTeam(user)}
              style={{ borderRadius: '5px' }}
              variant='info'
            >
              + Add User to Team
            </Button>
          ) : null}
          {team === 'team1' ? (
            <Button
              onClick={() => removeUserFromTeam(user)}
              style={{ borderRadius: '5px' }}
              variant='danger'
            >
              - Remove User From Team
            </Button>
          ) : null}
          {team === 'team2' ? (
            <Button
              onClick={() => changeUserTeam(user)}
              style={{ borderRadius: '5px' }}
              variant='dark'
            >
              Change teams
            </Button>
          ) : null}
        </div>
      ) : null}
      {currentTeam === 'team2' ? (
        <div>
          {team === 'none' ? (
            <Button
              onClick={() => addUserToTeam(user)}
              style={{ borderRadius: '5px' }}
              variant='success'
            >
              + Add User to Team
            </Button>
          ) : null}
          {team === 'team2' ? (
            <Button
              onClick={() => removeUserFromTeam(user)}
              style={{ borderRadius: '5px' }}
              variant='danger'
            >
              - Remove User From Team
            </Button>
          ) : null}
          {team === 'team1' ? (
            <Button
              onClick={() => changeUserTeam(user)}
              style={{ borderRadius: '5px' }}
              variant='dark'
            >
              Change teams
            </Button>
          ) : null}
        </div>
      ) : null}
    </div>
  )
}

export default TeamModalUser
