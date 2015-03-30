angular.module('markdownFilter', []).filter('mFilter', function() {
	return function(input) {
		return markdown.toHTML(input);
	};
});

angular.module('docsapiapp', ['markdownFilter']);

function DocsApiCtrl($scope, $http) {
	$scope.toggleiterator = 0;
	//$scope.source = "";
	$scope.data = {};
	$http.get('./api.txt').success(function(data) {
		data = data.replace("$hostname", document.location.host);
		$scope.data = ApiaryBlueprintParser.parse(data);
		//$scope.source = data + "\n" + JSON.stringify($scope.data);

		for (var s = 0; s < $scope.data.sections.length; s++) {
			var section = $scope.data.sections[s];
			for (var r = 0; r < section.resources.length; r++) {
				var resource = section.resources[r];
				resource.curl = "curl --include ";
				for (var h in resource.request.headers) {
					resource.curl += "--header \"" + h + ": " + resource.request.headers[h] + "\" ";
				}
				if (resource.method !== "GET") {
					resource.curl += "--request " + resource.method + " ";
				}
				if (resource.request.body || resource.method !== "GET") {
					resource.curl += "--data-binary " + (resource.request.body ? JSON.stringify(resource.request.body.replace(/(\r\n|\n|\r)/gm,"")) : "") + " ";
				}
				resource.curl += $scope.data.location + "" + resource.url;
			}
		}

	}).error(function() {
		console.log("loading source doc failed");
	});
}