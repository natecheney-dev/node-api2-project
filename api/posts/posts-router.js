// implement your posts router here
const express = require('express')
const Posts = require('./posts-model')
const router = express.Router()

// [GET] /api/posts
router.get('/', (req, res) => {
    Posts.find(req.query)
        .then(post => {
            res.json(post)
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({
                message: `The posts information could not be retrieved`
            });
        });

})

// [GET] /api/posts/:id
router.get('/:id', (req, res) => {
    const { id } = req.params
    Posts.findById(id)
        .then(post => {
            if (post) {
                res.json(post)
            }
            else (res.status(404).json({ message: `The post with the specified ID does not exist` }))
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({
                message: `The post information could not be retrieved`
            });
        });

})

// [POST] /api/posts
router.post('/', async (req, res) => {
    try {
        const { title, contents } = req.body
        if (!title || !contents) {
            res.status(400).json({ message: "Please provide title and contents for the post" })
        } else {
            const posts = await Posts.insert({ title, contents })
                .then(({ id }) => {
                    return Posts.findById(id);
                })
            res.status(201).json(posts)
        }
    }
    catch (error) {
        res.status(500).json({ message: "There was an error while saving the post to the database" })
    }
})


// [PUT] /api/posts/:id
router.put('/:id', async (req, res) => {
    try {
      const { id } = req.params
      const { title, contents } = req.body
      const posts = await Posts.findById(id)
        if (!posts) {
            res.status(404).json({ message: "The post with the specified ID does not exist" })
        }
        else if (!title || !contents) {
            res.status(400).json({ message: "Please provide title and contents for the post" })
        } 
        else {
            const data = await Posts.update(id, { title, contents })
            .then((postData) => {
                if (postData) {
                  return Posts.findById(req.params.id, req.body);
                }
              })
              .then((morePostData) => {
                if (morePostData) {
                  res.json(morePostData);
                }
              })
            res.status(200).json(data)
            
        }
    } catch (error) {
      res.status(500).json({ message: "The post information could not be modified" })
    }
  })
// [DELETE] /api/posts/:id
router.delete("/:id", async (req, res) => {
    try {
      const post = await Posts.findById(req.params.id);
      if (!post) {
        res.status(404).json({ message: "The post with the specified ID does not exist" });
      } else {
        await Posts.remove(req.params.id);
        res.status(200).json(post);
      }
    } catch (error) {
      res
        .status(500).json({ message: "The post could not be removed"});
    }
  })
// [GET] /api/posts/:id/comments

router.get("/:id/comments", async (req, res) => {
    try {
      const postId = await Posts.findById(req.params.id);
      const posts = await Posts.findPostComments(req.params.id);
  
      if (!postId) {
        res.status(404).json({ message: "The post with the specified ID does not exist" });
      } else {
        res.status(200).json(posts);
      }
    } catch (error) {
      res.status(500).json({ message: "The comments information could not be retrieved" });
    }
  });











module.exports = router