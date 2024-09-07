export interface PostDataInterface {
  postId?: any;
  userId?: string;
  captions?: string;
  hashtags?: string[];
  images?: string[];
  videos?: string[];
  reports?: string[];
  likes?: string[];
  location?: string;
  saved?: string;
  dp?: string;
  username?: string;
  isBlocked?: boolean;
  isArchived: boolean;
  mentions?: string[];
  shares?: string[];
  comments?: string[];
  createdAt: Date;
  updatedAt: Date;


}

export interface ReportPostInterface {
  postId: string;
  reason: string;
  comments: string;
  reporterId: string;
  reporterUsername: string;
}

export interface StoryReaction {
  userId: string;
  type: "like" | "love" | "haha" | "sad" | "angry";
}

export interface StoryInterface  {
  userId: string;
  isHighlighted: boolean;
  isExpired: boolean;
  captions?: string;
  username?: string;
  dp?: string;
  mediaUrl: string;
  mediaType: "image" | "video" | "text";
  viewers: string[];
  viewCount: number;
  reactions: StoryReaction[];
  hiddenFrom: string[];
  createdAt?: Date;
  updatedAt?: Date;
}


export interface highlightsInterface{
  userId: any; 
  highlightName: string,
  coverImage: string,
  selectedStories: [StoryInterface]
} 