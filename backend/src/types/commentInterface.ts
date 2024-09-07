
export interface CommentInterface {
    postId: string;
    userId: string;
    username: string;
    comment: string;
    dp: string;
    replies: string[];
    report: string[];
    likes: string[];
    isBlock: boolean;
}

export interface ReplyInterface {
    commentId: string;
    postId: string;
    userId: string;
    username: string;
    reply: string;
    dp: string;
  }