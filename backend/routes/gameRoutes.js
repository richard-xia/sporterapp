const express = require('express')
const {
  getGameInfo,
  addGame,
  addOpenGame,
  updateGame,
  deleteGame,
  joinOpenGame,
  requestToJoinGame,
  acceptRequestToJoinGame,
  denyRequestToJoinGame,
  deleteUser,
  inviteUser,
  changeUserRole,
  addToTeam,
  removeFromTeam,
  finishGame,
  changeGameType,
} = require('../controllers/gamesController')

const { protect } = require('../middleware/auth')
const router = express.Router()

//Game CRUD routes
router.route('/:id').put(protect, updateGame).delete(protect, deleteGame)
router.route('/open').post(protect, addOpenGame)
router.route('/getGameInfo/:id').get(protect, getGameInfo)
router.route('/joinOpenGame/:id').put(protect, joinOpenGame)

router.route('/:groupId').post(protect, addGame)

//Game routes for modifying users
router
  .route('/:gameId/users/:userId')
  .delete(protect, deleteUser)
  .put(protect, changeUserRole) // Also a role route

//Role routes
router.route('/:id/role').put(protect, changeGameType)

//Team routes
router.route('/:id/team').put(protect, addToTeam)
router.route('/:id/team').delete(protect, removeFromTeam)

//Finish game routes
router.route('/:id/finish').put(protect, finishGame)

//Invite and Request routes
router.route('/:gameId/invite/:userId').post(protect, inviteUser)
router.route('/:id/request').post(protect, requestToJoinGame)
router
  .route('/:gameId/request/:requestId')
  .put(protect, acceptRequestToJoinGame)
  .delete(protect, denyRequestToJoinGame)

module.exports = router
