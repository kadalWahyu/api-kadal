/**
 * PostController
 *
 * @description :: Server-side logic for managing Posts
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
module.exports = {



  /**
   * `PostController.create()`
   */
  create: function (req, res) {

    let categoryName = req.param('category_name'),
       title = req.param('title'),
       content =req.param('content'),
       userId = req.param('user_id');

       if(!categoryName){
         return res.badRequest({err : 'invalid category_name'});
       }
        if(!title){
         return res.badRequest({err : 'invalid title'});
       }
        if(!content){
         return res.badRequest({err : 'invalid content'});
       }
        if(!userId){
         return res.badRequest({err : 'invalid user_id'});
       }

       Category.create({
         name : categoryName
       })
       .exec( (err,category) => {
         if(err){
           return res.serverError(err);
         }

         Post.create({
           title,
           content,
           _user : userId,
           _category : category.id
         })
         .exec( (err,post) => {
           if(err){
             return res.serverError(err);
           }
           return res.ok({category,post});
         })
       })
  },


  /**
   * `PostController.findOne()`
   */
  findOne: function (req, res) {
   let postId = req.params.id;

   if(!postId) {
     return res.badRequest({err : 'invalid postId'});
   }

   Post.findOne({
     id: postId
   })
   .populate('_category')
   .then(post => {
     res.ok(post);
   })
   .catch(err => res.notFound(err));
  },


  /**
   * `PostController.findAll()`
   */
  findAll: function (req, res) {
    Post.find()
    .populate('_category')
    .then(posts => {
      if(!posts || posts.length === 0){
        throw new Error('No Post Found');
      }
      return res.ok(posts);
    })
    .catch(err => res.notFound(err));
    // return res.json({
    //   todo: 'findAll() is not implemented yet!'
    // });
  },


  /**
   * `PostController.update()`
   */
  update: function (req, res) {
    let postId = req.params.id;

    let post = {};

    let title = req.param('title'),
    content = req.param('content'),
    userId = req.param('user_id'),
    categoryId = req.param('category_id');
    if(title){
      post.title = title;
    }
    if(content) {
      post.content = content;
    }
    if(userId) {
      post._user = userId;
    }
    if(categoryId) {
      post._category = categoryId;
    }

    Post.update({id : postId}, post)
    .then(post => {
      return res.ok(post[0]);
    })
    .catch(err => res.serverError(err));

    // return res.json({
    //   todo: 'update() is not implemented yet!'
    // });
  },


  /**
   * `PostController.delete()`
   */
  delete: function (req, res) {
    let postId = req.params.id;

    if(!postId) {
      return res.badRequest({err: 'invalid request'});
    }

    Post.destroy ({
      id: postId
    })
    .then(post => {
      res.ok(`post has been deleted with id ${postId}`)
    })
    .catch(err => res.serverError(err));
    // return res.json({
    //   todo: 'delete() is not implemented yet!'
    // });
  }
};

