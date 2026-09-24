const mongoose = require('mongoose');

const pointFields = {
  type: {
    type: String,
    default: 'Point',
    enum: ['Point'],
    required: true,
  },
  coordinates: {
    type: [Number],
    required: true,
    validate: {
      validator: function (coordinates) {
        return (
          Array.isArray(coordinates) &&
          coordinates.length === 2 &&
          coordinates.every(Number.isFinite) &&
          coordinates[0] >= -180 &&
          coordinates[0] <= 180 &&
          coordinates[1] >= -90 &&
          coordinates[1] <= 90
        );
      },
      message: 'Coordinates must be a valid [longitude, latitude] pair',
    },
  },
  description: {
    type: String,
    trim: true,
  },
};

const startLocationSchema = new mongoose.Schema(
  {
    ...pointFields,
    address: {
      type: String,
      trim: true,
    },
  },
  { _id: false },
);

const locationSchema = new mongoose.Schema({
  ...pointFields,
  day: {
    type: Number,
    min: [1, 'A location day must be at least 1'],
  },
});

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: true,
      trim: true,
    },
    slug: {
      type: String,
      trim: true,
      lowercase: true,
    },
    duration: {
      type: Number,
      required: [true, 'A tour must have a duration'],
      min: [1, 'A tour must last at least 1 day'],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a group size'],
      min: [1, 'A tour must allow at least 1 participant'],
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have a difficulty'],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Difficulty must be easy, medium, or difficult',
      },
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating must be at most 5'],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
      min: [0, 'Ratings quantity cannot be negative'],
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a price'],
      min: [0, 'Price cannot be negative'],
    },
    summary: {
      type: String,
      required: [true, 'A tour must have a summary'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, 'A tour must have a cover image'],
    },
    images: [String],
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false,
    },
    startLocation: startLocationSchema,
    locations: [locationSchema],
    // Guide details belong to User documents and can be populated later.
    guides: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});

// Reviews are stored separately, with each review referencing its tour.
tourSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'tour',
  localField: '_id',
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
