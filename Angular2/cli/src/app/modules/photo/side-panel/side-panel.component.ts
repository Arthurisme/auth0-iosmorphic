import {Component} from '@angular/core';
import {UserService} from "../../../services/user.service";
import {PhotoService} from "../../../services/photo.service";
import {User} from '../../../models/user';
import {Photo} from '../../../models/photo';
import {Router} from '@angular/router';
// import {ROUTER_DIRECTIVES} from '@angular/router';
import {Observable} from 'rxjs/Observable'
import {PhotoRow} from '../photo-row/photo-row.component'


@Component({
    selector: 'side-panel',
    templateUrl: './side-panel.component.html',
    // styleUrls: [ '../../../resources/css/semantic.css', '../../../resources/css/modules/photo.css' ],

    // directives:[PhotoRow]

})
export class SidePanel {}
