const express = require('express')
const {
  getGroupsWithCreateGamePermission,
  createGroup,
  updateGroup,
  deleteGroup,
  requestToJoinGroup,
  acceptRequestToJoinGroup,
  denyRequestToJoinGroup,
  deleteUser,
  inviteUser,
  changeUserRole,
  changeGroupType,
  getGroupInfo,
} = require('../controllers/groupsController')

const { protect } = require('../middleware/auth')
const router = express.Router()

//Additional group routes for getting groups
router.route('/createGames').get(protect, getGroupsWithCreateGamePermission)
router.route('/getGroupInfo/:id').get(protect, getGroupInfo)

//Group CRUD routes
router.route('/:id').put(protect, updateGroup).delete(protect, deleteGroup)
router.route('/').post(protect, createGroup)

//Group routes for modifying users
router
  .route('/:groupId/users/:userId')
  .delete(protect, deleteUser)
  .put(protect, changeUserRole) // Also a role route

//Role routes
router.route('/:id/role').put(protect, changeGroupType)

//Invite and Request routes
router.route('/:groupId/invite/:userId').post(protect, inviteUser)
router.route('/:id/request').post(protect, requestToJoinGroup)
router
  .route('/:groupId/request/:requestId')
  .put(protect, acceptRequestToJoinGroup)
  .delete(protect, denyRequestToJoinGroup)

module.exports = router
