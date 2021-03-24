import { Component, EventEmitter } from '@angular/core';
import { NgxPicaErrorInterface, NgxPicaService } from 'ng-pica';

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

    console.log(this.convertQueue);
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
    console.log(this.imageTypeSelect);

    switch (this.imageTypeSelect) {
      case undefined:
        alert('Você precisa selecionar um tipo de renderização');
        break;

      case 'emote':
        console.log(this.emoteArray);
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

        console.log(this.convertedImages);
        break;

      case 'badge':
        console.log(this.badgeArray);
        this.isImageResized = !this.isImageResized;
        break;
    }
  }

  submitImages() {
    console.log('Botão pressionado!', this.convertedImages);

    this.convertedImages.forEach((item) => {
      
      let base64 = item.split(',')

      let byteCharacters = atob(base64[1])
      let byteNumbers = new Array(byteCharacters.length)
      var byteArray = new Uint8Array(byteNumbers)
      let blob = new Blob([byteArray], {"type": "image/png"})

      console.log(blob)

    })

    //this.ConvertedImages == array onde fica as imagens convertidas para base64 + tamanho certo
    

    // let splitConvertQueue = this.convertedImages[0].split(',')
    // let byteCharacters = atob(splitConvertQueue[1])


    // let byteNumbers = new Array(byteCharacters.length);
    // for (var i = 0; i < byteCharacters.length; i++) {
    //     byteNumbers[i] = byteCharacters.charCodeAt(i);
    // }

    // var byteArray = new Uint8Array(byteNumbers);

    // let blob = new Blob([byteArray], {"type": "image/png"});

    // console.log(blob)
      
        // if(navigator.msSaveBlob){
        //   let filename = 'file_name_here';
        //   navigator.msSaveBlob(blob, filename);
        // } else {
        //   let link = document.createElement("a");

        //   link.href = URL.createObjectURL(blob);

        //   link.setAttribute('visibility','hidden');
        //   link.download = 'fichier';

        //   document.body.appendChild(link);
        //   link.click();
        //   document.body.removeChild(link);
        // }
  }

  uploadImages() {
    this.isImageResized = !this.isImageResized;
  }
}
