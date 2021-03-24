import {
    Directive,
    Output,
    Input,
    EventEmitter,
    HostBinding,
    HostListener
  } from '@angular/core';
  
  @Directive({
    selector: '[appDnd]'
  })
  export class DndDirective {
    @HostBinding('class.fileover') fileOver: boolean | undefined;
    @Output() fileDropped = new EventEmitter<any>();
  
    // Dragover listener
    @HostListener('dragover', ['$event']) onDragOver(evt: any) {
      evt.preventDefault();
      evt.stopPropagation();
      this.fileOver = true;
  
      console.log('dragover')
    }
  
    // Dragleave listener
    @HostListener('dragleave', ['$event']) public onDragLeave(evt: any) {
      evt.preventDefault();
      evt.stopPropagation();
      this.fileOver = false;
  
      console.log('dragleave')
    }
  
    // Drop listener
    @HostListener('drop', ['$event']) public ondrop(evt: any) {
      evt.preventDefault();
      evt.stopPropagation();
      this.fileOver = false;
      console.log('drop')
      let files = evt.dataTransfer.files;
      if (files.length > 0) {
        this.fileDropped.emit(files);
        console.log(`You dropped ${files.length} files`)
      }
    }
  }
  