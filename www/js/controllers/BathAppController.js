angular.module('MyBath.BathAppController', [])
.controller('BathAppController', function ($scope, $state, $timeout, $ionicModal, $ionicLoading, $cordovaStatusbar, $cordovaCalendar, $ionicPlatform, UserData, BathData, Reports, Comments, FeedData, LiveTravel, $ionicSideMenuDelegate, $ionicActionSheet, $ionicPopup, DataTransformations) {

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // STARTUP
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    /////////////////////////////////////////////////////////////////////////////////////////////
    // Variables: Global
    /////////////////////////////////////////////////////////////////////////////////////////////
    $scope.currentReport = { type: '', description: '', userFirstname: '', userLastname: '', locationFound: true, useUserLocation: true, usePersonalDetails: true, userAddress: '', userUPRN: '', userLat: '', userLon: '', photo: '', lat: '', long: '', status: 'Not sent', photo: '' };
    $scope.currentComment = Comments.getDefaultComment();
    $scope.userData = UserData.all();
    $scope.reports = Reports.getReports();
    $scope.comments = Comments.getComments();
    $scope.currentLocation = null;
    $scope.addresses = [];

    $scope.myCouncil = BathData.getMyCouncil();
    $scope.myNearest = BathData.getMyNearest();
    $scope.myHouse = BathData.getMyHouse();

    $scope.reportMap = {
        defaults: {
            tileLayer: 'http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}' + (L.Browser.retina ? '@2x' : '') + '.png',
            maxZoom: 20,
            zoomControlPosition: 'bottomleft'
        },
        maxbounds: {
            northEast: { lat: 51.439536, lng: -2.278544 },
            southWest: { lat: 51.273101, lng: -2.705955 }
        },
        center: { lat: 51.3821440, lng: -2.3589420, zoom: 15 },
        markers: { reportItMarker: { lat: 0, lng: 0, focus: true, message: "Drag me to adjust position of report", draggable: true } }
    };


    $scope.carParkChart = {
        options: {
            //This is the Main Highcharts chart config. Any Highchart options are valid here.
            //will be overriden by values specified below.
            chart: {
                type: 'bar'
            },
            tooltip: {
                style: {
                    padding: 10,
                    fontWeight: 'bold'
                }
            },
            title: {
                text: ''
            },
            legend: {
                enabled: false
            }
        },
        //The below properties are watched separately for changes.

        //Series object (optional) - a list of series using normal highcharts series options.
        series: [{
            name: 'Spaces',
            data: []
        }],
        //Title configuration (optional)
        //title: {
        //text: 'Hello'
        //},
        //Boolean to control showng loading status on chart (optional)
        //Could be a string if you want to show specific loading text.
        loading: false,
        //Configuration for the xAxis (optional). Currently only one x axis can be dynamically controlled.
        //properties currentMin and currentMax provied 2-way binding to the chart's maximimum and minimum
        xAxis: {
            categories: [],
            //currentMin: 0,
            //currentMax: 100,
            title: { text: '' }
        },
        yAxis: {
            title: { text: 'Spaces remaining' }
        },
        //Whether to use HighStocks instead of HighCharts (optional). Defaults to false.
        useHighStocks: false,
        //size (optional) if left out the chart will default to size of the div or something sensible.
        size: {
            //width: 400,
            //height: 300
        },
        legend: {
            enabled: false
        },
        //function (optional)
        func: function (chart) {
            //setup some logic for the chart
        }
    };

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////// ///////////////
    // MODAL DEFINITIONS
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    /////////////////////////////////////////////////////////////////////////////////////////////
    // Modal: Register Details
    // The first register screen
    /////////////////////////////////////////////////////////////////////////////////////////////
    $ionicModal.fromTemplateUrl('templates/register-details.html', function (modal) {
        $scope.registerModal = modal;
    }, {
        scope: $scope
    });
    $scope.register = function () {
        $scope.registerModal.show();
    };
    $scope.closeRegister = function () {
        $scope.registerModal.hide();
    };

    /////////////////////////////////////////////////////////////////////////////////////////////
    // Modal: Register Address
    // Select address screen
    /////////////////////////////////////////////////////////////////////////////////////////////
    $ionicModal.fromTemplateUrl('templates/register-set-address.html', function (modal) {
        $scope.propertyModal = modal;
    }, {
        scope: $scope
    });
    $scope.setAddress = function () {
        $scope.propertyModal.show();
    };
    $scope.closeSetAddress = function () {
        $scope.propertyModal.hide();
    };

    /////////////////////////////////////////////////////////////////////////////////////////////
    // Modal: Display options
    // Options screen for local data display
    /////////////////////////////////////////////////////////////////////////////////////////////
    $ionicModal.fromTemplateUrl('templates/options-data-display.html', function (modal) {
        $scope.displayOptionsModal = modal;
    }, {
        scope: $scope
    });
    $scope.displayOptions = function () {
        $scope.displayOptionsModal.show();
    };
    $scope.closeDisplayOptions = function () {
        // Save user data
        UserData.save($scope.userData);
        $scope.displayOptionsModal.hide();
    };

    /////////////////////////////////////////////////////////////////////////////////////////////
    // Modal: NewComment
    // Planning comments screen
    /////////////////////////////////////////////////////////////////////////////////////////////
    $ionicModal.fromTemplateUrl('templates/comments-new.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function (modal) {
        $scope.commentModal = modal;
    });
    $scope.newComment = function () {
        $scope.commentModal.show();
        // Dummy reference for testing
        $scope.currentComment.reference = Math.floor((Math.random() * 100000000));

        // Populate the form with user address, if that info exists
        if ($scope.userData.address) {
            $scope.currentComment.address = $scope.userData.address;
        }
        if ($scope.userData.phone) {
            $scope.currentComment.userPhone = $scope.userData.phone;
        }
        if ($scope.userData.email) {
            $scope.currentComment.userEmail = $scope.userData.email;
        }
    };
    $scope.closeComment = function () {
        $scope.commentModal.hide();
    };
    $scope.submitCommentPage1 = function (comment) {
        if ($scope.currentComment.type) {

            $scope.commentModal.hide();
            $scope.commentComposeModal.show();
            return;
        }
    };

    /////////////////////////////////////////////////////////////////////////////////////////////
    // Modal: Comment Compose
    // planning comments screen: Compose comment
    /////////////////////////////////////////////////////////////////////////////////////////////
    $ionicModal.fromTemplateUrl('templates/comments-compose.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function (modal) {
        $scope.commentComposeModal = modal;
    });
    $scope.submitComment = function (comment) {
        $scope.commentComposeModal.hide();
        Comments.addComment($scope.currentComment);
        $scope.currentComment = Comments.getDefaultComment();
        $scope.comments = Comments.getComments();
    };

    /////////////////////////////////////////////////////////////////////////////////////////////
    // Modal: ReportIt
    // The first report it screen
    /////////////////////////////////////////////////////////////////////////////////////////////
    $ionicModal.fromTemplateUrl('templates/report-it-report.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function (modal) {
        $scope.reportItModal = modal;
    });
    $scope.reportIt = function () {
        $scope.reportItModal.show();
    };
    $scope.closeReportIt = function () {
        $scope.reportItModal.hide();
    };
    //Submit
    $scope.submitReportItPage1 = function (report) {
        $scope.currentReport.userFirstname = $scope.userData.firstname;
        $scope.currentReport.userLastname = $scope.userData.lastname;
        $scope.currentReport.userEmail = $scope.userData.email;
        $scope.currentReport.userPhone = $scope.userData.phone;
        $scope.reportItModal.hide();
        $scope.reportItPhotoModal.show();
    };

    /////////////////////////////////////////////////////////////////////////////////////////////
    // Modal: ReportIt Photo
    // Gives the user an option to add a photo to their report.
    /////////////////////////////////////////////////////////////////////////////////////////////
    $ionicModal.fromTemplateUrl('templates/report-it-photo.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function (modal) {
        $scope.reportItPhotoModal = modal;
    });
    $scope.reportItPhoto = function () {
        $scope.reportItPhotoModal.show();
    };
    $scope.closeReportItPhoto = function () {
        $scope.reportItPhotoModal.hide();
    };
    // Submit
    $scope.submitReportItPage2 = function (photo) {
        $scope.reportItPhotoModal.hide();
        $ionicLoading.show({
            template: 'Finding location...'
        });
        $scope.geoLocate();
    };

    /////////////////////////////////////////////////////////////////////////////////////////////
    // Modal: ReportIt Location
    // Add the user's current location to the report, or allows them to search for an address
    /////////////////////////////////////////////////////////////////////////////////////////////
    $ionicModal.fromTemplateUrl('templates/report-it-location.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function (modal) {
        $scope.reportItLocationModal = modal;
    });
    $scope.reportItLocation = function () {
        $scope.reportItLocationModal.show();

    };
    $scope.closeReportItLocation = function () {
        $scope.reportItLocationModal.hide();
    };
    // Submit
    $scope.submitReportItPage3 = function (location) {
        if ($scope.currentReport.useUserLocation) {
            $scope.currentReport.lat = $scope.currentLocation.coords.latitude;
            $scope.currentReport.long = $scope.currentLocation.coords.longitude;
        }
        $scope.reportItLocationModal.hide();
        $scope.reportItMapModal.show();
    };

    /////////////////////////////////////////////////////////////////////////////////////////////
    // Modal: ReportIt Map
    // Allows the user to customise the detected location
    /////////////////////////////////////////////////////////////////////////////////////////////
    $ionicModal.fromTemplateUrl('templates/report-it-map.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function (modal) {
        $scope.reportItMapModal = modal;
    });
    $scope.reportItMap = function () {
        $scope.reportItMapModal.show();

    };
    $scope.closeReportItMap = function () {
        $scope.reportItMapModal.hide();
    };
    // Submit
    $scope.submitReportItPage4b = function (location) {
        $scope.currentReport.lat = $scope.reportMap.markers.reportItMarker.lat;
        $scope.currentReport.long = $scope.reportMap.markers.reportItMarker.lng;
        $scope.reportItMapModal.hide();
        $scope.reportItPersonalModal.show();
    };

    /////////////////////////////////////////////////////////////////////////////////////////////
    // Modal: ReportIt Personal details
    // Add the user's personal details to the report.  This will be optional.
    /////////////////////////////////////////////////////////////////////////////////////////////
    // set up the report it personal details modal
    $ionicModal.fromTemplateUrl('templates/report-it-personal.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function (modal) {
        $scope.reportItPersonalModal = modal;
    });
    $scope.reportItPersonal = function () {
        $scope.reportItPersonalModal.show();
    };
    $scope.closeReportItPersonal = function () {
        $scope.reportItPersonalModal.hide();
    };
    // Submit
    $scope.submitReportItPage4 = function (report) {
        $scope.reportItPersonalModal.hide();

        // To do: deal with photos as a file.

        $scope.currentReport.photo = '';
        Reports.addReport($scope.currentReport);
        $scope.currentReport = { type: '', description: '', userFirstname: '', userLastname: '', useUserLocation: true, usePersonalDetails: true, userAddress: '', userUPRN: '', userLat: '', userLon: '', photo: '', lat: '', long: '', status: 'Not sent', photo: '' };
        $scope.reports = Reports.getReports();
        $scope.submitReports();
    };

    /////////////////////////////////////////////////////////////////////////////////////////////
    // Modal Cleanup
    /////////////////////////////////////////////////////////////////////////////////////////////
    $scope.$on('$destroy', function () {
        $scope.reportItModal.remove();
        $scope.reportItLocationModal.remove();
    });

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // APP FUNCTIONS
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    /////////////////////////////////////////////////////////////////////////////////////////////
    // Function: searchUserAddress
    // Searches for the user address
    /////////////////////////////////////////////////////////////////////////////////////////////
    $scope.searchUserAddress = function (addressSearch) {
        if (addressSearch) {
            $scope.closeRegister();
            $ionicLoading.show({
                template: 'Searching...'
            });
            UserData.fetchUprn(addressSearch)
                .then(function (data) {
                    // check for whether we have postcode results
                    if (data && data !== "Failed") {
                        $ionicLoading.hide();
                        $scope.addresses = data;
                        $scope.setAddress();
                    }
                    else {
                        $ionicLoading.hide();
                        $ionicPopup.alert({
                            title: 'No addresses found',
                            content: 'Sorry, couldn\'t find address.  Check search terms and internet connection.',
                            buttons: [{
                                text: '<i class="ion-android-done"></i> Dismiss',
                                type: 'button-clear button-full button-positive'
                            }]
                        }).then(function (res) {

                        });
                    }
                });
        }
    };

    /////////////////////////////////////////////////////////////////////////////////////////////
    // Function: setProperty
    // Sets the user selected property during registration
    /////////////////////////////////////////////////////////////////////////////////////////////
    $scope.setProperty = function (uprn, lat, lng, address, postcode) {
        $scope.propertyModal.hide();
        $ionicLoading.show({
            template: 'Fetching data...'
        });
        $scope.uprn = uprn;

        UserData.save({ "address": address, "uprn": uprn, "addressSearch": $scope.userData.addressSearch, "firstname": $scope.userData.firstname, "lastname": $scope.userData.lastname, "email": $scope.userData.email, "phone": $scope.userData.phone, "postcode": postcode, "lat": lat, "lon": lng, "displayCategories": $scope.userData.displayCategories });
        $scope.userData = UserData.all();

        $scope.pullRefresh();
    };

    /////////////////////////////////////////////////////////////////////////////////////////////
    // Function: pullRefresh
    // Called by the pull to refresh control
    /////////////////////////////////////////////////////////////////////////////////////////////
    $scope.pullRefresh = function () {
        if ($scope.userData && $scope.userData.uprn && $scope.userData.postcode) {
            //FeedData.fetchAll($scope.userData.latitude, $scope.userData.longitude)
            //    .then(function (data) {
            //        if (data && data != []) {
            //            $scope.feedData = data;
            //            $scope.feedDataObject = FeedData.toObj();
            //        }
            //    });
            BathData.fetchAll($scope.userData.uprn, $scope.userData.postcode)
                .then(function (data) {
                    if (data && data != [] && data != "Failed") {
                        BathData.save(data);
                        $scope.myCouncil = data.myCouncil;
                        $scope.myNearest = data.myNearest;
                        $scope.myHouse = data.myHouse;
                        $scope.$broadcast('scroll.refreshComplete');
                        $ionicLoading.hide();
                    } else {
                        $scope.$broadcast('scroll.refreshComplete');
                        $ionicLoading.hide();
                        $scope.showPopup('Failed', 'Failed to fetch property data - please try again later.');
                    }
                });
        }
        else {
            $scope.$broadcast('scroll.refreshComplete');
            $ionicLoading.hide();
        }
    };

    /////////////////////////////////////////////////////////////////////////////////////////////
    // Function: toggleGroup
    // To do:
    /////////////////////////////////////////////////////////////////////////////////////////////
    $scope.toggleGroup = function (group) {
        if ($scope.isGroupShown(group)) {
            $scope.shownGroup = null;
        } else {
            $scope.shownGroup = group;
        }
    };

    /////////////////////////////////////////////////////////////////////////////////////////////
    // Function: isGroupShown
    // To do:
    /////////////////////////////////////////////////////////////////////////////////////////////
    $scope.isGroupShown = function (group) {
        return $scope.shownGroup === group;
    };

    /////////////////////////////////////////////////////////////////////////////////////////////
    // Function: options
    // Displays the options menu
    /////////////////////////////////////////////////////////////////////////////////////////////
    $scope.options = function () {
        var refreshText = '';
        if ($scope.userData.uprn !== undefined) {
            refreshText = '<i class="icon ion-refresh"></i>Refresh data';
        }
        var optionsSheet = $ionicActionSheet.show({
            buttons: [
                { text: '<i class="icon ion-location"></i>Register/Set location' },
                { text: refreshText }
            ],
            destructiveText: 'Clear data',
            titleText: 'App options',
            cancelText: '<i class="ion-android-close"></i> Cancel',
            buttonClicked: function (index) {
                if (index === 0) {
                    // either registering or un-registering
                    $scope.register();
                }
                if (index === 2 && $scope.userData.uprn !== undefined) {
                    //Refresh data
                    $ionicLoading.show({
                        template: 'Fetching data...'
                    });

                    $scope.pullRefresh();
                }
                return true;
            },
            destructiveButtonClicked: function () {
                $scope.deleteData();
                return true;
            }
        });
    };

    /////////////////////////////////////////////////////////////////////////////////////////////
    // Function: SelectMenu
    // Called to select the current view - currently called in the menu bar and on various buttons
    // throughout the app.
    /////////////////////////////////////////////////////////////////////////////////////////////
    $scope.selectMenu = function (menuItem) {
        $ionicSideMenuDelegate.toggleLeft(false);
        if (menuItem === 'home') { $state.go('menu.home'); }
        if (menuItem === 'map') { $state.go('menu.map'); }
        if (menuItem === 'reports') { $state.go('menu.reports'); }
        if (menuItem === 'details') { $state.go('menu.details'); }
        if (menuItem === 'mycouncil') { $state.go('menu.mycouncil'); }
        if (menuItem === 'myhouse') { $state.go('menu.myhouse'); }
        if (menuItem === 'mynearest') { $state.go('menu.mynearest'); }
        if (menuItem === 'planning') { $state.go('menu.planningApp'); }
    };

    /////////////////////////////////////////////////////////////////////////////////////////////
    // Function: toggleMenu
    // Moves the sidebar in or out.
    /////////////////////////////////////////////////////////////////////////////////////////////
    $scope.toggleMenu = function () {
        $ionicSideMenuDelegate.toggleLeft();
    };

    /////////////////////////////////////////////////////////////////////////////////////////////
    // Function: showPopup
    // Shows a helper popup - used on various information buttons throughout the app.
    /////////////////////////////////////////////////////////////////////////////////////////////
    $scope.showPopup = function (title, message) {
        var alertPopup = $ionicPopup.alert({
            title: title,
            template: message,
            buttons: [{
                text: '<i class="ion-android-done"></i> Dismiss',
                type: 'button-clear button-full button-positive'
            }]
        });
        alertPopup.then(function (res) {
        });
    };

    /////////////////////////////////////////////////////////////////////////////////////////////
    // Function: deleteData
    // Removes the user's registered data
    /////////////////////////////////////////////////////////////////////////////////////////////
    $scope.deleteData = function () {
        $ionicPopup.confirm({
            title: 'Clear data',
            template: 'This will clear all stored data on the app (including saved reports).',
            cancelType: 'button-clear button-full button-stable',
            okType: 'button-clear button-full button-assertive'
        }).then(function (res) {
            if (res) {
                UserData.clear();
                BathData.clear();
                Reports.saveReports([]);
                Comments.saveComments([]);
                $scope.reports = Reports.getReports();
                $scope.comments = Comments.getComments();
                $scope.userData = UserData.all(); //Get defaults
                $scope.bathData = {};
                $scope.myCouncil = {};
                $scope.myNearest = {};
                $scope.myHouse = {};
                $scope.bathDataObject = {};
                $scope.feedData = {};
                $scope.feedDataObject = {};
            }
        });
    };

    /////////////////////////////////////////////////////////////////////////////////////////////
    // Function: deleteReport
    // Removes a single user report
    /////////////////////////////////////////////////////////////////////////////////////////////
    $scope.deleteReport = function (index) {
        if ($scope.reports[index]) {
            $scope.reports.splice(index, 1);
            Reports.saveReports($scope.reports);
        }
    };

    /////////////////////////////////////////////////////////////////////////////////////////////
    // Function: deleteComment
    // Removes a single comment
    /////////////////////////////////////////////////////////////////////////////////////////////
    $scope.deleteComment = function (index) {
        if ($scope.comments[index]) {
            $scope.comments.splice(index, 1);
            Comments.saveComments($scope.comments);
        }
    };

    /////////////////////////////////////////////////////////////////////////////////////////////
    // Function: submitReports
    // Submits all outstanding reports.
    /////////////////////////////////////////////////////////////////////////////////////////////
    $scope.submitReports = function () {
        $ionicLoading.show({
            template: 'Submitting reports...'
        });
        Reports.submitReports().then(function (data) {
            $ionicLoading.hide();
            var message = '';
            if (data && data == "Failed") {
                message = 'Failed.  Please try again later.'
            }
            else if (data && data.length == 0) {
                message = 'No outstanding reports.'
            }
            else if (data && data.length > 0) {
                message = 'Succeeded.';
                Reports.saveReports(data);
                $scope.reports = Reports.getReports();
            }

            $ionicPopup.alert({
                title: 'Reports',
                content: message,
                buttons: [{
                    text: '<i class="ion-android-done"></i> Dismiss',
                    type: 'button-clear button-full button-positive'
                }]
            })
        });
    };

    /////////////////////////////////////////////////////////////////////////////////////////////
    // Function: openWebsite
    // A general popup when opening external sites
    /////////////////////////////////////////////////////////////////////////////////////////////
    $scope.openWebsite = function (url) {
        var alertPopup = $ionicPopup.alert({
            title: 'External link',
            template: 'Open the following link in your default browser ' + url + '?',
            buttons: [
                {
                    text: '<i class="ion-android-close"></i> Cancel',
                    type: 'button-clear button-stable'
                },
                {
                    text: '<i class="ion-android-open"></i> Website',
                    type: 'button-clear button-balanced',
                    onTap: function (e) {
                        window.open(url, '_system');
                    }
                }
            ]
        });
        alertPopup.then(function (res) {
        });
    };

    /////////////////////////////////////////////////////////////////////////////////////////////
    // Function: emailTo
    // A general popup for composing an email
    /////////////////////////////////////////////////////////////////////////////////////////////
    $scope.emailTo = function (emailAddress) {
        var alertPopup = $ionicPopup.alert({
            title: 'Send email',
            template: 'Use default mail app to compose email to: ' + emailAddress + '?',
            buttons: [
                {
                    text: '<i class="ion-android-close"></i> Cancel',
                    type: 'button-clear button-stable'
                },
                {
                    text: '<i class="ion-at"></i> Email',
                    type: 'button-clear button-balanced',
                    onTap: function (e) {
                        window.open('mailto:' + emailAddress, '_system');
                    }
                }
            ]
        });
        alertPopup.then(function (res) {
        });
    };

    /////////////////////////////////////////////////////////////////////////////////////////////
    // Function: callNumber
    // A general popup for phone numbers
    /////////////////////////////////////////////////////////////////////////////////////////////
    $scope.callNumber = function (phone) {
        var alertPopup = $ionicPopup.alert({
            title: 'Call number',
            template: 'Call this number: ' + phone + '?',
            buttons: [
                {
                    text: '<i class="ion-android-close"></i> Cancel',
                    type: 'button-clear button-stable'
                },
                {
                    text: '<i class="ion-ios-telephone"></i> Call',
                    type: 'button-clear button-balanced',
                    onTap: function (e) {
                        window.open('tel:' + phone, '_system', 'location=yes');
                    }
                }
            ]
        });
        alertPopup.then(function (res) {
        });
    };

    /////////////////////////////////////////////////////////////////////////////////////////////
    // Function: textTo
    // A general popup for texting
    /////////////////////////////////////////////////////////////////////////////////////////////
    $scope.textTo = function (phone, body) {
        var alertPopup = $ionicPopup.alert({
            title: 'Compose text',
            template: 'Compose text message to ' + phone + '?',
            buttons: [
                {
                    text: '<i class="ion-android-close"></i> Cancel',
                    type: 'button-clear button-stable'
                },
                {
                    text: '<i class="ion-android-textsms"></i> Text',
                    type: 'button-clear button-balanced',
                    onTap: function (e) {
                        window.open('sms:' + phone + '?body=' + body, '_system', 'location=yes');
                    }
                }
            ]
        });
        alertPopup.then(function (res) {
        });
    };

    /////////////////////////////////////////////////////////////////////////////////////////////
    // Function: createEvent
    // Creates an event in the device calendar
    /////////////////////////////////////////////////////////////////////////////////////////////
    $scope.createEvent = function (name) {
        var alertPopup = $ionicPopup.alert({
            title: 'Create event',
            template: 'Create event:' + name,
            buttons: [
                {
                    text: '<i class="ion-android-close"></i> Cancel',
                    type: 'button-clear button-stable'
                },
                {
                    text: '<i class="ion-calendar"></i> Add',
                    type: 'button-clear button-balanced',
                    onTap: function (e) {
                        $cordovaCalendar.createEventWithOptions({
                            title: name,
                            location: $userData.address,
                            notes: '',
                            startDate: new Date(2015, 0, 6, 18, 30, 0, 0, 0),
                            recurrence: 'weekly'
                        }).then(function (result) {
                            // success
                        }, function (err) {
                            // error
                        });
                    }
                },
            ]
        });
        alertPopup.then(function (res) {
        });
    };

    /////////////////////////////////////////////////////////////////////////////////////////////
    // Function: updateCarParks
    // Updates the car park data.
    /////////////////////////////////////////////////////////////////////////////////////////////
    $scope.updateCarParks = function () {
        if (!$scope.refreshingCarParks) {
            $scope.refreshingCarParks = true;
            LiveTravel.fetchAll()
                    .then(function (data) {
                        if (data && data != [] && data != "Failed") {

                            $scope.carParkChart.series[0].data = [];
                            $scope.carParkChart.xAxis.categories = [];

                            for (var carPark in data.carParks) {
                                // Only show if car park updated within last 30 mins
                                if (data.carParks[carPark] && moment().diff(moment(data.carParks[carPark]['last updated']), 'minutes') < 15) {
                                    var numberOfSpaces = parseInt(data.carParks[carPark].Capacity - parseInt(data.carParks[carPark].Occupancy));
                                    var color = '';
                                    if (numberOfSpaces < 0) numberOfSpaces = 0;
                                    if (numberOfSpaces < 100) color = '#ffc900';
                                    if (numberOfSpaces < 30) color = '#ef473a';

                                    if (color != '') {
                                        $scope.carParkChart.series[0].data.push({ y: numberOfSpaces, color: color });
                                    } else {
                                        $scope.carParkChart.series[0].data.push(numberOfSpaces);
                                    } 
                                    $scope.carParkChart.xAxis.categories.push(data.carParks[carPark].Name.replace('CP', ''))
                                }
                            }

                            $scope.refreshingCarParks = false;
                        } else {
                            // currently do nothing - chart wil only display if there is data.
                            $scope.refreshingCarParks = false;
                        }
                    });
        }
    };
    // Run on Load:
    $scope.updateCarParks();

    /////////////////////////////////////////////////////////////////////////////////////////////
    // Function: showCouncilConnectPopup
    // A popup for council connect
    /////////////////////////////////////////////////////////////////////////////////////////////
    $scope.showCouncilConnectPopup = function () {
        var alertPopup = $ionicPopup.alert({
            title: 'Council Connect',
            template: 'Council Connect can help you with a range of enquiries including waste & recycling, roads & highways and general library & planning enquiries.',
            buttons: [
                {
                    text: '<i class="ion-android-close"></i> Cancel',
                    type: 'button-clear button-stable'
                },
                {
                    text: '<i class="ion-ios-telephone"></i> Call',
                    type: 'button-clear button-balanced',
                    onTap: function (e) {
                        window.open('tel:01225394041', '_system', 'location=yes');
                    }
                },
            ]
        });
        alertPopup.then(function (res) {
        });
    };

    /////////////////////////////////////////////////////////////////////////////////////////////
    // Function: showCouncilConnectPopupOutOfHours
    // A popup for council connect
    /////////////////////////////////////////////////////////////////////////////////////////////
    $scope.showCouncilConnectPopupOutOfHours = function () {
        var alertPopup = $ionicPopup.alert({
            title: 'Out of Hours',
            template: 'Council connect is open 8.00am � 6.00pm Mon, Tues, Thurs & Fri and 9.30am � 6.00pm on Weds.  An emergency out of hours service is provided.',
            buttons: [
                {
                    text: '<i class="ion-android-close"></i> Cancel',
                    type: 'button-clear button-stable'
                },
                {
                    text: '<i class="ion-ios-telephone"></i> Emergency',
                    type: 'button-assertive',
                    onTap: function (e) {
                        window.open('tel:01225477477', '_system', 'location=yes');
                    }
                },
            ]
        });
        alertPopup.then(function (res) {
            // To do: handle the result
        });
    };

    /////////////////////////////////////////////////////////////////////////////////////////////
    // Function: navigateTo
    // Uses the default map application to navigate
    /////////////////////////////////////////////////////////////////////////////////////////////
    $scope.navigateTo = function (lat, lng) {

        var alertPopup = $ionicPopup.alert({
            title: 'Navigation',
            template: 'Launch default maps application?',
            buttons: [
                {
                    text: '<i class="ion-android-close"></i> Cancel',
                    type: 'button-clear button-stable'
                },
                {
                    text: '<i class="ion-navigate"></i> Navigate',
                    type: 'button-clear button-balanced',
                    onTap: function (e) {

                        var geoUrl = "geo:" + lat + "," + lng + "?q=" + lat + "," + lng;
                        if (ionic.Platform.isIOS()) {
                            geoUrl = 'maps:q=' + lat + "," + lng + '&ll=' + lat + "," + lng;
                        }
                        window.open(geoUrl, '_system');

                    }
                }
            ]
        });
        alertPopup.then(function (res) {
        });

    };

    /////////////////////////////////////////////////////////////////////////////////////////////
    // Function: takePhoto
    // Takes a photo, stores it in localStorage.reportPhoto
    // Displays it to the user in photoTaken, which is by default aLinkcolor blank image
    /////////////////////////////////////////////////////////////////////////////////////////////
    $scope.takePhoto = function () {
        if (!navigator.camera) {
            console.warn("navigator.camera is undefined");
            return;
        }
        navigator.camera.getPicture(
            function (imageURI) {
                // saves to currentReport.photo
                imageURI = "data:image/jpeg;base64," + imageURI;
                $scope.$apply(function () {
                    $scope.currentReport.photo = imageURI;
                });
            },
            function (failMessage) {
                // alert('Failed because: ' + message);
            },
            { quality: 50, destinationType: Camera.DestinationType.DATA_URL });
    };

    /////////////////////////////////////////////////////////////////////////////////////////////
    // Function: updateMap
    // Sets the Report It map with the current detected position as center.
    /////////////////////////////////////////////////////////////////////////////////////////////
    $scope.updateMap = function (position) {
        $scope.reportMap.center.lat = position.coords.latitude;
        $scope.reportMap.center.lng = position.coords.longitude;
        $scope.reportMap.markers.reportItMarker.lat = position.coords.latitude;
        $scope.reportMap.markers.reportItMarker.lng = position.coords.longitude;
    };

    /////////////////////////////////////////////////////////////////////////////////////////////
    // Function: geoLocate
    // Stores the geolocation.
    /////////////////////////////////////////////////////////////////////////////////////////////
    $scope.geoLocate = function () {

        navigator.geolocation.getCurrentPosition(
            function (position) {
                $scope.currentLocation = position;
                $scope.updateMap(position);
                $ionicLoading.hide();
                $scope.currentReport.useLocation = true;
                $scope.currentReport.locationFound = true;
                $scope.currentReport.locationMessage = "Your location has been successfully detected.  If you would like this to be used as part of the report, check the option below.";
                $scope.currentReport.lat = position.coords.latitude;
                $scope.currentReport.long = position.coords.longitude;
                // $scope.reportItLocationModal.show();
                $scope.reportItPersonalModal.show();
            },
            function (error) {
                $ionicLoading.hide();
                $scope.currentReport.locationMessage = "Your location was not detected.";
                $scope.currentReport.useLocation = false;
                $scope.currentReport.locationFound = false;
                // $scope.reportItLocationModal.show();
                $scope.reportItPersonalModal.show();

            },
            { maximumAge: 3000, timeout: 10000, enableHighAccuracy: true });
    };

    /////////////////////////////////////////////////////////////////////////////////////////////
    // Function: emailCouncilConnect
    // Test function to email Council Connect with the report
    // Uses https://github.com/katzer/cordova-plugin-email-composer/blob/0cc829af59b94b52db63a999064577a6962bf763/README.md
    // This will be replaced at some point
    /////////////////////////////////////////////////////////////////////////////////////////////
    $scope.emailCouncilConnect = function () {
        try {
            window.plugin.email.open({
                to: ['councilconnect@bathnes.gov.uk'],
                subject: "Message from Bath App",
                body: "",
                isHtml: false
            });
        } catch (err) {
            window.location.href = "mailto:councilconnect@bathnes.gov.uk";
        }
    };
});