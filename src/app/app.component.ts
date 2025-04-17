import { Component } from '@angular/core';
import { HttpClient } from  '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'myApp';
  pdfSrc: any;
  pdfUrl: string | undefined;
  pdfFile: File | undefined;
  checked = false;
  blob: Blob | undefined;

  constructor(private http: HttpClient) { }

  onFileSelected(event:any) {
    const file: File = event.target.files[0];
    if (file && file.type === 'application/pdf') {
      const reader = new FileReader();
      reader.onload = () => {
        const arrayBuffer = reader.result as ArrayBuffer;
        this.pdfSrc = new Uint8Array(arrayBuffer);
      };
      reader.readAsArrayBuffer(file);
    } else {
      alert('Please select a valid PDF file.');
    }
  }
  onDragOver(event:any) {
    event.preventDefault();
}

// From drag and drop
onDropSuccess(event:any) {
    event.preventDefault();

    this.onFileChange(event.dataTransfer.files);    // notice the "dataTransfer" used instead of "target"
}

// From attachment link
onChange(event:any) {
    this.onFileChange(event.target.files);    // "target" is correct here
}

private onFileChange(files: File[]) {
  this.pdfFile = files[0];
}
urlPost(){
  this.pdfSrc = this.pdfUrl;
}
sendToApi() {
  const pdfFile = this.pdfSrc;

  const formdata: FormData = new FormData();
  formdata.append('pdfFile', pdfFile); // Should match the parameter name in backend

  this.http.post<any>('https://localhost:3000/pdfUpload', formdata).subscribe(
  (data) => {
    this.blob = new Blob([data], {type: 'application/pdf'});

    var downloadURL = window.URL.createObjectURL(data);
    var link = document.createElement('a');
    link.href = downloadURL;
    link.download = "help.pdf";
    link.click();
  },
  (error) => {
    console.error(error.error);
  });
}
  
}
