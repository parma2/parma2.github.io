const express = require("express");
const router = express.Router();

const catchAsync = require("../utils/catchAsync");
const { isLoggedIn } = require("../middleware");
const { validateCampground, isAuthor } = require("../middleware");

// controller
const artsocialController = require("../controllers/artsocial")

const multer  = require('multer')
const { storage } = require("../cloudinary/index")
const upload = multer({ storage: storage })

router.route("/")
    .get(catchAsync(artsocialController.index))
    .post(isLoggedIn, upload.array("image"), validateCampground, catchAsync(artsocialController.createCampground))
    
router.get("/new", isLoggedIn, artsocialController.renderNewForm);

router.route("/:id")
    .get(catchAsync(artsocialController.showCampground))
    .put(isLoggedIn, isAuthor, upload.array("image"), validateCampground, catchAsync(artsocialController.updateCampground))
    .delete(isLoggedIn, isAuthor, catchAsync(artsocialController.deleteCampground))

router.get("/:id/edit", isLoggedIn, isAuthor, catchAsync(artsocialController.renderEditForm))

module.exports = router;
