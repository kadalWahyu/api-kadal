/**
 * AuthController
 *
 * @description :: Server-side logic for managing Auths
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {



  /**
   * `AuthController.login()`
   */
  login: function (req, res) {
    let email = req.param('email'),
    password = req.param('password');
    if(!email) {
      return res.badRequest({err : 'invalid email'});
    }
    if(!password){
      return res.badRequest({err : 'invalid password'});
    }

    const loginReq = async () => {
      //find user by email
      const user = await User.findOne({
        email
      });
      // check is password matched
      const isMatched = await User.checkPassword(password,user.password)

      if(!isMatched){
        throw new Error('Your password is not matched');
      }
      let resp = {
        user
      };

      //generate token object
      let token = JwtService.issue({
        user,
        expiresIn: '1d'
      });

      resp.token = token;

      return resp;
      //get the encrypted password for this user
      // return user;
    };
    loginReq()
    .then(user => res.ok(user))
    .catch(err => res.forbidden(err));
    // return res.json({
    //   todo: 'login() is not implemented yet!'
    // });
  },


  /**
   * `AuthController.signup()`
   */
  signup: function (req, res) {
    let firstName = req.param('first_name'),
    lastName = req.param('last_name'),
    email = req.param('email'),
    password = req.param('password');

    if(!firstName) {
      return res.badRequest({err: 'invalid first Name'});
    }
    if(!lastName) {
      return res.badRequest({err: 'invalid last Name'});
    }
    if(!email) {
      return res.badRequest({err: 'invalid email'});
    }
    if(!password) {
      return res.badRequest({err: 'invalid password'});
    }
    const signupRequest = async() =>{
      try {
        const enCpassword = await UltilityService.encryptPassword(password);
       const user = await User.create( {
          first_name: firstName,
          last_name: lastName,
          email,
          password : enCpassword
        });
        return res.ok(user);
      }
      catch (e){
        throw e;
      }
    };
    signupRequest()
    .then(user => res.ok(user))
    .catch(err => res.serverError(err));
    //create user
    // User.create( {
    //   first_name: firstName,
    //   last_name: lastName,
    //   email,
    //   password
    // })
    // .then (user=> {
    //   res.ok(user)
    // })
    // .catch(err => res.serverError(err));
    // return res.json({
    //   todo: 'signup() is not implemented yet!'
    // });
  }
};

