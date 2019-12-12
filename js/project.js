
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

app.directive('ngFile', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            element.bind('change', function(){

                $parse(attrs.ngFile).assign(scope,element[0].files);
                scope.$apply();
            });
        }
    };
}]);


app.directive('starRating', function () {
    return {
        scope: {
            value: '='
        },
        template: '<div class="stars"><i class="fa fa-star" ng-repeat="r in entries"></i></div>',
        controller: function ($scope) {
            $scope.entries = _.range($scope.value);
        }
    }
});

		// We can write our own fileUpload service to reuse it in the controller
		app.service('fileUpload', ['$http', function ($http) {
			this.uploadFileToUrl = function(files, uploadUrl, name, exp_name){
				let fd = new FormData();
                angular.forEach(files,function(file){
                    fd.append('file[]',file);
                });
				fd.append('name', name);
                fd.append('exp_name', exp_name);
				$http.post(uploadUrl, fd, {
					transformRequest: angular.identity,
					headers: {'Content-Type': undefined,'Process-Data': false}
				}).then(function(data){
                    let res=data.data;
                    //console.log(res);
                    if (res==="0")
                    {
                        //console.log("good");

                    }
                    else {
                        console.log("error upload files");

                    }
                    //console.log("res",res );



					//$scope.uploadFile(data,name);


				})

			}
		}]);


//		 myApp.controller('myCtrl', ['$scope', 'fileUpload', function($scope, fileUpload){

app.controller('avivTest', function ($scope, $http,$compile, $interval, fileUpload, $window, $element, $timeout) {

    $scope.init_avivTest = function () {
        // this function called when loading the site. init all params.

        $scope.hide_pages();
        $scope.show_home();
        $scope.schema2=[];
        $scope.schema=[];
        $scope.h_1=[];
        $scope.h_2=[];
        $scope.last_time_mouse="";
        $scope.mouse_moves=[];
        $scope.new_user_gender_val="";
        $scope.curr_user={};
        $scope.curr_exp_id="";
        $scope.curr_count_ans=0;
        $scope.total_ans_needed=0;
        $scope.curr_order=1;
        $scope.exclude_ids="";
        $scope.experiments=[];
        $scope.exp_ids=[];
        $scope.done_test=false;
        $scope.exp_after_test=[];
        $scope.files_to_upload={"csv":"","xml":[],"xsd":[]};
        $scope.time_to_pause="";
        $scope.disp_feedback=false;
        $scope.test_schema="";
        $scope.curr_realConf="";
        $scope.user_total_ans_right=0;
        $scope.last_ans=false;
        $scope.validFieldFigureEight = new RandExp(/[A-Gg-z0-9]{40}/).gen();
        $scope.user_current_confidence = 0;

        // $scope.create_heat_map();
        $scope.get_mouse_click_data();
        $scope.showConfidenctLineGraph();
    };

    $scope.show_home = function(){
        // this function show the home div - the instructions.
        $("#home").show();
    };

    $scope.hide_pages = function () {
        //this function hide all pages.
        $("#home").hide();
        $("#riddle").hide();
        $("#experiment").hide();
        $("#begin_exp_user").hide();
        $("#finish_exp").hide();
        $("#instruction_after").hide();
        $("#statistics").hide();
    };

    $scope.show_riddle = function () {
        //this function show the riddles div after the user read the instruction.

        $("#riddle").show();
        $("#tr_riddle_1").show();
        $("#tr_riddle_2").show();
        $("#tr_riddle_3").show();
        $("#tr_riddle_4").show();
        $("#tr_riddle_5").show();
        $("#tr_riddle_6").show();
        $("#tr_riddle_7").show();
        let hide1=Math.floor((Math.random() * 7) + 1);
        let choose = false;
        let hide2;
        while (!choose)
        {
            hide2=Math.floor((Math.random() * 7) + 1);
            if (hide1!==hide2)
            {
                choose = true;
            }
        }
        let str1="#tr_riddle_"+hide1;

        let str2="#tr_riddle_"+hide2;
        console.log(str1,str2);
        $(str1).hide();
        $(str2).hide();
    };

    $scope.show_exp = function () {
        // this function show the new user form after clicking on the "experiment" in the nav bar.
        $scope.exclude_ids="";
        $scope.curr_order=1;
        $scope.mouse_moves=[];
        $scope.done_test=false;
        $scope.disp_feedback=false;
        $("#begin_exp_user").show();

    };

    $scope.show_test = function() {

            $http({
                method: 'POST',
                url: 'php/riddles.php',
                data: $.param({
                    riddle_1: document.getElementById("riddle_1").value,
                    riddle_2: document.getElementById("riddle_2").value,
                    riddle_3: document.getElementById("riddle_3").value,
                    riddle_4: document.getElementById("riddle_4").value,
                    riddle_5: document.getElementById("riddle_5").value,
                    riddle_6: document.getElementById("riddle_6").value,
                    riddle_7: document.getElementById("riddle_7").value,
                    user_id: $scope.curr_user['id']
                }),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }).then(function (data) {
                if (data.data !== "err") {
                    $("#riddle").hide();
                    document.getElementById("riddle_1").value = "";
                    document.getElementById("riddle_2").value = "";
                    document.getElementById("riddle_3").value = "";
                    document.getElementById("riddle_4").value = "";
                    document.getElementById("riddle_5").value = "";
                    document.getElementById("riddle_6").value = "";
                    document.getElementById("riddle_7").value = "";
                    $scope.begin_exp($scope.test_schema);
                } else {
                    console.log(data.data);
                }

            });
    };

    $scope.show_statistics = function(){
        // this function show the home div - the instructions.
        $("#statistics").show();
        $scope.showCorrectAnswersBar();
    };

    $scope.begin_exp = function(exp){
        //this function set the experiment form accordingly to the correct settings and call getExp function
        // to get the first pair.

        $("#experiment").show();
        if (exp['disp_type'] === 0)
        {
            $("#row_type").hide();
        }
        else
        {
            $("#row_type").show();
        }
        if (exp['disp_h'] === 0)
        {
            $("#row_h").hide();
        }
        else
        {
            $("#row_h").show();
        }
        if (exp['disp_control'] === 0)
        {
            $("#row_control").hide();
        }
        else
        {
            $("#row_control").show();
        }
        if (exp['disp_feedback'] === 1)
        {
            $scope.disp_feedback=true;
        }
        else {
            $scope.disp_feedback=false;
        }
        console.log("disp_feedback:",$scope.disp_feedback);
        $scope.curr_exp_id=exp['id'];
        $scope.total_ans_needed = exp['num_pairs'];

        $scope.time_to_pause = Math.floor(exp['num_pairs']*0.2);
        //console.log("time_to_pause",$scope.time_to_pause);
        $scope.getExp($scope.curr_exp_id);
        document.getElementById("exp_hello").innerText="Hello, " + $scope.curr_user["last"] + " " + $scope.curr_user['first'];

    };


    $scope.clear_user_form = function()
    {
        //this function clear the new user form after data saved.
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
        // this function create new user for experiment.

        $scope.curr_count_ans=0;
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
            //console.log((data.data));
            if (data.data !== "err")
            {
                $("#begin_exp_user").hide();
                $scope.exp_after_test = data.data[0];

                $scope.test_schema=data.data[1];
                console.log("group_name:",$scope.test_schema['schema_name']);
                $scope.curr_user={"first":document.getElementById("new_user_first").value,
                    "last":document.getElementById("new_user_last").value,
                    "id": data.data[2]
                };

                $scope.show_riddle();

                $scope.clear_user_form();
            }
            else
            {
                console.log(data.data);
            }

        });
    };


    $scope.getExp2 = function (callback,exp_id) {
        // function to retrieves the term from shcema 1
        // console.log("bla:",$scope.curr_order,exp_id);
        $http({
            method: 'POST',
            url: 'php/get_exp_info.php',
            data: $.param({
                exp_id: exp_id,
                order: $scope.curr_order,
                term_a_or_b: 'sch_id_1',
                exclude_ids: $scope.exclude_ids
            }),
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).then(function (data) {
            // console.log((data.data));
            //console.log((data.data)[0]);

            $scope.schema=data.data;
            $scope.h_1=[];
            let h_1_temp=$scope.schema[0]['h_1'].split(".");
            let last=0;
            for (let j=0;j<h_1_temp.length;j++)
            {
                if ($scope.schema[0]['col_name'] === h_1_temp[j]){
                    $scope.h_1.push({"index":j,"val":h_1_temp[j],"color":'red'});
                }
                else{
                    $scope.h_1.push({"index":j,"val":h_1_temp[j],"color":'green'});
                }

                last=j;
            }
            for (let k=0;k<$scope.schema[0]['brothers'].length;k++)
            {
                $scope.h_1.push({"index":last,"val":$scope.schema[0]['brothers'][k],"color":'blue'});
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
            $scope.exclude_ids = $scope.exclude_ids +  " and id!=" + $scope.schema[0]['index'];
            // console.log("ex_id",$scope.exclude_ids);
            if ($scope.schema[0]['return_order'] === "change")
            {
                $scope.curr_order = $scope.curr_order + 1;
            }
            $scope.curr_realConf = $scope.schema[0]['realConf'];
            document.getElementById("user_confidence").value=50;
            document.getElementById("text_confidence_input").value = 50;
            callback($scope.schema);
        });

    };

    $scope.getExp = function(exp_id){
        // this function retrieves from the DB a pair to display in the expertiment.
        // first the callback function run - the term from schema 1.

        $scope.getExp2(function(schema){
            // then this function - the term from schema 2.
            $http({
                method: 'POST',
                url: 'php/get_exp_info.php',
                data: $.param({
                    exp_id: exp_id,
                    term_a_or_b: 'sch_id_2',
                    index_from_a: schema[0]['index']
                }),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }).then(function (data) {
                // console.log((data.data));
                //console.log((data.data)[0]);

                $scope.schema2=data.data;
                $scope.h_2=[];
                let h_2_temp=$scope.schema2[0]['h_2'].split(".");
                let last=0;
                for (let j=0;j<h_2_temp.length;j++)
                {
                    if ($scope.schema2[0]['col_name'] === h_2_temp[j]){
                        $scope.h_2.push({"index":j,"val":h_2_temp[j],"color":'red'});
                    }
                    else{
                        $scope.h_2.push({"index":j,"val":h_2_temp[j],"color":'green'});
                    }

                    last=j;
                }

                for (let k=0;k<$scope.schema2[0]['brothers'].length;k++)
                {
                    $scope.h_2.push({"index":last,"val":$scope.schema2[0]['brothers'][k],"color":'blue'});
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
                document.getElementById("exp_pair_score").innerText=
                    $scope.schema2[0]['score']+" similar";
            });
        },exp_id);
    };


    $scope.exp_res = function(){
        //this function save user answer for current pair to DB.

        $http({
            method: 'POST',
            url: 'php/exp_res.php',
            data: $.param({
                exp_id: $scope.curr_exp_id,
                user_id: $scope.curr_user['id'],
                sch_id_1: $scope.schema[0]['sch_id'],
                sch_id_2: $scope.schema2[0]['sch_id'],
                realconf: $scope.schema[0]['realConf'],
                userconf: document.getElementById("user_confidence").value,
                mouse_loc: $scope.mouse_moves,
                user_ans_match:$scope.user_ans_match
            }),
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).then(function (data) {
            //console.log((data.data));
            if (data.data === "1")
            {
                $scope.getExp($scope.curr_exp_id); // TODO: check for move it to the end
                document.getElementById("user_confidence").value=50; // init range to 0
                document.getElementById("text_confidence_input").value = 50;

                // to disable init array of mouse locations add the comment sign
                $scope.mouse_moves=[];

                $scope.curr_count_ans = $scope.curr_count_ans + 1;
                // console.log("count",$scope.curr_count_ans,$scope.total_ans_needed);
                if ($scope.curr_count_ans >=  $scope.total_ans_needed) // check if exp is done
                {
                    if($scope.done_test === false) // check if user in test exp, if yes - show instruction, else show finished
                    {
                        $scope.done_test = true;

                        $scope.curr_order = 0;
                        $scope.curr_count_ans = 0;
                        // TODO: for roee - delete this if:
                        if ($scope.test_schema['schema_name'] === "group2") {
                            //Coral - change === to ==
                            if (($scope.curr_realConf == 0 && $scope.user_ans_match==false) ||
                                ($scope.curr_realConf == 1 && $scope.user_ans_match==true)) // the user was right
                            {
                                $scope.user_total_ans_right += 1;
                            }

                            document.getElementById("feedback_body").innerHTML = "You were right in " +
                                $scope.user_total_ans_right + " answers out of the last 5 pairs.";
                            $scope.user_total_ans_right = 0;
                            $("#disp_feedback_modal").modal('show');

                        }
                        else if ($scope.test_schema['schema_name'] === "group1")
                        {
                            // console.log("i am here");
                            let prefix_str="";
                            let body_str="";
                            //Coral: change last_ans after && to user_ans_match
                            if (($scope.curr_realConf == 0 && $scope.user_ans_match==false) ||
                                ($scope.curr_realConf == 1 && $scope.user_ans_match==true)) // the user was right
                            {
                                prefix_str = "Well Done!";
                            }
                            else
                            {
                                prefix_str = "Your answer is wrong. In order to improve your confidence level in future - Be aware!";
                            }

                            body_str = "The instances of the Terms are not resembled.";
                            document.getElementById("feedback_body").innerHTML = prefix_str + "<br>" + body_str;
                            $("#disp_feedback_modal").modal('show');

                        }
                        else
                        {
                            //TODO: for roee not to delete!!!!! need to be out of the if
                            $("#experiment").hide();
                            $("#instruction_after").show();
                        }

                    }
                    else {
                        // console.log($scope.curr_count_ans);
                        $("#experiment").hide();

                        document.getElementById("figureEightValidateField").placeholder = ($scope.validFieldFigureEight).toString();
                        $("#finish_exp").show();
                        $scope.curr_order = 1;
                        $scope.curr_count_ans = 0;
                    }

                }
                else if($scope.done_test === false && $scope.disp_feedback === true ) // TODO: for roee need to change to True: $scope.done_test === true
                {
                    if ($scope.test_schema['schema_name'] === "group2") {
                        // console.log("real conf:",$scope.curr_realConf,$scope.user_ans_match,$scope.user_total_ans_right);
                        if (($scope.curr_realConf == 0 && $scope.user_ans_match==false) ||
                            ($scope.curr_realConf == 1 && $scope.user_ans_match==true)) // the user was right
                        {
                            $scope.user_total_ans_right += 1;
                        }
                        if ($scope.curr_count_ans === 5 || $scope.curr_count_ans === 10) {
                            document.getElementById("feedback_body").innerHTML = "You were right in " +
                                $scope.user_total_ans_right + " answers out of the last 5 pairs.";
                            $scope.user_total_ans_right = 0;
                            $("#disp_feedback_modal").modal('show');

                        }

                    }
                    else if ($scope.test_schema['schema_name'] === "group1")
                    {
                        // console.log("real conf:",$scope.curr_realConf,$scope.user_ans_match,$scope.user_total_ans_right);
                        let prefix_str ="";
                        let body_str="";
                        if (($scope.curr_realConf == 0 && $scope.user_ans_match==false) ||
                            ($scope.curr_realConf == 1 && $scope.user_ans_match==true)) // the user was right
                        {
                            prefix_str = "Well Done!";
                        }
                        else
                        {
                            prefix_str = "Your answer is wrong. In order to improve your confidence level in future - Be aware!";
                        }

                        //CORAL: Add line 608 - reduce curr_order by 1
                        $scope.curr_order = $scope.curr_order - 1;
                        // console.log("$scope.curr_order ", $scope.curr_order);
                        if ($scope.curr_order === 1 || $scope.curr_order === 2 || $scope.curr_order === 4
                            || $scope.curr_order === 7 || $scope.curr_order === 10)
                        {
                            body_str = "The instances of the Terms are not resembled.";
                        }
                        else if ($scope.curr_order === 3 || $scope.curr_order === 5)
                        {
                            body_str = "The instances of the Terms are resembled in their types and values.";
                        }
                        else if ($scope.curr_order === 6)
                        {
                            body_str = "The instances of the Terms are not resembled in their types in the instances." +
                                "For example, the string 3 is representing a number while three is a string.";
                        }
                        else if ($scope.curr_order === 8)
                        {
                            body_str = "The Terms are resembled in their location at the hierarchy and their instances.";
                        }
                        else if ($scope.curr_order === 9)
                        {
                            body_str = "The Terms are resembled in their instances subject." +
                                "For Example, both 3PM and 3:00 is two ways to represent time.";
                        }
                        document.getElementById("feedback_body").innerHTML = prefix_str + "<br>" + body_str;
                        $("#disp_feedback_modal").modal('show');

                        //CORAL: After line 608 - add curr_order 1 for the next function
                        $scope.curr_order = $scope.curr_order + 1;
                    }



                }

                // TODO: for roee need remove the comment sign
                    /*
                else if($scope.done_test === true && ($scope.curr_count_ans % $scope.time_to_pause === 0)){
                    // show pause modal every $scope.time_to_pause answers
                    // show pause only for non-test schema

                    document.getElementById("pause_modal_body").innerHTML="Get ready for the next Step." +
                        "<br>Pairs remaining: " + ($scope.total_ans_needed - $scope.curr_count_ans);;


                    $("#pause_exp_modal").modal('show');
                    //console.log("pause");


                }*/ // untill here
                $scope.last_ans = $scope.user_ans_match;
                $scope.user_ans_match = false; // init radio button match/no match
            }
            else // error while update the answer from user
            {
                console.log(data.data);
            }

        });
    };

    $scope.show_pause_after_feedback = function() {
        // this function show pause modal after the feedback modal dismissed.
        // TODO: for roee need remove the comment sign
        /*
        if($scope.done_test === true && ($scope.curr_count_ans % $scope.time_to_pause === 0)) {
            // show pause modal every $scope.time_to_pause answers
            // show pause only for non-test schema
            document.getElementById("pause_modal_body").innerHTML="Get ready for the next Step." +
                "<br>Pairs remaining: " + ($scope.total_ans_needed - $scope.curr_count_ans);

            $("#pause_exp_modal").modal('show');
            //console.log("pause");
        }*/

        // TODO: for roee delete this.
        if ($scope.done_test === true)
        {
            console.log("enter");
            $("#experiment").hide();
            $("#instruction_after").show();
        }



    };

    $scope.after_instructions = function () {
        // this function redirect user to begin the experiment
        $scope.begin_exp($scope.exp_after_test);
        $("#instruction_after").hide();
    };

    $scope.new_admin = function() {
        // this function create new admin.
        $http({
            method: 'POST',
            url: 'php/new_admin.php',
            data: $.param({
                new_admin_email: document.getElementById("new_admin_email").value,
                new_admin_pass: document.getElementById("new_admin_pass").value,
                new_admin_name: document.getElementById("new_admin_name").value,
            }),
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).then(function (data) {
            if (data.data === "err")
            {
                document.getElementById("new_admin_log").innerHTML="Error";
                $timeout(function() {
                    document.getElementById("new_admin_log").innerHTML="";
                },3000);
            }
            else
            {
                document.getElementById("new_admin_log").innerHTML="Done";
                $timeout(function() {
                    document.getElementById("new_admin_log").innerHTML="";
                    $('#new_admin').modal('hide')
                },2000);
            }

        });

    };
    $scope.admin_login = function() {
        // this function check if admin authenticate correctly and adds menu options for admin.
        $http({
            method: 'POST',
            url: 'php/admin_login.php',
            data: $.param({
                admin_email: document.getElementById("admin_email").value,
                admin_pass: document.getElementById("admin_pass").value,
            }),
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).then(function (data) {
            if (data.data === "err") // sql error
            {
                document.getElementById("admin_login_log").innerHTML="Error";
                $timeout(function() {
                    document.getElementById("admin_login_log").innerHTML="";
                },3000);
            }
            else if (data.data === "no_user")
            {
                document.getElementById("admin_login_log").innerHTML="Wrong user or password";
                $timeout(function() {
                    document.getElementById("admin_login_log").innerHTML="";
                    $('#new_admin').modal('hide')
                },2000);
            }
            else {
                $scope.admin_details = data.data;
                document.getElementById("nav_admin").innerText = "";
                angular.element(document.getElementById("nav_admin")).append($compile(
                    "<a class=\"nav-link dropdown-toggle\"  id=\"navbarDropdownMenuLink\" data-toggle=\"dropdown\" href=\"#\"  aria-haspopup=\"true\"\n" +
                    "\t\t\t\t\t\t   aria-expanded=\"false\">More</a>\n" +
                    "\t\t\t\t\t\t<div class=\"dropdown-menu  dropdown-menu-right\" aria-labelledby=\"navbarDropdownMenuLink\" id=\"navbar_admin\">\n" +
                    "\t\t\t\t\t\t\t<a class=\"dropdown-item\" href=\"#\"  data-toggle=\"modal\" data-target=\"#new_admin\">New Admin</a>\n" +
                    "\t\t\t\t\t\t\t<a class=\"dropdown-item\" href=\"#\"  data-toggle=\"modal\" data-target=\"#add_exp_modal\">Add Experiment</a>\n" +
                    "\t\t\t\t\t\t\t<a class=\"dropdown-item\" href=\"#\"  data-toggle=\"modal\" data-target=\"#update_exp_modal\" ng-click=\"get_exp_for_update()\">Update Experiment</a>\n" +
                    "\t\t\t\t\t\t\t<a class=\"dropdown-item\" href=\"#\"  ng-click=\"hide_pages(); show_statistics()\">Show Statistics</a>\n" +
                    "\t\t\t\t\t\t\t<a class=\"dropdown-item\" href=\"#\"  ng-click=\"admin_logout()\">Logout</a>\n" +
                    "\t\t\t\t\t\t</div>")($scope));
                //console.log( $scope.admin_details);
                $timeout(function() {
                    document.getElementById("admin_email").value="";
                    document.getElementById("admin_pass").value="";
                    $('#admin_login').modal('hide')
                },1000);
            }



        });

    };

    $scope.admin_logout = function(){
        // this function disconnect admin user and remove the admin panel from nav bar.
        $http({
            method: 'POST',
            url: 'php/new_exp.php',
            data: $.param({

            }),
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).then(function (data) {
            $scope.admin_details=[];
            document.getElementById("nav_admin").innerText = "";
            angular.element(document.getElementById("nav_admin")).append($compile(
                "<a class=\"nav-link dropdown-toggle\"  id=\"navbarDropdownMenuLink\" data-toggle=\"dropdown\" href=\"#\"  aria-haspopup=\"true\"\n" +
                "\t\t\t\t\t\t   aria-expanded=\"false\">More</a>\n" +
                "\t\t\t\t\t\t<div class=\"dropdown-menu  dropdown-menu-right\" aria-labelledby=\"navbarDropdownMenuLink\" id=\"navbar_admin\">\n" +
                "\t\t\t\t\t\t\t<a class=\"dropdown-item\" href=\"#\"  data-toggle=\"modal\" data-target=\"#admin_login\">Log in</a>\n" +
                "\t\t\t\t\t\t</div>")($scope));

        });

    };

    $scope.upload_exp_files = function(callback){
        $scope.files_to_upload={"csv":"","xml":[],"xsd":[]};

        let file = $scope.first_xml_file;
        // console.log(file);
        let exp_name = document.getElementById("exp_name").value;
        let uploadUrl = "php/fileUpload.php";
        let text = file.name;
        for (let i=0;i<file.length;i++)
        {
            $scope.files_to_upload['xml'].push(file[i].name);
        }
        fileUpload.uploadFileToUrl(file, uploadUrl, text,exp_name);


        file = $scope.first_xsd_file;
        console.log(file);
        exp_name = document.getElementById("exp_name").value;
        uploadUrl = "php/fileUpload.php";
        text = file.name;
        $scope.files_to_upload['xsd'].push(file[0].name);
        fileUpload.uploadFileToUrl(file, uploadUrl, text,exp_name);


        file = $scope.file_csv;
        console.log(file);
        exp_name = document.getElementById("exp_name").value;
        uploadUrl = "php/fileUpload.php";
        text = file.name;
        $scope.files_to_upload['csv']=file[0].name;
        fileUpload.uploadFileToUrl(file, uploadUrl, text,exp_name);

        file = $scope.sec_xml_file;
        console.log(file);
        exp_name = document.getElementById("exp_name").value;
        uploadUrl = "php/fileUpload.php";
        text = file.name;
        for (let i=0;i<file.length;i++)
        {
            $scope.files_to_upload['xml'].push(file[i].name);
        }
        fileUpload.uploadFileToUrl(file, uploadUrl, text,exp_name);

        file = $scope.sec_xsd_file;
        console.log(file);
        exp_name = document.getElementById("exp_name").value;
        uploadUrl = "php/fileUpload.php";
        text = file.name;
        $scope.files_to_upload['xsd'].push(file[0].name);
        fileUpload.uploadFileToUrl(file, uploadUrl, text,exp_name);

        console.log($scope.files_to_upload);

        callback(); // create exp in db
    };

    $scope.add_exp = function () {

        $http({
            method: 'POST',
            url: 'php/new_exp.php',
            data: $.param({
                exp_name: document.getElementById("exp_name").value,
                exp_sch_name: document.getElementById("exp_sch_name").value,
                exp_num_pairs: document.getElementById("exp_num_pairs").value,
                show_instance: document.getElementById("show_instance").checked,
                show_type: document.getElementById("show_type").checked,
                show_hierarchy: document.getElementById("show_hierarchy").checked,
                show_feedback: document.getElementById("show_feedback").checked,
                show_control: document.getElementById("show_control").checked,
                //files: $scope.files_to_upload
            }),
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).then(function (data) {

            if (data.data === "err") {
                console.log((data.data));

            } else {
                console.log("new exp id:", data.data);
            }

        });


    };

    $scope.captureCoordinate = function($event){
        // this function save mouse location every 500 milliseconds (0.5 second)
        let d = new Date();
        if ($scope.last_time_mouse.length === 0)
        {
            $scope.last_time_mouse = d.getTime();
            let left=false,right=false,scroll=false;
            if ($event['which']===0){
                left=true;
            }
            else if ($event['which']===1){
                right=true;
            }
            else if ($event['which']===2){
                scroll=true;
            }


            $scope.mouse_moves.push({"time":d.getTime(),"x":$event['pageX'],"y":$event['pageY'],"l":left,"r":right,"s":scroll});
        }
        else if (d.getTime() -  $scope.last_time_mouse > 500 )
        {
            let left=false,right=false,scroll=false;
            if ($event['which']===0){
                left=true;
            }
            else if ($event['which']===1){
                right=true;
            }
            else if ($event['which']===2){
                scroll=true;
            }
            $scope.mouse_moves.push({"time":d.getTime(),"x":$event['pageX'],"y":$event['pageY'],"l":left,"r":right,"s":scroll});
            $scope.last_time_mouse = d.getTime();
        }

    };



    $scope.getCustomRepeatArray = function (size) {
        // this function makes the hierarchy design in the exp form.
        // get the current level in the hierarchy and return an array in that size - this is for ng repeat.
        let sized_array=new Array(size);
        for (let b=0;b<size-1;b++)
        {
            sized_array[b]=b;
        }

        return sized_array;
    };


    
    $scope.get_exp_for_update = function () {
        // this function get all the experiments meta data for the update modal for the admin.
        $http({
            method: 'POST',
            url: 'php/get_exp_for_update.php',
            data: $.param({


            }),
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).then(function (data) {
            //console.log((data.data));
            if (data.data === "1") //error
            {
                console.log(data.data);
            }
            else
            {
                $scope.experiments = data.data;
                for (let i = 0; i < $scope.experiments.length; i++)
                {
                    $scope.exp_ids.push($scope.experiments[i]['id']);
                }
            }

        });
    };

    $scope.update_exp = function () {
        // this function update every experiment according to changes made by admin in the update experiment modal.
        let exps = [];
        for (let i = 0; i < $scope.exp_ids.length; i++)
        {
            let name_l="upt_exp_name_"+$scope.exp_ids[i];
            let schema_name_l="upt_exp_shcema_name_"+$scope.exp_ids[i];
            let num_pairs_l="upt_exp_num_pairs_"+$scope.exp_ids[i];
            let upt_exp_disp_instacne = "upt_exp_disp_instacne_checked_"+$scope.exp_ids[i];

            let disp_inst_val=0;
            if (angular.element("#"+upt_exp_disp_instacne).length>0  && document.getElementById(upt_exp_disp_instacne).checked === true)
            {
                disp_inst_val=1;
            }
            else{
                upt_exp_disp_instacne = "upt_exp_disp_instacne_"+$scope.exp_ids[i];
                if (angular.element("#"+upt_exp_disp_instacne).length>0 && document.getElementById(upt_exp_disp_instacne).checked === true)
                {
                    disp_inst_val=1;
                }
            }
            let upt_exp_disp_type = "upt_exp_disp_type_checked_"+$scope.exp_ids[i];
            let disp_type_val=0;
            if (angular.element("#"+upt_exp_disp_type).length  && document.getElementById(upt_exp_disp_type).checked === true)
            {
                disp_type_val=1;
            }
            else{
                upt_exp_disp_type = "upt_exp_disp_type_"+$scope.exp_ids[i];
                if (angular.element("#"+upt_exp_disp_type).length  && document.getElementById(upt_exp_disp_type).checked === true)
                {
                    disp_type_val=1;
                }
            }
            let upt_exp_disp_h = "upt_exp_disp_h_checked_"+$scope.exp_ids[i];
            let disp_h_val=0;
            if (angular.element("#"+upt_exp_disp_h).length  && document.getElementById(upt_exp_disp_h).checked === true)
            {
                disp_h_val=1;
            }
            else{
                upt_exp_disp_h = "upt_exp_disp_h_"+$scope.exp_ids[i];
                if (angular.element("#"+upt_exp_disp_h).length  && document.getElementById(upt_exp_disp_h).checked === true)
                {
                    disp_h_val=1;
                }
            }
            let upt_exp_disp_feedback = "upt_exp_disp_feedback_checked_"+$scope.exp_ids[i];
            let disp_feedback_val=0;
            if (angular.element("#"+upt_exp_disp_feedback).length  && document.getElementById(upt_exp_disp_feedback).checked === true)
            {
                disp_feedback_val=1;
            }
            else{
                upt_exp_disp_feedback = "upt_exp_disp_feedback_"+$scope.exp_ids[i];
                if (angular.element("#"+upt_exp_disp_feedback).length  && document.getElementById(upt_exp_disp_feedback).checked === true)
                {
                    disp_feedback_val=1;
                }
            }
            let upt_exp_disp_control = "upt_exp_disp_control_checked_"+$scope.exp_ids[i];
            let disp_control_val=0;
            if (angular.element("#"+upt_exp_disp_control).length  && document.getElementById(upt_exp_disp_control).checked === true)
            {
                disp_control_val=1;
            }
            else{
                upt_exp_disp_control = "upt_exp_disp_control_"+$scope.exp_ids[i];
                if (angular.element("#"+upt_exp_disp_control).length  && document.getElementById(upt_exp_disp_control).checked === true)
                {
                    disp_control_val=1;
                }
            }
            let upt_exp_active = "upt_exp_is_active_checked_"+$scope.exp_ids[i];
            let disp_active_val=0;
            if (angular.element("#"+upt_exp_active).length  && document.getElementById(upt_exp_active).checked === true)
            {
                disp_active_val=1;
            }
            else{
                upt_exp_active = "upt_exp_is_active_"+$scope.exp_ids[i];
                if (angular.element("#"+upt_exp_active).length  && document.getElementById(upt_exp_active).checked === true)
                {
                    disp_active_val=1;
                }
            }

            exps.push({'id':$scope.exp_ids[i],
                'name':document.getElementById(name_l).value,
                'schema_name':document.getElementById(schema_name_l).value,
                'num_pairs':document.getElementById(num_pairs_l).value,
                'disp_instance': disp_inst_val,
                'disp_type': disp_type_val,
                'disp_h': disp_h_val,
                'disp_feedback': disp_feedback_val,
                'disp_control': disp_control_val,
                'is_active': disp_active_val

            })
        }

        $http({
            method: 'POST',
            url: 'php/update_exp.php',
            data: $.param({
                exps: exps

            }),
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).then(function (data) {
            if (data.data === "1") //error
            {
                document.getElementById("update_exp_log").innerHTML="Error!!";
                $timeout(function() {
                    document.getElementById("update_exp_log").innerHTML="";
                },3000);

            }
            else
            {
                document.getElementById("update_exp_log").innerHTML="Changes Saved!";
                $timeout(function() {
                    document.getElementById("update_exp_log").innerHTML="";
                },3000);
            }

        });
    };

    $scope.getColors = function(numOfColors) {
        let letters = '0123456789ABCDEF';
        let color = '#';
        let colors=[];
        for (let j=0; j < numOfColors ; j++)
        {
            color = '#';
            for (let i = 0; i < 6; i++ ) {
                color += letters[Math.floor(Math.random() * 16)];
            }
            colors.push(color);
        }
        return colors;
    };

    $scope.showCorrectAnswersBar = function () {
        document.getElementById("correctAnswersBar").innerHTML = "";

        $http({
            method: 'POST',
            url: 'php/get_num_of_correct_answers.php',
            data: $.param({
                expIds : []
            }),
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).then(function (data) {

            if (data.data.length !== 0) {

                let xLabels = [];
                let yData = [];
                let dataSets = [];

                const colors = $scope.getColors(data.data.length);

                let j = 0;
                for (let item in data.data){
                    const expId = (data.data)[item]['exp_id'];
                    const totalCorrectAns = (data.data)[item]['totalCorrectAns'];

                    xLabels.push(expId);
                    yData.push(totalCorrectAns);

                    const itemForDataSets = {label: expId,
                        data: totalCorrectAns, backgroundColor: colors[j]};
                    dataSets.push(itemForDataSets);
                    j++;
                }

                const ctx = document.getElementById("correctAnswersBar").getContext("2d");
                if ($scope.correctAnswersBar){
                    $scope.correctAnswersBar.destroy();
                }

                console.log(xLabels);
                console.log(dataSets);

                $scope.correctAnswersBar = new Chart(ctx, {
                    type: 'bar',
                    data: {
                        labels: xLabels,
                        datasets: [{
                            label: '# of Correct Answers',
                            data: yData,
                            backgroundColor: colors,
                            borderWidth: 1
                        }]
                    }
                });

                document.getElementById("correctAnswersBar").innerHTML = $scope.correctAnswersBar;

            } else {
                console.log('Get bar - number of correct answers failed');
            }
        });

    };


    $scope.showConfidenctLineGraph = function () {
        document.getElementById("correctAnswersBar").innerHTML = "";

        $http({
            method: 'POST',
            url: 'php/get_confidence_values.php',
            data: $.param({
                expIds : []
            }),
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).then(function (data) {

            if (data.data.length !== 0) {

                let xLabels = [];
                let yData = [];

                let j = 1;
                for (let item in data.data){
                    const user_conf = (data.data)[item]['user_conf'];

                    xLabels.push(j);
                    yData.push(user_conf);

                    j++;
                }

                const ctx = document.getElementById("confidenceLineGraph").getContext("2d");
                if ($scope.confidenctLineGraph){
                    $scope.confidenctLineGraph.destroy();
                }

                console.log(xLabels);
                console.log(yData);

                $scope.confidenctLineGraph = new Chart(ctx, {
                    type: 'line',
                    data: {
                        labels: xLabels,
                        datasets: [{
                            data: yData,
                            label: "Confidence Level",
                            borderColor: "#3235cd",
                            fill: false
                        }
                        ]
                    },
                    options: {
                        title: {
                            display: true,
                            text: 'Confidence Level as function of number of Questions'
                        }
                    }
                });

                document.getElementById("confidenctLineGraph").innerHTML = $scope.confidenctLineGraph;

            } else {
                console.log('Get line graph data - confidence levels failed');
            }
        });

    };


    $scope.add_user_data_finish_exp = function(){

        $http({
            method: 'POST',
            url: 'php/exp_add_user_data_finish_exp.php',
            data: $.param({
                user_id:  $scope.curr_user['id'],
                id_card: document.getElementById("new_user_card_id").value,
                u_validFieldFigureEight: $scope.validFieldFigureEight
            }),
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).then(function (data) {
            if (data.data !== "err")
            {
                document.getElementById("show_message_after_finish_figure_8").innerText = "Results saved Successfully!";
                document.getElementById("show_message_after_finish_figure_8").style.color = "green";
            }
            else
            {
                document.getElementById("show_message_after_finish_figure_8").innerText = "Error while saving results.";
                document.getElementById("show_message_after_finish_figure_8").style.color = "red";
                console.log(data.data);
            }

        });
    };

    $scope.create_heat_map = function() {
        Highcharts.chart('heatMap_container', {

            chart: {
                type: 'heatmap',
                marginTop: 40,
                marginBottom: 80,
                plotBorderWidth: 1,
                plotBackgroundImage: 'https://www.highcharts.com/samples/graphics/skies.jpg'
            },


            title: {
                text: 'Sales per employee per weekday'
            },

            xAxis: {
                categories: ['Alexander', 'Marie', 'Maximilian', 'Sophia', 'Lukas', 'Maria', 'Leon', 'Anna', 'Tim', 'Laura']
            },

            yAxis: {
                categories: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
                title: null,
                reversed: true
            },

            colorAxis: {
                min: 0,
                minColor: '#ffc8bf',
                maxColor: '#ff1800'
            },

            legend: {
                align: 'right',
                layout: 'vertical',
                margin: 0,
                verticalAlign: 'top',
                y: 25,
                symbolHeight: 280
            },

            series: [{
                name: 'Sales per employee',
                borderWidth: 0,
                opacity: 0.5,
                data: [[0, 0, 10], [0, 1, 19], [0, 2, 8], [0, 3, 24], [0, 4, 67], [1, 0, 92], [1, 1, 58], [1, 2, 78], [1, 3, 117], [1, 4, 48], [2, 0, 35], [2, 1, 15], [2, 2, 123], [2, 3, 64], [2, 4, 52], [3, 0, 72], [3, 1, 132], [3, 2, 114], [3, 3, 19], [3, 4, 16], [4, 0, 38], [4, 1, 5], [4, 2, 8], [4, 3, 117], [4, 4, 115], [5, 0, 88], [5, 1, 32], [5, 2, 12], [5, 3, 6], [5, 4, 120], [6, 0, 13], [6, 1, 44], [6, 2, 88], [6, 3, 98], [6, 4, 96], [7, 0, 31], [7, 1, 1], [7, 2, 82], [7, 3, 32], [7, 4, 30], [8, 0, 85], [8, 1, 97], [8, 2, 123], [8, 3, 64], [8, 4, 84], [9, 0, 47], [9, 1, 114], [9, 2, 31], [9, 3, 48], [9, 4, 91]],
                //dataLabels: {
                  //  enabled: false,
                    //color: '#000000'
                //}
            }],

            responsive: {
                rules: [{
                    condition: {
                        maxWidth: 500
                    },
                    chartOptions: {
                        yAxis: {
                            labels: {
                                formatter: function () {
                                    return this.value.charAt(0);
                                }
                            }
                        }
                    }
                }]
            }

        });
    };

    $scope.get_mouse_click_data = function(){
        $scope.allClicks = {};
        $http({
            method: 'POST',
            url: 'php/get_mouse_click_data.php',
            data: $.param({
                // TODO: Complete conditions
            }),
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).then(function (data) {
            console.log("GET MOUSE DATA ");
            // console.log(data.data);
            let count = 1;
            for(let index in data.data){
                const all_clicks_for_q = data.data[index];
                const all_clicks_list = all_clicks_for_q.split(';');
                // console.log(all_clicks_list);
                for (let i_click in all_clicks_list){
                    if((all_clicks_list[i_click]).includes('(')) {
                        let click = JSON.parse((all_clicks_list[i_click].replace('(','['))
                            .replace(')',']'));
                        const key_for_click = [click[1],click[2]];
                        if(key_for_click in $scope.allClicks && click){
                            $scope.allClicks[key_for_click] += 1;
                        }
                        else{
                            $scope.allClicks[key_for_click] = 1;
                        }
                    }
                }
            }
            console.log($scope.allClicks);

        });
    };

});	 //app.controller


