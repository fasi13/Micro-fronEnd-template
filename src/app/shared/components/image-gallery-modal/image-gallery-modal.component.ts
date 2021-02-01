import { FetchContentGroup } from './../../../core/store/content/content.actions';
import { getGroup } from './../../../core/store/store.reducers';
import { Store } from '@ngrx/store';
import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ContentGroupModelGallery } from './ContentGroupModelGallery';
import { ContentGroup, getGroups, State } from '@forge/core';

@Component({
  selector: 'fge-image-gallery-modal',
  templateUrl: './image-gallery-modal.component.html',
})
export class ImageGalleryModalComponent implements OnInit {
  images: any;
  contentGroups: ContentGroup[];
  currentContentGroup: ContentGroup;
  selectedImage: any;
  selectedContentGroup = [];
  applicationId: string | number;
  isLoading: boolean;

  constructor(

    public activeModal: NgbActiveModal,
    private store: Store<State>
  ) {}

  ngOnInit() {

    this.isLoading = true;
    this.onLoad();
  }

  onLoad() {

    this.store.select(getGroups).subscribe((groups) => {
      this.contentGroups = [...groups];
      this.contentGroups.sort((t1: ContentGroup, t2: ContentGroup) => {
        return t1.name < t2.name ? -1 : t1.name > t2.name ? -1 : 0;
      });
    });

    this.store.select(getGroup).subscribe((group) => {
      this.isLoading = false;
      this.currentContentGroup = group;
      this.selectedImage = null;
      if(group && group.content) this.images = group.content.filter((y) => y.dataType.name === 'Image');
    });
    return this.contentGroups;
  }

  onContentClick(item: ContentGroup) {
    this.isLoading = true;
    this.currentContentGroup = item;
    this.store.dispatch(new FetchContentGroup(item.id));
    return this.isLoading;
  }

  onImageSelection(image) {
    this.selectedImage = image;

    this.images.forEach((img) => {
      img.active = img === image ? !image.active : false;
    });
    if (this.selectedContentGroup.length > 0) {
      const conentGroupSelected = this.selectedContentGroup.find(
        (x) => x.id === this.currentContentGroup.id
      );
      if (conentGroupSelected != null) {
        const conentGroupImageSelected = conentGroupSelected.value.find(
          (x) => x.id === this.selectedImage.id
        );
        if (!conentGroupImageSelected) {
          return conentGroupSelected.value.push(image);
        } else {
          if (conentGroupSelected.value)
          return conentGroupSelected.value.pop(conentGroupImageSelected);
        }
      } else {
        const conentGroup = new ContentGroupModelGallery();
        conentGroup.id = +this.currentContentGroup.id;
        conentGroup.name = this.currentContentGroup.name;
        conentGroup.value = [];
        conentGroup.value.push(image);
        return this.selectedContentGroup.push(conentGroup);
      }
    } else {
      const conentGroup = new ContentGroupModelGallery();
      conentGroup.id = +this.currentContentGroup.id;
      conentGroup.name = this.currentContentGroup.name;
      conentGroup.value = [];
      conentGroup.value.push(image);
      return this.selectedContentGroup.push(conentGroup);
    }
  }
  handleCancel(isSave): void {
    if (isSave) {
      this.activeModal.close(this.selectedContentGroup);
    } else {
      this.activeModal.close();
    }
  }
}
