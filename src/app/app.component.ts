import { Component } from '@angular/core';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})

export class AppComponent {
  title = 'twitch-resizer';

  files: any[] = []
  value: any

  imageTypeSelect: any
 
  badgeArray: number[] = [72, 36, 18]
  emoteArray: number[] = [112, 56, 28]
  isImageResized: boolean = true

  carregando: boolean = true;
  convertQueue: any[] = [];
  convertedImages: any[] = [];


  /**
   * on file drop handler
   */
   onFileDropped(arquivos: any) {

    console.log(this.files)

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

  clicarBotao(){
    
    console.log(this.imageTypeSelect)

    switch(this.imageTypeSelect){
      case undefined:
        alert('Você precisa selecionar um tipo de renderização')
      break;

      case 'emote':
        console.log(this.emoteArray)
        this.isImageResized = !this.isImageResized;
      break;
    
      case 'badge':
        console.log(this.badgeArray)
        this.isImageResized = !this.isImageResized;
      break;
    }
  }  
  uploadImages(){
    this.isImageResized = !this.isImageResized;
  }
}
