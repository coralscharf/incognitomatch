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
        $scope.curr_exp_id="";
        $scope.curr_count_ans=0;
        $scope.total_ans_needed=0;
        $scope.curr_order=1;
        $scope.exclude_ids="";
        $scope.experiments=[];
        $scope.exp_ids=[];

    }; //the function

    $scope.show_home = function(){
        $("#home").show();
    };

    $scope.hide_pages = function () {
        $("#home").hide();
        $("#page2").hide();
        $("#experiment").hide();
        $("#begin_exp_user").hide();
        $("#finish_exp").hide();
        console.log("hide");
    };

    $scope.show_page2 = function () {
        $("#page2").show();

    };
    $scope.show_exp = function () {
        $("#begin_exp_user").show();

    };
    $scope.begin_exp = function(exp){
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
        $scope.curr_exp_id=exp['id'];
        $scope.total_ans_needed = exp['num_pairs'];
        $scope.getExp($scope.curr_exp_id);
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
        $scope.curr_count_ans=0;
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
            if (data.data !== "err")
            {
                $("#begin_exp_user").hide();
                let exp=data.data;
                $scope.begin_exp(exp);
                $scope.clear_user_form();
            }
            else
            {
                console.log(data.data);
            }

        });




    };


    $scope.getExp2 = function (callback,exp_id) {
        console.log("getExp2",exp_id);
        console.log("order", $scope.curr_order);
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
            console.log((data.data));
            //console.log((data.data)[0]);

            $scope.schema=data.data;
            $scope.h_1=[];
            let h_1_temp=$scope.schema[0]['h_1'].split(".");
            let last=0;
            for (let j=0;j<h_1_temp.length;j++)
            {
                $scope.h_1.push({"index":j,"val":h_1_temp[j]});
                last=j;
            }
            for (let k=0;k<$scope.schema[0]['brothers'].length;k++)
            {
                $scope.h_1.push({"index":last,"val":$scope.schema[0]['brothers'][k]});
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
            console.log("ex_id",$scope.exclude_ids);
            if ($scope.schema[0]['return_order'] === "change")
            {
                $scope.curr_order = $scope.curr_order + 1;
            }
            callback($scope.schema);
        });

    };

    $scope.getExp = function(exp_id){
        $scope.getExp2(function(schema){
            console.log(schema);
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
                console.log((data.data));
                console.log((data.data)[0]);

                $scope.schema2=data.data;
                $scope.h_2=[];
                let h_2_temp=$scope.schema2[0]['h_2'].split(".");
                let last=0;
                for (let j=0;j<h_2_temp.length;j++)
                {
                    $scope.h_2.push({"index":j,"val":h_2_temp[j]});
                    last=j;
                }

                for (let k=0;k<$scope.schema2[0]['brothers'].length;k++)
                {
                    $scope.h_2.push({"index":last,"val":$scope.schema2[0]['brothers'][k]});
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
        },exp_id);
    };


    $scope.exp_res = function(){

        console.log($scope.mouse_moves);
        console.log($scope.last_time_mouse);
        $http({
            method: 'POST',
            url: 'php/exp_res.php',
            data: $.param({
                exp_id: $scope.curr_exp_id,
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
                $scope.getExp($scope.curr_exp_id);
                document.getElementById("user_confidence").value="";
                // to init array of mouse locations remove the comment sign
                //$scope.mouse_moves=[];
                //$scope.last_time_mouse="";
                $scope.curr_count_ans = $scope.curr_count_ans + 1;
                console.log($scope.curr_count_ans);
                if ($scope.curr_count_ans >  $scope.total_ans_needed)
                {
                    console.log($scope.curr_count_ans);
                    $("#experiment").hide();
                    $("#finish_exp").show();
                    $scope.curr_order = 1;
                }

            }
            else
            {
                console.log(data.data);
            }

        });
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
                show_control: document.getElementById("show_control").checked

            }),
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).then(function (data) {
            console.log((data.data));
            if (data.data === "1")
            {

            }
            else
            {
                console.log(data.data);
            }

        });
        /*let file = $scope.first_xml_file;
        console.log(file);
        let exp_name = document.getElementById("exp_name").value;
        let uploadUrl = "php/fileUpload.php";
        let text = file.name;
        fileUpload.uploadFileToUrl(file, uploadUrl, text,exp_name);*/


    };

    $scope.captureCoordinate = function($event){
        // save mouse location every 500 milliseconds (0.5 second)
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

    $scope.decorateWithSpace = function(num,val) {

        return Array(+num + 1).join(' - ')+val+ "<i class=\"fas fa-folder-open\"></i>";


    };

    $scope.getCustomRepeatArray = function (size) {


        let bla=new Array(size);
        for (let b=0;b<size-1;b++)
        {
            bla[b]=b;
        }

        return bla;
    };


    
    $scope.get_exp_for_update = function () {
        $http({
            method: 'POST',
            url: 'php/get_exp_for_update.php',
            data: $.param({


            }),
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).then(function (data) {
            console.log((data.data));
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
    }

    $scope.update_exp = function () {
        let exps = [];
        for (let i = 0; i < $scope.exp_ids.length; i++)
        {
            let name_l="upt_exp_name_"+$scope.exp_ids[i];
            let schema_name_l="upt_exp_shema_name_"+$scope.exp_ids[i];
            let num_pairs_l="upt_exp_num_pairs_"+$scope.exp_ids[i];
            let upt_exp_disp_instacne = "upt_exp_disp_instacne_checked_"+$scope.exp_ids[i];
            console.log("bb", document.getElementById(upt_exp_disp_instacne).checked);
            console.log(upt_exp_disp_instacne);
            let disp_inst_val=0;
            if (document.getElementById(upt_exp_disp_instacne).checked === true)
            {
                console.log("what");
            }
            else{
                console.log("the");
            }
            if(angular.element("#"+upt_exp_disp_instacne).length>0)
            {
                console.log("what????");
            }
            else
            {
                console.log("the?????");
            }
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
                'disp_conrtrol': disp_control_val,
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
            console.log((data.data));
            if (data.data === "1") //error
            {
                console.log(data.data);
            }
            else
            {
                console.log(data.data);
            }

        });


    }


});	 //app.controller


