import fetch from "node-fetch";
import passport from "passport";
import GitHubStrategy from "passport-github2";
import local from "passport-local";
import { UserModel } from "../dao/models/users.model.js";
import { isValidPassword } from "../utils/bcrypt.js";
const LocalStrategy = local.Strategy;

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
				console.log(profile);
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
						const newUser = {
							email: profile.email,
                            firstName: profile._json.name || profile._json.login || "noname",
                            lastName:profile._json.name || profile._json.login || "noname",
							userName: profile._json.login || profile._json.name || "noname",
							role: "user",
							password: "nopass",
						};
						let userCreated = await UserModel.create(newUser);
						console.log("User Registration succesful");
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
	
	passport.use('login',new LocalStrategy({usernameField:'email'},async(username,password,done)=>{
		try{
			let user = await UserModel.findOne({ email: username });

			if(!user){
				console.log("user doesnt exist");
				return done(null,false);
			}
			else{
				if(!isValidPassword(user,password)){
					return done(null,user);
				}
			}
		}catch(e){
			return done(e);
		}
	}));

	
	passport.serializeUser((user, done) => {
		done(null, user._id);
	});

	passport.deserializeUser(async (id, done) => {
		let user = await UserModel.findById(id);
		done(null, user);
    });
}
