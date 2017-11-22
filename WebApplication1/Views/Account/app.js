(function () {
    'use strict';

    angular
        .module('app', ['ngRoute', 'ngCookies', 'ngMaterial', 'ngMessages', 'naif.base64', 'chart.js', 'angularTrix', 'textAngular', 'ngSanitize'])
        .directive('validFile', function () {
            return {
                require: 'ngModel',
                link: function (scope, el, attrs, ngModel) {
                    //change event is fired when file is selected
                    el.bind('change', function () {
                        scope.$apply(function () {
                            ngModel.$setViewValue(el.val());
                            ngModel.$render();
                        });
                    });
                }
            }
        })
         .directive("mwInputRestrict", [
            function () {
                return {
                    restrict: "A",
                    link: function (scope, element, attrs) {
                        element.on("keypress", function (event) {
                            if (attrs.mwInputRestrict === "onlynumbers") {
                                // allow only digits to be entered, or backspace and delete keys to be pressed
                                return (event.charCode >= 48 && event.charCode <= 57) ||
                                       (event.keyCode === 8 || event.keyCode === 46);
                            } if (attrs.mwInputRestrict === "nospicialchar") {
                                // allow only digits to be entered, or backspace and delete keys to be pressed
                                return (event.charCode !== 96
                                    && event.charCode !== 126
                                    && event.charCode !== 123
                                    && event.charCode !== 125
                                    && event.charCode >= 47
                                    && !(event.charCode >= 33 && event.charCode <= 47)
                                    && !(event.charCode >= 58 && event.charCode <= 64)
                                    && !(event.charCode >= 91 && event.charCode <= 96)
                                    && !(event.charCode >= 123 && event.charCode <= 126)
                                    && event.charCode !== 38
                                    /*&& event.charCode !== 39*/
                                    && event.charCode !== 94
                                    && event.charCode !== 96
                                    && event.charCode !== 39
                                    && event.charCode !== 220
                                    && event.charCode !== 191
                                    && event.charCode !== 42)
                                    || (event.keyCode === 8 || event.keyCode === 46);
                            }
                            if (attrs.mwInputRestrict === "nospace") {
                                // allow only digits to be entered, or backspace and delete keys to be pressed
                                return (event.charCode !== 32)
                                    || (event.keyCode === 8 || event.keyCode === 46);
                            }
                            return true;
                        });
                    }
                }
            }
         ]).directive('myEnter', function () {
             return function (scope, element, attrs) {
                 element.bind("keydown keypress", function (event) {
                     if (event.which === 13) {
                         scope.$apply(function () {
                             scope.$eval(attrs.myEnter);
                         });

                         event.preventDefault();
                     }
                 });
             };
         })
        // Optional configuration
   .config(['ChartJsProvider', '$compileProvider', function (ChartJsProvider, $compileProvider) {
       $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|javascript):/);

       // Configure all charts
       ChartJsProvider.setOptions({
           chartColors: ['#FF5252', '#FF8A80'],
           responsive: false
       });
       // Configure all line charts
       ChartJsProvider.setOptions('area', {
           showLines: false
       });
   }])
        .directive('appHeader', function () {
            return {
                restrict: 'EA',
                replace: true,
                templateUrl: 'maindirective/header.html',
                controllerAs: 'HeaderController'
            };
        })
        .directive('appMenu', function () {
            return {
                restrict: 'A',
                replace: true,
                templateUrl: 'maindirective/menu.html'
            };
        })
         .directive('appFooter', function () {
             return {
                 restrict: 'A',
                 replace: true,
                 templateUrl: 'maindirective/footer.html'
             };
         })
        .config(config)
        .run(run);

    config.$inject = ['$routeProvider', '$locationProvider'];
    function config($routeProvider, $locationProvider) {
        //$locationProvider.html5Mode({
        //    enabled: true,
        //    requireBase: false
        //});

        $routeProvider
            .when('/', {
                controller: 'HomeController',
                templateUrl: 'home/home.view.html',
                controllerAs: 'vm',
                title: "Home"
            })
            .when('/home', {
                controller: 'HomeController',
                templateUrl: 'home/home.view.html',
                controllerAs: 'vm',
                title: "Home"
            })
            .when('/login', {
                controller: 'LoginController',
                templateUrl: 'login/login.view.html',
                controllerAs: 'vm',
                title: "Login"
            })
            .when('/onlineuserslist/:id?', {
                controller: 'OnlineUsersListController',
                templateUrl: 'home/onlineuserslist.view.html',
                controllerAs: 'vm',
                title: "Register"
            })
            .when('/dietitianchathistory/:id?', {
                controller: 'DietitianChatHistoryController',
                templateUrl: 'home/dietitianchathistory.view.html',
                controllerAs: 'vm',
                title: "Register"
            })
            .when('/register', {
                controller: 'RegisterController',
                templateUrl: 'register/register.view.html',
                controllerAs: 'vm',
                title: "Register"
            })
            .when('/layout', {
                controller: 'LayoutController',
                templateUrl: 'layout/layout.view.html',
                controllerAs: 'vm',
                title: "Home"
            })
            .when('/showevent', {
                controller: 'ShoweventController',
                templateUrl: 'events/showevent.view.html',
                controllerAs: 'vm',
                title: "Show Event"
            })
            .when('/addevent/:id?', {
                controller: 'AddeventController',
                templateUrl: 'events/addevent.view.html',
                controllerAs: 'vm',
                title: "Add Event"
            })
            .when('/updateevent', {
                controller: 'UpdateEventController',
                templateUrl: 'events/updateevent.view.html',
                controllerAs: 'vm',
                title: "Home"
            })
            .when('/memberimport/:chk?', {
                controller: 'MemberImportController',
                templateUrl: 'memberimport/memberimport.view.html',
                controllerAs: 'vm',
                title: "Member Import"
            })
            .when('/adduser/:chk?', {
                controller: 'AddUserController',
                templateUrl: 'memberimport/adduser.view.html',
                controllerAs: 'vm',
                title: "Add User"
            })
            .when('/removemember', {
                controller: 'MemberRemoveController',
                templateUrl: 'memberimport/memberremove.view.html',
                controllerAs: 'vm',
                title: "Member Remove"
            })
            .when('/searchuser', {
                controller: 'SearchUsercontroller',
                templateUrl: 'memberimport/searchuser.view.html',
                controllerAs: 'vm',
                title: "Search User"
            })
            .when('/viewuser', {
                controller: 'ViewUserController',
                templateUrl: 'memberimport/viewuser.view.html',
                controllerAs: 'vm',
                title: "View User"
            })
            .when('/GlobelSearch/:id?', {
                controller: 'GlobelSearchController',
                templateUrl: 'memberimport/GlobelSearch.view.html',
                controllerAs: 'vm',
                title: "Advance Search"
            })
            .when('/moderatequestin', {
                controller: 'QuestionController',
                templateUrl: 'discussion/question.view.html',
                controllerAs: 'vm',
                title: "Moderate Question"
            })
            .when('/moderatedquestions', {
                controller: 'ModeratedQuestionsController',
                templateUrl: 'discussion/moderatedquestions.view.html',
                controllerAs: 'vm',
                title: "Moderated Questions"
            })
            .when('/moderateanswer', {
                controller: 'AnswerController',
                templateUrl: 'discussion/answer.view.html',
                controllerAs: 'vm',
                title: "Moderate Answer"
            })
            .when('/createchallenge/:id?', {
                controller: 'CreatechallengeController',
                templateUrl: 'challenge/createchallenge.view.html',
                controllerAs: 'vm',
                title: "Create Challenge"
            })
            .when('/viewchallenge', {
                controller: 'ViewChallengeController',
                templateUrl: 'challenge/viewchallenge.view.html',
                controllerAs: 'vm',
                title: "View Challenge"
            })
            .when('/advanturelist', {
                controller: 'ViewAdventurelistController',
                templateUrl: 'adventure/advanturelist.view.html',
                controllerAs: 'vm',
                title: "Adventure list"
            })
            .when('/createassing', {
                controller: 'CreateAssignCorporateController',
                templateUrl: 'adventure/createassing.view.html',
                controllerAs: 'vm',
                title: "Assign Corporate list"
            })

            .when('/adventurecorporate', {
                controller: 'ViewAdventureCorporatelistController',
                templateUrl: 'adventure/advetureCorporate.view.html',
                controllerAs: 'vm',
                title: "Adventure Corporate"
            })

            .when('/engagementreport', {
                controller: 'EngagementreportController',
                templateUrl: 'engagementreport/engagementreport.view.html',
                controllerAs: 'vm',
                title: "View Challenge"
            })
            .when('/engagementreportsave', {
                controller: 'EngagementreportSaveController',
                templateUrl: 'engagementreport/engagementreportsave.view.html',
                controllerAs: 'vm',
                title: "View Challenge"
            })

            .when('/registerusercorporatemanager', {
                controller: 'RegisterUserCorporateManager',
                templateUrl: 'login/registerusercorporatemanager.view.html',
                controllerAs: 'vm',
                title: "View Challenge"
            })
            .when('/registeruser/:myid?', {
                controller: 'RegisterUserAccountManager',
                templateUrl: 'login/registeruseraccountmanager.view.html',
                controllerAs: 'vm',
                title: "View Challenge"
            })
            .when('/registermoderatoruser/:myid?', {
                controller: 'RegisteruserModerator',
                templateUrl: 'login/registerusermoderator.view.html',
                controllerAs: 'vm',
                title: "View Challenge"
            })
            .when('/listuser', {
                controller: 'ListUserController',
                templateUrl: 'login/listuser.view.html',
                controllerAs: 'vm',
                title: "View Challenge"
            })
            .when('/edituser', {
                controller: 'EditUserController',
                templateUrl: 'login/edituser.view.html',
                controllerAs: 'vm',
                title: "View Challenge"
            })
            .when('/teampost', {
                controller: 'TeamPostController',
                templateUrl: 'challenge/teampost.view.html',
                controllerAs: 'vm',
                title: "Team Post"
            })
            .when('/addcorporate/:id?', {
                controller: 'AddCorporateController',
                templateUrl: 'corporates/addcorporate.view.html',
                controllerAs: 'vm',
                title: "Add Corporate"
            })
            .when('/corporatelist', {
                controller: 'CorporateListController',
                templateUrl: 'corporates/corporatelist.view.html',
                controllerAs: 'vm',
                title: "Corporate List"
            })
            .when('/corporateactivities', {
                controller: 'CorporateActivityController',
                templateUrl: 'corporates/corporateactivity.view.html',
                controllerAs: 'vm',
                title: "Corporate Activities"
            })
            .when('/sendemail', {
                controller: 'SendEmailController',
                templateUrl: 'sendemail/sendemail.view.html',
                controllerAs: 'vm',
                title: "Send Email"
            })
            .when('/sendlaunchmail', {
                controller: 'SendLaunchMailController',
                templateUrl: 'sendemail/sendlaunchmail.view.html',
                controllerAs: 'vm',
                title: "Send Email"
            })
            .when('/dumpdownload', {
                controller: 'DumpDownloadController',
                templateUrl: 'sendemail/dumpdownload.view.html',
                controllerAs: 'vm',
                title: "Download Dump"
            })

            .when('/healthexpert', {
                controller: 'HealthExpertController',
                templateUrl: 'healthexpert/healthexpert.view.html',
                controllerAs: 'vm',
                title: "Health Expert"
            })
            .when('/addhealthexpert', {
                controller: 'HealthExpertController',
                templateUrl: 'addhealthexpert/addhealthexpert.view.html',
                controllerAs: 'vm',
                title: "Health Expert"
            })
            .when('/loginhistory', {
                controller: 'LoginHistoryController',
                templateUrl: 'engagementreport/loginhistory.view.html',
                controllerAs: 'vm',
                title: "Login History"
            })
            .when('/staticreport', {
                controller: 'StaticReportController',
                templateUrl: 'engagementreport/staticreport.view.html',
                controllerAs: 'vm',
                title: "Static Report"
            })
            .when('/hraengagementreport', {
                controller: 'HraEngagementReportController',
                templateUrl: 'engagementreport/hraengagementreport.view.html',
                controllerAs: 'vm',
                title: "HRA Engagement Report"
            })
            .when('/hrareport', {
                controller: 'HraReportController',
                templateUrl: 'engagementreport/hrareport.view.html',
                controllerAs: 'vm',
                title: "HRA Report"
            })
            .when('/wnllog', {
                controller: 'WNLLogController',
                templateUrl: 'engagementreport/wnllog.view.html',
                controllerAs: 'vm',
                title: "WNL Log"
            })
            .when('/engagementreportcalculated', {
                controller: 'CalculatedReportController',
                templateUrl: 'engagementreport/calculatedreport.view.html',
                controllerAs: 'vm',
                title: "Engagement Report(Calculated)"
            })
            .when('/forgotpassword', {
                controller: 'ForgotPasswordController',
                templateUrl: 'login/forgotpassword.view.html',
                controllerAs: 'vm',
                title: "Forgot Password"
            })
            .when('/createadventure/:id?', {
                controller: 'CreateAdventureController',
                templateUrl: 'adventure/createadventure.view.html',
                controllerAs: 'vm',
                title: "Create Adventure "
            })
            .when('/createassingCorporate/:id?', {
                controller: 'CreateAssignCorporateController',
                templateUrl: 'adventure/createassing.view.html',
                controllerAs: 'vm',
                title: "Create Adventure "
            })
           .when('/stepchallengelist/:id?', {
               controller: 'StepchallengelistController',
               templateUrl: 'stepchallenges/stepchallengelist.view.html',
               controllerAs: 'vm',
               title: "Step Challenge"
           })
            .when('/createstepchallenge/:id?', {
                controller: 'CreateStepChallengeController',
                templateUrl: 'stepchallenges/createstepchallenge.view.html',
                controllerAs: 'vm',
                title: "Create Step Challenge "
            })
            .when('/Challengelist/:id?', {
                controller: 'CorporatechallengelistController',
                templateUrl: 'CorporateChallenge/Corporatechallengelist.view.html',
                controllerAs: 'vm',
                title: "Challenges "
            })
            .when('/Createchallenge/:id?', {
                controller: 'CreateCorporateChallengeController',
                templateUrl: 'CorporateChallenge/Createcorporatechallenge.view.html',
                controllerAs: 'vm',
                title: "Create Challenges "
            })
            .when('/Teamlist/:id?', {
                controller: 'TeamlistController',
                templateUrl: 'Teams/Teamslist.view.html',
                controllerAs: 'vm',
                title: "Teams"
            })
            .when('/Createteam/:id?', {
                controller: 'CreateTeamController',
                templateUrl: 'Teams/Createteam.view.html',
                controllerAs: 'vm',
                title: "Create Team"
            })




            .otherwise({ redirectTo: '/login' });
    }

    run.$inject = ['$rootScope', '$location', '$cookieStore', '$http', '$window'];
    function run($rootScope, $location, $cookieStore, $http, $window) {

        //var mainInfo = null;
        $http.get('./config.json').success(function (data) {
            $rootScope.appurl = data.appurl;
            $rootScope.appDomain = data.appDomain;
        });


        $rootScope.loder = function () {
            document.getElementById("loader").style.display = "block";
            document.getElementById("overlay").style.display = "block";
        }

        $rootScope.hideloder = function () {
            document.getElementById("loader").style.display = "none";
            document.getElementById("overlay").style.display = "none";
        }

        $rootScope.enc = function (source_string) {
            return CryptoJS.AES.encrypt(
                         source_string,
                         $rootScope.base64Key,
                         { iv: $rootScope.iv }
                     );
        }

        $rootScope.dec = function (encrypted) {
            ciphertext = encrypted.ciphertext.toString(CryptoJS.enc.Base64);

            console.log('ciphertext = ' + ciphertext);

            var cipherParams = CryptoJS.lib.CipherParams.create({
                ciphertext: CryptoJS.enc.Base64.parse(ciphertext)
            });
            var decrypted = CryptoJS.AES.decrypt(
                                cipherParams,
                                $rootScope.base64Key,
                                { iv: $rootScope.iv });
            return decrypted.toString(CryptoJS.enc.Utf8);
        }

        //$rootScope.addevent = function () {
        //    alert("success");
        //}
        //document.getElementById('#SearchTags').select2();

        //('#SearchTags').select2();

        $rootScope.page = {
            setTitle: function (title) {
                this.title = title + " | Corporate Admin";
            }
        }
        // keep user logged in after page refresh
        $rootScope.globals = $cookieStore.get('globals') || {};
        if ($rootScope.globals.currentUser) {
            $http.defaults.headers.common['Authorization'] = 'Basic ' + $rootScope.globals.currentUser.authdata; // jshint ignore:line
        }

        $rootScope.nav = false;
        $rootScope.$on("$routeChangeSuccess", function (event, currentRoute, previousRoute) {
            $rootScope.page.setTitle(currentRoute.title || "Corporate-Admin");
            var restrictedPage = $.inArray($location.path(), ["/login", "/forgotpassword"]) === -1;
            //var loggedIn = $rootScope.globals.currentUser;
            var loggedIn = true;
            if (restrictedPage && loggedIn) {
                $rootScope.nav = true;

            } else {
                $rootScope.nav = false;
            }

        });

        $rootScope.$on('$locationChangeStart', function (event, next, current) {

            // forceSSL();


            $rootScope.base64Key = CryptoJS.enc.Hex.parse('0123456789abcdef0123456789abcdef')
            $rootScope.iv = CryptoJS.enc.Hex.parse('abcdef9876543210abcdef9876543210');

            $rootScope.title = event.title;


            $http.get('./menu.json').success(function (data) {
                var cc = data;
                $rootScope.authenticationJson = data;
                var isAvailable = false;
                var isUrlInJson = false;
                $rootScope.authenticationJson.Menu.forEach(function (x) {
                    if (x.redirectUrl.substr(1) === $location.path()) {
                        isUrlInJson = true;
                    }
                    x.RoleID.forEach(function (id) {
                        if ($rootScope.globals.currentUser && id === $rootScope.globals.currentUser.roleid && x.redirectUrl.substr(1) === $location.path()) {
                            isAvailable = true;
                            return true;
                        }
                    });
                    x.SubMenu.forEach(function (y) {
                        if (y.redirectUrl.substr(1) === $location.path()) {
                            isUrlInJson = true;
                        }
                        y.RoleID.forEach(function (id) {
                            if ($rootScope.globals.currentUser && id === $rootScope.globals.currentUser.roleid && y.redirectUrl.substr(1) === $location.path()) {
                                isAvailable = true;
                                return true;
                            }
                        });
                    });
                });
                if (!isAvailable && isUrlInJson) {
                    $location.path('/login');
                }
            });

            // redirect to login page if not logged in and trying to access a restricted page
            var restrictedPage = $.inArray($location.path(), ['/login', "/forgotpassword"]) === -1;
            var loggedIn = $rootScope.globals.currentUser;

            if (restrictedPage && !loggedIn) {
                $location.path('/login');
            }

        });


        var forceSSL = function () {
            if ($location.protocol() !== 'https') {
                $window.location.href = $location.absUrl().replace('http', 'https');
            }
        };

        $http.get('./menu.json').success(function (data) {
            //$rootScope.authenticationJson = data;

            //console.log("--AUTHORIZED MENU----");

            //console.log($rootScope.authenticationJson);

            //console.log("--AUTHORIZED MENU----");
            //$http({
            //    contentType: "application/json",
            //    method: 'POST',
            //    url: $rootScope.appurl + 'Login/ChackURL',
            //    data: data.Menu
            //    // headers: { 'Content-Type': 'application/json' }
            //}).success(function (data, status, headers, config) {


            //}).error(function (data, status, headers, config) {
            //    console.log(data);
            //});

            //var authorized = false;

            //for (var i = 0; i < $rootScope.authenticationJson.Menu.length; i++) {

            //    if ($rootScope.authenticationJson.Menu[i].redirectUrl === "#" + $location.path()) {

            //        for (var j = 0; j < $rootScope.authenticationJson.Menu[0].RoleID.length; j++) {
            //            if ($rootScope.authenticationJson.Menu[i].RoleID[j] == $rootScope.globals.currentUser.roleid) {
            //                authorized = true;
            //            }
            //        }
            //    }
            //    else {
            //        for (var j = 0; j < $rootScope.authenticationJson.Menu[i].SubMenu.length; j++) {
            //            if ($rootScope.authenticationJson.Menu[i].SubMenu[j].redirectUrl === "#" + $location.path()) {
            //                for (var k = 0; k < $rootScope.authenticationJson.Menu[i].SubMenu[j].RoleID.length; k++) {
            //                    if ($rootScope.authenticationJson.Menu[i].SubMenu[j].RoleID[k] == $rootScope.globals.currentUser.roleid) {
            //                        authorized = true;
            //                    }
            //                }
            //            }
            //        }
            //    }
            //}


            //if (!authorized) {  $location.path('/login'); }

        });

    }
    angular.module("app").filter("to_trusted", [
        "$sce", function ($sce) {
            return function (text) {
                return $sce.trustAsHtml(text);
            };
        }
    ]);
})();