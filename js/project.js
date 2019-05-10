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
                    console.log(res);
                    if (res==="0")
                    {
                        console.log("good");

                    }
                    else {
                        console.log("not good");

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
        $scope.last_time_mouse="";
        $scope.mouse_moves=[];
        $scope.new_user_gender_val="";
        $scope.curr_user={};

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
        document.getElementById("exp_hello").innerText="Hello, " + $scope.curr_user["last"] + " " + $scope.curr_user['first'];

    };


    $scope.clear_user_form = function()
    {
        document.getElementById("new_user_first").value="";
        document.getElementById("new_user_last").value="";
        document.getElementById("new_user_email").value="";
        document.getElementById("new_user_country").value="";
        document.getElementById("new_user_lang").value="";
        document.getElementById("new_user_age").value="";
        document.getElementById("new_user_occ").value="";
        document.getElementById("new_user_edu").value="";
    };


    $scope.new_user_exp = function(){
        $scope.curr_user={"first":document.getElementById("new_user_first").value,"last":document.getElementById("new_user_last").value};
        console.log($scope.curr_user);
        $http({
            method: 'POST',
            url: 'php/exp_new_user.php',
            data: $.param({
                u_first: document.getElementById("new_user_first").value,
                u_last: document.getElementById("new_user_last").value,
                u_email: document.getElementById("new_user_email").value,
                u_loc: document.getElementById("new_user_country").value,
                u_lang: document.getElementById("new_user_lang").value,
                u_age: document.getElementById("new_user_age").value,
                u_occ: document.getElementById("new_user_occ").value,
                u_edu: document.getElementById("new_user_edu").value,
                u_gender: $scope.new_user_gender_val
            }),
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).then(function (data) {
            console.log((data.data));
            if (data.data === "1")
            {
                $("#begin_exp_user").hide();
                $scope.begin_exp();
                $scope.clear_user_form();
            }
            else
            {
                console.log(data.data);
            }

        });




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

        console.log($scope.mouse_moves);
        console.log($scope.last_time_mouse);
        $http({
            method: 'POST',
            url: 'php/exp_res.php',
            data: $.param({
                exp_id: 1,
                user_id: 1,
                sch_id_1: $scope.schema[0]['sch_id'],
                sch_id_2: $scope.schema2[0]['sch_id'],
                realconf: $scope.schema[0]['realConf'],
                userconf: document.getElementById("user_confidence").value,
                mouse_loc: $scope.mouse_moves
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
                // to init array of mouse locations remove the comment sign
                //$scope.mouse_moves=[];
                //$scope.last_time_mouse="";
            }
            else
            {
                console.log(data.data);
            }

        });
    };



    $scope.add_exp = function () {


        let file = $scope.myFile;

        console.dir(file);

        let uploadUrl = "php/fileUpload.php";
        let text = file.name;
        fileUpload.uploadFileToUrl(file, uploadUrl, text);

    };

    $scope.captureCoordinate = function($event){
        // save mouse location every 500 milliseconds (0.5 second)
        let d = new Date();
        if ($scope.last_time_mouse.length === 0)
        {
            $scope.last_time_mouse = d.getTime();
            $scope.mouse_moves.push({"time":d.getTime(),"x":$event['pageX'],"y":$event['pageY']});
        }
        else if (d.getTime() -  $scope.last_time_mouse > 500 )
        {
            $scope.mouse_moves.push({"time":d.getTime(),"x":$event['pageX'],"y":$event['pageY']});
            $scope.last_time_mouse = d.getTime();
        }

    };

    $scope.decorateWithSpace = function(num,val) {

        return Array(+num + 1).join(' - ')+val;


    };





});	 //app.controller


