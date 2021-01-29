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
  conentGroups: ContentGroup[];
  currentConentGroup: ContentGroup;
  selectedImage: any;
  selectedConentGroup = [];
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
      this.conentGroups = groups;
      this.conentGroups.sort((t1: ContentGroup, t2: ContentGroup) => {
        return t1.name < t2.name ? -1 : t1.name > t2.name ? -1 : 0;
      });
    });

    this.store.select(getGroup).subscribe((group) => {
      this.isLoading = false;
      this.currentConentGroup = group;
      this.selectedImage = null;
      this.images = group.content.filter((y) => y.dataType.name === 'Image');
    });
  }

  onContentClick(item: ContentGroup) {
    this.isLoading = true;
    this.currentConentGroup = item;
    this.store.dispatch(new FetchContentGroup(item.id));
  }

  onImageSelection(image) {
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
        conentGroup.id = +this.currentConentGroup.id;
        conentGroup.name = this.currentConentGroup.name;
        conentGroup.value = [];
        conentGroup.value.push(image);
        return this.selectedConentGroup.push(conentGroup);
      }
    } else {
      const conentGroup = new ContentGroupModelGallery();
      conentGroup.id = +this.currentConentGroup.id;
      conentGroup.name = this.currentConentGroup.name;
      conentGroup.value = [];
      conentGroup.value.push(image);
      return this.selectedConentGroup.push(conentGroup);
    }
  }
  handleCancel(isSave): void {
    if (isSave) {
      this.activeModal.close(this.selectedConentGroup);
    } else {
      this.activeModal.close();
    }
  }
}
