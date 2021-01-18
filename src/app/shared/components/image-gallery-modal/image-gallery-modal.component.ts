import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ContentService } from 'src/app/core/services/content.service';
import { ContentGroupModelGallery } from './ContentGroupModelGallery';

@Component({
  selector: 'fge-image-gallery-modal',
  templateUrl: './image-gallery-modal.component.html',
})

export class ImageGalleryModalComponent implements OnInit {
  images: any;
  conentGroups: any;
  currentConentGroup: any;
  selectedImage: any;
  selectedConentGroup = [];
  applicationId: string | number;
  isLoading: boolean;

  constructor(
    private contentService: ContentService,
    public activeModal: NgbActiveModal
  ) {}

  ngOnInit() {
      /* istanbul ignore next */
    this.isLoading = true;
    this.contentService.getContentGroups(this.applicationId).subscribe((a) => {
      this.conentGroups = a.data.items;
      this.conentGroups.sort((t1, t2) => {
        if (t1.name < t2.name) {
          return -1;
        }
        if (t1.name > t2.name) {
          return 1;
        }
        return 0;
      });
      this.currentConentGroup = this.conentGroups[0];
      this.contentService
        .getContentGroup(this.applicationId, this.conentGroups[0].id)
        .subscribe((x) => {
          this.currentConentGroup.active = !this.currentConentGroup.active;
          this.selectedImage = null;
          this.images = x.data.content.filter(
            (y) => y.dataType.name === 'Image'
          );
          this.isLoading = false;
        });
    });
  }

  onContentClick(item) {
      /* istanbul ignore next */
    this.isLoading = true;
    this.currentConentGroup.active = !this.currentConentGroup.active;
        this.currentConentGroup = item;
        this.currentConentGroup.active = !this.currentConentGroup.active;
    this.contentService
      .getContentGroup(this.applicationId, item.id)
      .subscribe((x) => {
        this.isLoading = false;
        this.selectedImage = null;
        this.images = x.data.content.filter((y) => y.dataType.name === 'Image');
        
      });
  }

  onImageSelection(image) {
      /* istanbul ignore next */

    this.selectedImage = image;

    this.images.forEach((img) => {
      img.active = img === image ? !image.active : false;
    });
    if (this.selectedConentGroup.length > 0) {
      const conentGroupSelected = this.selectedConentGroup.find(
        (x) => x.id === this.currentConentGroup.id
      );
      if (conentGroupSelected != null) {
        const conentGroupImageSelected = conentGroupSelected.value.find(
          (x) => x.id === this.selectedImage.id
        );
        if (!conentGroupImageSelected) {
          return conentGroupSelected.value.push(image);
        } else {
          return conentGroupSelected.value.pop(conentGroupImageSelected);
        }
      } else {
        const conentGroup = new ContentGroupModelGallery();
        conentGroup.id = this.currentConentGroup.id;
        conentGroup.name = this.currentConentGroup.name;
        conentGroup.value = [];
        conentGroup.value.push(image);
        return this.selectedConentGroup.push(conentGroup);
      }
    } else {
      const conentGroup = new ContentGroupModelGallery();
      conentGroup.id = this.currentConentGroup.id;
      conentGroup.name = this.currentConentGroup.name;
      conentGroup.value = [];
      conentGroup.value.push(image);
      return this.selectedConentGroup.push(conentGroup);
    }
  }
  handleCancel(isSave): void {
      /* istanbul ignore next */
    if (isSave) {
      this.activeModal.close(this.selectedConentGroup);
    } else {
      this.activeModal.close();
    }
  }
}
