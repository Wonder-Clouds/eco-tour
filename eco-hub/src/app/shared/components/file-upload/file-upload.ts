import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatChipsModule } from '@angular/material/chips';

interface UploadedFile {
  file: File;
  preview?: string;
  uploading?: boolean;
  progress?: number;
}

@Component({
  selector: 'app-file-upload',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatProgressBarModule,
    MatChipsModule,
  ],
  templateUrl: './file-upload.html',
  styleUrls: ['./file-upload.scss'],
})
export class FileUpload {
  @Input() accept: string = 'image/*'; // 'image/*', '.pdf,.doc,.docx', etc.
  @Input() multiple: boolean = true;
  @Input() maxSize: number = 5 * 1024 * 1024; // 5MB default
  @Input() maxFiles: number = 10;

  @Output() filesSelected = new EventEmitter<File[]>();
  @Output() filesUploaded = new EventEmitter<string[]>(); // URLs

  uploadedFiles: UploadedFile[] = [];
  isDragging = false;
  errorMessage: string = '';

  get isUploading(): boolean {
    return this.uploadedFiles.some((f) => f.uploading);
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;

    const files = event.dataTransfer?.files;
    if (files) {
      this.handleFiles(Array.from(files));
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.handleFiles(Array.from(input.files));
    }
  }

  handleFiles(files: File[]): void {
    this.errorMessage = '';

    // Validar número máximo de archivos
    if (this.uploadedFiles.length + files.length > this.maxFiles) {
      this.errorMessage = `Máximo ${this.maxFiles} archivos permitidos`;
      return;
    }

    // Procesar cada archivo
    files.forEach((file) => {
      // Validar tamaño
      if (file.size > this.maxSize) {
        this.errorMessage = `${
          file.name
        } excede el tamaño máximo de ${this.formatBytes(this.maxSize)}`;
        return;
      }

      const uploadedFile: UploadedFile = {
        file,
        uploading: false,
        progress: 0,
      };

      // Si es imagen, crear preview
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          uploadedFile.preview = e.target?.result as string;
        };
        reader.readAsDataURL(file);
      }

      this.uploadedFiles.push(uploadedFile);
    });

    // Emitir archivos seleccionados
    const allFiles = this.uploadedFiles.map((uf) => uf.file);
    this.filesSelected.emit(allFiles);
  }

  removeFile(index: number): void {
    this.uploadedFiles.splice(index, 1);
    const allFiles = this.uploadedFiles.map((uf) => uf.file);
    this.filesSelected.emit(allFiles);
  }

  // Simular subida (reemplazar con tu lógica de subida real)
  async uploadFiles(): Promise<void> {
    const uploadPromises = this.uploadedFiles.map((uploadedFile, index) =>
      this.simulateUpload(uploadedFile, index)
    );

    await Promise.all(uploadPromises);

    // Emitir URLs de archivos subidos (en tu caso real, serían URLs del servidor)
    const urls = this.uploadedFiles.map((uf) => uf.preview || '');
    this.filesUploaded.emit(urls);
  }

  // Simular progreso de subida (reemplazar con tu API real)
  private simulateUpload(
    uploadedFile: UploadedFile,
    index: number
  ): Promise<void> {
    return new Promise((resolve) => {
      uploadedFile.uploading = true;
      uploadedFile.progress = 0;

      const interval = setInterval(() => {
        if (uploadedFile.progress! < 100) {
          uploadedFile.progress! += 10;
        } else {
          uploadedFile.uploading = false;
          clearInterval(interval);
          resolve();
        }
      }, 200);
    });
  }

  formatBytes(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  }

  getFileIcon(file: File): string {
    if (file.type.startsWith('image/')) return 'image';
    if (file.type.includes('pdf')) return 'picture_as_pdf';
    if (file.type.includes('word')) return 'description';
    if (file.type.includes('excel') || file.type.includes('spreadsheet'))
      return 'table_chart';
    return 'insert_drive_file';
  }
}
