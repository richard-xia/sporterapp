const mongoose = require('mongoose')

const GameSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      required: [true, 'Please add a game title'],
      minLength: [6, 'Please enter a title with more than 6 characters'],
      maxlength: [30, 'Please enter a title with less than 30 characters'],
    },
    description: {
      type: String,
      maxlength: [250, 'Description can not be more than 250 characters'],
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
      },
      coordinates: {
        type: [Number],
        index: '2dsphere',
        default: [45.3875812, -75.69602019999999],
      },
    },
    time: { type: Date },
    group: {
      _id: { type: mongoose.Schema.ObjectId, ref: 'Group' },
      name: { type: String },
      photo: { type: String },
    },
    sport: { type: String },
    users: [
      {
        _id: { type: mongoose.Schema.ObjectId, ref: 'User' },
        role: [
          {
            type: String,
            required: true,
            default: 'user',
          },
        ],
        name: { type: String },
        photo: { type: String },
      },
    ],
    photo: { type: String, default: 'people-arrows-solid.svg' },
    requests: [
      {
        user: { type: mongoose.Schema.ObjectId, ref: 'User' },
        message: {
          type: String,
        },
        name: { type: String },
        photo: { type: String },
      },
    ],
    open: { type: Boolean, default: false },
    private: { type: Boolean, default: false },
    competitive: { type: Boolean, default: true },
    team1: {
      name: { type: String, default: 'Red Team' },
      photo: { type: String, default: 'red-team.svg' },
      users: [
        {
          _id: { type: mongoose.Schema.ObjectId, ref: 'User' },
          name: { type: String },
          photo: { type: String },
        },
      ],
    },
    team2: {
      name: { type: String, default: 'Blue Team' },
      photo: { type: String, default: 'blue-team.svg' },
      users: [
        {
          _id: { type: mongoose.Schema.ObjectId, ref: 'User' },
          name: { type: String },
          photo: { type: String },
        },
      ],
    },
    winner: { type: String, enum: ['team1', 'team2'] },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
)

module.exports = mongoose.model('Game', GameSchema)
