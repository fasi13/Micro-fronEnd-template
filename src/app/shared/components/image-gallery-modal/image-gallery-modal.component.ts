import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ContentService } from 'src/app/core/services/content.service';

@Component({
  selector: 'fge-image-gallery-modal',
  templateUrl: './image-gallery-modal.component.html',
  styleUrls: ['./image-gallery-modal.component.scss']
})
export class ImageGalleryModalComponent implements OnInit {
 myData: string;
 images: any;
 conentGroups: any;
 currentConentGroup: any;
 selectedImage: any;
 selectedConentGroup = [];

  constructor(private contentService: ContentService,
  public activeModal: NgbActiveModal) {}

  ngOnInit() {
  }

  onContentClick(item){
    this.contentService.getContentGroup(1, item.id).subscribe( x => {
      this.currentConentGroup = item;
      this.selectedImage = null;
      this.images = x.data.content.filter(y => y.dataType.name === "Image");
    })
  }

  onImageSelection(image){
    this.selectedImage = image;
    image.active = !image.active;

    if(this.selectedConentGroup.length > 0){
    let x = this.selectedConentGroup.find(x => x.id == this.currentConentGroup.id);
    if(x != null )
    {
      x.value.push(image);
    }
    else{
      let conentGroup = new ContentGroupModelGallery();
      conentGroup.id = this.currentConentGroup.id;
      conentGroup.name = this.currentConentGroup.name;
      conentGroup.value = [];
      conentGroup.value.push(image);
      this.selectedConentGroup.push(conentGroup);
    }
  }
  else{
    let conentGroup = new ContentGroupModelGallery();
      conentGroup.id = this.currentConentGroup.id;
      conentGroup.name = this.currentConentGroup.name;
      conentGroup.value = [];
      conentGroup.value.push(image);
      this.selectedConentGroup.push(conentGroup);
  }
  }
  handleCancel(isSave): void {
    if(isSave)
    this.activeModal.close(this.selectedConentGroup);

    else this.activeModal.close();
  }
}

export class ContentGroupModelGallery {
  id: number;
  name: string;
  value: any;
}
