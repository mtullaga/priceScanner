
document.addEventListener('deviceready', onDeviceReady, false);

function onDeviceReady() {

    // console.log('Running cordova-' + cordova.platformId + '@' + cordova.version);
    // document.getElementById('deviceready').classList.add('ready');

    var scannerConfig = {
        preferFrontCamera : true, // iOS and Android
        showFlipCameraButton : true, // iOS and Android
        showTorchButton : true, // iOS and Android
        torchOn: false, // Android, launch with the torch switched on (if available)
        saveHistory: true, // Android, save scan history (default false)
        prompt : "Place a barcode inside the scan area", // Android
        resultDisplayDuration: 500, // Android, display scanned text for X ms. 0 suppresses it entirely, default 1500
        // formats : "QR_CODE,PDF_417", // default: all but PDF_417 and RSS_EXPANDED
        orientation : "portrait", // Android only (portrait|landscape), default unset so it rotates with the device
        disableAnimations : true, // iOS
        disableSuccessBeep: false, // iOS and Android
        continuousMode: false // Android
    }

    function checkConnection() {
        var networkState = navigator.connection.type;
    
        var states = {};
        states[Connection.UNKNOWN]  = 'Unknown connection';
        states[Connection.ETHERNET] = 'Ethernet connection';
        states[Connection.WIFI]     = 'WiFi connection';
        states[Connection.CELL_2G]  = 'Cell 2G connection';
        states[Connection.CELL_3G]  = 'Cell 3G connection';
        states[Connection.CELL_4G]  = 'Cell 4G connection';
        states[Connection.CELL]     = 'Cell generic connection';
        states[Connection.NONE]     = 'No network connection';
    
        return states[networkState];
    }
    
    // Check internet Connection
    if(checkConnection() == 'No network connection') {
        navigator.notification.alert('Please connect to the internet. Palihug!')
    }

    
    $('#openScanner').click(function(){
        if(checkConnection() == 'No network connection') {
            navigator.notification.alert('Please connect to the internet. Palihug!')
        }else{
            cordova.plugins.barcodeScanner.scan(
                function (result) {
                    var code = result.text;
                    
                },
                function (error) {
                    alert("Scanning failed: " + error);
                }
            );
        
        }
    })


    $('#addItem').click(function (){

        if(checkConnection() == 'No network connection') {
            navigator.notification.alert('Please connect to the internet. Palihug!')
        }else{
            cordova.plugins.barcodeScanner.scan(
                function (result) {
                    var code = result.text;

                    function onPrompt(results) {
                        alert(results.buttonIndex)

                        // db.collection("items").add({
                        //     itemCode: code,
                        //     itemName: "item name",
                        //     itemPrice: results.input1
                        // })
                        // .then((docRef) => {
                        //     alert("Save Successfully");
                        // })
                        // .catch((error) => {
                        //     alert("Error adding document: ", error);
                        // });
                    }
                    
                    navigator.notification.prompt(
                        'Please enter the price.',  // message
                        onPrompt,                  // callback to invoke
                        'Registration',            // title
                        ['Ok','Cancel'],             // buttonLabels
                        '0'                 // defaultText
                    );
                },
                function (error) {
                    alert("Scanning failed: " + error);
                },scannerConfig);
        }
    })

    $('#addItem').click(function (){
        if(checkConnection() == 'No network connection') {
            navigator.notification.alert('Please connect to the internet. Palihug!')
        }else{
        
        
        }
    })










    
    
  

    
}

