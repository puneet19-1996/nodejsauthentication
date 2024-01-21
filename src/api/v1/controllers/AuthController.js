//----------- Import the packages from packages, use to make strong apis -------X
const bcrypt = require('bcryptjs'); //Convert password into hash
const jwt = require('jsonwebtoken'); // Tokenized our users

//-------------- Model Specific Stuff
const UserModel = require('../models/UsersModel'); //User modal

//------------------ Creating the AuthControllers to authenticate the users -----------X
function AuthController() {

    return {

        // Register the users, using POST '/api/user/register'
        async Register(req, res) {

            try {
                //--------- Req.body content
                const { name, email, password, cpassword } = req.body;

                //Requring all the specific fields
                if (!name || !email || !password || !cpassword) { 
                    return res.status(404).json({ success: false, msg: "All fields are required" }) 
                };

                if (password.length < 8 || cpassword.length < 8){
                    // return res.status(404).json({ success: false, msg: "Password & Confirm password must be 8 char long" })

                    return res.redirect('/register.html');
                }
                  

                //check password and confirm password match
                if (password !== cpassword) {
                    //  return res.status(404).json({ success: false, msg: "Password and ConfrimPassword did not match" }) 
                    return res.redirect('/register.html');
                    };

                // Check the user is already register
                let users = await UserModel.findOne({ email })
                if (users) { 
                    // return res.status(401).json({ success: false, msg: "this crenditentals's user is already exist" }) 
                    return res.redirect('/register.html')
                };

                //Converting the password into hash
                let hashPassword = await bcrypt.hash(password, 10);

                //Register the users
                users = await UserModel({
                    name,
                    email,
                    password: hashPassword
                })
                await users.save();

                // return res.status(200).json({ success: true, msg: 'You are successfully register', users });
                return res.redirect('/')

            } catch (error) { 
                return res.redirect('/register.html');
                // return res.status(500).json({ success: false, msg: `${error.message}` }); 
            }
        },

        // Login the users, using POST '/api/user/login'
        async Login(req, res) {
            try {
                //--------- Req.body content
                const { email, password } = req.body;

                //Requring all the specific fields
                if (!email || !password) { return res.status(404).json({ success: false, msg: "All fields are required" }) };

                // Check the user is not already register
                let users = await UserModel.findOne({ email })
                if (!users) { 
                    // return res.status(401).json({ success: false, msg: "Your crenditentals is not correct" }) 
                    return res.redirect('/register.html')
                };

                //Comparing the password of register and login user
                let hashPassword = await bcrypt.compare(password, users.password)
                if (!hashPassword) { 
                    // return res.status(404).json({ success: false, msg: "Your credentials not correct" }) 
                    return res.redirect('/register.html')

                }

                // Now create the token to authorizing the users
                const payloads = {
                    user: { id: users._id }
                }
                const Secret_Key = process.env.JWT_SECRET_KEY;

                const token = await jwt.sign(payloads, Secret_Key, { expiresIn: '10d' })

                // return res.status(200).json({ success: true, msg: 'You are successfully login', token });
                return res.redirect('/home.html')


            } catch (error) {
                //  return res.status(500).json({ success: false, msg: error }); 
                return res.redirect('/')

                }
        },

        // Get the info of login user, using GET '/api/user/getUser'
        async getUser(req, res) {
            try {
                const user = req.user;

                return res.status(200).json({ success: true, msg: `Welcome back ${req.user.name}`, user });

            } catch (error) { return res.status(500).json({ success: true, msg: error }); }
        },

        // Get the info of login user, using GET '/api/user/getUser'
        async Logout(req, res) {
            try {
                req.header('auth-token') = null;
                return res.redirect('/');
                
            } catch (error) { return res.status(500).json({ success: true, msg: error }); }
        },


    }
}

module.exports = AuthController;