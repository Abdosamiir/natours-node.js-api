const fs = require('node:fs');
const path = require('node:path');
const dns = require('node:dns');
const mongoose = require('mongoose');

const dotenv = require('dotenv');
dotenv.config({ path: path.join(__dirname, '../../config.env') });

const Tour = require('../../models/tours/tourModel');

// Override DNS for SRV/TXT lookups when the system resolver cannot resolve Atlas.
if (process.env.DNS_SERVERS) {
  dns.setServers(
    process.env.DNS_SERVERS.split(',').map((server) => server.trim()),
  );
}

// read the JSON file
const tours = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'tours.json'), 'utf-8'),
);

// import data into the database
const importData = async () => {
  await Tour.create(tours);
  console.log(`${tours.length} tours successfully loaded!`);
};

// delete all data from the database
const deleteData = async () => {
  const { deletedCount } = await Tour.deleteMany();
  console.log(`${deletedCount} tours successfully deleted!`);
};

const actions = {
  '--import': importData,
  '--delete': deleteData,
};

const run = async () => {
  const action = actions[process.argv[2]];
  if (!action) {
    console.error(
      'Usage: node dev-data/data/import-dev-data.js --import | --delete',
    );
    process.exitCode = 1;
    return;
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('DB connection successful!');
    await action();
  } catch (err) {
    console.error('Seeding failed:', err.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
};

run();
