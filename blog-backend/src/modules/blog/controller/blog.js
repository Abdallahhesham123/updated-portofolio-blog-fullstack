import CommentModel from "../../../../DB/model/Blog.model.js";
import UserModel from "../../../../DB/model/User.model.js";

export const getCommentModule = async (req, res, next) => {
  try {
    //pageination
    const UserPage = req.query.page * 1 || 1;
    const blogPerPage = 3;
    const skipItems = (UserPage - 1) * blogPerPage;
    const posts = await CommentModel.find({ isAccepted: true })
      .skip(skipItems)
      .limit(blogPerPage)
      .populate({ path: "User_Id", select: "_id isDeleted" });
    const totalpost = await CommentModel.find({ isAccepted: true });
    const pagesCount = Math.ceil(totalpost.length / blogPerPage);
    return res.json({
      message: "Done",
      data: posts,
      pagesCount: pagesCount,
      UserPage,
    });
  } catch (error) {
    return res.json({
      message: "Catch error",
      error,
      stack: error.stack,
    });
  }
};
export const getComments = async (req, res, next) => {
  try {
    const posts = await CommentModel.find({ isAccepted: false }).populate({
      path: "User_Id",
      select: "_id isDeleted username",
    });

    return res.json({ message: "Done", data: posts });
  } catch (error) {
    return res.json({
      message: "Catch error",
      error,
      stack: error.stack,
    });
  }
};
export const searchpost = async (req, res, next) => {
  try {
    const { title } = req.query;
    const regexp = new RegExp(`${title}`);
    const posts = await CommentModel.find({
      isAccepted: true,
      title: regexp,
    }).populate({ path: "User_Id", select: "_id isDeleted" });

    return res.json({ message: "Done", data: posts });
  } catch (error) {
    return res.json({
      message: "Catch error",
      error,
      stack: error.stack,
    });
  }
};

export const acceptedpost = async (req, res, next) => {
  try {
    const { id } = req.params;
    const post = await CommentModel.updateOne(
      { _id: id, isAccepted: false },
      { isAccepted: true }
    );

    return post.modifiedCount
      ? res.json({
          message: "post Accepted Sucsessfully ",
        })
      : res.json({ message: "InValid-Id" });
  } catch (error) {
    return res.json({
      message: "Catch error",
      error,
      stack: error.stack,
    });
  }
};
export const removepost = async (req, res, next) => {
  try {
    const { id } = req.params;
    const post = await CommentModel.findOneAndDelete({
      _id: id,
      isAccepted: false,
    });

    return post
      ? res.json({ message: "post Deleted Sucsessfully from database" })
      : res.json({ message: "InValid-Id" });
  } catch (error) {
    return res.json({
      message: "Catch error",
      error,
      stack: error.stack,
    });
  }
};
export const restoreComment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const post = await CommentModel.updateOne(
      { _id: id, isAccepted: true },
      { isAccepted: false }
    );

    return post.modifiedCount
      ? res.json({
          message: "post Blocked ",
        })
      : res.json({ message: "InValid-Id" });
  } catch (error) {
    return res.json({
      message: "Catch error",
      error,
      stack: error.stack,
    });
  }
};

export const addComment = async (req, res, next) => {
  try {
    const { title, body ,postPicture} = req.body;
    console.log(req.body);
    let UserExist = await UserModel.findById({
      _id: req.user._id,
      isDeleted: false,
    });
    if (UserExist === null) {
      return res
        .status(404)
        .json({ message: "This user isnot Exist Try again" });
    } else {

      
      const Post = await CommentModel.create({
        title,
        body,
        postPicture,
        User_Id: req.user._id,
      });
      return res
        .status(200)
        .json({ message: "Your Post is added Successfully", Post });
    }
  } catch (err) {
    return res.json({
      message: "Catch error",
      err,
      stack: err.stack,
    });
  }
};
export const getCommentById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const post = await CommentModel.findById({ _id: id }).populate({
      path: "User_Id",
    });
    return res.json({ message: "Done", post });
  } catch (error) {
    return res.json({
      message: "Catch error",
      error,
      stack: error.stack,
    });
  }
};
export const updateComment = async (req, res, next) => {
  try {
    const { id } = req.params;
    // const { user_Id } = req.query;
    const { body, title ,postPicture} = req.body;
    console.log(req.body);
    let UserExist = await UserModel.findById({
      _id: req.user._id,
      isDeleted: false,
    });

    if (UserExist === null) {
      return res
        .status(404)
        .json({ message: "This user isnot Exist in Database" });
    }
    const post = await CommentModel.findOneAndUpdate(
      { _id: id, User_Id: req.user._id },
      req.body,
      { new: true }
    ).populate({ path: "User_Id", select: "userName  -_id" });
    return post
      ? res
          .status(200)
          .json({ message: "This comment updated successfully", post })
      : res.status(404).json({ message: "This post not found" });
  } catch (error) {
    return res.json({
      message: "Catch error",
      error,
      stack: error.stack,
    });
  }
};
export const deleteComment = async (req, res, next) => {
  try {
    const { id } = req.params;
    // const { user_Id } = req.query;

    let UserExist = await UserModel.findById({
      _id: req.user._id,
      isDeleted: false,
    });

    if (UserExist === null) {
      return res.json({ message: "This user isnot Exist in Database" });
    }
    const comments = await CommentModel.findOneAndDelete({
      _id: id,
      User_Id: req.user._id,
    });
    return comments
      ? res.json({ message: "This comment deleted successfully" })
      : res.json({ message: "This comment not found" });
  } catch (error) {
    return res.json({
      message: "Catch error",
      error,
      stack: error.stack,
    });
  }
};

//like and dislike post
export const likepost = async (req, res, next) => {
  try {
    const { id } = req.params;
    console.log(id);
    const user_Id = req.user._id.toString();
    const post = await CommentModel.findById({ _id: id });
    if (post) {
      if (!post.likes.includes(user_Id)) {
        await CommentModel.updateOne({ _id: id },{ $push: { likes: user_Id } });
        
        return res.status(200).json({ message: "the post has been liked" });
       
      } else {
       await CommentModel.updateOne({ _id: id },{ $pull: { likes: user_Id } });
        return res.status(200).json({ message: "the post has been disliked" });
      }

    
    } else {
      return res.status(404).json({ message: "this post not found" });
    }
  } catch (error) {
    return res.json({
      message: "Catch error",
      error,
      stack: error.stack,
    });
  }
};
