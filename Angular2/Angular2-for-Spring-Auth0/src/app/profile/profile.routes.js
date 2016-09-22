"use strict";
var profile_edit_component_1 = require('./profile_edit.component.ts');
var profile_show_component_1 = require('./profile_show.component.ts');
var profile_component_1 = require('./profile.component.ts');
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