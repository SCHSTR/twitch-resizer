import { Component, EventEmitter } from '@angular/core';
import { NgxPicaErrorInterface, NgxPicaService } from 'ng-pica';
import * as JSZip from 'jszip';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass'],
})
export class AppComponent {
  title = 'twitch-resizer';

  files: any[] = [];
  value: any;

  imageTypeSelect: any;

  badgeArray: number[] = [72, 36, 18];
  emoteArray: number[] = [112, 56, 28];

  base64: any[] = [];
  zipFiles: any[] = [];

  isImageResized: boolean = true;

  images: File[] = [];

  carregando: boolean = true;
  convertQueue: any[] = [];
  convertedImages: any[] = [];

  constructor(private ngxPicaService: NgxPicaService) {}

  /**
   * on file drop handler
   */
  onFileDropped(arquivos: any) {
    console.log(this.files);

    Array.from(arquivos).forEach((arquivo: any, arquivoIndex) => {
      const reader = new FileReader();

      reader.readAsDataURL(arquivo);
      reader.onload = () => {
        this.convertQueue.push(reader.result);
      };

      if (arquivoIndex === arquivos.length - 1) {
        this.prepareFilesList(arquivos);
      }
    });

  }

  /**
   * handle file from browsing
   */
  fileBrowseHandler(arquivos: any) {
    Array.from(arquivos).forEach((arquivo: any, arquivoIndex) => {
      const reader = new FileReader();

      reader.readAsDataURL(arquivo);
      reader.onload = () => {
        //console.log(reader.result);
        this.convertQueue.push(reader.result);
      };

      if (arquivoIndex === arquivos.length - 1) {
        this.prepareFilesList(arquivos);
      }
    });

    console.log(this.convertQueue);
  }

  /**
   * Delete file from files list
   * @param index (File index)
   */
  deleteFile(index: any) {
    this.files.splice(index, 1);
    this.convertQueue.splice(index, 1)
  }

  /**
   * Simulate the upload process
   */
  uploadFilesSimulator(index: any) {
    setTimeout(() => {
      if (index === this.files.length) {
        return;
      } else {
        const progressInterval = setInterval(() => {
          if (this.files[index].progress === 100) {
            clearInterval(progressInterval);
            this.uploadFilesSimulator(index + 1);
          } else {
            this.files[index].progress += 5;
          }
        }, 200);
      }
    }, 5000);
  }

  /**
   * Convert Files list to normal array list
   * @param files (Files List)
   */
  prepareFilesList(files: any) {
    for (const item of files) {
      item.progress = 0;
      this.files.push(item);
    }
    this.uploadFilesSimulator(0);
  }

  /**
   * format bytes
   * @param bytes (File size in bytes)
   * @param decimals (Decimals point)
   */
  formatBytes(bytes: any, decimals: any) {
    if (bytes === 0) {
      return '0 Bytes';
    }
    const k = 1024;
    const dm = decimals <= 0 ? 0 : decimals || 2;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }

  clicarBotao(arquivos: any) {
    switch (this.imageTypeSelect) {
      case undefined:
        alert('Você precisa selecionar um tipo de renderização');
        break;

      case 'emote':
        this.isImageResized = !this.isImageResized;
        this.emoteArray.forEach((emoteSize) => {
          this.ngxPicaService
            .resizeImages(arquivos, emoteSize, emoteSize, { alpha: true })
            .subscribe(
              (imageResized: File) => {
                let reader: FileReader = new FileReader();

                reader.addEventListener(
                  'load',
                  (event: any) => {
                    this.images.push(event.target.result);
                  },
                  false
                );

                reader.readAsDataURL(imageResized);
                reader.onload = () => {
                  this.convertedImages.push(reader.result);
                };
              },
              (err: NgxPicaErrorInterface) => {
                throw err.err;
              }
            );
        });
        break;

      case 'badge':
        this.isImageResized = !this.isImageResized;
        this.badgeArray.forEach((emoteSize) => {
          this.ngxPicaService
            .resizeImages(arquivos, emoteSize, emoteSize, { alpha: true })
            .subscribe(
              (imageResized: File) => {
                let reader: FileReader = new FileReader();

                reader.addEventListener(
                  'load',
                  (event: any) => {
                    this.images.push(event.target.result);
                  },
                  false
                );

                reader.readAsDataURL(imageResized);
                reader.onload = () => {
                  this.convertedImages.push(reader.result);
                };
              },
              (err: NgxPicaErrorInterface) => {
                throw err.err;
              }
            );
        });
        break;
    }
  }

  submitImages() {
    console.log('Botão pressionado!', this.convertedImages);

    this.convertedImages.forEach((item) => {
      let getBaseURI = item.split(',');
      this.base64.push(getBaseURI[1]);
    });

    var zip = new JSZip();
    zip.file(
      'Your files!.txt',
      'This files was generated by Twitch Resizer,\nfeel free to help-me with a donation :)\n\nMy social:\nhttps://twitch.tv/schstr\nhttps://twitter.com/rschstr'
    );

    let img: any = zip.folder('images');

    for (var item = 0; item < this.base64.length; item++) {
      img.file(`image${item}.png`, this.base64[item], { base64: true });
    }

    zip.generateAsync({ type: 'blob' }).then(function (content) {
      saveAs(content, 'images.zip');
    });

    console.log(this.base64);
  }

  uploadImages() {
    this.isImageResized = !this.isImageResized;
    
    this.files = [];
    this.base64 = [];
    this.zipFiles= [];
    this.images = [];
    this.convertQueue = [];
    this.convertedImages = [];
  }
}
