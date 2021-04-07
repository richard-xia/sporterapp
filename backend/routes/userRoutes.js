const express = require('express')
const {
  getUser,
  getAllUserEmails,
  updateUser,
  acceptGroupInvite,
  denyGroupInvite,
  acceptGameInvite,
  denyGameInvite,
  getDashboard,
  getSearch,
  getGameInvites,
  getGroupInvites,
  leaveGroup,
  leaveGame,
} = require('../controllers/usersController')

const router = express.Router()

const { protect } = require('../middleware/auth')

router.route('/getDashboard').get(protect, getDashboard)
router.route('/getSearch').get(protect, getSearch)

//Gets the information of every user (for detecting already registered)
router.route('/allEmails').get(getAllUserEmails)

//Routes for accepting and denying group/game invites
router
  .route('/groups/invite/:id')
  .put(protect, acceptGroupInvite)
  .delete(protect, denyGroupInvite)

router
  .route('/games/invite/:id')
  .put(protect, acceptGameInvite)
  .delete(protect, denyGameInvite)

//Routes for leaving groups/games
router.route('/leaveGroup/:id').put(protect, leaveGroup)
router.route('/leaveGame/:id').put(protect, leaveGame)

router.route('/:id/groupInvites').get(protect, getGroupInvites)
router.route('/:id/gameInvites').get(protect, getGameInvites)

//Routes for getting another user or updating the current user
router.route('/:id').get(protect, getUser).put(protect, updateUser)

module.exports = router
