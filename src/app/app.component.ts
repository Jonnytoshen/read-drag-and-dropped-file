import { Component, OnInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  @ViewChild('target') target: ElementRef;
  @ViewChild('cleanup') cleanup: ElementRef;

  fileList: any[] = [];
  
  constructor(
    private renderer: Renderer2
  ) {}

  ngOnInit() {
    this.registerListeners(this.target.nativeElement);
  }

  /**
   * @private
   * @param dropArea HTMLElement
   */
  private registerListeners(dropArea: HTMLElement): void {
    this.renderer.listen(dropArea, 'dragenter', this.handleStop.bind(this));
    this.renderer.listen(dropArea, 'dragenter', this.handleEnter.bind(this));
    this.renderer.listen(dropArea, 'dragover', this.handleStop.bind(this));
    this.renderer.listen(dropArea, 'drop', this.handleStop.bind(this));
    this.renderer.listen(dropArea, 'drop', this.handleDrop.bind(this));
    this.renderer.listen(dropArea, 'drop', this.handleLeave.bind(this));
    this.renderer.listen(dropArea, 'dragleave', this.handleStop.bind(this));
    this.renderer.listen(dropArea, 'dragleave', this.handleLeave.bind(this));
  }

  /**
   * @private
   * @param event DragEvent
   */
  private handleStop(event: DragEvent): void {
    event.stopPropagation();
    event.preventDefault();
    event.dataTransfer.dropEffect = 'copy';
  }

  /**
   * @private
   * @param event DragEvent
   */
  private handleEnter(event: DragEvent): void {
    this.fileList = [];
    this.renderer.addClass(this.target.nativeElement, 'drag-enter');
  }

  /**
   * @private
   * @param event DragEvent
   */
  private handleLeave(event: DragEvent): void {
    this.renderer.removeClass(this.target.nativeElement, 'drag-enter');
  }

  /**
   * @private
   * @param event DragEvent
   */
  private handleDrop(event: DragEvent): void {
    /**
     * file type
     * GeoJSON/TopoJSON: application/geo+json 
     * KML: application/vnd.google-earth.kml+xml
     * GPX/IGC: application/gpx+xml
     * JPG/JPEG: image/jpeg
     * PNG: image/png
     * GIF: image/gif
     */
    const files = event.dataTransfer.files;
    for (let i = 0, ii = files.length; i < ii; ++i) {
      const file = files.item(i);
      const reader: FileReader = new FileReader();
      reader.addEventListener('load', this.handleResult.bind(this, file));
      if(file.type.includes("image")) {
        reader.readAsDataURL(file);
      } else {
        reader.readAsText(file);
      }
    }
  }

  /**
   * @private
   * @param file File
   * @param event ProgressEvent
   */
  private handleResult(file: File, event: ProgressEvent): void {
    const target: FileReader = <FileReader>event.target;
    const result = target.result;
    let image = null;
    if(file.type.includes("image")) {
      image = result;
    }
    this.fileList.push({ properties: file, result, image});
  }

  

}
