"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
// import { Auth }                 from '../auth.service';
// import { AuthHttp, AuthConfig, AUTH_PROVIDERS, provideAuth } from 'angular2-jwt';
var router_1 = require('@angular/router');
require('rxjs/add/operator/map');
// import { FORM_DIRECTIVES } from '@angular/common'
var ProfileEdit = (function () {
    function ProfileEdit(
        // private auth: Auth,
        //         private authHttp: AuthHttp,
        router) {
        this.router = router;
        // if(auth.userProfile.user_metadata && auth.userProfile.user_metadata.address){
        //   this.address = auth.userProfile.user_metadata.address;
        // }
    }
    ProfileEdit.prototype.onSubmit = function () {
        var headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        };
        var data = JSON.stringify({
            user_metadata: {
                address: this.address
            }
        });
        // this.authHttp
        //   .patch('https://' + 'YOUR_DOMAIN' + '/api/v2/users/' + this.auth.userProfile.user_id, data, {headers: headers})
        //   .map(response => response.json())
        //   .subscribe(
        //     response => {
        //       this.auth.userProfile = response;
        //       localStorage.setItem('profile', JSON.stringify(response));
        //       this.router.navigate(['/profile']);
        //     },
        //     error => alert(error.json().message)
        //   );
    };
    ProfileEdit = __decorate([
        core_1.Component({
            selector: 'profile',
            templateUrl: 'profile/profile_edit.template.html',
        }), 
        __metadata('design:paramtypes', [router_1.Router])
    ], ProfileEdit);
    return ProfileEdit;
}());
exports.ProfileEdit = ProfileEdit;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvZmlsZV9lZGl0LmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInByb2ZpbGVfZWRpdC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBLHFCQUFxQyxlQUFlLENBQUMsQ0FBQTtBQUVyRCwwREFBMEQ7QUFDMUQsb0ZBQW9GO0FBQ3BGLHVCQUFxQyxpQkFBaUIsQ0FBQyxDQUFBO0FBQ3ZELFFBQU8sdUJBQXVCLENBQUMsQ0FBQTtBQUMvQixvREFBb0Q7QUFtQnBEO0lBRUU7UUFDSSxzQkFBc0I7UUFDdEIsc0NBQXNDO1FBQ3RCLE1BQWM7UUFBZCxXQUFNLEdBQU4sTUFBTSxDQUFRO1FBRWhDLGdGQUFnRjtRQUNoRiwyREFBMkQ7UUFDM0QsSUFBSTtJQUNOLENBQUM7SUFFRCw4QkFBUSxHQUFSO1FBQ0UsSUFBSSxPQUFPLEdBQVE7WUFDakIsUUFBUSxFQUFFLGtCQUFrQjtZQUM1QixjQUFjLEVBQUUsa0JBQWtCO1NBQ25DLENBQUM7UUFFRixJQUFJLElBQUksR0FBUSxJQUFJLENBQUMsU0FBUyxDQUFDO1lBQzdCLGFBQWEsRUFBRTtnQkFDYixPQUFPLEVBQUUsSUFBSSxDQUFDLE9BQU87YUFDdEI7U0FDRixDQUFDLENBQUM7UUFFSCxnQkFBZ0I7UUFDaEIsb0hBQW9IO1FBQ3BILHNDQUFzQztRQUN0QyxnQkFBZ0I7UUFDaEIsb0JBQW9CO1FBQ3BCLDBDQUEwQztRQUMxQyxtRUFBbUU7UUFDbkUsNENBQTRDO1FBQzVDLFNBQVM7UUFDVCwyQ0FBMkM7UUFDM0MsT0FBTztJQUNULENBQUM7SUFwREg7UUFBQyxnQkFBUyxDQUFDO1lBQ1QsUUFBUSxFQUFFLFNBQVM7WUFDbkIsV0FBVyxFQUFFLG9DQUFvQztTQWFsRCxDQUFDOzttQkFBQTtJQXNDRixrQkFBQztBQUFELENBQUMsQUFwQ0QsSUFvQ0M7QUFwQ1ksbUJBQVcsY0FvQ3ZCLENBQUEifQ==