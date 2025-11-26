const express = require('express');
const app = express();
const port = process.env.PORT || 3333;

app.use(express.json());

// Import routes
// (other routes may be required/used here in the real backend)
const onibusRoutes = require('./routes/onibus.routes');

app.use('/onibus', onibusRoutes);

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Server running on port ${port}`);
});

module.exports = app;
