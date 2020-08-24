const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');

const { protect, authorization } = require('../middlewares/auth');
const {
  getBootcamps,
  createBootcamps,
  modifyBootcamp,
  getBootcampById,
  deleteBootcampById,
} = require('../controllers/bootcamps');

router
  .route('/')
  .get(getBootcamps)
  .post(protect, authorization('admin'), createBootcamps);
// router.put('/:id', modifyBootcamp);
router
  .route('/:id')
  .get(getBootcampById)
  .delete(protect, authorization('admin'), deleteBootcampById)
  .put(protect, authorization('admin'), modifyBootcamp);

module.exports = router;
