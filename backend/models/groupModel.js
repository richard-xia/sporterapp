const mongoose = require('mongoose')

const GroupSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a name'],
      trim: true,
      minLength: [6, 'Please enter a name with more than 6 characters'],
      maxlength: [30, 'Please enter a name with less than 30 characters'],
    },
    description: {
      type: String,
      maxlength: [250, 'Description can not be more than 250 characters'],
    },
    location: {
      coordinates: {
        type: [Number],
        index: '2dsphere',
        default: [45.3875812, -75.69602019999999],
      },
    },
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
        wins: { type: Number, default: 0 },
        losses: { type: Number, default: 0 },
        name: { type: String },
        photo: { type: String },
      },
    ],
    sports: [],
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
    groupGames: [
      {
        _id: { type: mongoose.Schema.ObjectId, ref: 'Game' },
        title: { type: String },
        photo: { type: String },
      },
    ],
    private: {
      type: Boolean,
      default: false,
    },
    competitive: {
      type: Boolean,
      default: true,
    },
    photo: {
      type: String,
      default: 'users-solid.svg',
    },
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

// Cascade delete games
GroupSchema.pre('remove', async function (next) {
  console.log(`Games being removed from group ${this._id}`)
  await this.model('Game').deleteMany({ group: this._id })
  next()
})

module.exports = mongoose.model('Group', GroupSchema)
