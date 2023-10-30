interface AudioFile {
  blob: Blob;
  url: string;
  checked: boolean;
}

interface UploadFliles {
  audio: AudioFile[];
}
