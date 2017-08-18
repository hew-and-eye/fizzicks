let xArray = [], yArray = [];
let vxArray = [], vyArray = [];
let xSize = [], ySize = [];
let objects = 0;
let wDown = false, aDown = false, dDown = false, jumpInProgress = false;

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
    if (aDown) vxArray[0] = -8;
    if (dDown) vxArray[0] = 8;
    for (i = 0; i < objects; i++) {
      // update the position using the velocity
      xArray[i] += vxArray[i];
      yArray[i] += vyArray[i];

      // check for collisions with boundaries (check for collisions with other objects eventually)
      if (xArray[i] < 0) {
        xArray[i] = 0;
        vxArray[i] = 0;
      }
      if (xArray[i] > window.innerWidth - xSize[i]) {
        xArray[i] = window.innerWidth - xSize[i];
        vxArray[i] = 0;
      }

      if (yArray[i] < 0) yArray[i] = 0;
      if (yArray[i] > window.innerHeight - ySize[i]) {
        yArray[i] = window.innerHeight - ySize[i];
        vyArray[i] = 0;
      }
      //handle acceleration
      vxArray[i] = vxArray[i] - 0.7 * vxArray[i];
      if (vxArray[i] < 0.01) vxArray[i] = 0;

      if (i == 0 && wDown) {
        vyArray[i] += 0.3;
      } else {
        vyArray[i] += 1;
      }
      document.getElementById(`object-${i}`).style.left = `${xArray[i]}px`;
      document.getElementById(`object-${i}`).style.top = `${yArray[i]}px`;
    }
    if (yArray[0] >= window.innerHeight - ySize[0]) jumpInProgress = false;
  }, 5);
}

window.onload = () => {
  xArray.push(50);
  yArray.push(window.innerHeight - 68);
  vxArray.push(0);
  vyArray.push(0);
  xSize.push(25);
  ySize.push(68);
  objects++;
  setupInterval();
  setupKeydownEvent();
  document.getElementById("object-0").focus();
};