const Bootcamps = require('../models/Bootcamps');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middlewares/async');
const User = require('../models/User');

// Get all
exports.getBootcamps = asyncHandler(async (req, res, next) => {
  const bootcamps = await Bootcamps.find();
  res.status(200).json({
    success: true,
    data: bootcamps,
  });
});

// get 1 bootcamp by id
exports.getBootcampById = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamps.findById(req.params.id);
    if (!bootcamp) {
      return res.status(400).json({
        success: false,
        error: 'do not have data',
      });
    }
    res.status(200).json({
      success: true,
      data: bootcamp,
    });
  } catch (error) {
    next(
      new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
    );
    // res.status(400).json({
    //   success: false,
    //   error: error.message,
    // });
  }
};

// Create new bootcamp
exports.createBootcamps = asyncHandler(async (req, res, next) => {
  // Add user to req.body
  req.body.user = req.user.id;
  // Find current user
  const user = await User.findById(req.user.id).select('+password');

  // Only admin account can post more than one bootcamp
  if (user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `The user with ${user.role} can not post more than one bootcamp`,
        400
      )
    );
  }

  // create new bootcamp
  const bootcamp = await Bootcamps.create(req.body);
  // Push and save new bootcamp to current user
  user.bootcamps.push(bootcamp);
  await user.updateOne({
    bootcamps: user.bootcamps,
  });

  res.status(201).json({
    success: true,
    data: bootcamp,
  });
});

// Put = modify exist 1 bootcamp by Id
exports.modifyBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamps.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!bootcamp) {
    return res.status(400).json({
      success: false,
      error: 'do not have bootcamp which has same id',
    });
  }
  res.status(200).json({
    success: true,
    data: bootcamp,
  });
});

// Delete 1 exist bootcamp by Id
exports.deleteBootcampById = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamps.findByIdAndDelete(req.params.id);
  // Get current user
  const user = req.user;

  // Only admin or the owner of bootcamp can delete the bootcamp
  if (
    user.role !== 'admin' ||
    user.id.toString() !== req.params.id.toString()
  ) {
    return next(
      new ErrorResponse(
        `This user account ${user.email} can not delete this bootcamp`,
        401
      )
    );
  }
  if (!bootcamp) {
    return res.status(400).json({
      success: false,
      error: 'do not have bootcamp which has same id',
    });
  }
  const bootcamps = await Bootcamps.find();
  res.status(200).json({
    success: true,
    data: bootcamps,
  });
});
