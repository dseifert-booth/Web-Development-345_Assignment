require('dotenv').config();
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

mongoose.connect(process.env.DB_HOST, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

var roomSchema = new Schema({
    "title": {
        "type": String,
        "unique": true
    },
    "price": String,
    "description": String,
    "location": String,
    "photo": String,
    "rating": Number,
    "numRating": Number,
    "plus": Boolean,
    "super": Boolean
})

var Room = mongoose.model("rooms", roomSchema);

function findRooms() {
    return Room.find().exec();
}

function countRooms() {
    return Room.countDocuments();
}

module.exports = {
    findRooms: findRooms,
    countRooms: countRooms
}