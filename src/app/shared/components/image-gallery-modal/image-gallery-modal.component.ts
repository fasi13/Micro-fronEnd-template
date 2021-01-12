import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'fge-image-gallery-modal',
  templateUrl: './image-gallery-modal.component.html',
  styleUrls: ['./image-gallery-modal.component.scss']
})
export class ImageGalleryModalComponent implements OnInit {
 myData: string;
images: [];
  constructor() { }

  ngOnInit() {
  }

}
