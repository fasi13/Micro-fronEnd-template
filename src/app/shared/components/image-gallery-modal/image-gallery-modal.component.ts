import { Component, OnInit } from '@angular/core';
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

  constructor(private contentService: ContentService) {

   }

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
      debugger;
  }

}
