import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';


// import { ShoppingListAddComponent } from "./shopping-list/shopping-list-add.component";
// import { ShoppingListComponent } from "./shopping-list/shopping-list.component";
// import { RecipesComponent } from "./recipes/recipes.component";
// import { RecipeListComponent } from "./recipes/recipe-list/recipe-list.component";
// import { RecipeDetailComponent } from "./recipes/recipe-detail/recipe-detail.component";
// import { RecipeEditComponent } from "./recipes/recipe-edit/recipe-edit.component";
// import { RecipeItemComponent } from "./recipes/recipe-list/recipe-item.component";
// import { RecipeStartComponent } from "./recipes/recipe-start.component";
// import { ShoppingListService } from "./shopping-list/shopping-list.service";
// import { RecipeService } from "./recipes/recipe.service";

import {photoAppRouting} from "./photo-app.routing";

import {NavBar} from './nav-bar.component';
import {MyAlbum} from './my-album.component';
import {AddPhoto} from './add-photo.component';
import {ImageDetail} from './image-detail.component';

import {ImageComments} from "./image-comments.component";


// import {UserService} from "./services/user.service";
// import {PhotoService} from "./services/photo.service";
// import {AddPhotoService} from "./services/add-photo.service";
// import {UploadPhotoService} from "./services/upload-photo.service";
// import {ApiTestService} from "./services/apitest.service";





@NgModule({
  declarations: [

    NavBar,
    MyAlbum,
    AddPhoto,
    ImageDetail,
    ImageComments,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    photoAppRouting,
  ],
  providers: [
    // UserService,
    // PhotoService,
    // AddPhotoService,
    // UploadPhotoService,
    // ApiTestService
  ],
  bootstrap: [ ]
})
export class PhotoAppModule {}
