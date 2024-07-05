
const IMAGE_PATH = "../pictures/rand_pictures/p";
const NUM_PICTURES = 5;

const imagesOnScreen = [];
const imageUrls = [];

class ImageObject {

    constructor(url, xCoord, yCoord, xVelo, yVelo, size, id){
        this._url = url;
        this._xCoord = xCoord;
        this._yCoord = yCoord;
        this._xVelo = xVelo;
        this._yVelo = yVelo;
        this._size = size;
        this._id = id;
    }

    get url() {
        return this._url;
    }

    set url(newUrl) {
        this._url = newUrl;
    }

    // Getter and Setter for xCoord
    get xCoord() {
        return this._xCoord;
    }

    set xCoord(newXCoord) {
        this._xCoord = newXCoord;
    }

    // Getter and Setter for yCoord
    get yCoord() {
        return this._yCoord;
    }

    set yCoord(newYCoord) {
        this._yCoord = newYCoord;
    }

    // Getter and Setter for xVelo
    get xVelo() {
        return this._xVelo;
    }

    set xVelo(newXVelo) {
        this._xVelo = newXVelo;
    }

    // Getter and Setter for yVelo
    get yVelo() {
        return this._yVelo;
    }

    set yVelo(newYVelo) {
        this._yVelo = newYVelo;
    }

    // Getter and Setter for size
    get size() {
        return this._size;
    }

    set size(newSize) {
        this._size = newSize;
    }

    get id(){
        return this._id;
    }

    set id(newId){
        this._id = newId;
    }


}

function placePicture(image){
    
    const img = document.createElement('img');
    img.src = chrome.runtime.getURL(image.url);
    img.style.position = 'absolute';
    img.style.top = `${image.yCoord}px`;
    img.style.left = `${image.xCoord}px`;
    img.style.zIndex = '9999';
    img.style.width = `${image.size}px`;
    img.style.height = `${image.size}px`;
    img.id = image.id;
    img.alt = "wont load";


    let prevClicked = false;
    let clickTimeout;

    img.onmouseover = () =>  {

        if (prevClicked){
            removePicture(image);
        }
        else {
            clickTimeout = setTimeout(() => {
            removePicture(image);
            }, 500);
            prevClicked = true;
        }
        

    }
    img.onclick = () => {
        clearTimeout(clickTimeout);
        driftPicture(image);
    }

    
    document.body.appendChild(img);
}

function removePicture(image){
    const img = document.getElementById(image.id);
    if(img){
        img.remove();
    }
    const index = imagesOnScreen.findIndex(img => img.id ===image.id);
    if(index !== -1){
        imagesOnScreen.splice(index, 1);
    }
}

function updatePicture(image){

    const img = document.getElementById(image.id);

    if(img){
        image.xCoord += image.xVelo;
        image.yCoord += image.yVelo;
        img.style.left = `${image.xCoord}px`
        img.style.top = `${image.yCoord}px`

        if (image.xCoord <= 0 || image.xCoord >= window.innerWidth - image.size){
            image.xVelo *= -1;
        }
        if(image.yCoord <= 0 || image.yCoord >= window.innerHeight - image.size){
            image.yVelo *= -1;
        }

        for (let otherImage of imagesOnScreen){
            if(otherImage.id !== image.id && checkCollision(image, otherImage)){
                console.log("pics collided");
                handleCollision(image, otherImage);
            }
        }
        requestAnimationFrame(() => updatePicture(image));

    }


}

function driftPicture(image){

    image.xVelo = Math.random() * 3 + .6;
    image.yVelo = Math.random() * 3 + .6;
    updatePicture(image);

}

function checkCollision(image1, image2){

    return !(
        image1.xCoord + image1.size < image2.xCoord ||    
        image1.xCoord > image2.xCoord + image2.size ||             
        image1.yCoord + image1.size < image2.yCoord ||      
        image1.yCoord > image2.yCoord + image2.size         
    );
}

function handleCollision(image1, image2){
   // image1.xVelo == (image1.xVelo * -1) + (Math.random() / 2) - (Math.random() / 2);
    //image1.yVelo == (image1.yVelo * -1) + (Math.random() / 2) - (Math.random() / 2);
    //image2.xVelo == (image2.xVelo * -1) + (Math.random() / 2) - (Math.random() / 2);
    //image2.yVelo == (image2.yVelo * -1) + (Math.random() / 2) - (Math.random() / 2);

    image1.xVelo *= -1;
    image2.xVelo *= -1;
    image1.yVelo *= -1;
    image2.yVelo *= -1;


}

function sleep(ms){
    return new Promise(resolve => setTimeout(resolve, ms));
}

function gaussianRandom(mean = 8, stdDev = 3) {
    let u1 = Math.random();
    let u2 = Math.random();

    let randStdNormal = Math.sqrt(-2.0 * Math.log(u1)) * Math.sin(2.0 * Math.PI * u2); // Random normal(0,1)
    let randNormal = mean + stdDev * randStdNormal; // Random normal(mean,stdDev)

    return randNormal;
}


async function generatePictures(){

    const numPictures = gaussianRandom();
    
    for(let i = 0; i < numPictures; i ++){

        let randomIndex = Math.floor(Math.random() * NUM_PICTURES);
        let imageUrl = IMAGE_PATH + randomIndex + ".png";
        let imageSize = Math.random() * 200 + 50;
        let randx = Math.random() * (window.innerWidth - imageSize);
        let randy = Math.random() * (window.innerHeight - imageSize);
    
        const myImg = new ImageObject(imageUrl, randx, randy, 0, 0, imageSize, "id" + i);
        placePicture(myImg);
        imagesOnScreen.push(myImg);
        driftPicture(myImg);
    
    }

}

let generate = (Math.random() < .15);

if (generate){
    generatePictures();
}







