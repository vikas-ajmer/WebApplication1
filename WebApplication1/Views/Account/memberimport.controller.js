(function () {
    'use strict';

    function MemberImportController(UserService, $rootScope, $scope, $http, $location, $anchorScroll, $routeParams) {

        initController();
        $rootScope.homerout = "memberimport";
        $scope.startimport = false;
        $scope.appDomain = $rootScope.appDomain;
        $scope.CorporateID = 0;
        $scope.iscorporatemanager = $rootScope.globals.currentUser.roleid;
        $scope.isremove = false;

        $scope.showWrongemailInfo = "none";
        $scope.showDoubleobjectInfo = "none";
        $scope.showGetemailfromdbInfo = "none";
        $scope.showInsertedMembers = "none";

        $scope.IsshowWrongemailInfo = true;
        $scope.IsshowDoubleobjectInfo = true;
        $scope.IsshowGetemailfromdbInfo = true;
      
        if ($routeParams.chk == 1) {
            $scope.isremove = true;
        } else {
            $scope.isremove = false;
        }

        function initController() {

            var postObject = new Object();
            postObject.CorporateRoleID = $rootScope.globals.currentUser.roleid;

            postObject.MemberID = $rootScope.globals.currentUser.userid;
            postObject.UserCorporateID = $rootScope.globals.currentUser.userCorporateID;

            $http({
                contentType: "application/json",
                method: 'POST',
                url: $rootScope.appurl + 'EngagementReport/GetCorporateName',
                data: postObject
                // headers: { 'Content-Type': 'application/json' }
            }).success(function (data, status, headers, config) {
                $scope.corporateName = data;

            }).error(function (data, status, headers, config) {
                console.log(data);
            });


            $scope.gotobottom = function (target, $event) {

                document.getElementById(target).scrollIntoView();
                //$location.hash(target);
                //$anchorScroll();
                event.preventDefault();
                event.stopPropagation();
                return false;
            }

            $rootScope.memberimportrout = "active";
            $rootScope.homerout = "";
            $rootScope.eventrout = "";

            $scope.ApplicationList = [
                { label: 'E2AP', value: 1 },
                { label: 'TWC', value: 2 }
            ];
            $scope.selectedItemvalue = "2";

            $scope.isListDisplay = false;
            $scope.isErrordisplay = false;
            $scope.isDuplicateError = false;
            $scope.isAlreadyExist = false;
            $scope.isInsertMessage = false;

            $scope.onChange = function (e, fileList) {
                alert('this is on-change handler!');
            };
            
            var uploadedCount = 0;
            $scope.files = [];

            $scope.removeSection = function (sectionName) {
                if (sectionName === "alreadySection") {
                    $scope.isAlreadyExist = false;
                    $scope.showGetemailfromdbInfo = "none";
                    $scope.IsshowGetemailfromdbInfo = false;
                    var elm = document.getElementById('divAlreadyExist');
                    elm.innerHTML = "";
                }
                if (sectionName === "duplicateSection") {
                    $scope.isDuplicateError = false;
                    $scope.showDoubleobjectInfo = "none";
                    $scope.IsshowDoubleobjectInfo = false;
                }
                if (sectionName === "incorrectEmailSection") {
                    $scope.isErrordisplay = false;
                    $scope.showWrongemailInfo = "none";
                    $scope.IsshowWrongemailInfo = false;
                }
            };

            $scope.remove = function (array, index) {
                array.splice(index, 1);
                alert("removed");
            }

            $rootScope.resubmit = function (resubmit) {

                if (!resubmit.$valid) {
                    return false;
                }
                var resubmitData = [];

                // angular.extend(resubmitData, $scope.wrongemail, $scope.doubleobject, $scope.getemailfromdb);

                if ($scope.IsshowWrongemailInfo == true) {
                    for (var inxex = 0; inxex < $scope.wrongemail.length; inxex++) {
                        resubmitData.push($scope.wrongemail[inxex]);
                    }
                }
                                
                if ($scope.IsshowDoubleobjectInfo == true) {
                    for (var index = 0; index < $scope.doubleobject.length; index++) {
                        resubmitData.push($scope.doubleobject[index]);
                    }
                }

                if ($scope.IsshowGetemailfromdbInfo == true) {
                    for (var index = 0; index < $scope.getemailfromdb.length; index++) {
                        resubmitData.push($scope.getemailfromdb[index]);
                    }
                }
                
                var postObject = new Object();
                postObject.CorporateID = $rootScope.globals.currentUser.corporateID;
                postObject.CorporateinfoID = $scope.selectcorporate;
                //postObject.ApplicationID = $rootScope.globals.currentUser.applicationID;

                var elm = document.getElementById("selectapplication");
                postObject.ApplicationID = elm.options[elm.selectedIndex].value;

                if (elm.options[elm.selectedIndex].value == 1 || elm.options[elm.selectedIndex].value == 2) { }
                else {
                    alert("Please select Application.");
                    return false;
                }

                postObject.data = resubmitData;

                postObject.isremove = false;


                console.log($rootScope.globals.currentUser.applicationID + ' => ' + JSON.stringify(postObject));

                if ($routeParams.chk == 1) {
                    postObject.isremove = true;
                }
                $scope.loder();
                $http({
                    contentType: "application/json",
                    method: 'POST',
                    url: $rootScope.appurl + 'values/AddMemberImport',
                    data: postObject
                    // headers: { 'Content-Type': 'application/json' }
                }).success(function (data, status, headers, config) {
                    if (data.userRegisterLimit <= (data.totalCorporateMembers + data.membersToImport)) {
                        //alert("You can't add " + data.membersToImport + " users as corporate's register limit is -> " + data.userRegisterLimit + ". And already " + data.totalCorporateMembers + " members are registered.");
                        alert(data.messageToShow);
                        $scope.hideloder();
                        return false;
                    }
                    if (data.status == -1) {
                        alert("Column name is not valid. please check excel document.");
                        $scope.hideloder();
                        return false;
                    }


                    $scope.hideloder();
                    //$rootScope.hideloder();
                    alert("Files uploaded successfully.");
                    $scope.wrongemail = data.wrongemail;
                    $scope.doubleobject = data.doubleobject;
                    $scope.getemailfromdb = data.getemailfromdb;
                    $scope.insertedMembers = data.insertedMembers;

                    for (var i = 0; i < $scope.wrongemail.length; i++) {
                        $scope.wrongemail[i].Member_DOB = new Date($scope.wrongemail[i].Member_DOB);
                    }

                    $scope.doubleobject = data.doubleobject;

                    for (var i = 0; i < $scope.doubleobject.length; i++) {
                        $scope.doubleobject[i].Member_DOB = new Date($scope.doubleobject[i].Member_DOB);
                    }

                    $scope.getemailfromdb = data.getemailfromdb;

                    for (var i = 0; i < $scope.getemailfromdb.length; i++) {
                        $scope.getemailfromdb[i].Member_DOB = new Date($scope.getemailfromdb[i].Member_DOB);
                    }

                    $scope.insertedMembers = data.insertedMembers;
                    if ($scope.insertedMembers > 0) {
                        $scope.showInsertedMembers = "block";
                        //$scope.hideInsertedMembers = false;
                    }
                    else {
                        $scope.showInsertedMembers = "none";
                        //$scope.hideInsertedMembers = true;
                    }

                    $scope.isListDisplay = true;
                    $scope.isInsertMessage = true;
                    if ($scope.insertedMembers > 0) {
                        $scope.showInsertedMembers = "block";
                        //$scope.hideInsertedMembers = false;
                    }
                    else {
                        $scope.showInsertedMembers = "none";
                        //$scope.hideInsertedMembers = true;
                    }
                    if ($scope.wrongemail.length > 0) {
                        $scope.isErrordisplay = true;
                        $scope.IsshowWrongemailInfo = true;
                        $scope.showWrongemailInfo = "block";
                    }
                    else {
                        $scope.isErrordisplay = false;
                        $scope.showWrongemailInfo = "none";
                    }
                    
                    if ($scope.doubleobject.length > 0) {
                        $scope.isDuplicateError = true;
                        $scope.IsshowDoubleobjectInfo = true;
                        $scope.showDoubleobjectInfo = "block";
                    }
                    else {
                        $scope.isDuplicateError = false;
                        $scope.IsshowGetemailfromdbInfo = true;
                        $scope.showDoubleobjectInfo = "none";
                    }

                    

                    if ($scope.getemailfromdb.length > 0) {
                        $scope.isAlreadyExist = true;
                        $scope.showGetemailfromdbInfo = "block";
                    }
                    else {
                        $scope.isAlreadyExist = false;
                        $scope.showGetemailfromdbInfo = "none";
                    }

                    //if ($scope.wrongemail.length > 0) {
                    //    $scope.isErrordisplay = true;
                    //}
                    //else {
                    //    $scope.isErrordisplay = false;
                    //}

                    //if ($scope.doubleobject.length > 0) {
                    //    $scope.isDuplicateError = true;
                    //}
                    //else {
                    //    $scope.isDuplicateError = false;
                    //}

                    //if ($scope.getemailfromdb.length > 0) {
                    //    $scope.isAlreadyExist = true;
                    //}
                    //else {
                    //    $scope.isAlreadyExist = false;
                    //}

                }).error(function (data, status, headers, config) {
                    console.log(data);
                });
            }

            $scope.getcorporatelocationid = function () {
                var ob = new Object();
                ob.corporateInfoID = $scope.selectcorporate;
                $http({
                    contentType: "application/json",
                    method: 'POST',
                    url: $rootScope.appurl + 'values/GetCorporateLocationByCorporateID',
                    data: ob
                    // headers: { 'Content-Type': 'application/json' }
                }).success(function (data, status, headers, config) {

                    $scope.CorporateID = data.CorporateID;

                }).error(function (data, status, headers, config) {
                    console.log(data);
                });
            }
            
            $rootScope.showdata = function () {                
                var postData = new Object();
                postData.file = $scope.file.base64;

                if ($rootScope.globals.currentUser.roleid == 3) {
                    postData.CorporateinfoID = $rootScope.globals.currentUser.corporateInfoID;
                    postData.CorporateID = $rootScope.globals.currentUser.corporateID;
                    postData.ApplicationID = $rootScope.globals.currentUser.applicationID;
                }
                else {

                    if ($scope.CorporateID == 0) {
                        alert("Corporate location not found.");
                        return false;
                    }
                    //postData.ApplicationID = $scope.selectapplication;
                    postData.CorporateinfoID = $scope.selectcorporate;
                    postData.CorporateID = $scope.CorporateID;

                    var elm = document.getElementById("selectapplication");

                    if (elm.options[elm.selectedIndex].value == 1 || elm.options[elm.selectedIndex].value == 2) { }
                    else {
                        alert("Please select Application.");
                        return false;
                    }

                    postData.ApplicationID = elm.options[elm.selectedIndex].value;
                    
                }

                //console.log($rootScope.globals.currentUser.applicationID + ' => ' + $rootScope.globals.currentUser.roleid + ' => ' + JSON.stringify(postData));

                postData.isremove = false;

                if ($routeParams.chk == 1) {
                    postData.isremove = true;
                }

                $scope.loder();
                $http({
                    contentType: "application/json",
                    method: 'POST',
                    url: $rootScope.appurl + 'values/AddMemberImport',
                    data: postData
                    // headers: { 'Content-Type': 'application/json' }
                }).success(function (data, status, headers, config) {

                  
                    if (data.userRegisterLimit <= (data.totalCorporateMembers + data.membersToImport)) {
                        //alert("You can't add " + data.membersToImport + " users as corporate's register limit is -> " + data.userRegisterLimit + ". And already " + data.totalCorporateMembers + " members are registered.");
                        alert(data.messageToShow);
                        $scope.hideloder();
                        return false;
                    }
                    if (data.status == -1) {
                        alert("Column name is not valid. please check excel document.");
                        $scope.hideloder();
                        return false;
                    }

                    $scope.hideloder();
                    //$rootScope.hideloder();

                    alert("Files uploaded successfully.");
                    $scope.wrongemail = data.wrongemail;

                    for (var i = 0; i < $scope.wrongemail.length; i++) {
                        $scope.wrongemail[i].Member_DOB = new Date($scope.wrongemail[i].Member_DOB);
                    }

                    $scope.doubleobject = data.doubleobject;

                    for (var i = 0; i < $scope.doubleobject.length; i++) {
                        $scope.doubleobject[i].Member_DOB = new Date($scope.doubleobject[i].Member_DOB);
                    }

                    $scope.getemailfromdb = data.getemailfromdb;

                    for (var i = 0; i < $scope.getemailfromdb.length; i++) {
                        $scope.getemailfromdb[i].Member_DOB = new Date($scope.getemailfromdb[i].Member_DOB);
                    }

                    $scope.insertedMembers = data.insertedMembers;
                    if ($scope.insertedMembers > 0) {
                        $scope.showInsertedMembers = "block";
                        //$scope.hideInsertedMembers = false;
                    }
                    else {
                        $scope.showInsertedMembers = "none";
                        //$scope.hideInsertedMembers = true;
                    }

                    $scope.isListDisplay = true;
                    $scope.isInsertMessage = true;
                    

                    if ($scope.wrongemail.length > 0) {
                        $scope.isErrordisplay = true;
                        $scope.IsshowWrongemailInfo = true;
                        $scope.showWrongemailInfo = "block";
                    }
                    else {
                        $scope.isErrordisplay = false;
                        $scope.showWrongemailInfo = "none";
                    }
                    
                    if ($scope.doubleobject.length > 0) {
                        $scope.isDuplicateError = true;
                        $scope.IsshowDoubleobjectInfo = true;
                        $scope.showDoubleobjectInfo = "block";
                    }
                    else {
                        $scope.isDuplicateError = false;
                        $scope.showDoubleobjectInfo = "none";
                    }

                    if ($scope.getemailfromdb.length > 0) {
                        $scope.isAlreadyExist = true;
                        $scope.IsshowGetemailfromdbInfo = true;
                        $scope.showGetemailfromdbInfo = "block";
                    }
                    else {
                        $scope.isAlreadyExist = false;
                        $scope.showGetemailfromdbInfo = "none";
                    }

                    if (typeof data.wrongemail === 'undefined') {
                        alert('Excel sheet provided by you is in wrong format.');
                        $scope.hideloder();
                        return false;
                    }


                }).error(function (data, status, headers, config) {
                    console.log(data);
                });

            }
        }

        $scope.loder = function () {
            document.getElementById("loader").style.display = "block";
            document.getElementById("overlay").style.display = "block";
        }

        $scope.hideloder = function () {
            document.getElementById("loader").style.display = "none";
            document.getElementById("overlay").style.display = "none";
        }
        
        //new methods for post document

        // GET THE FILE INFORMATION.
        $scope.getFileDetails = function (e) {

            $scope.files = [];
            $scope.$apply(function () {

                // STORE THE FILE OBJECT IN AN ARRAY.
                for (var i = 0; i < e.files.length; i++) {
                    $scope.files.push(e.files[i]);
                }

            });
        };

        $scope.onLoad = function (e, reader, file, fileList, fileOjects, fileObj) {

            //console.log(fileOjects);
            //console.log(fileObj);

            var fileformat = fileObj.filename.split('.').pop();

            var check = fileformat == 'xlsx' || fileformat == 'xls';

            if (!check) {
                alert("Please select excel file only.");
                $scope.startimport = false;
            } else {
                $scope.startimport = true;
            }
            //alert('this is handler for file reader onload event!');
        };

        // NOW UPLOAD THE FILES.
        $scope.uploadFiles = function () {

            //FILL FormData WITH FILE DETAILS.
            var data = new FormData();

            for (var i in $scope.files) {
                data.append("uploadedFile", $scope.files[i]);
            }

            // ADD LISTENERS.
            var objXhr = new XMLHttpRequest();
            objXhr.addEventListener("progress", updateProgress, false);
            objXhr.addEventListener("load", transferComplete, false);

            // SEND FILE DETAILS TO THE API.
            objXhr.open("POST", $rootScope.appurl + "values/UploadFiles");
            objXhr.send(data);
        }

        // UPDATE PROGRESS BAR.
        function updateProgress(e) {
            if (e.lengthComputable) {
                document.getElementById('pro').setAttribute('value', e.loaded);
                document.getElementById('pro').setAttribute('max', e.total);
            }
        }

        // CONFIRMATION.
        function transferComplete(e) {
            alert("Files uploaded successfully.");
        }


    }
    angular
        .module('app')
        .directive('memberImport', function () {
            return {
                restrict: 'A',
                replace: true,
                templateUrl: 'memberimport/directive/memberimport.html'
            };
        })
        .directive('errorShow', function () {
            return {
                restrict: 'A',
                replace: true,
                templateUrl: 'memberimport/directive/errorshow.html'
            };
        })
        .directive('duplicateError', function () {
            return {
                restrict: 'EA',
                replace: true,
                templateUrl: 'memberimport/directive/duplicateError.html',
                link: function (scope, elem, attrs, ctrl) {
                    //alert(ctrl.formtable.$valid);
                    //elem.bind('keyup', function () {
                    //    alert(ctrl.formtable.$valid); //check validity
                    //})
                }
            };
        })
        .directive('alreadyExist', function () {
               return {
                   require: '^form',
                   restrict: 'EA',
                   scope: true,
                   templateUrl: 'memberimport/directive/alreadyExist.html'
               };
           })
        .directive('insertMessage', function () {
              return {
                  restrict: 'A',
                  replace: true,
                  templateUrl: 'memberimport/directive/insretMessage.html'
              };
          })
        .controller('MemberImportController', MemberImportController);

    MemberImportController.$inject = ['UserService', '$rootScope', '$scope', '$http', '$location', '$anchorScroll', '$routeParams'];
})();