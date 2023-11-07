interface PeopleListItem {
  modelNo: number;
  modelName: string;
  imagePath: string;
}

interface ModelInformation extends PeopleListItem {
  videoList: string[];
  voiceList: string[];
  conversationText: string;
}

export { PeopleListItem, ModelInformation };
