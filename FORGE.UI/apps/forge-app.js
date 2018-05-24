(function () {
    'use strict';

    angular
        .module('forge-app',
        ['ui.router',
            'ngAnimate',
            'summernote',
            'ngSanitize',
            'ui.bootstrap',
            'app_signin',
            'app_router',
            'app_service',
            'app_serviceEndpoint',
            'app_interceptors',
            'app_auth',
            'app_leftMenuComponent',
            'app_topRightMenuComponent',
            'app_heirarchy',
            'colorpicker.module',
            'contentsModule',
            'contentEditorModule',
            'sessionLogoutModule',
            'modal-module',
            'changePasswordModule',
            'app-share_data-fac',
            'app_content_management',
            'app_promotionComponent']);



})();