const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/async')

const Group = require('../models/groupModel')
const Game = require('../models/gameModel')
const User = require('../models/userModel')

// ***************************************
// CRUD methods for Groups
// Includes: getGroupInfo, updateGroup, deleteGroup, createGame
// ***************************************

// @desc      Get single group
// @route     GET /api/v1/groups/getGroupInfo/:id
// @access    Private
exports.getGroupInfo = asyncHandler(async (req, res, next) => {
  const group = await Group.findById(req.params.id)
  const user = await User.findById(req.user.id)

  //Get all public games in the group the user belongs to
  const publicGames = await Game.find({
    group: { _id: group._id },
    private: false,
  })

  //Get all private games in the group the user belongs to
  const privateGames = await Game.find({
    group: { _id: group._id },
    users: { $elemMatch: { _id: req.user.id } },
    private: true,
  })

  //Push all public and private games into a single array
  let groupGames = []
  publicGames.map((game) => {
    groupGames.push(game)
  })
  privateGames.map((game) => {
    groupGames.push(game)
  })

  //Separate public and private games by current and finished
  let currentGames = []
  let finishedGames = []
  groupGames.map((game) => {
    if (game.winner === 'team1' || game.winner === 'team2') {
      finishedGames.push(game)
    } else {
      currentGames.push(game)
    }
  })

  //Find the user in the group and get their role
  const groupUser = group.users.find((groupUser) => groupUser.id == req.user.id)
  let role = ''
  if (groupUser) {
    role = groupUser.role
  }

  //Get all users that can be invited to the group
  //All users that share a group with the current user but not in the current group

  //Get all other groups that the user belongs to
  let userGroupIds = []
  user.groups.map((group) => {
    if (group.id !== req.params.id) {
      userGroupIds.push(group.id)
    }
  })
  const otherGroups = await Group.find({
    _id: { $in: userGroupIds },
  })

  //Get all users that belong to the current group
  let groupUsers = []
  group.users.map((groupUser) => {
    groupUsers.push(groupUser.id)
  })

  //Get all users who belong to other groups but not the current group
  let otherUsers = []
  otherGroups.map((group) => {
    group.users.map((groupUser) => {
      if (
        !otherUsers.includes(groupUser.id) &&
        !groupUsers.includes(groupUser.id)
      ) {
        otherUsers.push(groupUser.id)
      }
    })
  })

  //Return all users from other groups who have not been invited yet
  const inviteUsers = await User.find({
    _id: { $in: otherUsers },
    groupInvites: { $not: { $elemMatch: { group: req.params.id } } },
  })

  //Add name and photo to group users
  const groupUsersInfo = await User.find({ _id: { $in: groupUsers } })
  groupUsersInfo.map((groupUser) => {
    group.users.map((user) => {
      if (groupUser.id == user.id) {
        user.photo = groupUser.photo
        user.name = groupUser.name
      }
    })
  })

  //Add name and photo to request users
  let requestUserIds = []
  group.requests.map((request) => {
    requestUserIds.push(request.user)
  })
  const requestUsers = await User.find({ _id: { $in: requestUserIds } })
  requestUsers.map((requestUser) => {
    group.requests.map((request) => {
      if (requestUser.id == request.user) {
        request.photo = requestUser.photo
        request.name = requestUser.name
      }
    })
  })

  return res.status(200).json({
    success: true,
    data: {
      group: group,
      games: groupGames,
      currentGames: currentGames,
      finishedGames: finishedGames,
      user: user,
      role: role,
      inviteUsers: inviteUsers,
    },
  })
})

// @desc      Update the information of a group
// @route     PUT /api/v1/groups/:id
// @access    Protected
exports.updateGroup = asyncHandler(async (req, res, next) => {
  // Error checking
  let group = await Group.findById(req.params.id)
  if (!group) {
    new ErrorResponse(`Group not found with id of ${req.params.id}`, 404)
  }

  const reqUser = await group.users.find(
    (groupUser) => groupUser.id == req.user.id
  )
  if (!reqUser) {
    return next(
      new ErrorResponse(`User making the request is not part of the group`, 401)
    )
  }
  if (!reqUser.role.includes('creator')) {
    return next(
      new ErrorResponse('User must be a creator to update the group', 401)
    )
  }

  // Update the group information with the req.body
  group = await Group.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  })

  res.status(200).json({ success: true, data: group })
})

// @desc      Delete group
// @route     DELETE /api/v1/groups/:id
// @access    Protected
exports.deleteGroup = asyncHandler(async (req, res, next) => {
  // Error checking
  const group = await Group.findById(req.params.id)
  if (!group) {
    return next(
      new ErrorResponse(`Group not found with id of ${req.params.id}`, 404)
    )
  }

  const reqUser = await group.users.find(
    (groupUser) => groupUser.id == req.user.id
  )
  if (!reqUser) {
    return next(
      new ErrorResponse(`User making the request is not part of the group`, 404)
    )
  }
  if (!reqUser.role.includes('creator')) {
    return next(
      new ErrorResponse('User must be a creator to delete the group', 401)
    )
  }

  const users = await User.find({ groups: { _id: req.params.id } })
  const games = await Game.find({
    group: { _id: group._id },
  })

  //Remove all games and the group from the user's model
  users.map((user) => {
    user.games.map((userGame) => {
      games.map((groupGame) => {
        if (userGame._id == groupGame.id) {
          user.games.splice(user.games.indexOf(userGame), 1)
        }
      })
    })
    let deleteGroup = user.groups.find(
      (userGroup) => userGroup.id == req.params.id
    )
    user.groups.splice(user.groups.indexOf(deleteGroup), 1)
    user.save()
  })

  //Remove all group invites
  const inviteUsers = await User.find({
    groupInvites: { $elemMatch: { group: req.params.id } },
  })

  inviteUsers.map((user) => {
    user.groupInvites.map((invite) => {
      if (invite.group == req.params.id) {
        user.groupInvites.splice(user.groupInvites.indexOf(invite), 1)
      }
    })
    user.save()
  })

  //Delete all games and the group
  await Game.deleteMany({ group: { _id: group._id } })
  group.remove()

  res.status(200).json({ success: true, data: {} })
})

// @desc      Create a new group
// @route     POST /api/v1/groups/
// @access    Private
exports.createGroup = asyncHandler(async (req, res, next) => {
  //Create the group with the information in req.body and add the user to the group
  req.body.users = [
    {
      _id: req.user.id,
      role: ['creator', 'manageUsers', 'createGames', 'inviteUsers'],
    },
  ]
  const group = await Group.create(req.body)
  const user = await User.findById(req.user.id)
  await user.groups.push({
    _id: group.id,
  })
  await user.save()
  res.status(201).json({
    success: true,
    data: group,
  })
})

// ***************************************
// Additional methods for getting groups
// Includes: getGroupsWithCreateGamePermission
// ***************************************

// @desc      Get all groups where the current user has permission to create games
// @route     GET /api/v1/groups/createGames
// @access    Private
exports.getGroupsWithCreateGamePermission = asyncHandler(
  async (req, res, next) => {
    const groups = await Group.find({
      users: { $elemMatch: { _id: req.user.id, role: 'createGames' } },
    })
    res.status(200).json({ data: groups })
  }
)

// ***************************************
// Methods for modifying users
// Includes: deleteUser, changeUserRole (also a role method)
// ***************************************

// @desc      Remove a user from the group
// @route     DELETE /api/v1/groups/:groupId/users/:userId
// @access    Protected
exports.deleteUser = asyncHandler(async (req, res, next) => {
  // Error checking
  const group = await Group.findById(req.params.groupId)
  const user = await User.findById(req.params.userId)
  if (!group) {
    res.status(404)
    new ErrorResponse('Group not found', 404)
  }
  //Find user being deleted
  const deleteUser = await group.users.find(
    (groupUser) => groupUser.id == req.params.userId
  )

  if (!deleteUser) {
    new ErrorResponse('User not found', 404)
  }

  //Find user making the delete request
  const reqUser = await group.users.find(
    (groupUser) => groupUser.id == req.user.id
  )
  if (!reqUser) {
    return next(new ErrorResponse(`User is not part of the group`, 404))
  }

  if (
    !(reqUser.role.includes('creator') || reqUser.role.includes('manageUsers'))
  ) {
    return next(
      new ErrorResponse(
        'User must be a creator or have permission to delete a user',
        401
      )
    )
  }

  if (deleteUser.role.includes('creator')) {
    return next(new ErrorResponse(`Cannot delete creator`, 404))
  }
  if (
    !reqUser.role.includes('creator') &&
    deleteUser.role.includes('manageUsers')
  ) {
    return next(
      new ErrorResponse(
        `Only creator can delete a user with manageUsers permission`,
        404
      )
    )
  }

  //Remove all group games from the user's games
  const games = await Game.find({
    group: { _id: group._id },
  })
  games.map((groupGame) => {
    user.games.map((userGame) => {
      if (userGame.id == groupGame._id) {
        user.games.splice(user.games.indexOf(userGame), 1)
      }
    })
  })

  //Remove the user from all games and teams in the group
  games.map((game) => {
    game.users.map((gameUser) => {
      if (gameUser._id == req.params.userId) {
        game.users.splice(game.users.indexOf(gameUser), 1)
        let team1User = undefined
        let team2User = undefined
        team1User = game.team1.users.find(
          (teamUser) => teamUser.id == req.params.userId
        )
        team2User = game.team2.users.find(
          (teamUser) => teamUser.id == req.params.userId
        )
        if (team1User) {
          game.team1.users.splice(game.team1.users.indexOf(team1User), 1)
        }
        if (team2User) {
          game.team2.users.splice(game.team2.users.indexOf(team2User), 1)
        }
      }
    })
    game.save()
  })

  const userGroup = await user.groups.find(
    (userGroup) => userGroup.id == req.params.groupId
  )

  //Remove the user from the group and the group from the user
  group.users.splice(group.users.indexOf(deleteUser), 1)
  user.groups.splice(user.groups.indexOf(userGroup), 1)
  await group.save()
  await user.save()
  return res.status(200).json({
    success: true,
    data: group.users,
  })
})

// @desc      Change the role of a user in the group
// @route     GET /api/v1/groups/:groupId/users/:userId
// @access    Protected
exports.changeUserRole = asyncHandler(async (req, res, next) => {
  // Error checking
  const group = await Group.findById(req.params.groupId)
  const user = await User.findById(req.params.userId)
  if (!group) {
    res.status(404)
    new ErrorResponse('Group not found', 404)
  }
  if (!user) {
    return next(new ErrorResponse(`User not found`, 404))
  }

  const reqUser = await group.users.find(
    (groupUser) => groupUser.id === req.user.id
  )
  if (!reqUser) {
    return next(new ErrorResponse(`You are not part of the group`, 404))
  }

  if (
    !(reqUser.role.includes('creator') || reqUser.role.includes('manageUsers'))
  ) {
    return next(
      new ErrorResponse(
        'User must be a creator or have permission to change roles',
        401
      )
    )
  }

  // Change the user's role to the roles in req.body
  const changeUser = await group.users.find(
    (groupUser) => groupUser.id == req.params.userId
  )

  if (!changeUser) {
    return next(new ErrorResponse(`User is not part of the group`, 404))
  }
  changeUser.role = []
  req.body.role.map((eachRole) => changeUser.role.push(eachRole))
  group.save()
  return res.status(200).json({
    success: true,
    data: changeUser,
  })
})

// ***************************************
// Role methods for users in Group
// Includes: changeGroupType (not yet implemented)
// ***************************************

// @desc      Change the role of every user in the group
// @route     PUT /api/v1/groups/:id/role
// @access    Protected
exports.changeGroupType = asyncHandler(async (req, res, next) => {
  // Error checking
  const group = await Group.findById(req.params.id)
  if (!group) {
    res.status(404)
    new ErrorResponse('Group not found', 404)
  }

  const reqUser = await group.users.find(
    (groupUser) => groupUser.id == req.user.id
  )
  if (!reqUser) {
    return next(new ErrorResponse(`You are not part of the group`, 404))
  }

  if (
    !(reqUser.role.includes('creator') || reqUser.role.includes('manageUsers'))
  ) {
    return next(
      new ErrorResponse(
        'User must be a creator or have permission to change roles',
        401
      )
    )
  }

  //Add the role to all users who do not have the permission
  groupUsers = []
  group.users.map((eachUser) => groupUsers.push(eachUser))
  for (var i = 0; i < groupUsers.length; i++) {
    if (!groupUsers[i].role.includes(req.body.role)) {
      let user = await group.users.find(
        (groupUser) => groupUser.id === groupUsers[i].id
      )
      user.role.push(req.body.role)
    }
  }
  group.save()
  return res.status(200).json({
    success: true,
    data: group.users,
  })
})

// ***************************************
// Group Invite and Request methods
// Includes: inviteUser, requestToJoinGroup, acceptRequestToJoinGroup, denyRequestToJoinGroup
// ***************************************

// @desc      Invite a user to the group
// @route     POST /api/v1/groups/:groupId/invite/:userId
// @access    Protected
exports.inviteUser = asyncHandler(async (req, res, next) => {
  // Error checking
  const group = await Group.findById(req.params.groupId)
  const user = await User.findById(req.params.userId)
  if (!group) {
    return next(new ErrorResponse(`Group not found`, 404))
  }
  if (!user) {
    return next(new ErrorResponse(`User not found`, 404))
  }

  const reqUser = await group.users.find(
    (groupUser) => groupUser.id == req.user.id
  )
  if (!reqUser) {
    return next(new ErrorResponse(`User is not part of the group`, 404))
  }
  if (
    !(reqUser.role.includes('creator') || reqUser.role.includes('manageUsers'))
  ) {
    return next(
      new ErrorResponse(
        'User must be a creator or have permission to invite users',
        404
      )
    )
  }

  // Check if the user is already in the group or has already been invited
  const userExists = group.users.find((users) => users.id == req.params.userId)
  if (userExists) {
    return next(new ErrorResponse(`User already part of the group`, 401))
  }

  const requestExists = await user.groupInvites.find(
    (groupInvite) => groupInvite.group == req.params.groupId
  )
  if (requestExists) {
    return next(new ErrorResponse(`User has already been invited`, 401))
  }

  // Add the invite to the user
  await user.groupInvites.push({
    group: req.params.groupId,
    message: req.body.message,
  })
  await user.save()

  res.status(201).json({ data: user.groupInvites })
})

// @desc      Send a request to join the group
// @route     PSOT /api/v1/groups/:id/request
// @access    Private
exports.requestToJoinGroup = asyncHandler(async (req, res, next) => {
  // Error checking
  const group = await Group.findById(req.params.id)

  if (!group) {
    return next(new ErrorResponse(`Group not found`, 404))
  }

  // Check if the user is part of the group or has already made a request
  const reqUser = await User.findById(req.user.id)
  const userExists = group.users.find((users) => users.id == reqUser.id)

  if (userExists) {
    return next(new ErrorResponse(`User already part of the group`, 401))
  }

  const requestExists = await group.requests.find(
    (groupRequest) => groupRequest.user == req.user.id
  )
  if (requestExists) {
    return next(new ErrorResponse(`User already made request`, 401))
  }

  // Add the request to the user's requests
  await group.requests.push({
    user: req.user.id,
    message: req.body.message,
  })
  await group.save()

  res.status(201).json({ user: req.user.id, message: req.body.message })
})

// @desc      Accept a user's request to join the group
// @route     PUT /api/v1/groups/:groupId/request/:requestId
// @access    Protected
exports.acceptRequestToJoinGroup = asyncHandler(async (req, res, next) => {
  // Error checking
  const group = await Group.findById(req.params.groupId)
  if (!group) {
    return next(new ErrorResponse(`Group not found`, 404))
  }
  const reqUser = await group.users.find(
    (groupUser) => groupUser.id == req.user.id
  )
  if (!reqUser) {
    return next(new ErrorResponse(`User is not part of the group`, 404))
  }
  if (
    !(
      reqUser.role.includes('creator') ||
      reqUser.role.includes('manageUsers') ||
      reqUser.role.includes('manageRequests')
    )
  ) {
    return next(
      new ErrorResponse(
        'User must be a creator or have permission to manage requests',
        404
      )
    )
  }
  const request = group.requests.find(
    (groupRequest) => groupRequest.id === req.params.requestId
  )
  if (!request) {
    return next(new ErrorResponse(`Request not found`, 404))
  }

  // Remove the user's group invite if it exists
  const user = await User.findById(request.user)

  const invite = user.groupInvites.find(
    (groupInvite) => groupInvite.group == req.params.groupId
  )
  user.groupInvites.splice(user.groupInvites.indexOf(invite), 1)

  // Add the user to the group and remove their request
  await group.users.push({
    _id: request.user,
  })
  group.requests.splice(group.requests.indexOf(request), 1)
  await user.groups.push({
    _id: group.id,
  })

  // Add name and photo to group users
  let groupUserIds = []
  group.users.map((user) => {
    groupUserIds.push(user._id)
  })
  const groupUsers = await User.find({ _id: { $in: groupUserIds } })
  groupUsers.map((groupUser) => {
    group.users.map((user) => {
      if (groupUser.id == user.id) {
        user.photo = groupUser.photo
        user.name = groupUser.name
      }
    })
  })

  await user.save()
  await group.save()

  return res.status(200).json({
    success: true,
    data: group.users,
  })
})

// @desc      Deny a user's request to join the group
// @route     DELETE /api/v1/groups/:groupId/request/:requestId
// @access    Protected
exports.denyRequestToJoinGroup = asyncHandler(async (req, res, next) => {
  //Error checking
  const group = await Group.findById(req.params.groupId)

  if (!group) {
    return next(new ErrorResponse(`Group not found`, 404))
  }
  const reqUser = await group.users.find(
    (groupUser) => groupUser.id == req.user.id
  )
  if (!reqUser) {
    return next(new ErrorResponse(`User is not part of the group`, 404))
  }
  if (
    !(
      reqUser.role.includes('creator') ||
      reqUser.role.includes('manageUsers') ||
      reqUser.role.includes('manageRequests')
    )
  ) {
    return next(
      new ErrorResponse(
        'User must be a creator or have permission to manage requests',
        404
      )
    )
  }

  //Remove the user's request to join the group if it exists
  const request = group.requests.find(
    (groupRequest) => groupRequest.id === req.params.requestId
  )
  if (!request) {
    return next(new ErrorResponse(`Request not found`, 404))
  }
  group.requests.splice(group.requests.indexOf(request), 1)

  await group.save()
  return res.status(200).json({
    success: true,
    data: group.requests,
  })
})
