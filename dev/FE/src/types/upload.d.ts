interface MediaFile {
  blob: File;
  url: string;
  checked?: boolean;
  name?: string;
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

interface VideoInformation {
  videoSrc: string;
  videoName: string;
}

export {
  AudioFile,
  VideoFile,
  ImageFile,
  TextFile,
  UploadFiles,
  VideoInformation,
};
