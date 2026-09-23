const dns = require('node:dns');
const mongoose = require('mongoose');

const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

// Override DNS for SRV/TXT lookups when the system resolver cannot resolve Atlas.
if (process.env.DNS_SERVERS) {
  dns.setServers(
    process.env.DNS_SERVERS.split(',').map((server) => server.trim()),
  );
}

const app = require('./app');
const port = process.env.PORT || 3000;

mongoose
  .connect(process.env.MONGODB_URI)
  .then((con) => {
    console.log(con.connections);
    console.log('DB connection successful!');
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((err) => {
    console.error('Database connection failed:', err.message);
    process.exitCode = 1;
  });
