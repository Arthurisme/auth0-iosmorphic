"use strict";
var profile_edit_component_1 = require('./profile_edit.component');
var profile_show_component_1 = require('./profile_show.component');
var profile_component_1 = require('./profile.component');
exports.ProfileRoutes = [
    {
        path: 'profile',
        component: profile_component_1.ProfileComponent,
        children: [
            { path: 'edit', component: profile_edit_component_1.ProfileEdit },
            { path: '', component: profile_show_component_1.ProfileShow }
        ]
    }
];
//# sourceMappingURL=profile.routes.js.map