app.controller('physController', function($scope, $interval) {
    // data structures //////////
    $scope.xArray = [];
    $scope.yArray = [];

    $scope.vxArray = [];
    $scope.vyArray = [];

    $scope.xSize = [];
    $scope.ySize = [];
    $scope.objects = 0;
    /////////////////////////////
    // need function to initialize data structures
    // only need a single object for now. Just push a single set of values
    $scope.xArray.push(30);    
    $scope.yArray.push(window.innerHeight-10);
    $scope.vxArray.push(0);    
    $scope.vyArray.push(0);
    $scope.xSize.push(10);
    $scope.ySize.push(10);
    $scope.objects++;
    //////////////////////////////////////////////

    // $interval function that iterates through data structures and updates positions and velocities
    $interval(function(){
        if($scope.aDown) $scope.vxArray[0] = -8;
        if($scope.dDown) $scope.vxArray[0] = 8;
        for(i=0;i<$scope.objects;i++) {
            // update the position using the velocity
            $scope.xArray[i] += $scope.vxArray[i];
            $scope.yArray[i] += $scope.vyArray[i];
            // check for collisions with boundaries (check for collisions with other objects eventually)
            if($scope.xArray[i] < 0) { $scope.xArray[i] = 0; $scope.vxArray[i] = 0; }
            if($scope.xArray[i] > window.innerWidth-$scope.xSize[i]) { $scope.xArray[i] = window.innerWidth-$scope.xSize[i]; $scope.vxArray[i] = 0; }

            if($scope.yArray[i] < 0) $scope.yArray[i] = 0;
            if($scope.yArray[i] > window.innerHeight-$scope.ySize[i]) { $scope.yArray[i] = window.innerHeight-$scope.ySize[i]; $scope.vyArray[i] = 0; }
            //handle acceleration
            $scope.vxArray[i] = $scope.vxArray[i] - 0.7*$scope.vxArray[i];
            if($scope.vxArray[i] < 0.01) $scope.vxArray[i] = 0;

            if(i == 0 && $scope.wDown)
                $scope.vyArray[i] += 0.3;
            else $scope.vyArray[i] += 1;
        }
        if($scope.yArray[0] >= window.innerHeight-$scope.ySize[0])
            $scope.jumpInProgress = false;
    },5);
    ////////////////////////////////////////////////////////////////////////////////////////////////
    $scope.wDown = false; $scope.aDown = false; $scope.dDown = false; $scope.jumpInProgress = false;
    // input handling variables and functions ///
    $scope.handleKeys = function(event, keyDown) {
        console.log(event.keyCode);
        // 87 65 68
        switch(event.keyCode) {
            case 87: // w
                $scope.wDown = keyDown;
                if(!$scope.jumpInProgress) {
                    $scope.jumpInProgress = true;
                    $scope.vyArray[0] = -15;
                }
            break;
            case 65: // a
                $scope.aDown = keyDown;
            break;
            case 68: // d
                $scope.dDown = keyDown;
            break;   
        }
    }
    /////////////////////////////////////////////
});