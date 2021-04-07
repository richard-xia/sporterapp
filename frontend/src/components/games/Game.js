import React from 'react'
import { Image } from 'react-bootstrap'
import classes from './Game.module.css'
import { baseURL } from '../../axios'
import { LinkContainer } from 'react-router-bootstrap'

/*******************************************************************************
 * Game Component
 * Container with the game photo, title and redirects to the game when clicked
 *******************************************************************************/

const Game = ({ game, disableHover }) => {
  return (
    <div>
      {/* Game without redirecting the user by clicking on the name  */}
      {disableHover ? (
        <div>
          <Image
            src={`${baseURL}/uploads/${game.photo}`}
            className={classes.gameIconDisableHover}
          />
          <p className={classes.gameTitleDisableHover}>{game.title}</p>
          <Image
            src={`${baseURL}/uploads/${game.sport}.png`}
            className={classes.sportsIcon}
          />
        </div>
      ) : (
        <div>
          {/* Game that redirects the user by clicking on the name  */}
          <LinkContainer to={`/api/v1/games/${game._id}`}>
            <div>
              <Image
                src={`${baseURL}/uploads/${game.photo}`}
                className={classes.gameIcon}
              />
              <p className={classes.gameTitle}>{game.title}</p>
              <Image
                src={`${baseURL}/uploads/${game.sport}.png`}
                className={classes.sportsIcon}
              />
            </div>
          </LinkContainer>
        </div>
      )}
    </div>
  )
}

export default Game
