const fs = require('fs');
const express = require('express');
const app = express();

const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// define route
// app.get('/', (req, res) => {
//   res.status(200).json({ message: 'Hello, World!' });
// });

// app.post('/', (req, res) => {
//   res.send('POST request received!');
//   //   res.status(200).json({ message: 'POST request received!' });
// });

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`),
);

app.get('/api/v1/tours', (req, res) => {
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours,
    },
  });
});
