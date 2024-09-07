import express from "express";
import authMiddleware from "../middlewares/authMiddleware";
import { authServiceInterface } from "../../../application/services/authenticationServiceInterface";
import { authService } from "../../services/authenticationService";
import { userDBRepository } from "../../../application/repositories/userDBRepository";
import { userRepositoryMongoDB } from "../../database/mongodb/respositories/userRepositoryDatabase";
import postController from "../../../adapters/postController/postController";
import { postRepositoryMongoDB } from "../../database/mongodb/respositories/postRepositoryDatabase";
import { postDBRepository } from "../../../application/repositories/postDBRepository";

const postRouter = () => {
  const router = express();

  const controller = postController(
    userRepositoryMongoDB,
    userDBRepository,
    postRepositoryMongoDB,
    postDBRepository,
    authService,
    authServiceInterface
  );

  router.post("/addpost", authMiddleware, controller.addPost);
  router.post("/updatepost", authMiddleware, controller.updatepost);
  router.get("/getpostforuser", authMiddleware, controller.getpostforuser);
  router.get("/getpostforuserusername/:username", authMiddleware, controller.getpostforuserusername);
  router.get("/gettaggedpostforuserusername/:username", authMiddleware, controller.gettaggedpostforuserusername);
  router.get("/getpostlengthofuser/:username", authMiddleware, controller.getpostlengthofuser);
  router.get("/getpostofcurrentuser", authMiddleware, controller.getpostofcurrentuser);
  router.get("/getsavedpostofcurrentuser", authMiddleware, controller.getsavedpostofcurrentuser);
  router.get("/gettaggedpostofcurrentuser", authMiddleware, controller.gettaggedpostofcurrentuser);
  router.get("/getparticularpost/:id", authMiddleware, controller.getparticularpostofcurrentuser);
  router.get("/getpostusingpostId/:postId", authMiddleware, controller.getPostUsingPostId);
  router.post("/reportpost", authMiddleware, controller.reportPost);
  router.post("/savepost", authMiddleware, controller.savePost);
  router.post("/removesavepost", authMiddleware, controller.removesavePost);
  router.post("/removetaggedpost", authMiddleware, controller.removetaggedpost);
  router.post("/likepost", authMiddleware, controller.likePost);
  router.post("/dislikepost", authMiddleware, controller.dislikePost);
  router.get("/getlikedposts/:userId", authMiddleware, controller.getlikedposts);
  router.get("/getdislikedposts/:userId", authMiddleware, controller.getdislikedposts);
  router.get("/getlikesdislikesinfo/:postId", authMiddleware, controller.getlikesdislikesinfo);
  router.delete("/deletepost/:postId", authMiddleware, controller.deletepost);
  router.get("/getallpublicpostsforexplore", authMiddleware, controller.getallpublicpostsforexplore);
  router.post("/generatecaption", authMiddleware, controller.generatecaption);
  router.patch("/darkmode", authMiddleware, controller.darkmode);
  router.patch("/leftsidebar", authMiddleware, controller.leftsidebar);
  router.patch("/rightsidebar", authMiddleware, controller.rightsidebar);
  // COMMENT
  router.post("/addcomment", authMiddleware , controller.addComment)
  router.get("/getallcomments/:postId", authMiddleware, controller.getallcomments);
  router.delete("/deletecomment/:commentId", authMiddleware, controller.deleteComment);
  router.put("/editcomment", authMiddleware, controller.editComment);
  router.post("/replytocomment", authMiddleware , controller.replytocomment)
  // STORIES 
  router.post("/addstory", authMiddleware, controller.addStory);
  router.get("/getstories", authMiddleware, controller.getstories);
  router.post("/createstoryhighlights", authMiddleware, controller.createstoryhighlights);
  router.get("/getstoriesforhighlights", authMiddleware, controller.getStoriesForHighlights);
  router.get("/gethighlightsdata", authMiddleware, controller.getHighlightsData);
  router.delete("/deletehighlight/:highlightId", authMiddleware, controller.deletehighlight);
  router.get("/storiesforhighlightsusername/:username", authMiddleware, controller.storiesforhighlightsusername);
  router.get("/gethighlightsusingusername/:username", authMiddleware, controller.gethighlightsusingusername);
  // FEEDS
  router.get("/feeds", authMiddleware, controller.getFeeds);



  return router;
};

export default postRouter;
