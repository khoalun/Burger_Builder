const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load env vars
dotenv.config({
  path: './config/config.env',
});

// Load models
const Bootcamp = require('./models/Bootcamps');

// Connect DB
const connectionDB = async () => {
  const conn = await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  });
  console.log('conn.connection.host', conn.connection.host);
};
connectionDB();

// Read JSON files
const bootcamps = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/bootcamps.json`, 'utf-8')
);

// Import into DB
const importDB = async () => {
  try {
    await Bootcamp.create(bootcamps);
    process.exit();
  } catch (error) {
    console.error(error);
  }
};

// Delete all bootcamps
const deleteDB = async () => {
  try {
    await Bootcamp.deleteMany();
    process.exit();
  } catch (error) {
    console.error(error);
  }
};

if (process.argv[2] === 'create') {
  console.log('Importing...');
  importDB();
} else if (process.argv[2] === 'delete') {
  console.log('deleting...');
  deleteDB();
}
