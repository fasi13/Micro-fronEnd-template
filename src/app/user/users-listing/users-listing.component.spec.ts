import { TestBed } from "@angular/core/testing";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { UserModule } from "../user.module";

import { UsersListingComponent } from "./users-listing.component";
describe('User listing component', ()=>{
    let sut : UsersListingComponent;
    beforeEach(() => {
        TestBed.configureTestingModule({
          imports: [NgbModule, UserModule],
          declarations: [],
          providers: [],
        });
        sut = new UsersListingComponent(null);
   
        
      });

      it('should create' , ()=>{
        expect(sut).toBeTruthy();
    })
   

    it('should GetApplicationname' , ()=>{
        var user  = {applicationPath: {path:[{name:"name"}]}};
       expect(sut.getApplicationName(user)).toBe('name');
    })


});

