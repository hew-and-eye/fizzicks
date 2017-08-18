let mapSizeX = window.innerWidth;
let mapSizeY = window.innerHeight;
let xArray = [], yArray = [];
let vxArray = [], vyArray = [];
let xSize = [], ySize = [];
let objects = 0;
let wDown = false, aDown = false, dDown = false, jumpInProgress = false;
let collMap = [[], []];//new Array(Math.floor(mapSizeX / 10));

let setupKeydownEvent = () => {
    let keyHandler = (event, keyDown) => {
        console.log(event.keyCode); // 87 = w, 65 = a, 68 = d
        switch (event.keyCode) {
            case 87:
                wDown = keyDown;
                if (!jumpInProgress) {
                    jumpInProgress = true;
                    vyArray[0] = -15;
                }
                break;
            case 65:
                aDown = keyDown;
                break;
            case 68:
                dDown = keyDown;
                break;
        }
    };
    document.getElementById('frame').addEventListener('keydown', (event) => {
        keyHandler(event, true);
    });
    document.getElementById('frame').addEventListener('keyup', (event) => {
        keyHandler(event, false);
    });
};

let setupInterval = () => {
    setInterval(() => {
        if (aDown) vxArray[0] = -5;
        if (dDown) vxArray[0] = 5;
        for (i = 0; i < objects; i++) {
            let oldX = xArray[i];
            let oldY = yArray[i];
            // update the position using the velocity
            if (!checkCollision(i, xArray[i] + vxArray[i], yArray[i] + vyArray[i])) {
                xArray[i] += vxArray[i];
                yArray[i] += vyArray[i];
                updateCollMap(i, oldX, oldY);
            }
            else if (!checkCollision(i, xArray[i] + vxArray[i], yArray[i])) {
                //console.log("1st collision type");
                if (vyArray[i] > 0) jumpInProgress = false;
                vyArray[i] = 0;
                xArray[i] += vxArray[i];
                //yArray[i] += vyArray[i];
                updateCollMap(i, oldX, oldY);
            }
            else if (!checkCollision(i, xArray[i], yArray[i] + vyArray[i])) {
                //console.log("2nd collision type");
                vxArray[i] = 0;
                //xArray[i] += vxArray[i];
                yArray[i] += vyArray[i];
                updateCollMap(i, oldX, oldY);
            }
            else {
                //console.log("3rd collision type");
                vyArray[i] = 0;
                jumpInProgress = false;
            }
            //handle acceleration
            vxArray[i] = vxArray[i] - 0.7 * vxArray[i];
            if (vxArray[i] < 0.01) vxArray[i] = 0;

            if (i == 0 && wDown) {
                vyArray[i] += 0.2;
            } else {
                vyArray[i] += 0.4;
            }
            console.log("updating style...");
            document.getElementById(`object-${i}`).style.left = `${xArray[i]-5}px`;
            document.getElementById(`object-${i}`).style.top = `${yArray[i]-5}px`;
        }
        //if (yArray[0] >= window.innerHeight - ySize[0]) jumpInProgress = false;
    }, 5);
}
let setupCollMap = () => {
    for (i = 0; i < Math.floor(mapSizeX / 10); i++) {
        collMap.push([-1]);
        for (j = 0; j < Math.floor(mapSizeY / 10); j++) {
            collMap[i].push([-1]);
            collMap[i][j] = -1;
            if (i > Math.floor(mapSizeX / 10) - 5
                || j > Math.floor(mapSizeY / 10) - 5
                || i == 0 || j == 0)
                collMap[i][j] = objects + 1;
        }
    }
    for (i = 0; i < objects; i++) {
        collMap[Math.floor(xArray[i] / 10)][Math.floor(yArray[i] / 10)] = i;
    }
    //console.log("collMap info: " + collMap[Math.floor(xArray[0] / 10)][Math.floor(yArray[0] / 10)]);
}

let checkCollision = (objectIndex, newX, newY) => {
    //console.log("x: " + newX + "\ny: " + newY);
    //return false;
    //for (i = newX; i < newX + xSize[objectIndex]; i++)
    //    for (j = newY; j < newY + ySize[objectIndex]; j++) {
    //        if (collMap[Math.floor(i / 10)][Math.floor(j / 10)] != -1
    //            && collMap[Math.floor(i / 10)][Math.floor(j / 10)] != objectIndex) return false;
    //    }
    if (collMap[Math.floor(newX / 10)][Math.floor(newY / 10)] == -1) return false;
    if (collMap[Math.floor(newX / 10)][Math.floor(newY / 10)] == objectIndex) return false;
    //if (collMap[Math.floor(newX / 10)][Math.floor(newY / 10)] === null) return false;
    //if (collMap[Math.floor(newX / 10)][Math.floor(newY / 10)] == undefined) return false;
    //console.log("collided with: " + collMap[Math.floor(newX / 10)][Math.floor(newY / 10)]);
    return true;
}

let updateCollMap = (objectIndex, oldX, oldY) => {
    if (collMap[Math.floor(oldX / 10)][Math.floor(oldY / 10)] == objectIndex) {
        collMap[Math.floor(oldX / 10)][Math.floor(oldY / 10)] = -1;
        let newX = xArray[objectIndex];
        let newY = yArray[objectIndex];
        collMap[Math.floor(newX / 10)][Math.floor(newY / 10)] = objectIndex;
    }
}

window.onload = () => {
    xArray.push(50);
    yArray.push(window.innerHeight - 200);
    vxArray.push(0);
    vyArray.push(0);
    xSize.push(25);
    ySize.push(68);
    objects++;
    xArray.push(100);
    yArray.push(window.innerHeight - 200);
    vxArray.push(0);
    vyArray.push(0);
    xSize.push(25);
    ySize.push(68);
    objects++;
    setupInterval();
    setupKeydownEvent();
    setupCollMap();
    document.getElementById("object-0").focus();
};