const Campground = require("../models/campground")
const { cloudinary } = require("../cloudinary/index")

// mapbox
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const geocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN;

// console.log("here is the token", mapBoxToken)
const geocodingClient = mbxGeocoding({ accessToken: mapBoxToken })


module.exports.index = async (req, res) => {
    const campgrounds = await Campground.find({})
    res.render("artsocial/index", { campgrounds })
}

module.exports.renderNewForm = (req, res) => {
    res.render("artsocial/new")
}

module.exports.createCampground = async (req, res, next) => {
    const geoData = await geocodingClient.forwardGeocode({
        query: req.body.campground.location,
        limit: 1
    }).send()

    const campground = new Campground(req.body.campground);
    campground.geometry = geoData.body.features[0].geometry
    campground.images = req.files.map(f => ({ url: f.path, filename: f.filename }))
    campground.author = req.user._id;
    await campground.save();
    // console.log(campground)
    req.flash("success", "Successfully made a new arts!")
    res.redirect(`/artsocial/${campground._id}`)
}

module.exports.showCampground = async (req, res) => {
    const campground = await Campground.findById(req.params.id)
        .populate({
            path: "reviews",
            populate: { path: "author" } })
        .populate({ path: "author" });
    
    if (!campground) {
        req.flash("error", "Cannot find that campground");
        return res.redirect("/artsocial");
    }
    res.render("artsocial/show", { campground })
}

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(req.params.id)
    if (!campground) {
        req.flash("error", "Cannot find that campground");
        return res.redirect("/artsocial");
    }
    res.render("artsocial/edit", { campground })
}

module.exports.updateCampground = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });

    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    campground.images.push(...imgs);
    await campground.save()
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await campground.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
        console.log(campground)
    }
    req.flash("success", "Successfully updated campground!");
    res.redirect(`/artsocial/${campground._id}`);
}

module.exports.deleteCampground = async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash("success", "Successfully deleted campground")
    res.redirect("/artsocial");
}
