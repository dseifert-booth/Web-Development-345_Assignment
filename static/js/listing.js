async function getListing() {
    var listing = {
        rooms: this.rooms,
        count: this.count
    }

    await fetch("/room-display")
    .then(response => response.json())
    .then(data => listing.rooms = data);

    await fetch("/room-count")
    .then(response => response.json())
    .then(data => listing.count = data)

    return listing;
}

function setLocation(location, plus) {
    var roomLocation = document.createElement("p");
    if (plus) {
        roomLocation.className = "plus";
        var spanPlus = document.createElement("span");
        spanPlus.innerText = "Plus";
        roomLocation.appendChild(spanPlus);
        roomLocation.insertAdjacentHTML('beforeend'," ");
    }
    roomLocation.insertAdjacentHTML('beforeend', location);
    return roomLocation;
}

function setTitle(title) {
    var roomTitle = document.createElement("h4");
    roomTitle.innerHTML = title;
    return roomTitle;
}

function setPrice(price) {
    var roomPrice = document.createElement("p");
    roomPrice.innerHTML = price;
    return roomPrice;
}

function setRating(rating) {
    var roomRating = document.createElement("p");
    roomRating.className = "rating";
    roomRating.innerHTML = rating;
    return roomRating;
}

function setNumRatings(numRatings, superhost) {
    var roomNumRatings = document.createElement("p");
    roomNumRatings.insertAdjacentHTML('beforeend', "(");
    roomNumRatings.insertAdjacentHTML('beforeend', numRatings);
    roomNumRatings.insertAdjacentHTML('beforeend', ")");
    if (superhost) {
        roomNumRatings.insertAdjacentHTML('beforeend', " - Superhost");
    }
    return roomNumRatings;
}

function setRatingDetails(room) {
    var roomRatingDetails = document.createElement("div");
    roomRatingDetails.className = "rating-details";

    var roomStar = document.createElement("i");
    roomStar.className = "fas fa-star";

    roomRatingDetails.appendChild(roomStar);
    roomRatingDetails.appendChild(setRating(room.rating));
    roomRatingDetails.appendChild(setNumRatings(room.numRating, room.super));
    return roomRatingDetails;
}

function setImage(photo) {
    var roomImage = document.createElement("img");
    roomImage.setAttribute("src", photo);
    return roomImage;
}

function setRoomDetails(room) {
    var roomDetails = document.createElement("div");
    roomDetails.className = "card-details";

    roomDetails.appendChild(setLocation(room.location, room.plus));
    roomDetails.appendChild(setTitle(room.title));
    roomDetails.appendChild(setPrice(room.price));
    roomDetails.appendChild(setRatingDetails(room));

    return roomDetails;
}

async function displayRooms() {
    const listing = await getListing();
    const roomDiv = document.getElementById("listing-master");

    for (i = 0; i < listing.count; i++) {
        var roomCard = document.createElement("article");
        roomCard.className = "room-card";

        roomCard.appendChild(setImage(listing.rooms[i].photo));
        roomCard.appendChild(setRoomDetails(listing.rooms[i]));

        roomDiv.appendChild(roomCard);
    }
}

function createRoom() {

}

displayRooms();