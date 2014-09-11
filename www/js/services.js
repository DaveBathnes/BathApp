angular.module('mybath.services', [])
/**
 * Factory: Bath Data
 * The bath data factory includes methods to return and save data from iShare to local storage
 * and returns that data from local storage.
*/
.factory('BathData', function ($http, $q) {
    return {
		// Method: BathData.all()
		// Input: JSON[] / Empty
		// Output: JSON / Empty Array
		// gets all the data back from local storage.
        all: function () {

            // we need a one time only delete as there's invalid data leftover from earlier release
            var cleanUp = window.localStorage['cleanUp'];
            if (!cleanUp) {
                window.localStorage.removeItem('BathData');
                window.localStorage['cleanUp'] = 'cleaned';
            }

            var bathData = window.localStorage['BathData'];
            if (bathData) {
                return angular.fromJson(bathData);
            }
            return [];
        },
		// Method: BathData.save
		// Input: JSON
		// Output: None
		// saves the data from a JSON input, back into the local storage (overwriting previous storage)
        save: function (bathData) {
            window.localStorage['BathData'] = angular.toJson(bathData);
        },
		// Method: BathData.fetchAll()
		// Input: uId string (UPRN)
		// Output: 
		// calls all of the iShare links and aggregates the returned data into a single JSON array, queryable by index.
		// this data is returned as a promise.
        fetchAll: function (uId) {
            return $q.all([
                // Libraries
                // 0 - Libraries
                $http.get('http://isharemaps.bathnes.gov.uk/getdata.aspx?RequestType=LocalInfo&ms=BathNES/MyNearest&format=JSON&group=Libraries|Libraries Nearby&uid=' + uId),
                // 1 - Mobile Libraries
                $http.get('http://isharemaps.bathnes.gov.uk/getdata.aspx?RequestType=LocalInfo&ms=BathNES/MyNearest&format=JSON&group=Libraries|Mobile Libraries Nearby&uid=' + uId),

                // Education
                // 2 - Play schools
                $http.get('http://isharemaps.bathnes.gov.uk/getdata.aspx?RequestType=LocalInfo&ms=BathNES/MyNearest&format=JSON&group=Play%20Schools%20and%20Nurseries&uid=' + uId),
                // 3 - Primary schools
                $http.get('http://isharemaps.bathnes.gov.uk/getdata.aspx?RequestType=LocalInfo&ms=BathNES/MyNearest&format=JSON&group=Primary%20Schools&uid=' + uId),
                // 4 - Secondary schools
                $http.get('http://isharemaps.bathnes.gov.uk/getdata.aspx?RequestType=LocalInfo&ms=BathNES/MyNearest&format=JSON&group=Secondary%20Schools&uid=' + uId),
                // 5 - Colleges
                $http.get('http://isharemaps.bathnes.gov.uk/getdata.aspx?RequestType=LocalInfo&ms=BathNES/MyNearest&format=JSON&group=Colleges%20and%20Further%20Education|Colleges Nearby&uid=' + uId),
                // 6 - Universities
                $http.get('http://isharemaps.bathnes.gov.uk/getdata.aspx?RequestType=LocalInfo&ms=BathNES/MyNearest&format=JSON&group=Colleges%20and%20Further%20Education|Universities Nearby&uid=' + uId),

                // Bins
                // 7 - Collection dates
				$http.get('http://isharemaps.bathnes.gov.uk/getdata.aspx?RequestType=LocalInfo&ms=BathNES/MyHouse&format=JSON&group=Refuse%20and%20Recycling|_______________&uid=' + uId),

                // Roadworks
                // 8 - Roadworks
                $http.get('http://isharemaps.bathnes.gov.uk/getdata.aspx?RequestType=LocalInfo&ms=BathNES/MyNearest&format=JSON&group=Transport%20and%20Streets|Roadworks Nearby&uid=' + uId),

                // Leisure
                // 9 - Parks
                $http.get('http://isharemaps.bathnes.gov.uk/getdata.aspx?RequestType=LocalInfo&ms=BathNES/MyNearest&format=JSON&group=Parks%20and%20Open%20Spaces|Parks%20or%20Open%20spaces%20nearby&uid=' + uId),
                // 10 - Play areas
                $http.get('http://isharemaps.bathnes.gov.uk/getdata.aspx?RequestType=LocalInfo&ms=BathNES/MyNearest&format=JSON&group=Parks%20and%20Open%20Spaces|Play%20Areas%20Nearby&uid=' + uId),
                // 11 - Allotments
                $http.get('http://isharemaps.bathnes.gov.uk/getdata.aspx?RequestType=LocalInfo&ms=BathNES/MyNearest&format=JSON&group=Parks%20and%20Open%20Spaces|Allotments%20Nearby&uid=' + uId),

                // Health
                // 12 - Fitness
				$http.get('http://isharemaps.bathnes.gov.uk/getdata.aspx?RequestType=LocalInfo&ms=BathNES/MyNearest&format=JSON&group=Fitness%20and%20Recreation&uid=' + uId),

                // My council
                // 13 - Councillor 
				$http.get('http://isharemaps.bathnes.gov.uk/getdata.aspx?RequestType=LocalInfo&ms=BathNES/MyHouse&format=JSON&group=Council%20and%20Democracy|Your%20Councillors&uid=' + uId),
                // 14 - Listed building
                $http.get('http://isharemaps.bathnes.gov.uk/getdata.aspx?RequestType=LocalInfo&ms=BathNES/MyHouseLive&format=JSON&group=Property%20Details|Listed%20Building&uid=' + uId),

                // Planning
                // 15 - Planning apps
				$http.get('http://isharemaps.bathnes.gov.uk/getdata.aspx?RequestType=LocalInfo&ms=BathNES/MyHouseLive&format=JSON&group=Planning%20Applications|Planning%20Applications%20Nearby&uid=' + uId),

                // Licensing
                // 16 - New licenses
				$http.get('http://isharemaps.bathnes.gov.uk/getdata.aspx?RequestType=LocalInfo&ms=BathNES/MyHouseLive&format=JSON&group=Licensing%20Applications|New%20Licensing%20Applications%20Nearby&uid=' + uId),
                // 17 - Issued licenses
                $http.get('http://isharemaps.bathnes.gov.uk/getdata.aspx?RequestType=LocalInfo&ms=BathNES/MyHouseLive&format=JSON&group=Licensing%20Applications|Issued%20Licensing%20Applications%20Nearby&uid=' + uId),

				// 18 - council offices
				$http.get('http://isharemaps.bathnes.gov.uk/getdata.aspx?RequestType=LocalInfo&ms=BathNES/MyHouseLive&format=JSON&group=Council%20and%20Democracy|____________________________&uid=' + uId),
				// 19 - local housing allowance zone
				$http.get('http://isharemaps.bathnes.gov.uk/getdata.aspx?RequestType=LocalInfo&ms=BathNES/MyHouseLive&format=JSON&group=Council%20and%20Democracy|___________&uid=' + uId),
				// 20 - bus stops
				$http.get('http://isharemaps.bathnes.gov.uk/getdata.aspx?RequestType=LocalInfo&ms=BathNES/MyNearest&format=JSON&group=Transport%20and%20Streets|Bus%20stops%20nearby&uid=' + uId),
				// 21 - school crossings
				$http.get('http://isharemaps.bathnes.gov.uk/getdata.aspx?RequestType=LocalInfo&ms=BathNES/MyNearest&format=JSON&group=Transport%20and%20Streets|School%20crossings%20nearby&uid=' + uId),
				// 22 - parking zones
				$http.get('http://isharemaps.bathnes.gov.uk/getdata.aspx?RequestType=LocalInfo&ms=BathNES/MyHouseLive&format=JSON&group=Parking%20Permit|Parking%20zones&uid=' + uId)
            ]).then(function (results) {
                var aggregatedData = [];
                angular.forEach(results, function (result) {
                    aggregatedData = aggregatedData.concat(result.data);
                });
                window.localStorage['BathData'] = angular.toJson(aggregatedData);
                return aggregatedData;
            }, function (error) {
				return [];
			});
		}
    }
})
/**
 * Factory: User Data
 * The user data factory includes methods to handle user data for the app.
 * This includes retrieving address data, as well as handling registration data
 * such as name and email, and storing these for retrieval in form processes.
*/
.factory('UserData', function ($http, $q) {
    return {
        all: function () {
            var userData = window.localStorage['UserData'];
            if (userData) {
                return angular.fromJson(userData);
            }
            return [];
        },
        save: function (userData) {
            window.localStorage['UserData'] = angular.toJson(userData);
        },
        fetchUprn: function (postcode) {
			var addressData = [];
			var addressData_q = $q.defer();
            $http.get("http://isharemaps.bathnes.gov.uk/getdata.aspx?service=LocationSearch&RequestType=LocationSearch&location=" + postcode + "&pagesize=200&startnum=1")
				.success(function (data, status, headers, config) {
				    addressData = data;
					if (data && data != []) {
					}
					else
					{
						addressData = "Failed";
					}
				    addressData_q.resolve(data);
				    return addressData;
				})
				.error(function (data, status, headers, config) {
				    addressData = "Failed";
				    addressData_q.resolve(addressData);
				    return "Failed";
				});
            return addressData_q.promise;
        }
    }
})
.factory('Reports', function () {
    return {
        getReports: function () {
            var reports = window.localStorage['reports'];
            if (reports) {
                return angular.fromJson(reports);
            }
            return [];
        },
        saveReports: function (reports) {
            window.localStorage['reports'] = angular.toJson(reports);
        },
        addReport: function (report) {
            var reports = getReports();
			reports.add(report);
			saveReports(reports);
        },
		submitReports: function () {
            var reports = getReports();
			// reports is an array (of whatever length).
			// iterate through and submit to the web service.  as successes are recorded, remove from array.
			var index;
			for (index = 0; index < reports.length; ++index) {
				$http({
					method: 'POST',
					url: 'request-url',
					data: "message=" + message,
					headers: {'Content-Type': 'application/x-www-form-urlencoded'}
				});
			}
        }
    }
});