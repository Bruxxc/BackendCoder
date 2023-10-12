import fetch from "node-fetch";
import passport from "passport";
import GitHubStrategy from "passport-github2";
import local from "passport-local";
import { createHash } from "../utils/bcrypt.js";
import { isValidPassword } from "../utils/bcrypt.js";
import { MDBCartManager } from "../dao/helpers/MDBManagers/MDBCartManager.js";
import env from "../config/enviroment.config.js";
import { UserService } from "../services/User.service.js";
import { UserDTO_INPUT } from "../dao/dto/user.dto.js";

const LocalStrategy = local.Strategy;
const UService= new UserService;
const CManager= new MDBCartManager();

export function iniPassport() {
	passport.use(
		"github",
		new GitHubStrategy(
			{
				clientID: "Iv1.605ab076a5c92dc7",
				clientSecret: "52cd06469228744f203de7c1d8dedf7cd6e5db26",
				callbackURL: `${env.api_url}/views/sessions/githubcallback`,
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
					let user = await UService.getByEmail(profile.email);
					if (user==undefined) {
						let newUser= new UserDTO_INPUT(profile._json.name,profile._json.name,null,profile._json.login,profile.email,profile.id,"user");
						const createCart=await newUser.initCart();
						let userCreated = await UService.create(newUser);
						console.log("User registration succesful");
						return done(null, userCreated);
					} else {
						console.log("User already exists");
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
			if(email==env.adminEmail){
				let admin= await UService.getByEmail(email);

				if(admin){
					if(!isValidPassword(password,admin.password)){
						return done(null, false);
					}

					else{
						return done (null, admin);
					}
				}

				else{
					const hashedpwd=createHash(env.adminPassword);
					const newCart = await CManager.createCart();
					let createAdmin= await UService.create('ADMIN','CODER',666,'4DM1N',env.adminEmail,hashedpwd,"admin",newCart._id,);
					console.log("ADMIN CREADO::::");
					if(env.adminPassword==password){
						return done(null, createAdmin);
					}

					else{
						return done (null, false);
					}

				}
			}

			else{
				let user = await UService.getByEmail(email);
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
			let user = await UService.getByEmail(email);
			let user2 = await UService.getByUsername(userName);
	  
			if (user || email==env.adminEmail) {
			  console.log("Email already in use");
			  return done(null, false, { message: 'Email already in use' });
			} else if (user2) {
			  console.log("Username already in use");
			  return done(null, false, { message: 'Username already in use' });
			} else {
			  console.log("creating user...");	
			  const newUser= new UserDTO_INPUT(firstName,lastName,age,userName,email,password,"user");
			  const createCart= await newUser.initCart();
			  const userCreated= await UService.create(newUser);		
			  console.log(userCreated);
			  console.log("Register successful");
			  return done(null, userCreated);
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
		let user = await UService.getById(id);
		done(null, user);
    });
}
