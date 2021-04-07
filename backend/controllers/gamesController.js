const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/async')

const Game = require('../models/gameModel')
const User = require('../models/userModel')
const Group = require('../models/groupModel')

// ***************************************
// CRUD methods for Games
// Includes: getGameInfo, updateGame, deleteGame, addOpenGame, addGame
// ***************************************

// @desc      Return all information in a single game
// @route     GET /api/v1/games/getGameInfo/:id
// @access    Private
exports.getGameInfo = asyncHandler(async (req, res, next) => {
  const game = await Game.findById(req.params.id)
  const user = await User.findById(req.user.id)

  //Find the user in the group and get their role
  const gameUser = game.users.find((gameUser) => gameUser.id == req.user.id)
  let role = ''
  if (gameUser) {
    role = gameUser.role
  }
  //Set the group name
  if (!game.open) {
    const group = await Group.findById(game.group._id)
    game.group.name = group.name
  }

  //Find all users who do not belong to any team
  let otherUsersArray = []
  let team1IdsArray = []
  let team2IdsArray = []
  game.team1.users.map((user) => {
    team1IdsArray.push(user.id)
  })
  game.team2.users.map((user) => {
    team2IdsArray.push(user.id)
  })
  game.users.map((user) => {
    if (!team1IdsArray.includes(user.id) && !team2IdsArray.includes(user.id))
      otherUsersArray.push(user.id)
  })
  const otherUsers = await User.find({ _id: { $in: otherUsersArray } })

  let inviteUsers
  //Find all invite users for a group game
  if (!game.open) {
    inviteUsers = await User.find({
      games: { $not: { $elemMatch: { _id: req.params.id } } },
      groups: { $elemMatch: { _id: game.group } },
      gameInvites: { $not: { $elemMatch: { game: req.params.id } } },
    })
  } else {
    //Find all invite users for an open game
    let userGroups = []
    user.groups.map((group) => {
      userGroups.push(group._id)
    })
    inviteUsers = await User.find({
      games: { $not: { $elemMatch: { _id: req.params.id } } },
      groups: { $elemMatch: { _id: { $in: userGroups } } },
      gameInvites: { $not: { $elemMatch: { game: req.params.id } } },
    })
  }

  //Add name and photo to game users
  let gameUserIds = []
  game.users.map((user) => {
    gameUserIds.push(user._id)
  })
  const gameUsers = await User.find({ _id: { $in: gameUserIds } })
  gameUsers.map((gameUser) => {
    game.users.map((user) => {
      if (gameUser.id == user.id) {
        user.photo = gameUser.photo
        user.name = gameUser.name
      }
    })
  })

  //Add name and photo to request users
  let requestUserIds = []
  game.requests.map((request) => {
    requestUserIds.push(request.user)
  })
  const requestUsers = await User.find({ _id: { $in: requestUserIds } })
  requestUsers.map((requestUser) => {
    game.requests.map((request) => {
      if (requestUser.id == request.user) {
        request.photo = requestUser.photo
        request.name = requestUser.name
      }
    })
  })

  //Add name and photo to team1 users
  const team1Users = await User.find({ _id: { $in: team1IdsArray } })
  team1Users.map((team1User) => {
    game.team1.users.map((user) => {
      if (team1User.id == user.id) {
        user.photo = team1User.photo
        user.name = team1User.name
      }
    })
  })

  //Add name and photo to team2 users
  const team2Users = await User.find({ _id: { $in: team2IdsArray } })
  team2Users.map((team2User) => {
    game.team2.users.map((user) => {
      if (team2User.id == user.id) {
        user.photo = team2User.photo
        user.name = team2User.name
      }
    })
  })

  return res.status(200).json({
    success: true,
    data: {
      game: game,
      user: user,
      role: role,
      otherUsers: otherUsers,
      inviteUsers: inviteUsers,
    },
  })
})

// @desc      Update the information of a game
// @route     PUT /api/v1/games/:id
// @access    Protected
exports.updateGame = asyncHandler(async (req, res, next) => {
  // Check if game exists or winner is already declared
  let game = await Game.findById(req.params.id)
  if (!game) {
    return next(
      new ErrorResponse(`No game with the id of ${req.params.id}`, 404)
    )
  }
  if (game.winner) {
    return next(new ErrorResponse(`Game is already finished`, 404))
  }

  // Check if user making the request is part of the game and the creator
  const reqUser = await game.users.find(
    (gameUser) => gameUser.id == req.user.id
  )
  if (!reqUser) {
    return next(
      new ErrorResponse(`User making the request is not part of the game`, 404)
    )
  }
  if (!reqUser.role.includes('creator')) {
    return next(
      new ErrorResponse('User must be a creator to update the game', 401)
    )
  }

  // Update the game with the information in req.body
  game = await Game.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  })

  res.status(200).json({
    success: true,
    data: game,
  })
})

// @desc      Delete game
// @route     DELETE /api/v1/games/:id
// @access    Protected
exports.deleteGame = asyncHandler(async (req, res, next) => {
  // Check if game exists or winner is already declared
  const game = await Game.findById(req.params.id)
  if (!game) {
    return next(
      new ErrorResponse(`No game with the id of ${req.params.id}`, 404)
    )
  }
  if (game.winner) {
    return next(new ErrorResponse(`Game is already finished`, 404))
  }

  // Check if user making the request is part of the game and the creator
  const reqUser = await game.users.find(
    (gameUser) => gameUser.id == req.user.id
  )
  if (!reqUser) {
    return next(
      new ErrorResponse(`User making the request is not part of the game`, 404)
    )
  }
  if (!reqUser.role.includes('creator')) {
    return next(
      new ErrorResponse('User must be a creator to delete the game', 401)
    )
  }

  //Remove game from group
  if (!game.open) {
    const group = await Group.findById(game.group)
    const groupGame = await group.groupGames.find(
      (thisGame) => thisGame.id == req.params.id
    )
    group.groupGames.splice(group.groupGames.indexOf(groupGame), 1)
    group.save()
  }

  //Remove game from users
  const users = []
  game.users.map((gameUser) => users.push(gameUser.id))

  for (var i = 0; i < users.length; i++) {
    await User.findOne({
      _id: users[i],
    })
      .then((user) => {
        const curGame = user.games.find(
          (thisGame) => thisGame.id == req.params.id
        )
        user.games.splice(user.games.indexOf(curGame), 1)
        user.save()
      })
      .catch((e) => {
        // error
      })
  }

  await game.remove()

  res.status(200).json({
    success: true,
    data: {},
  })
})

// @desc      Create a new open game
// @route     POST /api/v1/games/open
// @access    Private
exports.addOpenGame = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id)

  // Create a new open game with the information in req.body and add the creator to the games' users
  req.body = {
    title: req.body.title,
    description: req.body.description,
    users: [
      {
        _id: req.user.id,
        role: ['creator', 'manageUsers', 'manageTeams', 'inviteUsers'],
      },
    ],
    open: true,
    sport: req.body.sport,
  }

  // Create a new game and add the game to user's list of games
  const game = await Game.create(req.body)
  await user.games.push({ _id: game.id })
  await user.save()

  res.status(200).json({
    success: true,
    data: game,
  })
})

// @desc      Create a new group game
// @route     POST /api/v1/games/:groupId/finished
// @access    Private
exports.addGame = asyncHandler(async (req, res, next) => {
  //Find the group which the game is being created inside and check if it exists
  const group = await Group.findById(req.params.groupId)
  if (!group) {
    return next(
      new ErrorResponse(`No group with the id of ${req.params.groupId}`, 404)
    )
  }

  // Check if user making the request is in the group and has permission to create games
  const reqUser = await group.users.find(
    (groupUser) => groupUser.id == req.user.id
  )
  if (!reqUser) {
    return next(new ErrorResponse(`User is not part of the group`, 404))
  }
  if (
    !(reqUser.role.includes('creator') || reqUser.role.includes('createGames'))
  ) {
    return next(
      new ErrorResponse(
        'User must be a creator or have permission to create a game',
        404
      )
    )
  }

  // Create a new game inside the group and set the user as the creator
  const user = await User.findById(req.user.id)
  req.body.users = [
    {
      _id: req.user.id,
      role: ['creator', 'manageUsers', 'manageTeams', 'inviteUsers'],
    },
  ]
  req.body.group = {
    _id: req.params.groupId,
  }

  // Add the game to the group and user's list of games
  const game = await Game.create(req.body)
  await group.groupGames.push({
    _id: game.id,
  })
  await group.save()
  await user.games.push({ _id: game.id })
  await user.save()

  res.status(200).json({
    success: true,
    data: game,
  })
})

// ***************************************
// Methods for modifying Users
// Includes: deleteUser, changeUserRole (also a role method)
// ***************************************

// @desc      Remove a user from the game
// @route     DELETE /api/v1/games/:gameId/users/:userId
// @access    Protected
exports.deleteUser = asyncHandler(async (req, res, next) => {
  //Check for all potential errors
  const game = await Game.findById(req.params.gameId)
  if (!game) {
    return next(
      new ErrorResponse(`No game with the id of ${req.params.id}`, 404)
    )
  }
  if (game.winner) {
    return next(new ErrorResponse(`Game is already finished`, 404))
  }
  const deleteUser = game.users.find(
    (gameUser) => gameUser.id == req.params.userId
  )
  if (!deleteUser) {
    return next(new ErrorResponse(`User is not part of the game`, 404))
  }

  const reqUser = await game.users.find(
    (gameUser) => gameUser.id == req.user.id
  )
  if (!reqUser) {
    return next(
      new ErrorResponse(`User making the request is not part of the game`, 404)
    )
  }

  if (
    !(reqUser.role.includes('creator') || reqUser.role.includes('manageUsers'))
  ) {
    return next(
      new ErrorResponse(
        'User must be a creator or have permission to delete users',
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

  //Remove the user from the game and the game from the user's list of games
  const user = await User.findOne({ _id: req.params.userId })
  const curGame = user.games.find(
    (thisGame) => thisGame.id == req.params.gameId
  )
  user.games.splice(user.games.indexOf(curGame), 1)
  user.save()

  game.users.splice(game.users.indexOf(deleteUser), 1)

  //Remove the user from any team they might be on
  const team1User = await game.team1.users.find(
    (teamUser) => teamUser.id == req.params.userId
  )
  const team2User = await game.team2.users.find(
    (teamUser) => teamUser.id == req.params.userId
  )
  if (team1User) {
    game.team1.users.splice(game.team1.users.indexOf(team1User), 1)
  }
  if (team2User) {
    game.team2.users.splice(game.team2.users.indexOf(team2User), 1)
  }

  await game.save()
  return res.status(200).json({
    success: true,
    data: game.users,
  })
})

exports.joinOpenGame = asyncHandler(async (req, res, next) => {
  //Check if the game is open
  const game = await Game.findById(req.params.id)
  const user = await User.findById(req.user.id)
  if (!game.open) {
    new ErrorResponse('Game is not open', 404)
  }

  // Add the user to the game's list of users and the game to the user's list of games
  game.users.push({
    _id: req.user.id,
  })
  user.games.push({
    _id: req.params.id,
  })
  await user.save()
  await game.save()

  return res.status(200).json({
    success: true,
    data: user,
  })
})

// ***************************************
// Role Methods for users
// Includes: changeUserRole, changeGameType(not yet implemented)
// ***************************************

// @desc      Change the role of a user
// @route     PUT /api/v1/games/:id/role
// @access    Protected
exports.changeUserRole = asyncHandler(async (req, res, next) => {
  // Error checking
  const game = await Game.findById(req.params.gameId)
  const user = await User.findById(req.params.userId)
  if (!game) {
    res.status(404)
    new ErrorResponse('Game not found', 404)
  }
  if (game.winner) {
    return next(new ErrorResponse(`Game is already finished`, 404))
  }
  if (!user) {
    return next(new ErrorResponse(`User not found`, 404))
  }
  const reqUser = await game.users.find(
    (gameUser) => gameUser.id == req.user.id
  )
  if (!reqUser) {
    return next(new ErrorResponse(`You are not part of the game`, 404))
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

  // Find the user in the game and change their role
  const changeUser = await game.users.find(
    (gameUser) => gameUser.id == req.params.userId
  )
  if (!changeUser) {
    return next(new ErrorResponse(`User is not part of the game`, 404))
  }
  changeUser.role = []
  req.body.role.map((eachRole) => changeUser.role.push(eachRole))
  game.save()

  return res.status(200).json({
    success: true,
    data: changeUser,
  })
})

// @desc      Change the role of every user in the game
// @route     PUT /api/v1/games/:id/role
// @access    Protected
exports.changeGameType = asyncHandler(async (req, res, next) => {
  // Error checking
  const game = await Game.findById(req.params.id)
  if (!game) {
    res.status(404)
    new ErrorResponse('Game not found', 404)
  }
  const reqUser = await game.users.find(
    (gameUser) => gameUser.id == req.user.id
  )
  if (!reqUser) {
    return next(new ErrorResponse(`You are not part of the game`, 404))
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

  // Add the role to the user if they do not already have permission
  gameUsers = []
  game.users.map((eachUser) => gameUsers.push(eachUser))
  for (var i = 0; i < gameUsers.length; i++) {
    if (!gameUsers[i].role.includes(req.body.role)) {
      let user = await game.users.find(
        (gameUser) => gameUser.id === gameUsers[i].id
      )
      user.role = req.body.role
    }
  }
  game.save()

  return res.status(200).json({
    success: true,
    data: game.users,
  })
})

// ***************************************
// Team methods for Games
// Includes: addToTeam, removeFromTeam
// ***************************************

// @desc      Add a user to a team or change the team of a user
// @route     PUT /api/v1/games/:id/team
// @access    Protected
exports.addToTeam = asyncHandler(async (req, res, next) => {
  // Error checking
  const game = await Game.findById(req.params.id)
  const user = await User.findById(req.body.user)
  if (!game) {
    return next(new ErrorResponse(`Game not found`, 404))
  }
  if (game.winner) {
    return next(new ErrorResponse(`Game is already finished`, 404))
  }
  if (!user) {
    return next(new ErrorResponse(`User not found`, 404))
  }
  const userExists = await game.users.find(
    (gameUser) => gameUser.id == req.body.user
  )
  if (!userExists) {
    return next(new ErrorResponse(`User is not part of the game`, 404))
  }
  const reqUser = await game.users.find(
    (gameUser) => gameUser.id == req.user.id
  )
  if (!reqUser) {
    return next(
      new ErrorResponse(`User making the request is not part of the game`, 404)
    )
  }
  if (
    !(reqUser.role.includes('creator') || reqUser.role.includes('manageTeams'))
  ) {
    return next(
      new ErrorResponse(
        'User must be a creator or have permission to manage teams',
        401
      )
    )
  }

  // Find if the user already belongs to a team
  const team1User = await game.team1.users.find(
    (teamUser) => teamUser.id == req.body.user
  )
  const team2User = await game.team2.users.find(
    (teamUser) => teamUser.id == req.body.user
  )
  if (req.body.team === 'team1' && team1User) {
    return next(new ErrorResponse('User is already part of team1', 401))
  }
  if (req.body.team === 'team2' && team2User) {
    return next(new ErrorResponse('User is already part of team2', 401))
  }

  // If the user is already on a team, then switch their team
  if (team1User || team2User) {
    if (team1User) {
      game.team1.users.splice(game.team1.users.indexOf(team1User), 1)
      game.team2.users.push({
        _id: req.body.user,
      })
    }
    if (team2User) {
      game.team2.users.splice(game.team2.users.indexOf(team2User), 1)
      game.team1.users.push({
        _id: req.body.user,
      })
    }
    // If the user is not already on a team then add them to the team specified
  } else {
    if (req.body.team === 'team1') {
      game.team1.users.push({
        _id: req.body.user,
      })
    }
    if (req.body.team === 'team2') {
      game.team2.users.push({
        _id: req.body.user,
      })
    }
  }
  game.save()

  //Add name and photo to team1 users
  let team1UserIds = []
  game.team1.users.map((user) => {
    team1UserIds.push(user._id)
  })
  const team1Users = await User.find({ _id: { $in: team1UserIds } })
  team1Users.map((team1User) => {
    game.team1.users.map((user) => {
      if (team1User.id == user.id) {
        user.photo = team1User.photo
        user.name = team1User.name
      }
    })
  })

  //Add name and photo to team2 users
  let team2UserIds = []
  game.team2.users.map((user) => {
    team2UserIds.push(user._id)
  })
  const team2Users = await User.find({ _id: { $in: team2UserIds } })
  team2Users.map((team2User) => {
    game.team2.users.map((user) => {
      if (team2User.id == user.id) {
        user.photo = team2User.photo
        user.name = team2User.name
      }
    })
  })

  return res.status(200).json({
    success: true,
    data: { team1: game.team1, team2: game.team2 },
  })
})

// @desc      Remove a user from a team
// @route     DELETE /api/v1/games/:id/team
// @access    Protected
exports.removeFromTeam = asyncHandler(async (req, res, next) => {
  // Error checking
  const game = await Game.findById(req.params.id)
  if (!game) {
    return next(new ErrorResponse(`Game not found`, 404))
  }
  if (game.winner) {
    return next(new ErrorResponse(`Game is already finished`, 404))
  }

  const userExists = await game.users.find(
    (gameUser) => gameUser.id == req.body.user
  )
  if (!userExists) {
    return next(new ErrorResponse(`User is not part of the game`, 404))
  }
  const reqUser = await game.users.find(
    (gameUser) => gameUser.id == req.user.id
  )
  if (!reqUser) {
    return next(
      new ErrorResponse(`User making the request is not part of the game`, 404)
    )
  }
  if (
    !(reqUser.role.includes('creator') || reqUser.role.includes('manageTeams'))
  ) {
    return next(
      new ErrorResponse(
        'User must be a creator or have permission to manage teams',
        401
      )
    )
  }

  //Find which team the user belongs to and remove them from the team
  const team1User = await game.team1.users.find(
    (teamUser) => teamUser.id == req.body.user
  )
  const team2User = await game.team2.users.find(
    (teamUser) => teamUser.id == req.body.user
  )
  if (!team1User && !team2User) {
    return next(new ErrorResponse('User is not part of either team', 404))
  }
  if (team1User) {
    game.team1.users.splice(game.team1.users.indexOf(team1User), 1)
  }
  if (team2User) {
    game.team2.users.splice(game.team2.users.indexOf(team2User), 1)
  }
  game.save()

  //Add name and photo to team1 users
  let team1UserIds = []
  game.team1.users.map((user) => {
    team1UserIds.push(user._id)
  })
  const team1Users = await User.find({ _id: { $in: team1UserIds } })
  team1Users.map((team1User) => {
    game.team1.users.map((user) => {
      if (team1User.id == user.id) {
        user.photo = team1User.photo
        user.name = team1User.name
      }
    })
  })

  //Add name and photo to team2 users
  let team2UserIds = []
  game.team2.users.map((user) => {
    team2UserIds.push(user._id)
  })
  const team2Users = await User.find({ _id: { $in: team2UserIds } })
  team2Users.map((team2User) => {
    game.team2.users.map((user) => {
      if (team2User.id == user.id) {
        user.photo = team2User.photo
        user.name = team2User.name
      }
    })
  })
  return res.status(200).json({
    success: true,
    data: { team1: game.team1, team2: game.team2 },
  })
})

// ***************************************
// Method for finishing the game
// Includes: finishGame
// ***************************************

// @desc      Set the winning team and update the wins/losses of players
// @route     PUT /api/v1/games/:id/finish
// @access    Protected
exports.finishGame = asyncHandler(async (req, res, next) => {
  // Error checking
  const game = await Game.findById(req.params.id)
  if (!game) {
    return next(new ErrorResponse(`Game not found`, 404))
  }
  if (game.winner) {
    return next(new ErrorResponse('Game is already finished', 401))
  }
  const reqUser = await game.users.find(
    (gameUser) => gameUser.id == req.user.id
  )
  if (!reqUser) {
    return next(
      new ErrorResponse(`User making the request is not part of the game`, 404)
    )
  }
  if (!reqUser.role.includes('creator')) {
    return next(
      new ErrorResponse(
        'User must be a creator or have permission to manage teams',
        401
      )
    )
  }
  if (game.team1.users.length === 0 || game.team2.users.length === 0) {
    return next(
      new ErrorResponse('Cannot end game without any members on a team', 401)
    )
  }

  //Update the wins and losses in the group according to the team of the player
  game.winner = req.body.winner
  const users = []
  game.users.map((gameUser) => users.push(gameUser.id.toString()))
  if (game.competitive) {
    await Group.findOne({
      _id: game.group,
    })
      .then((group) => {
        for (var i = 0; i < users.length; i++) {
          let groupUser = group.users.find(
            (groupUser) => groupUser.id.toString() == users[i]
          )
          let team1User = game.team1.users.find(
            (teamUser) => teamUser.id.toString() == users[i]
          )
          let team2User = game.team2.users.find(
            (teamUser) => teamUser.id.toString() == users[i]
          )
          if (req.body.winner === 'team1' && team1User) {
            groupUser.wins += 1
          } else if (req.body.winner === 'team1' && team2User) {
            groupUser.losses += 1
          }
          if (req.body.winner === 'team2' && team2User) {
            groupUser.wins += 1
          } else if (req.body.winner === 'team2' && team1User) {
            groupUser.losses += 1
          }
        }
        group.save()
      })
      .catch((e) => {
        // error
      })
  }
  game.save()
  return res.status(200).json({
    success: true,
    data: { game: game },
  })
})

// ***************************************
// Invite and Request methods for Games
// Includes: inviteUser, requestToJoinGame, acceptRequestToJoinGame, denyRequestToJoinGame
// ***************************************

// @desc      Invite a user to the game
// @route     POST /api/v1/games/:gameId/invite/:userId
// @access    Protected
exports.inviteUser = asyncHandler(async (req, res, next) => {
  // Error checking
  const game = await Game.findById(req.params.gameId)
  const user = await User.findById(req.params.userId)
  if (!game) {
    return next(new ErrorResponse(`Game not found`, 404))
  }
  if (game.winner) {
    return next(new ErrorResponse(`Game is already finished`, 404))
  }
  if (!user) {
    return next(new ErrorResponse(`User not found`, 404))
  }

  const reqUser = await game.users.find(
    (gameUser) => gameUser.id == req.user.id
  )
  if (!reqUser) {
    return next(
      new ErrorResponse(`User making the request is not part of the game`, 404)
    )
  }
  if (
    !(reqUser.role.includes('creator') || reqUser.role.includes('manageUsers'))
  ) {
    return next(
      new ErrorResponse(
        'User must be a creator or have permission to invite a user',
        401
      )
    )
  }
  const userExists = game.users.find((users) => users.id == req.params.userId)
  if (userExists) {
    return next(new ErrorResponse(`User already part of the game`, 401))
  }
  const requestExists = await user.gameInvites.find(
    (gameInvite) => gameInvite.game == req.params.gameId
  )
  if (requestExists) {
    return next(new ErrorResponse(`User has already been invited`, 401))
  }

  //Check if the user is in the group add the invite to the user's list of invites
  if (!game.open) {
    Group.findOne({
      _id: game.group,
    })
      .then((group) => {
        const inGroup = group.users.find(
          (users) => users.id == req.params.userId
        )
        if (!inGroup) {
          return next(new ErrorResponse(`User is not part of the group`, 401))
        } else {
          user.gameInvites.push({
            game: req.params.gameId,
            message: req.body.message,
          })
          user.save()

          res.status(201).json({ user: req.user.id, message: req.body.message })
        }
      })
      .catch((e) => {
        // error
      })
    // Add the invite to the user if it is an open game
  } else {
    user.gameInvites.push({
      game: req.params.gameId,
      message: req.body.message,
    })
    user.save()
    res.status(201).json({ user: req.user.id, message: req.body.message })
  }
})

// @desc      Send a request to join the game
// @route     POST /api/v1/games/:id/request
// @access    Private
exports.requestToJoinGame = asyncHandler(async (req, res, next) => {
  // Error checking
  const game = await Game.findById(req.params.id)
  if (game.winner) {
    return next(new ErrorResponse(`Game is already finished`, 404))
  }
  if (!game) {
    return next(new ErrorResponse(`Game not found`, 404))
  }

  const reqUser = await User.findById(req.user.id)
  const userExists = game.users.find((users) => users.id == reqUser.id)
  if (userExists) {
    return next(new ErrorResponse(`User already part of the game`, 401))
  }

  const requestExists = await game.requests.find(
    (gameRequest) => gameRequest.user == req.user.id
  )
  if (requestExists) {
    return next(new ErrorResponse(`User already made request`, 401))
  }

  //Add the user's request to the game's request list
  Group.findOne({
    _id: game.group,
  })
    .then((group) => {
      const inGroup = group.users.find((users) => users.id == reqUser.id)
      if (!inGroup) {
        return next(new ErrorResponse(`User is not part of the group`, 401))
      } else {
        game.requests.push({
          user: req.user.id,
          message: req.body.message,
        })
        game.save()

        res.status(201).json({ user: req.user.id, message: req.body.message })
      }
    })
    .catch((e) => {
      // error
    })
})

// @desc      Accept user's request to join a game
// @route     PUT /api/v1/games/:id/request/:requestId
// @access    Protected
exports.acceptRequestToJoinGame = asyncHandler(async (req, res, next) => {
  // Error checking
  const game = await Game.findById(req.params.gameId)
  if (!game) {
    return next(
      new ErrorResponse(`No game with the id of ${req.params.gameId}`, 404)
    )
  }
  if (game.winner) {
    return next(new ErrorResponse(`Game is already finished`, 404))
  }
  const reqUser = await game.users.find(
    (gameUser) => gameUser.id == req.user.id
  )
  if (!reqUser) {
    return next(
      new ErrorResponse(`User making the request is not part of the game`, 404)
    )
  }
  if (
    !(reqUser.role.includes('creator') || reqUser.role.includes('manageUsers'))
  ) {
    return next(
      new ErrorResponse(
        'User must be a creator or have permission to manage requests',
        401
      )
    )
  }
  const request = game.requests.find(
    (gameRequest) => gameRequest.id === req.params.requestId
  )
  if (!request) {
    return next(new ErrorResponse(`Request not found`, 404))
  }

  //If the user has made an invite to the game remove the invite
  const user = await User.findById(request.user)
  const invite = user.gameInvites.find(
    (gameInvite) => gameInvite.game == req.params.gameId
  )
  user.gameInvites.splice(user.gameInvites.indexOf(invite), 1)

  //Add the user to the game and remove the request from the game's request list
  await game.users.push({
    _id: request.user,
  })
  game.requests.splice(game.requests.indexOf(request), 1)

  //Add name and photo to game users
  let gameUserIds = []
  game.users.map((user) => {
    gameUserIds.push(user._id)
  })
  const gameUsers = await User.find({ _id: { $in: gameUserIds } })
  gameUsers.map((gameUser) => {
    game.users.map((user) => {
      if (gameUser.id == user.id) {
        user.photo = gameUser.photo
        user.name = gameUser.name
      }
    })
  })

  await user.games.push({ _id: game.id })
  await user.save()

  await game.save()
  return res.status(200).json({
    success: true,
    data: game.users,
  })
})

// @desc      Deny a user's request to join a game
// @route     DELETE /api/v1/games/:gameId/request/:requestId
// @access    Protected
exports.denyRequestToJoinGame = asyncHandler(async (req, res, next) => {
  // Error checking
  const game = await Game.findById(req.params.gameId)
  if (!game) {
    return next(
      new ErrorResponse(`No game with the id of ${req.params.gameId}`, 404)
    )
  }
  if (game.winner) {
    return next(new ErrorResponse(`Game is already finished`, 404))
  }
  const reqUser = await game.users.find(
    (gameUser) => gameUser.id == req.user.id
  )
  if (!reqUser) {
    return next(
      new ErrorResponse(`User making the request is not part of the game`, 404)
    )
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
        401
      )
    )
  }

  // Remove the request from the game's request list
  const request = game.requests.find(
    (gameRequest) => gameRequest.id === req.params.requestId
  )
  if (!request) {
    return next(new ErrorResponse(`Request not found`, 404))
  } else {
    game.requests.splice(game.requests.indexOf(request), 1)
    await game.save()
    return res.status(200).json({
      success: true,
      data: game.requests,
    })
  }
})
