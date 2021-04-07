const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/async')

const User = require('../models/userModel')
const Group = require('../models/groupModel')
const Game = require('../models/gameModel')

// @desc      Get the email of all users
// @route     GET /api/v1/users/all
// @access    Public
exports.getAllUserEmails = asyncHandler(async (req, res, next) => {
  const users = await User.find()
  let userEmails = []
  users.map((user) => {
    userEmails.push(user.email)
  })
  return res.status(200).json({ success: true, data: userEmails })
})

// ***************************************
// Methods for accepting and denying group/game invites
// Includes: acceptGroupInvite, denyGroupInvite, acceptGameInvite, denyGameInvite
// ***************************************

// @desc      Accept the group invite for the logged in user
// @route     PUT /api/v1/users/groups/invite/:id
// @access    Private
exports.acceptGroupInvite = asyncHandler(async (req, res, next) => {
  //Error checking
  const user = await User.findById(req.user.id)

  const invite = await user.groupInvites.find(
    (groupInvite) => groupInvite.id === req.params.id
  )

  if (!invite) {
    return next(new ErrorResponse(`Group invite not found`, 404))
  }

  // Add the user to the group and remove any request the user might have made
  Group.findOne({
    _id: invite.group,
  }).then((group) => {
    group.users.push({
      _id: req.user.id,
    })
    const request = group.requests.find(
      (groupRequest) => groupRequest.user == req.user.id
    )
    if (request) {
      group.requests.splice(group.requests.indexOf(request), 1)
    }
    group.save()
  })

  // Add the group to the user's list of groups
  await user.groups.push({
    _id: invite.group,
  })

  // Remove the invite from the user's list of invites
  user.groupInvites.splice(user.groupInvites.indexOf(invite), 1)
  await user.save()

  //Add name and photo to groups
  let userGroupIds = []
  user.groups.map((group) => {
    userGroupIds.push(group._id)
  })
  const userGroups = await Group.find({ _id: { $in: userGroupIds } })
  userGroups.map((userGroup) => {
    user.groups.map((group) => {
      if (userGroup.id == group.id) {
        group.photo = userGroup.photo
        group.name = userGroup.name
      }
    })
  })

  return res.status(200).json({
    success: true,
    data: user.groups,
  })
})

// @desc      Deny the group invite for the logged in user
// @route     DELETE /api/v1/users/groups/invite/:id
// @access    Private
exports.denyGroupInvite = asyncHandler(async (req, res, next) => {
  //Error checking
  const user = await User.findById(req.user.id)

  const invite = await user.groupInvites.find(
    (groupInvite) => groupInvite.id === req.params.id
  )

  if (!invite) {
    return next(new ErrorResponse(`Group invite not found`, 404))
  }

  // Remove the invite from the user's list of invites
  user.groupInvites.splice(user.groupInvites.indexOf(invite), 1)

  await user.save()
  return res.status(200).json({
    success: true,
  })
})

// @desc      Accept the game invite for the logged in user
// @route     PUT /api/v1/users/games/invite/:id
// @access    Private
exports.acceptGameInvite = asyncHandler(async (req, res, next) => {
  //Error checking
  const user = await User.findById(req.user.id)
  const invite = await user.gameInvites.find(
    (gameInvite) => gameInvite.id === req.params.id
  )
  if (!invite) {
    return next(new ErrorResponse(`Game invite not found`, 404))
  }

  // Add the user to the game and remove any request the user might have made
  Game.findOne({
    _id: invite.game,
  })
    .then((game) => {
      game.users.push({
        _id: req.user.id,
      })
      const request = game.requests.find(
        (gameRequest) => gameRequest.user == req.user.id
      )
      if (request) {
        game.requests.splice(game.requests.indexOf(request), 1)
      }
      game.save()
    })
    .catch((e) => {
      // error
    })

  // Add the game to the user's list of games
  await user.games.push({
    _id: invite.game,
  })

  // Remove the invite from the user's list of game invites
  user.gameInvites.splice(user.gameInvites.indexOf(invite), 1)
  await user.save()

  //Add name and photo to games
  let userGameIds = []
  user.games.map((game) => {
    userGameIds.push(game._id)
  })
  const userGames = await Game.find({ _id: { $in: userGameIds } })
  userGames.map((userGame) => {
    user.games.map((game) => {
      if (userGame.id == game.id) {
        game.photo = userGame.photo
        game.title = userGame.title
      }
    })
  })

  return res.status(200).json({
    success: true,
    data: user.games,
  })
})

// @desc      Deny the game invite for the logged in user
// @route     DELETE /api/v1/users/games/invite/:id
// @access    Private
exports.denyGameInvite = asyncHandler(async (req, res, next) => {
  //Check if the invite exists and remove the invite
  const user = await User.findById(req.user.id)

  const invite = await user.gameInvites.find(
    (gameInvite) => gameInvite.id === req.params.id
  )

  if (!invite) {
    return next(new ErrorResponse(`Game invite not found`, 404))
  }

  user.gameInvites.splice(user.gameInvites.indexOf(invite), 1)

  await user.save()
  return res.status(200).json({
    success: true,
  })
})

// @desc      Get the information of the user specified
// @route     GET /api/v1/users/:id
// @access    Private
exports.getUser = asyncHandler(async (req, res, next) => {
  //Check if the user exists
  const user = await User.findById(req.params.id)
  if (!user) {
    return next(new ErrorResponse(`User not found`, 404))
  }

  // If the profile is another user then only display private groups they have in common
  const publicGroups = await Group.find({
    users: { $elemMatch: { _id: user._id } },
    private: false,
  })
  const privateGroups = await Group.find({
    private: true,
    $and: [
      { users: { $elemMatch: { _id: user._id } } },
      { users: { $elemMatch: { _id: req.user.id } } },
    ],
  })

  let groups = []
  publicGroups.map((group) => {
    groups.push(group)
  })
  privateGroups.map((group) => {
    groups.push(group)
  })

  // If the profile is another user then only display private games they have in common
  const publicGames = await Game.find({
    users: { $elemMatch: { _id: user._id } },
    private: false,
  })
  const privateGames = await Game.find({
    private: true,
    $and: [
      { users: { $elemMatch: { _id: user._id } } },
      { users: { $elemMatch: { _id: req.user.id } } },
    ],
  })

  let games = []
  publicGames.map((game) => {
    games.push(game)
  })
  privateGames.map((game) => {
    games.push(game)
  })

  //Set the name and photo of group invites
  let userGroupInvites = []
  user.groupInvites.map((invite) => {
    userGroupInvites.push(invite.group)
  })
  const inviteGroups = await Group.find({
    _id: { $in: userGroupInvites },
  })
  user.groupInvites.map((invite) => {
    inviteGroups.map((inviteGroup) => {
      if (inviteGroup.id == invite.group) {
        invite.name = inviteGroup.name
        invite.photo = inviteGroup.photo
      }
    })
  })

  //Set the title and photo of game invites
  let userGameInvites = []
  user.gameInvites.map((invite) => {
    userGameInvites.push(invite.game)
  })
  const inviteGames = await Game.find({
    _id: { $in: userGameInvites },
  })
  user.gameInvites.map((invite) => {
    inviteGames.map((inviteGame) => {
      if (inviteGame.id == invite.game) {
        invite.title = inviteGame.title
        invite.photo = inviteGame.photo
      }
    })
  })

  let isCurrentUser = false
  if (req.user.id === req.params.id) {
    isCurrentUser = true
  }

  // Return all of the following data to the frontend
  const userInfo = {
    _id: user._id,
    name: user.name,
    description: user.description,
    photo: user.photo,
    groupInvites: user.groupInvites,
    gameInvites: user.gameInvites,
    private: user.private,
    groups: groups,
    games: games,
    isCurrentUser: isCurrentUser,
  }

  return res.status(200).json({
    success: true,
    data: userInfo,
  })
})

// @desc      Update the user
// @route     PUT /api/v1/users/:id
// @access    Private
exports.updateUser = asyncHandler(async (req, res, next) => {
  // Check if the user exists and update their information with the req.body
  let user = await User.findById(req.params.id)
  if (!user) {
    new ErrorResponse(`User not found with id of ${req.params.id}`, 404)
  }

  user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  })

  res.status(200).json({ success: true, data: user })
})

// @desc      Remove the user from the group
// @route     PUT /api/v1/users/leaveGroup/:id
// @access    Private
exports.leaveGroup = asyncHandler(async (req, res, next) => {
  // Error checking
  const user = await User.findById(req.user.id)
  const group = await Group.findById(req.params.id)
  if (!user) {
    return next(new ErrorResponse(`User not found`, 404))
  }
  const userGroup = user.groups.find(
    (findGroup) => findGroup.id == req.params.id
  )
  if (!userGroup) {
    return next(new ErrorResponse(`User is not part of the group`, 404))
  }

  //Remove all games from the user's array of games
  const games = []
  group.groupGames.map((groupGame) => games.push(groupGame.id))
  for (var i = 0; i < games.length; i++) {
    const curGame = user.games.find((thisGame) => thisGame.id == games[i])
    user.games.splice(user.games.indexOf(curGame), 1)
  }

  //Remove user from all games and teams
  const userGames = await Game.find({
    users: { $elemMatch: { _id: req.user.id } },
  })
  userGames.map((game) => {
    game.team1.users.map((user) => {
      if (user.id === req.user.id) {
        game.team1.users.splice(game.team1.users.indexOf(user), 1)
      }
    })
    game.team2.users.map((user) => {
      if (user.id === req.user.id) {
        game.team2.users.splice(game.team2.users.indexOf(user), 1)
      }
    })
    game.users.map((user) => {
      if (user.id === req.user.id) {
        game.users.splice(game.users.indexOf(user), 1)
      }
    })
    game.save()
  })

  //Remove the user from the group and the group from the user
  const groupUser = group.users.find((findUser) => findUser.id == req.user.id)
  user.groups.splice(user.groups.indexOf(userGroup), 1)
  group.users.splice(group.users.indexOf(groupUser), 1)
  await user.save()
  await group.save()
  return res.status(200).json({
    success: true,
  })
})

// @desc      Remove a user from the game
// @route     PUT /api/v1/users/leaveGame/:id
// @access    Private
exports.leaveGame = asyncHandler(async (req, res, next) => {
  // Error Checking
  const user = await User.findById(req.user.id)
  const game = await Game.findById(req.params.id)
  if (!user) {
    return next(new ErrorResponse(`User not found`, 404))
  }
  const userGame = user.games.find((findGame) => findGame.id == req.params.id)
  if (!userGame) {
    return next(new ErrorResponse(`User is not part of the game`, 404))
  }
  const gameUser = game.users.find((findUser) => findUser.id == req.user.id)

  //Remove user from team
  game.team1.users.map((user) => {
    if (user.id === req.user.id) {
      game.team1.users.splice(game.team1.users.indexOf(user), 1)
    }
  })
  game.team2.users.map((user) => {
    if (user.id === req.user.id) {
      game.team2.users.splice(game.team2.users.indexOf(user), 1)
    }
  })

  //Remove user from game and game from user
  user.games.splice(user.games.indexOf(userGame), 1)
  game.users.splice(game.users.indexOf(gameUser), 1)
  await user.save()
  await game.save()
  return res.status(200).json({
    success: true,
  })
})

// @desc      Return all data on the dashboard according to the current user's information
// @route     GET /api/v1/users/getDashboard
// @access    Private
exports.getDashboard = asyncHandler(async (req, res, next) => {
  const user = await User.findById({ _id: req.user.id })

  //Find and set user groups and games
  const groups = await Group.find({
    users: { $elemMatch: { _id: req.user.id } },
  })

  const games = await Game.find({
    users: { $elemMatch: { _id: req.user.id } },
  })

  user.groups = groups
  user.games = games

  //Find and set all groups the user is creator
  const myGroups = await Group.find({
    users: { $elemMatch: { _id: req.user.id, role: 'creator' } },
  })

  //Find current games and finished games
  let currentGames = []
  let finishedGames = []
  games.map((game) => {
    if (game.winner === 'team1' || game.winner === 'team2') {
      finishedGames.push(game)
    } else {
      currentGames.push(game)
    }
  })

  // Find all groups and games for the dashboard map
  const findGroups = await Group.find({
    users: { $not: { $elemMatch: { _id: req.user.id } } },
    private: false,
  })

  const findGames = await Game.find({
    users: { $not: { $elemMatch: { _id: req.user.id } } },
    winner: { $exists: false },
    private: false,
  })

  res.status(200).json({
    success: true,
    data: {
      user: user,
      myGroups: myGroups,
      currentGames: currentGames,
      finishedGames: finishedGames,
      findGroups: findGroups,
      findGames: findGames,
    },
  })
})

// @desc      Return all data in the search bar according to the current user's information
// @route     GET /api/v1/users/getSearch
// @access    Private
exports.getSearch = asyncHandler(async (req, res, next) => {
  //Set current user
  const user = await User.findById({ _id: req.user.id })

  //Set all groups of current user
  const groups = await Group.find({
    users: { $elemMatch: { _id: req.user.id } },
  })
  user.groups = groups

  //Set all games of current user
  const games = await Game.find({
    users: { $elemMatch: { _id: req.user.id } },
  })
  user.games = games

  //Set all find groups (public groups user does not belong to)
  const findGroups = await Group.find({
    users: { $not: { $elemMatch: { _id: req.user.id } } },
    private: false,
  })

  //Set all find games (public current games user does not belong to)
  const findGames = await Game.find({
    users: { $not: { $elemMatch: { _id: req.user.id } } },
    winner: { $exists: false },
    private: false,
  })

  //Set all users that belong to same groups as the current user
  let userGroups = []
  user.groups.map((group) => {
    userGroups.push(group._id)
  })
  let groupUsers = await User.find({
    groups: { $elemMatch: { _id: { $in: userGroups } } },
  })
  const curUser = groupUsers.find((user) => user.id === req.user.id)
  groupUsers.splice(groupUsers.indexOf(curUser), 1)

  //Set all users that do not belong to any groups of the current user
  const otherUsers = await User.find({
    groups: { $not: { $elemMatch: { _id: { $in: userGroups } } } },
    private: false,
  })

  res.status(200).json({
    success: true,
    data: {
      user: user,
      findGroups: findGroups,
      findGames: findGames,
      groupUsers: groupUsers,
      otherUsers: otherUsers,
    },
  })
})

// @desc      Get all groups the current user can be invited to inside the inviteGroupModal
// @route     GET /api/v1/users/:id/groupInvites
// @access    Private
exports.getGroupInvites = asyncHandler(async (req, res, next) => {
  const inviteUser = await User.findById({ _id: req.params.id })

  // Find all groups which the current user has permission to invite others
  const groups = await Group.find({
    $and: [
      { users: { $elemMatch: { _id: req.user.id, role: 'inviteUsers' } } },
      { users: { $not: { $elemMatch: { _id: req.params.id } } } },
    ],
  })

  // Check if the user has already been invited to the group
  let alreadyInvitedGroups = []
  inviteUser.groupInvites.map((groupInvite) => {
    groups.map((group) => {
      if (groupInvite.group == group.id) {
        alreadyInvitedGroups.push(group)
        groups.splice(groups.indexOf(group), 1)
      }
    })
  })

  res.status(200).json({
    success: true,
    data: { groups: groups, alreadyInvitedGroups: alreadyInvitedGroups },
  })
})

// @desc      Get all games the current user can be invited to inside the inviteGameModal
// @route     GET /api/v1/users/:id/gameInvites
// @access    Private
exports.getGameInvites = asyncHandler(async (req, res, next) => {
  const inviteUser = await User.findById({ _id: req.params.id })

  // Find all games where the current user has permission to invite
  const games = await Game.find({
    $and: [
      { users: { $elemMatch: { _id: req.user.id, role: 'inviteUsers' } } },
      { users: { $not: { $elemMatch: { _id: req.params.id } } } },
    ],
  })

  //Check if the user being invited is part of the group unless the game is open
  const inviteUserGroups = []
  inviteUser.groups.map((group) => {
    inviteUserGroups.push(group.id)
  })

  let inviteGames = []

  games.map((game) => {
    if (game.open) {
      inviteGames.push(game)
    }
    inviteUserGroups.map((group) => {
      if (game.group._id == group) {
        inviteGames.push(game)
      }
    })
  })

  //Remove already invited games
  let alreadyInvitedGames = []
  inviteUser.gameInvites.map((gameInvite) => {
    inviteGames.map((game) => {
      if (gameInvite.game == game.id) {
        alreadyInvitedGames.push(game)
        inviteGames.splice(inviteGames.indexOf(game), 1)
      }
    })
  })

  res.status(200).json({
    success: true,
    data: { games: inviteGames, alreadyInvitedGames: alreadyInvitedGames },
  })
})
