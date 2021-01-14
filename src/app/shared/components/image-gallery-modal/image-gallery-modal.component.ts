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
  applicationId: string | number;
  isEmpty: boolean;

  constructor(private contentService: ContentService,
    public activeModal: NgbActiveModal) { }

  ngOnInit() {
    this.isEmpty = true;
    this.contentService.getContentGroups(this.applicationId).subscribe(a => {
      this.contentService.getContentGroup(this.applicationId, a.data.items[0].id).subscribe(x => {
        this.currentConentGroup = a.data.items[0];
        this.currentConentGroup.active = !this.currentConentGroup.active;
        this.selectedImage = null;
        this.conentGroups = a.data.items;
        this.images = x.data.content.filter(y => y.dataType.name === "Image");
        this.isEmpty = false;
        });
      })
    }

  onContentClick(item) {
    this.isEmpty = true;
    this.contentService.getContentGroup(this.applicationId, item.id).subscribe(x => {
      this.currentConentGroup.active = !this.currentConentGroup.active;
      this.currentConentGroup = item;
      this.currentConentGroup.active = !this.currentConentGroup.active;
      this.selectedImage = null;
      this.images = x.data.content.filter(y => y.dataType.name === "Image");
      this.isEmpty = false;
    })
  }

  onImageSelection(image) {
    this.isEmpty = true;
    this.selectedImage = image;
    image.active = !image.active;

    if (this.selectedConentGroup.length > 0) {
      let conentGroupSelected = this.selectedConentGroup.find(x => x.id == this.currentConentGroup.id);
      if (conentGroupSelected != null) {
        let conentGroupImageSelected = conentGroupSelected.value.find(x => x.id == this.selectedImage.id);
        if(!conentGroupImageSelected) conentGroupSelected.value.push(image);
        else conentGroupSelected.value.pop(conentGroupImageSelected);
      }
      else {
        let conentGroup = new ContentGroupModelGallery();
        conentGroup.id = this.currentConentGroup.id;
        conentGroup.name = this.currentConentGroup.name;
        conentGroup.value = [];
        conentGroup.value.push(image);
        this.selectedConentGroup.push(conentGroup);
      }
    }
    else {
      let conentGroup = new ContentGroupModelGallery();
      conentGroup.id = this.currentConentGroup.id;
      conentGroup.name = this.currentConentGroup.name;
      conentGroup.value = [];
      conentGroup.value.push(image);
      this.selectedConentGroup.push(conentGroup);
    }
    this.isEmpty = false;
  }
  handleCancel(isSave): void {
    if (isSave) this.activeModal.close(this.selectedConentGroup);
    else this.activeModal.close();
  }
}

export class ContentGroupModelGallery {
  id: number;
  name: string;
  value: any;
}
