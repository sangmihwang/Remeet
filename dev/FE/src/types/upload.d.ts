interface MediaFile {
  blob: File; // File already includes 'name', 'size', etc.
  url: string;
  checked?: boolean;
}

interface AudioFile extends MediaFile {}

interface VideoFile extends MediaFile {}

interface ImageFile extends MediaFile {}

interface TextFile extends MediaFile {}

interface UploadFiles {
  audio: AudioFile[];
  video: VideoFile[];
  images: ImageFile;
  texts: TextFile[];
}
