import postCollection from "../models/postCollection.js"


const createPost = async (req, res) => {
    try {
        const { title, files } = req.body;
        // console.log(title)
        // console.log(files)
        const { _id } = req.user;
        // console.log(_id)
        let post = await postCollection.insertOne({
            title,
            files,
            userId: _id
        })
        res.status(201).json({ msg: "Post created successfully" })

    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}
const deletePost = async (req, res) => {
    try {
    const {postId }= req.params;
    const{_id} = req.user;
    // console.log(postId)
    // console.log(_id)


    const post = await postCollection.findById(postId);
    // console.log(post)
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
     if(post.userId == _id){
        //   console.log(post)
    await postCollection.deleteOne({ _id: postId });
    res.status(200).json({ msg: 'Post deleted successfully' });
     }
  } catch (error) {
    // console.error('Delete Error:', error);
    res.status(500).json({  error: error.message });
  }
}

const yourPost = async (req, res) => {
    try {
        const { _id } = req.user;
        let post = await postCollection.find({ userId:_id }).populate({ path:'userId'}).populate({
            path: 'likes', select: 'name profilePic'
        }).populate({ 
     path: 'comment',
     populate: {
       path: 'userId',
     } 
  })
  
        res.status(200).json({ post })
    } catch (error) {
        res.status(500).json({ error: error.message })


    }
}
const getAllPost = async (req, res) => {
    try {
        let post = await postCollection.find().populate({ path: 'userId', select: 'name profilePic' }).populate({
            path: 'likes', select: 'name profilePic'
        }).populate({
            path: 'comment',
            populate:{
                path: 'userId',
                select: 'name profilePic'
            }
        })
        res.status(200).json({ post })

    } catch (error) {
        res.status(500).json({ error: error.message })

    }
}


const likepost = async (req, res) => {
    try {
        const { _id } = req.user;
        const { postId } = req.params
        // console.log(postId)
        let post = await postCollection.findById(postId)
        // console.log(post)
        if (post.likes.includes(_id)) {
            post.likes.pull(_id)
            await post.save()
            res.status(200).json({ msg: " Post disliked successfully" })
        }
        else {
            // console.log(_id)
            post.likes.push(_id);
            await post.save()
            res.status(200).json({ msg: "Post like successfully" })
        }
    } catch (error) {
        res.status(500).json({ error: error.message })
    }

}

const commentPost = async (req, res) => {
    const { _id } = req.user;
    const { postId } = req.params;
    const { text } = req.body;
    try {
        let post = await postCollection.findById(postId)
        post.comment.push({userId:_id , text:text});
        await post.save()
        res.status(200).json({ msg: "Comment successfully" })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }

}

export {
    createPost,
    deletePost,
    yourPost,
    getAllPost,
    likepost,
    commentPost
}