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

function createRoom(data, fileName) {
    var newRoom = new Room ({
        title: data.title,
        price: data.price,
        description: data.desc,
        location: data.location,
        photo: "/images/" + fileName,
        rating: 0.00,
        numRating: 0,
        plus: false,
        super: false
    })

    return newRoom;
}

function saveRoom(room) {
    room.save((err) => {
        if (err) {
            console.log(`There was an error saving ` + room.title + `'s account ${err}`)
        } else {
            console.log(room.title + "'s account was saved to the database.")
        }
    })
}

module.exports = {
    findRooms: findRooms,
    countRooms: countRooms,
    createRoom: createRoom,
    saveRoom: saveRoom
}