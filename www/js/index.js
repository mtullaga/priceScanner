
document.addEventListener('deviceready', onDeviceReady, false);
document.addEventListener("backbutton", onBackButton, false);

function onBackButton(){
    navigator.notification.confirm("You want to exit app?", 
                                confirmCallback,
                                'Exit', 
                                ['Ok', 'Cancel'])
    function confirmCallback(index){
        if(index == 1){
            navigator.app.exitApp();
        }else{
            
        }
    }
}

function onDeviceReady() {

    // console.log('Running cordova-' + cordova.platformId + '@' + cordova.version);
    // document.getElementById('deviceready').classList.add('ready');

    var scannerConfig = {
        preferFrontCamera : false, // iOS and Android
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

    var db = firebase.firestore();

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


    // Scan Price Section
    $('#openScanner').click(function(){
        if(checkConnection() == 'No network connection') {
            navigator.notification.alert('Please connect to the internet. Palihug!')
        }else{
            cordova.plugins.barcodeScanner.scan(
                function (result) {
                    var code = result.text;
                    db.collection("items").where("itemCode", "==", code)
                        .get()
                        .then((querySnapshot) => {
                            if(querySnapshot.docs.length == 0){
                                alert('Item not exist please register the item.');
                            }else{
                                querySnapshot.forEach((doc) => {
                                    $('#item-code').empty();
                                    $('#item-name').empty();
                                    $('#item-price').empty();
                                    $('#item-code').append('<i>Item Code:</i> ' +doc.data().itemCode);
                                    $('#item-name').append('<i>Item Name:</i> ' +doc.data().itemName);
                                    $('#item-price').append('<i>Item Price:</i> <font style="color: blue; font-size: 24px">' 
                                    +doc.data().itemPrice + '</font>');
                                });
                            }
                           
                        })
                        .catch((error) => {
                            console.log("Error getting documents: ", error);
                        });
                },
                function (error) {
                    alert("Scanning failed: " + error);
                }
            );
        
        }
    })


    // Add Item section
    $('#addItem').click(function (){

        if(checkConnection() == 'No network connection') {
            navigator.notification.alert('Please connect to the internet. Palihug!')
        }else{
            cordova.plugins.barcodeScanner.scan(
                function (result) {
                    var code = result.text;
                    if(code != ''){
                        db.collection("items").where("itemCode", "==", code)
                            .get()
                            .then((querySnapshot) => {
                                if(querySnapshot.docs.length != 0){
                                    alert('Item registered already. Choose another item.')
                                }else{
                                    function onPrompt(results1) {
                                        if(results1.buttonIndex == 1){
                                            function onPrompt(results) {
                                                if(results.buttonIndex == 1){
                                                    if(isNaN(results.input1)){
                                                        alert('Please input a number.');
                                                    }else{
                                                        // alert(db)
                                                        db.collection("items").add({
                                                            itemCode: code,
                                                            itemName: results1.input1,
                                                            itemPrice: results.input1
                                                        })
                                                        .then((docRef) => {
                                                            alert("Save Successfully");
                                                        })
                                                        .catch((error) => {
                                                            alert("Error adding document: ", error);
                                                        });
                                                    }
                                                }
                                            }
                                            
                                            navigator.notification.prompt(
                                                'Please enter the price.',  // message
                                                onPrompt,                  // callback to invoke
                                                'Add New Item',            // title
                                                ['Ok','Cancel'],             // buttonLabels
                                                ''                 // defaultText
                                            );
                                        }
                                    }
                                    navigator.notification.prompt(
                                        'Please enter the item name.',  // message
                                        onPrompt,                  // callback to invoke
                                        'Add New Item',            // title
                                        ['Ok','Cancel'],             // buttonLabels
                                        ''                 // defaultText
                                    );
                                }
                                
                            })
                            .catch((error) => {
                                console.log("Error getting documents: ", error);
                            });
                    }
                },
                function (error) {
                    alert("Scanning failed: " + error);
                },scannerConfig);
        }
    })


// Edit Item section
    $('#editItem').click(function (){
        if(checkConnection() == 'No network connection') {
            navigator.notification.alert('Please connect to the internet. Palihug!')
        }else{
            cordova.plugins.barcodeScanner.scan(
                function (result) {
                    var code = result.text;
                    if(code != ''){
                        db.collection("items").where("itemCode", "==", code)
                        .get()
                        .then((querySnapshot) => {
                            if(querySnapshot.docs.length == 0){
                                alert('Item not exist please register the item.')
                            }else{
                                querySnapshot.forEach((doc) => {
                                    updatePrice(doc.id)
                                });
                            }
                            
                        })
                        .catch((error) => {
                            console.log("Error getting documents: ", error);
                        });
                    }
                },
                function (error) {
                    alert("Scanning failed: " + error);
                },scannerConfig);
        }

        function updatePrice(id){
            function onPrompt(results) {
                            
                if(results.buttonIndex == 1){
                    if(isNaN(results.input1)){
                        alert('Please input a number.');
                    }else{
                        db.collection("items").doc(id).update({
                            itemPrice: results.input1
                        })
                        .then(() => {
                            alert("Item price successfully updated.");
                        })
                        .catch((error) => {
                            alert("Error updating price: ", error);
                        });
                    }
                }
            }
            
            navigator.notification.prompt(
                'Please enter new price.',  // message
                onPrompt,                  // callback to invoke
                'Edit Price',            // title
                ['Ok','Cancel'],             // buttonLabels
                '0'                 // defaultText
            );
        }
    })










    
    
  

    
}

