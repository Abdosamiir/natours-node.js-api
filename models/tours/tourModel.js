const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A tour must have a name'],
    unique: true,
  },

  rating: {
    type: Number,
    default: 4.5,
  },

  price: {
    type: Number,
    required: [true, 'A tour must have a price'],
  },
});

const Tour = mongoose.model('Tour', tourSchema);

// const testTour = new Tour({
//   name: 'The park camper',
//   rating: 4.8,
//   price: 550,
// });

// testTour
//   .save()
//   .then((doc) => {
//     console.log('Tour saved:', doc);
//   })
//   .catch((err) => {
//     console.error('Error saving tour:', err.message);
//   });

module.exports = Tour;
