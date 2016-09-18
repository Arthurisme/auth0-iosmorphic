import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

// import { NgSemanticModule } from 'ng-semantic';





import {photoAppRouting} from "./photo-app.routing";

import {PhotoHomeComponent} from './photo-home/photo-home.component';
import {SidePanel} from './side-panel/side-panel.component';
import {PhotoList} from './photo-list/photo-list.component';
import {PhotoRow} from './photo-row/photo-row.component';
import {NavBar} from './nav-bar/nav-bar.component';
import {MyAlbum} from './my-album/my-album.component';
import {AddPhoto} from './add-photo/add-photo.component';
import {ImageDetail} from './image-detail/image-detail.component';

import {ImageComments} from "./image-comments/image-comments.component";


import {UserService} from "../../services/user.service";
import {PhotoService} from "../../services/photo.service";
import {AddPhotoService} from "../../services/add-photo.service";
import {UploadPhotoService} from "../../services/upload-photo.service";
import {ApiTestService} from "../../services/apitest.service";
import {CommentService} from "../../services/comment.service";





@NgModule({
  declarations: [

      PhotoHomeComponent,
      SidePanel,
      PhotoList,
      PhotoRow,
    NavBar,
    MyAlbum,
    AddPhoto,
    ImageDetail,
    ImageComments,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    // NgSemanticModule,

    photoAppRouting,
  ],
  providers: [
    UserService,
    PhotoService,
    AddPhotoService,
    UploadPhotoService,
    ApiTestService,
      CommentService
  ],
  bootstrap: [ ]
})
export class PhotoAppModule {}
