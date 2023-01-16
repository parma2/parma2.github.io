const mongoose = require("mongoose");

const Campground = require("../models/campground");
const cities = require("./cities");
const { places, descriptors } = require("./seedHelpers");

mongoose.connect("mongodb://localhost:27017/yelp-camp")

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected")
})

const sample = array => array[Math.floor(Math.random() * array.length)]

const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 200; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const priceRand = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            // MY USER ID
            author: "63ba93812214dbce00022fb6",
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Doloribus quas quaerat vitae quo corrupti doloremque id dicta, reprehenderit reiciendis nihil eos est dignissimos impedit nobis possimus. Odio voluptatum harum perspiciatis?",
            price: priceRand,
            geometry: { 
                type: 'Point', 
                coordinates: [
                    cities[random1000].longitude,
                    cities[random1000].latitude
                ]
            },
            images: [
                {
                    url: 'https://res.cloudinary.com/dijfxhm1t/image/upload/v1673432845/YelpCamp/oslj52nohihctduryybv.jpg',
                    filename: 'YelpCamp/oslj52nohihctduryybv'
                },
                {
                    url: 'https://res.cloudinary.com/dijfxhm1t/image/upload/v1673432844/YelpCamp/tcbujwvrifd9agbamcpk.jpg',
                    filename: 'YelpCamp/tcbujwvrifd9agbamcpk'
                }
            ]
        })
        await camp.save()
    }
}

seedDB().then(() => {
    mongoose.connection.close()
})