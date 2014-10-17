angular.module('MyBath.MapDataService', [])
/**
 * Factory: Map Data
 * 
*/
.factory('MapData', function ($http, $q) {
    var start = 'https://isharemaps.bathnes.gov.uk/MapGetImage.aspx?MapSource=BathNES/banes&RequestType=GeoJSON&ServiceAction=ShowMyClosest&ActiveTool=MultiInfo&mapid=-1&SearchType=findMyNearest&Distance=16094&MaxResults=50';
    var start2 = 'https://isharemaps.bathnes.gov.uk/MapGetImage.aspx?RequestType=GeoJSON&ServiceAction=ShowMyClosest&ActiveTool=MultiInfo&mapid=-1&SearchType=findMyNearest&Distance=16094&MaxResults=50&MapSource=BathNES/';
    var NorthEastString = "&Easting=375123.8049001&Northing=164590.7083502";
    var layerList = {
        libraries: start + NorthEastString + '&ActiveLayer=Libraries',
        primarySchools: start + NorthEastString + '&ActiveLayer=PrimarySchools',
        councilOffices: start + NorthEastString + '&ActiveLayer=Council_Offices',
        playSchools: start + NorthEastString + '&ActiveLayer=NurseryPlaySchools',
        secondarySchools: start + NorthEastString + '&ActiveLayer=SecondarySchools',
        colleges: start + NorthEastString + '&ActiveLayer=Colleges',
        universities: start + NorthEastString + '&ActiveLayer=Universities',
        conservationAreas: start + NorthEastString + '&ActiveLayer=ConAreas',
        wasteAndRecyling: start + NorthEastString + '&ctiveLayer=CivicAmenitySites',
        healthAndFitness: start + NorthEastString + '&ActiveLayer=HealthandFitnessCentres',
        playAreas: start + NorthEastString + '&ActiveLayer=PlayAreas',
        tennisCourts: start + NorthEastString + '&ActiveLayer=TennisCourts',
        allotments: start + NorthEastString + '&ActiveLayer=Allotments',
        mobileLibaries: start + NorthEastString + '&ActiveLayer=MobileLibraryStops',
        busStops: start + NorthEastString + '&ActiveLayer=BusStops',
        roadworks: start + NorthEastString + '&ActiveLayer=Roadworks',
        carParks: start2 + 'CarParks&ActiveLayer=CarParks' + NorthEastString,
        parks: start2 + 'ParksOpenSpaces&ActiveLayer=Parks' + NorthEastString,
        openSpaces: start2 + 'ParksOpenSpaces&ActiveLayer=OpenSpaces' + NorthEastString,
        wc: start2 + 'Public_Infrastructure&ActiveLayer=PublicConveniences' + NorthEastString
    };
    
    var icons = {
        defaultIcon: {
            type: 'div',
            iconSize: [30, 30],
            popupAnchor: [0, 0],
            html: '<i class="icon calm ion-bug  "></i>'
        },
        conservationIcon: {
            type: 'div',
            iconSize: [30, 30],
            popupAnchor: [0, 0],
            html: '<i class="icon balanced ion-leaf></i>'
        },
        libraryIcon: {
            type: 'div',
            iconSize: [30, 30],
            popupAnchor: [0, 0],
            html: '<i class="icon calm ion-android-book"></i>'
        },
        officeIcon: {
            type: 'div',
            iconSize: [30, 30],
            popupAnchor: [0, 0],
            html: '<i class="icon calm ion-coffee"></i>'
        },
        toiletIcon: {
            type: 'div',
            iconSize: [30, 30],
            popupAnchor: [0, 0],
            html: '<i class="icon calm ion-woman"></i><i class="icon calm ion-man"></i>'
        },
        parkIcon: {
            type: 'div',
            iconSize: [30, 30],
            popupAnchor: [0, 0],
            html: '<i class="icon calm ion-ios7-tennisball"></i>'
        },
        wasteIcon: {
            type: 'div',
            iconSize: [30, 30],
            popupAnchor: [0, 0],
            html: '<i class="icon calm ion-ios7-trash"></i>'
        },
        carParkIcon: {
            type: 'div',
            iconSize: [30, 30],
            popupAnchor: [0, 0],
            html: '<i class="icon calm ion-model-s"></i>'
        },
        schoolIcon: {
            type: 'div',
            iconSize: [30, 30],
            popupAnchor: [0, 0],
            html: '<i class="icon calm ion-ios7-home"></i>'
        },
        roadworksIcon: {
            type: 'div',
            iconSize: [30, 30],
            popupAnchor: [0, 0],
            html: '<i class="icon calm ion-wrench"></i>'
        },
        universityIcon: {
            type: 'div',
            iconSize: [30, 30],
            popupAnchor: [0, 0],
            html: '<i class="icon calm ion-university"></i>'
        },
        fitnessIcon: {
            type: 'div',
            iconSize: [30, 30],
            popupAnchor: [0, 0],
            html: '<i class="icon calm ion-happy"></i>'
        },
        playSchoolIcon: {
            type: 'div',
            iconSize: [30, 30],
            popupAnchor: [0, 0],
            html: '<i class="icon balanced on-ios7-paw"></i>'
        },
        busIcon: {
            type: 'div',
            iconSize: [30, 30],
            popupAnchor: [0, 0],
            html: '<i class="icon calm ion-pin"></i>'
        }

    };

    return {
        layerList: function () {
            return layerList;
        },
        getLayer: function (layer) {
            var getIcon = function(layer) {
            switch (layer){
                case "mobileLibaries":
                case "libraries":
                    return icons.libraryIcon;
                case "wasteAndRecyling":
                    return icons.wasteIcon;
                case "carParks":
                    return icons.carParkIcon;
                case "councilOffices":
                    return icons.officeIcon;
                case "wc":
                    return icons.toiletIcon;
                case "healthAndFitness":
                    return icons.fitnessIcon;
                case "busStops":
                    return icons.busIcon;
                case "primarySchools":
                case "secondarySchools":
                case "colleges":
                    return icons.schoolIcon;
                case "roadworks":
                    return icons.roadworksIcon;
                case "universities":
                    return icons.universityIcon;
                case "parks":
                case "playAreas":
                case "tennisCourts":
                case "openSpaces":
                    return icons.parkIcon;
                case "conservationAreas":
                case "allotments":
                    return icons.conservationIcon;
                case "playSchools":
                    return icons.playSchoolIcon;
                default:
                    console.log("default layer: " + layer);
                    return icons.defaultIcon;
            }
            
            };
            var url = layerList[layer];

            var layerData = [];
            var layerData_q = $q.defer();

            $http.get(url)
                .success(function (data, status, headers, config) {
                    if (data && data != [] && !(data.error)) {
                        
                        for (i = 0; i < data[0].features.length ; i++) {
                            var northing = data[0].features[i].geometry.coordinates[0][0];
                            var easting = data[0].features[i].geometry.coordinates[0][1];
                            var titleAndUrl = data[0].features[i].properties.fields._;
                            var title = data[0].features[i].properties.fields._;
                            if ( title ) {
                                if ( layer == "playAreas" ) {
                                    title = data[0].features[i].properties.html;
                                } else if (titleAndUrl.indexOf('|') != -1) {
                                title = titleAndUrl.split('|')[1];
                                }
                            } else {
                                //Add the HTML data - to display *something*
                                title = data[0].features[i].properties.html;
                            }
                        
                            var latlng = NEtoLL(northing, easting);
                            layerData.push({ lat: latlng.latitude, lng: latlng.longitude, icon: getIcon(layer), layer: data[0].properties.layerName, message: title });
                        }
                    } else {
                        layerData =  "Failed";
                    }
                    layerData_q.resolve(layerData);
                    return layerData;
                })
                .error(function (data, status, headers, config) {
                    layerData = "Failed";
                    layerData_q.resolve(layerData);
                    return "Failed";
                });
            return layerData_q.promise;
        }
    };
});