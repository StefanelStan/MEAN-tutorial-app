import { NgModule } from '@angular/core';
import {
    MatInputModule, MatCardModule, MatButtonModule, MatToolbarModule, MatExpansionModule,
    MatProgressSpinnerModule, MatPaginatorModule, MatDialogModule
} from '@angular/material';
@NgModule({
    // exports keyword will also take care of importing
    // imports: [
    //     MatInputModule,
    //     MatCardModule,
    //     MatButtonModule,
    //     MatToolbarModule,
    //     MatExpansionModule,
    //     MatProgressSpinnerModule,
    //     MatPaginatorModule,
    //     MatDialogModule
    // ], // by default they are not exportable so we need exports key
    exports: [
        MatInputModule,
        MatCardModule,
        MatButtonModule,
        MatToolbarModule,
        MatExpansionModule,
        MatProgressSpinnerModule,
        MatPaginatorModule,
        MatDialogModule
    ]
})
export class AngularMaterialModule {
}
