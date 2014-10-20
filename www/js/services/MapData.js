angular.module('MyBath.MapDataService', [])
/**
 * Factory: Map Data
 * 
*/
.factory('MapData', function ($http, $q) {

    
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
        getLayer: function (layer, lat, lng) {
            var getIcon = function(layer) {
                switch (layer){
                    case "MobileLibraryStops":
                    case "Libraries":
                        return icons.libraryIcon;
                    case "CivicAmenitySites":
                        return icons.wasteIcon;
                    case "CarParks":
                        return icons.carParkIcon;
                    case "Council_Offices":
                        return icons.officeIcon;
                    case "PublicConveniences":
                        return icons.toiletIcon;
                    case "HealthandFitnessCentres":
                        return icons.fitnessIcon;
                    case "BusStops":
                        return icons.busIcon;
                    case "PrimarySchools":
                    case "SecondarySchools":
                    case "Colleges":
                        return icons.schoolIcon;
                    case "Roadworks":
                        return icons.roadworksIcon;
                    case "Universities":
                        return icons.universityIcon;
                    case "Parks":
                    case "PlayAreas":
                    case "TennisCourts":
                    case "OpenSpaces":
                        return icons.parkIcon;
                    case "ConAreas":
                    case "Allotments":
                        return icons.conservationIcon;
                    case "NurseryPlaySchools":
                        return icons.playSchoolIcon;
                    default:
                        console.log("default layer: " + layer);
                        return icons.defaultIcon;
                }
            
            };

            var pos = LLtoNE(lat, lng);
            var start = 'https://isharemaps.bathnes.gov.uk/MapGetImage.aspx?MapSource=BathNES/banes&RequestType=GeoJSON&ServiceAction=ShowMyClosest&ActiveTool=MultiInfo&mapid=-1&SearchType=findMyNearest&Distance=16094&MaxResults=10';
            var start2 = 'https://isharemaps.bathnes.gov.uk/MapGetImage.aspx?RequestType=GeoJSON&ServiceAction=ShowMyClosest&ActiveTool=MultiInfo&mapid=-1&SearchType=findMyNearest&Distance=16094&MaxResults=10&MapSource=BathNES/';
            var NorthEastString = "&Easting=" + pos.east + "&Northing="+pos.north;

            var layerList = {
                Libraries: start + NorthEastString + '&ActiveLayer=Libraries',
                PrimarySchools: start + NorthEastString + '&ActiveLayer=PrimarySchools',
                Council_Offices: start + NorthEastString + '&ActiveLayer=Council_Offices',
                NurseryPlaySchools: start + NorthEastString + '&ActiveLayer=NurseryPlaySchools',
                SecondarySchools: start + NorthEastString + '&ActiveLayer=SecondarySchools',
                Colleges: start + NorthEastString + '&ActiveLayer=Colleges',
                Universities: start + NorthEastString + '&ActiveLayer=Universities',
                ConAreas: start + NorthEastString + '&ActiveLayer=ConAreas',
                CivicAmenitySites: start + NorthEastString + '&ctiveLayer=CivicAmenitySites',
                HealthandFitnessCentres: start + NorthEastString + '&ActiveLayer=HealthandFitnessCentres',
                PlayAreas: start + NorthEastString + '&ActiveLayer=PlayAreas',
                TennisCourts: start + NorthEastString + '&ActiveLayer=TennisCourts',
                Allotments: start + NorthEastString + '&ActiveLayer=Allotments',
                MobileLibraryStops: start + NorthEastString + '&ActiveLayer=MobileLibraryStops',
                BusStops: 'https://isharemaps.bathnes.gov.uk/MapGetImage.aspx?MapSource=BathNES/banes&RequestType=GeoJSON&ServiceAction=ShowMyClosest&ActiveTool=MultiInfo&mapid=-1&SearchType=findMyNearest&Distance=16094&MaxResults=25' + NorthEastString + '&ActiveLayer=BusStops',
                Roadworks: start + NorthEastString + '&ActiveLayer=Roadworks',
                CarParks: start2 + 'CarParks&ActiveLayer=CarParks' + NorthEastString,
                Parks: start2 + 'ParksOpenSpaces&ActiveLayer=Parks' + NorthEastString,
                OpenSpaces: start2 + 'ParksOpenSpaces&ActiveLayer=OpenSpaces' + NorthEastString,
                PublicConveniences: start2 + 'Public_Infrastructure&ActiveLayer=PublicConveniences' + NorthEastString
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
                                if ( layer == "PlayAreas" ) {
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