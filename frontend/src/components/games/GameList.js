import React from 'react'
import Game from './Game'
import { ListGroup } from 'react-bootstrap'
import { MDBContainer } from 'mdbreact'
import '../scrollbar.css'

/*******************************************************************************
 * GameList Component
 * Container for displaying a list of games provided
 *******************************************************************************/

function GameList({ games }) {
  const scrollContainerStyle = {
    width: '470px',
    maxHeight: '200px',
  }
  return (
    <MDBContainer>
      <ListGroup
        className='scrollbar scrollbar-primary  mx-auto'
        style={scrollContainerStyle}
      >
        {games.map((game) => (
          <ListGroup.Item style={{ height: '65px' }} key={game._id}>
            <Game game={game} disableHover={false} />
          </ListGroup.Item>
        ))}
        {games.length < 1 ? (
          <ListGroup.Item style={{ height: '65px' }}>
            <p style={{ marginTop: '6px' }}>No games to display</p>
          </ListGroup.Item>
        ) : null}
      </ListGroup>
    </MDBContainer>
  )
}

export default GameList
