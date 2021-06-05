const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync');
const { campgroundSchema } = require('../validateSchemas.js');
const {isLoggedIn,isAuthor,validateCampground}=require('../middleware');
const campgrounds=require('../controllers/campgrounds');//controlers
const multer = require('multer');
const { storage } = require('../cloudinary/index');
const upload = multer({ storage });

const ExpressError = require('../utils/ExpressError');
const Campground = require('../models/campground');//Model


router.route('/')
    .get(wrapAsync(campgrounds.index))
    .post(isLoggedIn,upload.array('image'),  validateCampground, wrapAsync(campgrounds.createCampground));

router.get('/new', isLoggedIn,campgrounds.renderNewForm)//should be before/:id

router.route('/:id')
    .get( wrapAsync(campgrounds.showCampground))
    .put(isLoggedIn,isAuthor,upload.array('image'),validateCampground, wrapAsync(campgrounds.updateCampground))
    .delete(isLoggedIn,isAuthor ,wrapAsync(campgrounds.deleteCampground));

router.get('/:id/edit',isLoggedIn,isAuthor, wrapAsync(campgrounds.renderEditForm))
module.exports = router;