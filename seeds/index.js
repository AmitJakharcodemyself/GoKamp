if(process.env.NODE_ENV !=='production'){
    require('dotenv').config();
}


const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');//or can deo places=(./seedhelpers).places
const Campground = require('../models/campground');


const MONGOURI = process.env.MONGO_URI;
mongoose.connect(MONGOURI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});
const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)];


const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 300; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 2000) + 10;
        const camp = new Campground({
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            //MINE AUTHOR ID
            author:"60b7515ea379472630dea444",
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam dolores vero perferendis laudantium, consequuntur voluptatibus nulla architecto, sit soluta esse iure sed labore ipsam a cum nihil atque molestiae deserunt!',
            price:price,
            geometry: {
                type: "Point",
                coordinates: [
                    cities[random1000].longitude,
                    cities[random1000].latitude                    
            ]
            },
            images:[
                {
                    url:"https://res.cloudinary.com/devcacmp/image/upload/v1622713489/DevCamp/ywkk6gwbxgrqadbpg9tm.jpg",
                    filename:"DevCamp/ywkk6gwbxgrqadbpg9tm"
                },
                {
                    url:"https://res.cloudinary.com/devcacmp/image/upload/v1622713493/DevCamp/inchcjv6qenyffni41wa.jpg",
                    filename:"DevCamp/inchcjv6qenyffni41wa"
                },
                {
                    url:"https://res.cloudinary.com/devcacmp/image/upload/v1622713497/DevCamp/junqf0mx3ftdolipof7r.jpg",
                    filename:"DevCamp/junqf0mx3ftdolipof7r"
                },
                {
                    url:"https://res.cloudinary.com/devcacmp/image/upload/v1622713504/DevCamp/wxravwktdc9szfoyrtvw.jpg",
                    filename:"DevCamp/wxravwktdc9szfoyrtvw"
                },
                {
                    url:"https://res.cloudinary.com/devcacmp/image/upload/v1622713508/DevCamp/nfpxpsytm1ihzllgcarl.jpg",
                    filename:"DevCamp/nfpxpsytm1ihzllgcarl"
                },
                {
                    url:"https://res.cloudinary.com/devcacmp/image/upload/v1622713512/DevCamp/oc12btgeoy0ggfhmvvxe.jpg",
                    filename:"DevCamp/oc12btgeoy0ggfhmvvxe"
                }
            ]
        })
        await camp.save();
    }
}
//calling seedDB
seedDB().then(() => {
    mongoose.connection.close();
})
