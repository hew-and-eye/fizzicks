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
        //console.log(event.keyCode); // 87 = w, 65 = a, 68 = d
        switch (event.keyCode) {
            case 87:
                wDown = keyDown;
                if (!jumpInProgress) {
                    jumpInProgress = true;
                    vyArray[0] = -10;
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
                //console.log("clause 1");
                xArray[i] += vxArray[i];
                yArray[i] += vyArray[i];
                updateCollMap(i, oldX, oldY);
            }
            else if (!checkCollision(i, xArray[i] + vxArray[i], yArray[i])) {
                if (vyArray[i] >= 0 && i == 0) {
                    jumpInProgress = false;
                }
                vyArray[i] = 0;
                xArray[i] += vxArray[i];
                //yArray[i] += vyArray[i];
                updateCollMap(i, oldX, oldY);
            }
            else if (!checkCollision(i, xArray[i], yArray[i] + vyArray[i])) {
                //console.log("clause 3");
                //console.log("2nd collision type");
                vxArray[i] = 0;
                //xArray[i] += vxArray[i];
                yArray[i] += vyArray[i];
                updateCollMap(i, oldX, oldY);
            }
            else {
                //console.log("clause 4");
                //console.log("3rd collision type");
                vyArray[i] = 0;
                //console.log("resetting in else clause");
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
            //console.log("updating style...");
            document.getElementById(`object-${i}`).style.left = `${xArray[i]}px`;
            document.getElementById(`object-${i}`).style.top = `${yArray[i]-10}px`;
        }
        //if (yArray[0] >= window.innerHeight - ySize[0]) jumpInProgress = false;
    }, 5);
}
let setupCollMap = () => {
    for (i = 0; i < Math.floor(mapSizeX); i++) {
        collMap.push([-1]);
        for (j = 0; j < Math.floor(mapSizeY); j++) {
            collMap[i].push([-1]);
            collMap[i][j] = -1;
            if (i > Math.floor(mapSizeX) - 50
                || j > Math.floor(mapSizeY) - 50
                || i == 0 || j == 0)
                collMap[i][j] = objects + 1;
        }
    }
    for (i = 0; i < objects; i++) {
        collMap[Math.floor(xArray[i])][Math.floor(yArray[i])] = i;
    }
    //console.log("collMap info: " + collMap[Math.floor(xArray[0] / 10)][Math.floor(yArray[0] / 10)]);
}

let checkCollision = (objectIndex, newX, newY) => {
    //console.log("x: " + newX + "\ny: " + newY);
    //return false;
    for (k = Math.floor(newX); k < Math.floor(newX + xSize[objectIndex]); k++) {
       for (l = Math.floor(newY); l < Math.floor(newY + ySize[objectIndex]); l++) {
           if (collMap[Math.floor(k)][Math.floor(l)] != -1
               && collMap[Math.floor(k)][Math.floor(l)] != objectIndex) {
                   //console.log("found collision");
                   return true;
               }
       }
    }
    return false;
    // if (collMap[Math.floor(newX)][Math.floor(newY)] != -1 && collMap[Math.floor(newX)][Math.floor(newY)] != objectIndex)
    //     return true;

    //    console.log("no collision");
    //    return false;

    //if (collMap[Math.floor(newX)][Math.floor(newY)] == -1) return false;
    //if (collMap[Math.floor(newX)][Math.floor(newY)] == objectIndex) return false;
    // return true;
}

let updateCollMap = (objectIndex, oldX, oldY) => {
    // if (collMap[Math.floor(oldX)][Math.floor(oldY)] == objectIndex) {
    //     collMap[Math.floor(oldX)][Math.floor(oldY)] = -1;
    //     let newX = xArray[objectIndex];
    //     let newY = yArray[objectIndex];
    //     collMap[Math.floor(newX)][Math.floor(newY)] = objectIndex;
    // }
    let newX = Math.floor(xArray[objectIndex]);
    let newY = Math.floor(yArray[objectIndex]);
    oldX = Math.floor(oldX);
    oldY = Math.floor(oldY);
    for(k = 0; k < xSize[objectIndex]; k++)
        for(l = 0; l < ySize[objectIndex]; l++) {
            if(collMap[oldX + k][oldY + l] == -1 || collMap[oldX + k][oldY + l] == objectIndex)
                collMap[oldX + k][oldY + l] = -1;
            if(collMap[newX + k][newY + l] == -1 || collMap[newX + k][newY + l] == objectIndex)
                collMap[newX + k][newY + l] = objectIndex;
        }
}

window.onload = () => {
    xArray.push(50);
    yArray.push(window.innerHeight - 200);
    vxArray.push(0);
    vyArray.push(0);
    xSize.push(10);
    ySize.push(10);
    objects++;

    xArray.push(100);
    yArray.push(window.innerHeight - 200);
    vxArray.push(0);
    vyArray.push(0);
    xSize.push(100);
    ySize.push(100);
    objects++;

    xArray.push(400);
    yArray.push(window.innerHeight - 500);
    vxArray.push(0);
    vyArray.push(0);
    xSize.push(50);
    ySize.push(200);
    objects++;
    setupCollMap();
    setupKeydownEvent();
    setupInterval();
    document.getElementById("object-0").focus();
};