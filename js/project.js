let app = angular.module('template', []);

app.directive('fileModel', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;

            element.bind('change', function(){
                scope.$apply(function(){
                    modelSetter(scope, element[0].files[0]);
                });
            });
        }
    };
}]);

		// We can write our own fileUpload service to reuse it in the controller
		app.service('fileUpload', ['$http', function ($http) {
			this.uploadFileToUrl = function(file, uploadUrl, name){
				var fd = new FormData();
				fd.append('file', file);
				fd.append('name', name);
				$http.post(uploadUrl, fd, {
					transformRequest: angular.identity,
					headers: {'Content-Type': undefined,'Process-Data': false}
				}).then(function(data){
                    let res=data.data;
                    if (res==="0")
                    {
                        console.log("good");
                        document.getElementById("couldnt_add_new_file").style.display="none";
                        document.getElementById("added_file_successfully").style.display="block";
                    }
                    else {
                        console.log("not good");
                        document.getElementById("couldnt_add_new_file").style.display="block";
                        document.getElementById("added_file_successfully").style.display="none";
                    }
                    console.log("res",res );



					//$scope.uploadFile(data,name);


				})

			}
		}]);


//		 myApp.controller('myCtrl', ['$scope', 'fileUpload', function($scope, fileUpload){

app.controller('avivTest', function ($scope, $http,$compile, $interval, fileUpload, $window, $element, $timeout) {

	$scope.init_avivTest = function () {
		//$("#nav").show();
        //$scope.hidePages();
        //$("#home").show();
        console.log("bb");
    }; //the function


});	 //app.controller


