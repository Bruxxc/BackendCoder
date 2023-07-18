import fetch from "node-fetch";
import passport from "passport";
import GitHubStrategy from "passport-github2";
import local from "passport-local";
import { UserModel } from "../dao/models/users.model.js";
import { createHash } from "../utils/bcrypt.js";
import { isValidPassword } from "../utils/bcrypt.js";
import { MDBCartManager } from "../dao/MDBManagers/MDBCartManager.js";
import { CartModel } from "../dao/models/carts.model.js";

const LocalStrategy = local.Strategy;

const CartManager= new MDBCartManager();

export function iniPassport() {
	passport.use(
		"github",
		new GitHubStrategy(
			{
				clientID: "Iv1.605ab076a5c92dc7",
				clientSecret: "52cd06469228744f203de7c1d8dedf7cd6e5db26",
				callbackURL: "http://localhost:8080/views/sessions/githubcallback",
			},
			async (accesToken, _, profile, done) => {
				try {
					const res = await fetch("https://api.github.com/user/emails", {
						headers: {
							Accept: "application/vnd.github+json",
							Authorization: "Bearer " + accesToken,
							"X-Github-Api-Version": "2022-11-28",
						},
					});
					const emails = await res.json();
					const emailDetail = emails.find((email) => email.verified == true);
					if (!emailDetail) {
						return done(new Error("cannot get a valid email for this user"));
					}
					profile.email = emailDetail.email;

					let user = await UserModel.findOne({ email: profile.email });
					if (!user) {
						const newCart = await CartModel.create({});
						console.log("Nuevo carrito:", newCart);
						const newUser = {
							email: profile.email,
                            firstName: profile._json.name || profile._json.login || "noname",
                            lastName:profile._json.name || profile._json.login || "noname",
							userName: profile._json.login || profile._json.name || "noname",
							age:null,
							role: "user",
							password: "nopass",
							cart: newCart._id
						};
						
						let userCreated = await UserModel.create(newUser);
						console.log("User registration succesful");
						return done(null, userCreated);
					} else {
						console.log("User already exists");
						console.log("user",user);
						return done(null, user);
					}
				} catch (e) {
					console.log("Error en auth github");
					console.log(e);
					return done(e);
				}
			}
		)
	);
	
	passport.use('login',new LocalStrategy({usernameField:'email'},async(email,password,done)=>{
		try{
			let user = await UserModel.findOne({ email: email });
			console.log(email,password);
			console.log(user);
			if(!user){
				console.log("user doesnt exist");
				return done(null,false);
			}
			else{
				if(!isValidPassword(password,user.password)){
					return done(null,false);
				}

				else{
					return done(null,user);
				}
			}
		}catch(e){
			return done(e);
		}
	}));

	passport.use('register', new LocalStrategy(
		{ passReqToCallback: true, usernameField: 'email' },
		async (req, email, password, done) => {
		  const { firstName, lastName, age, userName } = req.body;
		  try {
			let user = await UserModel.findOne({ email: email });
			let user2 = await UserModel.findOne({ userName: userName });
	  
			if (user) {
			  console.log("Email already in use");
			  return done(null, false, { message: 'Email already in use' });
			} else if (user2) {
			  console.log("Username already in use");
			  return done(null, false, { message: 'Username already in use' });
			} else {
			  console.log("creating user...");	
			  const newCart = await CartModel.create({});
			  console.log("Nuevo carrito:", newCart);
			  console.log(firstName,lastName,age,userName,email,password);	
			  const hashedpwd=createHash(password);
			  const newUser = await UserModel.create({
				firstName: firstName,
				lastName: lastName,
				age: age,
				userName: userName,
				email: email,
				password: hashedpwd,
				cart: newCart._id
			  });
			  
			  console.log(newUser);
			  console.log("Registro de usuario exitoso");
			  return done(null, newUser);
			}
		  } catch (e) {
			return done(e);
		  }
		}
	  ));


	passport.serializeUser((user, done) => {
		done(null, user._id);
	});

	passport.deserializeUser(async (id, done) => {
		let user = await UserModel.findById(id);
		done(null, user);
    });
}
