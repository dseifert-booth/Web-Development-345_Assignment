require('dotenv').config();
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

mongoose.connect(process.env.DB_HOST, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

var roomSchema = new Schema({
    "roomNum": Number,
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
    "super": Boolean,
    "booked": Boolean
})

var Room = mongoose.model("rooms", roomSchema);

function getRoom(roomNum) {
    return Room.findOne({"roomNum": roomNum}).exec();
}

function findRooms(location) {
        console.log("dbroom #1");
    if (location) {
        console.log(location);
        return Room.find({"location": location}).exec();
    } else {
        return Room.find().exec();
    }
}

function countRooms(location) {
    if (location) {
        return Room.countDocuments({"location": location});
    } else {
        return Room.countDocuments();
    }
}

async function createRoom(data, fileName) {
    var room = await Room.find().sort({roomNum: -1}).limit(1)
    .exec()
    var lastRoomNumber = room[0].roomNum;

    var newRoom = new Room ({
        roomNum : lastRoomNumber + 1,
        title: data.title,
        price: data.price,
        description: data.desc,
        location: data.location,
        photo: "/images/" + fileName,
        rating: 0.00,
        numRating: 0,
        plus: false,
        super: false,
        booked: false
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

async function bookRoom(roomNum) {
    var room = await getRoom(roomNum);
    room.booked = true;

    await room.save();
}

module.exports = {
    getRoom: getRoom,
    findRooms: findRooms,
    countRooms: countRooms,
    createRoom: createRoom,
    saveRoom: saveRoom,
    bookRoom: bookRoom
}