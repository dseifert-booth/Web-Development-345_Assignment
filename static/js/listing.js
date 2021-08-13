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
        roomLocation.insertAdjacentHTML('beforeend'," Verified - ");
    } else {
        roomLocation.insertAdjacentHTML('beforeend', "Entire Apartment - ");
    }
    roomLocation.insertAdjacentHTML('beforeend', location);
    return roomLocation;
}

function setTitle(title, roomNum, booked) {
    var roomTitle = document.createElement("h4");
    var roomLink = document.createElement("a");
    roomLink.innerHTML = title;
    
    if (!booked) {
        roomLink.setAttribute("id", "ls-not-booked");
        roomLink.setAttribute('href', "/room-desc?room=" + roomNum)
    } else {
        roomLink.insertAdjacentHTML('beforeend', " (Booked!)");
    }

    
    roomTitle.appendChild(roomLink);
    return roomTitle;
}

function setPrice(price) {
    var roomPrice = document.createElement("p");
    roomPrice.insertAdjacentHTML('beforeend', "$" + price + " CAD/night");
    return roomPrice;
}

function setRating(rating) {
    var roomRating = document.createElement("p");
    roomRating.className = "rating";
    roomRating.innerHTML = rating;
    if (rating % 1 == 0) {
        roomRating.insertAdjacentHTML('beforeend', ".00");
    }
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

function setImage(photo, booked) {
    var roomImage = document.createElement("img");
    roomImage.setAttribute("src", photo);
    if (booked) {
        roomImage.style.filter = "grayscale(100%)"
    }
    return roomImage;
}

function setRoomDetails(room) {
    var roomDetails = document.createElement("div");
    roomDetails.className = "card-details";

    roomDetails.appendChild(setLocation(room.location, room.plus));
    roomDetails.appendChild(setTitle(room.title, room.roomNum, room.booked));
    roomDetails.appendChild(setPrice(room.price));
    roomDetails.appendChild(setRatingDetails(room));

    return roomDetails;
}

async function displayRooms(fetchedListing) {
    var listing;
    
    if (fetchedListing) {
        listing = fetchedListing;
    } else {
        listing = await getListing();
    }

    const roomDiv = document.getElementById("listing-master");

    while (roomDiv.lastChild) {
        roomDiv.removeChild(roomDiv.lastChild);
    }

    for (i = 0; i < listing.count; i++) {
        var roomCard = document.createElement("article");
        roomCard.className = "room-card";

        roomCard.appendChild(setImage(listing.rooms[i].photo, listing.rooms[i].booked));
        roomCard.appendChild(setRoomDetails(listing.rooms[i]));

        roomDiv.appendChild(roomCard);
    }
}

async function searchRooms() {
    var location = document.getElementById("s-locations").value;
    
    if (location != "Search") {
        var listing = {
            rooms: this.rooms,
            count: this.count
        };
        var fetchString = "/search-rooms?location=" + location;
    
        await fetch(fetchString)
        .then(response => response.json())
        .then(data => {
            listing.rooms = data.rooms;
            listing.count = data.count;
        });
    
        console.log(listing);
        displayRooms(listing);
    } else {
        displayRooms();
    }
}

displayRooms();