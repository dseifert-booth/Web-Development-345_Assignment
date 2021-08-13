var room;

async function getRoomData() {
    var room;

    await fetch("/room-data")
    .then(response => response.json())
    .then(data => room = data);

    return room;
}

function setRoomNum(roomNum) {
    var h3 = document.getElementById("rd-roomnum");
    h3.insertAdjacentHTML('beforeend', roomNum);
}

function setLocation(location) {
    var p = document.getElementById("rd-location");
    p.innerText = location;
}

function setImgGrid(photo) {
    var imgGrid = document.getElementById("rd-img-grid");
    for (var i = 0; i < 4; i++) {
        var gridImg = document.createElement("img");
        gridImg.setAttribute("class", "grid-img");
        gridImg.setAttribute("src", photo);
        imgGrid.appendChild(gridImg);
    }
}

function setPhoto(photo) {
    var div = document.getElementById("main-img");
    div.style.backgroundImage = 'url("..' + photo +'")';

    setImgGrid(photo);
}

function setTitle(title) {
    var h4 = document.getElementById("rd-title");
    h4.insertAdjacentHTML('afterbegin', title);
}

function setDesc(desc) {
    var p = document.getElementById("rd-desc");
    p.innerHTML = desc;
}

function setPrice(price, discount) {
    var h4 = document.getElementById("rd-price");

    var span1 = document.createElement("span");
    span1.setAttribute("id", "rd-discount");

    var span2 = document.createElement("span");
    span2.setAttribute("id", "rd-permonth");
    span2.innerHTML = "/month";

    if (discount != false) {
        span1.innerHTML = "$" + discount;
        h4.appendChild(span1);
        h4.insertAdjacentHTML('beforeend', " ");
    }
    h4.insertAdjacentHTML('beforeend', "$" + price);
    h4.appendChild(span2);

}

async function displayRoomData() {
    room = await getRoomData();

    setRoomNum(room.roomNum);
    setLocation(room.location);
    setPhoto(room.photo);
    setTitle(room.title);
    setDesc(room.description);
    setPrice(room.price, false);
}

var bookRoom = document.getElementById("book-form");

bookRoom.addEventListener("input", function() {
    var checkin = new Date(document.getElementById("checkin").value);
    var checkout = new Date(document.getElementById("checkout").value);
    var accPrice = document.getElementById("rd-acc-fee");
    var total = document.getElementById("rd-total");
    var dayDiff = (checkout.getTime() - checkin.getTime()) / (1000 * 3600 * 24);
    var discount = 0;
    var cleaning = 70;
    var service = 60
    var totalCost = 0;
    

    accPrice.innerHTML = "$(n/a)";
    total.innerHTML = "$(n/a)";

    if (checkin != "Invalid Date" && checkout != "Invalid Date" ) {
        if (dayDiff > 0) {
            var roundedPrice = Math.ceil((room.price / 30) * dayDiff);
            accPrice.innerHTML = "$" + roundedPrice;
            totalCost = roundedPrice - discount + cleaning + service;
            console.log(totalCost);
        }

        total.innerHTML = "$" + totalCost;
    }
});

displayRoomData();