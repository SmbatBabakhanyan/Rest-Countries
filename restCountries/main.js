var countriesApp = angular.
    module('countriesApp', []);
countriesApp.controller('countries', ["$scope", "$http", "defaultCongifs", "configs", "margeAllConfigs", function PhoneListController($scope, $http, defaultCongifs, configs, margeAllConfigs) {
    $scope.countries = [];
    $scope.searchOptions = [
        { "name": "By name", "value": "name" },
        { "name": "Full Name", "value": "fullName" },
        { "name": "CURRENCY", "value": "currency" },
        { "name": "LANGUAGE", "value": "lang" },
        { "name": "CAPITAL CITY", "value": "capitalCity" },
        { "name": "CALLING CODE", "value": "callingCode" },
        { "name": "REGION", "value": "region" },
    ];
    $scope.configs = margeAllConfigs;
    $scope.searchItem = margeAllConfigs.defaultSearchOptions;
    $scope.submitFilter = function () {
        $scope.searchItem = $scope.searchText;
    }
    $scope.showSelectValue = function (searchItem) {
        $scope.searchItem = searchItem;
    }

    $scope.getSearchData = function (searchItem) {
        var chekedName = "";
        chekedName += $scope.searchText;
        var url = "";
        var baseUrl = configs.baseUrl;
        if (searchItem === "all") {
            url = baseUrl + "all";
        }
        if (searchItem === "name") {
            url = baseUrl + "name/" + chekedName;
        }
        if (searchItem === "fullName") {
            url = baseUrl + "name/" + chekedName + "?fullText=true";
        }
        if (searchItem === "currency") {
            url = baseUrl + "currency/" + chekedName;
        }
        if (searchItem === "lang") {
            url = baseUrl + "lang/" + chekedName;
        }
        if (searchItem === "capitalCity") {
            url = baseUrl + "capital/" + chekedName;
        }
        if (searchItem === "callingCode") {
            url = baseUrl + "callingcode/" + chekedName;
        }
        if (searchItem === "region") {
            url = baseUrl + "region/" + chekedName;
        }
        $http.get(url).then(function (response) {
            $scope.countries = [];
            $scope.countries = $scope.countries.concat(response.data);
            $scope.groups = {};
            var index = 0;
            function sortData() {
                $scope.countries.forEach(function (country) {
                    var firstChar = country.name[0];
                    if (!$scope.groups[firstChar]) {
                        $scope.groups[firstChar] = [];
                    };
                    $scope.groups[firstChar].push(country);
                });
            }
            console.log($scope.groups)
            sortData();
        }).catch(err => {
            console.log("error: " + err.message);
            $scope.countries = [];
            $scope.countries = $scope.countries.concat([]);
        });

    }
    $scope.getSearchData("all");
}]).constant("configs", {
    baseUrl: ["https://restcountries.eu/rest/v2/"],
    restrictedSearchOptions: ["fullName", "capitalCity"],
    defaultSearchOptions: "lang",
}).constant("defaultCongifs", {
    baseUrl: ["https://restcountries.eu/rest/v2/"],
    restrictedSearchOptions: ["currency", "callingCode"],
    defaultSearchOptions: "name",
}).service('margeAllConfigs', function (configs, defaultCongifs) {
    function isObject(item) {
        return (item && typeof item === 'object' && !Array.isArray(item));
    }
    function mergeDeep(target, source) {
        let output = Object.assign({}, target);
        if (isObject(target) && isObject(source)) {
            Object.keys(source).forEach(key => {
                if (isObject(source[key])) {
                    if (!(key in target)) {
                        Object.assign(output, { [key]: source[key] });
                    } else {
                        output[key] = mergeDeep(target[key], source[key]);
                    }
                } else {
                    Object.assign(output, { [key]: source[key] });
                }
            });
        }
        return output;
    }
    return mergeDeep(defaultCongifs, configs);
});