import React from 'react'
import { Image } from 'react-bootstrap'
import classes from './Group.module.css'
import { baseURL } from '../../axios'
import { LinkContainer } from 'react-router-bootstrap'

/*******************************************************************************
 * Group Component
 * Displays the photo and name of a group with a link to the group provided
 *******************************************************************************/

const Group = ({ group, disableHover }) => {
  return (
    <div>
      {/* Create a group that does not redirect the user when clicking on the name */}
      {disableHover ? (
        <div>
          <Image
            src={`${baseURL}/uploads/${group.photo}`}
            className={classes.groupIconDisableHover}
          />
          <p className={classes.groupNameDisableHover}>{group.name}</p>
        </div>
      ) : (
        <div>
          {/* Create a group that redirects the user when clicking on the name */}
          <LinkContainer to={`/api/v1/groups/${group._id}`}>
            <div>
              <Image
                src={`${baseURL}/uploads/${group.photo}`}
                className={classes.groupIcon}
              />
              <p className={classes.groupName}>{group.name}</p>
            </div>
          </LinkContainer>
        </div>
      )}
      {/* Add the icon of sports to the end of the box */}
      {group.sports.map((sport) => (
        <Image
          src={`${baseURL}/uploads/${sport}.png`}
          className={classes.sportsIcon}
        />
      ))}
    </div>
  )
}

export default Group
