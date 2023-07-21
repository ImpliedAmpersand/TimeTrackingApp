const express = require('express');
const fs = require('fs');
const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.use(express.json());

// Import routes
const indexRoute = require('./routes/index');
const adminRoute = require('./routes/admin');
const timeTrackingRoute = require('./routes/timeTracking');
const timeTrackingAdminInRoute = require('./routes/timeTrackingAdminIn');
const newUserRoute = require('./routes/newUser');
const updateTableRoute = require('./routes/updateTable');
const fixClockoutRoute = require('./routes/fixClockout');

// Serve static files from the public directory
app.use(express.static('public'));
app.use("/fo", express.static('node_modules/fomantic-ui/dist'));
app.use("/dists", express.static('node_modules/jquery/dist'));

// Set up routes
app.use('/', indexRoute);
app.use('/admin', adminRoute);
app.use('/time-tracking', timeTrackingRoute);
app.use('/time-tracking-admin-in', timeTrackingAdminInRoute);
app.use('/new-user', newUserRoute);
app.use('/update-table', updateTableRoute);
app.use('/fix-clockout', fixClockoutRoute);

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
