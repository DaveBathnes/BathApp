angular.module('MyBath.MapDataService', [])
/**
 * Factory: Map Data
 * 
*/
.factory('MapData', function ($http, $q) {
	var start = 'https://isharemaps.bathnes.gov.uk/MapGetImage.aspx?MapSource=BathNES/banes&RequestType=GeoJSON&ServiceAction=ShowMyClosest&ActiveTool=MultiInfo&mapid=-1&SearchType=findMyNearest&Distance=16094&MaxResults=50'
	var start2 = 'https://isharemaps.bathnes.gov.uk/MapGetImage.aspx?RequestType=GeoJSON&ServiceAction=ShowMyClosest&ActiveTool=MultiInfo&mapid=-1&SearchType=findMyNearest&Distance=16094&MaxResults=50&MapSource=BathNES/'
	var NorthEastString = "&Easting=375123.8049001&Northing=164590.7083502";
    var layerList = {
       	libraries: start + NorthEastString + '&ActiveLayer=Libraries',
        primarySchools: start + NorthEastString + '&ActiveLayer=PrimarySchools',
		councilOffices: start + NorthEastString + '&ActiveLayer=Council_Offices',
		playSchools: start + NorthEastString + '&ActiveLayer=NurseryPlaySchools',
		primarySchools: start + NorthEastString + '&ActiveLayer=PrimarySchools',
		secondarySchools: start + NorthEastString + '&ActiveLayer=SecondarySchools',
		colleges: start + NorthEastString + '&ActiveLayer=Colleges',
		universities: start + NorthEastString + '&ActiveLayer=Universities',
		conservationAreas: start + NorthEastString + '&ActiveLayer=ConAreas',
		wasteAndRecyling: start + NorthEastString + '&ctiveLayer=CivicAmenitySites',
		healthAndFitness: start + NorthEastString + '&ActiveLayer=HealthandFitnessCentres',
		playAreas: start + NorthEastString + '&ActiveLayer=PlayAreas',
		tennisCourts: start + NorthEastString + '&ActiveLayer=TennisCourts',
		allotments: start + NorthEastString + '&ActiveLayer=Allotments'
		mobileLibaries: start + NorthEastString + '&ActiveLayer=MobileLibraryStops',
		busStops: start + NorthEastString + '&ActiveLayer=BusStops',
		roadworks: start + NorthEastString + '&ActiveLayer=Roadworks',
		carParks: start2 + 'CarParks&ActiveLayer=CarParks' + NorthEastString,
		parks: start2 + 'ParksOpenSpaces&ActiveLayer=Parks' + NorthEastString,
		openSpaces: start2 + 'ParksOpenSpaces&ActiveLayer=OpenSpaces' + NorthEastString,
		wc: start2 + '		Public_Infrastructure&ActiveLayer=PublicConveniences' + NorthEastString
	};
	https://isharemaps.bathnes.gov.uk//MapGetImage.aspx?MapSource=BathNES/CarParks&RequestType=GeoJSON&ServiceAction=ShowMyClosest&ActiveTool=MultiInfo&ActiveLayer=CarParks&mapid=-1&axuid=1413451503306&SearchType=findMyNearest&Distance=16094&MaxResults=50&Easting=375106.88420646&Northing=164497.37635133&_=1413451503307
	console.log(layerList);

    var icons = {
        libraryIcon: {
            type: 'div',
            iconSize: [30, 30],
            popupAnchor: [0, 0],
            html: '<i class="icon calm ion-android-book"></i>'
        }
    };

    return {
        layerList: function () {
            return layerList;
        },
        getLayer: function (layer) {
            var url = layerList[layer];

            var layerData = [];
            var layerData_q = $q.defer();

            $http.get(url)
                .success(function (data, status, headers, config) {
                    if (data && data != []) {
                        for (i = 0; i < data[0].features.length ; i++) {
                            var northing = data[0].features[i].geometry.coordinates[0][0];
                            var easting = data[0].features[i].geometry.coordinates[0][1];
                            var titleAndUrl = data[0].features[i].properties.fields._;
                            var title = data[0].features[i].properties.fields._;
                            if (titleAndUrl.indexOf('|') != -1) {
                                title = titleAndUrl.split('|')[1];
                            }
                            var latlng = NEtoLL(northing, easting);
                            layerData.push({ lat: latlng.latitude, lng: latlng.longitude, icon: icons.libraryIcon, layer: data[0].properties.layerName, message: title });
                        }
                    }
                    else {
                        layerData = "Failed";
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