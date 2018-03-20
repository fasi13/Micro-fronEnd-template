var const_application = {
    applications: 1,
    group: 2,
    settings: 3,
    content: 4
};

var const_content = {
    contents: 1,
    groups: 2,
    statues: 3
};

var const_control = {
    types: 1
};

var const_setting = {
    settings: 1,
    groups: 2
};

var const_data = {
    types: 1,
    typeValue: 2
};

var const_class = {
    classes: 1,
    groups: 2,
    settingOverrides: 3,
    contentOverrides: 4
};

var const_promotion = {
    promotions: 1,
    TargetTypes: 2,
    openTypes: 3,
    OptOuts: 4
};

var const_user = {
    users: 1,
    permissions: 2,
    roles: 3
};

var const_permission = {
    permissions: 1
};

var const_role = {
    roles: 1,
    permissions: 2
};

var const_navigation = {
    navigations: 1
};


var const_auth = {
    undefined: 'undefined'
};

var const_request = {
    require: true,
    notrequire: false
};

var const_APIUrl = "https://toolsservices-qa.awardcenter.com";

var const_role = {
    parentAdmin: 'pAdmin',
    childAdmin: 'cAdmin'
};

var Profile = function () {
    return {
        "success": false,
        "data": {
            "items": [
                {
                    "id": 0,
                    "name": "",
                    "_links": []
                }
            ],
            "offset": 0,
            "limit": 25,
            "totalCount": 0,
            "sortType": null,
            "sortDirection": null,
            "_links": []
        },
        "error": null
    }
};