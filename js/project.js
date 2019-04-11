let app = angular.module('template', []);

app.directive('fileModel', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            let model = $parse(attrs.fileModel);
            let modelSetter = model.assign;

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
				let fd = new FormData();
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
        $scope.hide_pages();

        console.log("bb");
        $scope.show_home();

    }; //the function

    $scope.show_home = function(){
        $("#home").show();
    };

    $scope.hide_pages = function () {
        $("#home").hide();
        $("#page2").hide();
        $("#experiment").hide();
        console.log("hide");
    };

    $scope.show_page2 = function () {
        $("#page2").show();

    };
    $scope.show_exp = function () {
        $("#experiment").show();
        $scope.getExp();

    };

    $scope.getExp = function () {

        $http({
            method: 'POST',
            url: 'php/get_exp_info.php',
            data: $.param({
                exp_id: 1,
            }),
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).then(function (data) {
            console.log((data.data));
            console.log((data.data)[0]);

            let schema=data.data;
            //let index = Math.floor((Math.random() * schema.length) + 1);
            //console.log(schema[index]);
            document.getElementById("A_col_name").innerText=schema[0]['col_name'];
            document.getElementById("A_col_type").innerText=schema[0]['col_type'];
            document.getElementById("A_col_instance").innerText=schema[0]['instance'];
        });


    }





});	 //app.controller


