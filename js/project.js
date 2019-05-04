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
        $scope.schema2=[];
        $scope.schema=[];
        $scope.h_1=[];
        $scope.h_2=[];

    }; //the function

    $scope.show_home = function(){
        $("#home").show();
    };

    $scope.hide_pages = function () {
        $("#home").hide();
        $("#page2").hide();
        $("#experiment").hide();
        $("#begin_exp_user").hide();
        console.log("hide");
    };

    $scope.show_page2 = function () {
        $("#page2").show();

    };
    $scope.show_exp = function () {
        $("#begin_exp_user").show();


    };
    $scope.begin_exp = function(){
        $("#experiment").show();
        $scope.getExp();
    };


    $scope.new_user_exp = function(){

        $("#begin_exp_user").hide();
        $scope.begin_exp();

    };


    $scope.getExp2 = function (callback) {

        $http({
            method: 'POST',
            url: 'php/get_exp_info.php',
            data: $.param({
                exp_id: 1,
                term_a_or_b: 'sch_id_1'
            }),
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).then(function (data) {
            console.log((data.data));
            //console.log((data.data)[0]);

            $scope.schema=data.data;
            $scope.h_1=[];
            let h_1_temp=$scope.schema[0]['h_1'].split(".");
            for (let j=0;j<h_1_temp.length;j++)
            {
                $scope.h_1.push({"index":j,"val":h_1_temp[j]});
            }


            let str_instance="";
            if ("instance" in $scope.schema[0])
            {
                for (let i=0;i<$scope.schema.length;i++)
                {
                    str_instance=str_instance+$scope.schema[i]['instance']+", ";
                }
                str_instance=str_instance.substring(0, str_instance.length-1);
            }
            else {
                str_instance = "N/A";
            }

            //let index = Math.floor((Math.random() * schema.length) + 1);
            //console.log(schema[index]);
            document.getElementById("A_col_name").innerText=$scope.schema[0]['col_name'];
            document.getElementById("A_col_type").innerText=$scope.schema[0]['col_type'];
            document.getElementById("A_col_instance").innerText=str_instance;

            callback($scope.schema);
        });

    };

    $scope.getExp = function(){
        $scope.getExp2(function(schema){
            console.log(schema);
            $http({
                method: 'POST',
                url: 'php/get_exp_info.php',
                data: $.param({
                    exp_id: 1,
                    term_a_or_b: 'sch_id_2',
                    index_from_a: schema[0]['index']
                }),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }).then(function (data) {
                console.log((data.data));
                console.log((data.data)[0]);

                $scope.schema2=data.data;
                $scope.h_2=[];
                let h_2_temp=$scope.schema[0]['h_2'].split(".");
                for (let j=0;j<h_2_temp.length;j++)
                {
                    $scope.h_2.push({"index":j,"val":h_2_temp[j]});
                }
                let str_instance="";
                if ("instance" in $scope.schema2[0]) {
                    for (let i = 0; i < $scope.schema2.length; i++) {
                        str_instance = str_instance + $scope.schema2[i]['instance'] + ", ";
                    }
                    str_instance=str_instance.substring(0, str_instance.length-1);
                }
                else {
                    str_instance = "N/A";
                }
                //let index = Math.floor((Math.random() * schema.length) + 1);
                //console.log(schema[index]);
                document.getElementById("B_col_name").innerText=$scope.schema2[0]['col_name'];
                document.getElementById("B_col_type").innerText=$scope.schema2[0]['col_type'];
                document.getElementById("B_col_instance").innerText=str_instance;
                document.getElementById("exp_pair_score").innerText="System Suggestion: "+
                    $scope.schema2[0]['order']+" similar";
            });
        });
    };


    $scope.exp_res = function(){
        $http({
            method: 'POST',
            url: 'php/exp_res.php',
            data: $.param({
                exp_id: 1,
                user_id: 1,
                sch_id_1: $scope.schema[0]['sch_id'],
                sch_id_2: $scope.schema2[0]['sch_id'],
                realconf: $scope.schema[0]['realConf'],
                userconf: document.getElementById("user_confidence").value
            }),
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).then(function (data) {
            console.log((data.data));
            if (data.data === "1")
            {
                $scope.getExp();
                document.getElementById("user_confidence").value="";
            }

        });
    };



    $scope.add_exp = function () {

        let fd = new FormData();
        console.log($scope.myFile);
        fd.append('file', $scope.myFile);
        fd.append('name', "test");
        $http.post("php/fileUpload.php", fd, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined, 'Process-Data': false}
        }).then(function (data) {
            let res = data.data;
            if (res === "0") {
                console.log("good");
            } else {
                console.log("not good");
            }
            console.log("res", res);


        })

    };

    $scope.captureCoordinate = function($event){
        let d = new Date();
        let sec = d.getSeconds();
        if (sec % 20 === 0)
        {
            console.log("x:" + $event['pageX']+ " y:" + $event['pageY']);
        }

    };




});	 //app.controller


