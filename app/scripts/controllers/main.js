'use strict';

angular.module('positionApp')
    .controller('MainCtrl', function ($scope, $location, $anchorScroll/*, $upload*/) {

        $scope.submit = {};
        $scope.errors = {};

        $scope.profiles = [
            { 'name': 'Evgeny', 'icon': '4f45010a2abf7534cbe2d74a3958f887'},
            { 'name': 'Eliran', 'icon': 'e3fa9afb10996aa1385e54ec91117ed6'},
            { 'name': 'Erez', 'icon': 'f1fe3644bccbe87b831c66c7b1db0faa'},
            { 'name': 'Guy', 'icon': 'cecbb22e0d89c674b916f0641607aff9'}
        ];

        var file = null;
        $scope.onFileSelect = function ($files) {
            file = $files[0];
            $scope.fileTooBig = file.size > 200000;
            if (!$scope.fileTooBig) {
                $scope.errors.file = null;
            } else {
                $scope.errors.file = 'Too big. Must be less than 200K';
            }
            console.log(['files were selected', $files]);

        };

        $scope.submitForm = function () {
            console.log(['submitting', $scope.submit]);

            var oMyForm = new FormData();

            oMyForm.append('applicantData', JSON.stringify($scope.submit));
            oMyForm.append('resume', file); // number 123456 is immediately converted to string "123456"
//            oMyForm.append( "resume", $('input[type=file]')[0].files[0]); // number 123456 is immediately converted to string "123456"


            $.ajax({
                url: '/backend/submit',
                data: oMyForm,
                type: 'POST',
                contentType: false,
                processData: false,
                cache: false,
                xhrFields: {
                    onprogress: function (e) {
                        if (e.lengthComputable) {
                            console.log('Loaded ' + (e.loaded / e.total * 100) + '%');
                        } else {
                            console.log('Length not computable.');
                        }
                    }
                }
            });

//            $scope.upload = $upload.upload({
//                url: '/backend/submit', //upload.php script, node.js route, or servlet url
//                // method: POST or PUT,
//                // headers: {'headerKey': 'headerValue'}, withCredential: true,
//                data: {},
//                file:$scope.submit.file
//                /* set file formData name for 'Content-Desposition' header. Default: 'file' */
//                //fileFormDataName: myFile,
//                /* customize how data is added to formData. See #40#issuecomment-28612000 for example */
//                //formDataAppender: function(formData, key, val){}
//            }).progress(function(evt) {
//                    console.log('percent: ' + parseInt(100.0 * evt.loaded / evt.total));
//                }).success(function(data, status, headers, config) {
//                    // file is uploaded successfully
//                    console.log(data);
//                });
        };

        $scope.goTo = function (loc) {
            console.log('going to ' + loc);
            $location.hash(loc);
            $anchorScroll();
        };
    });
