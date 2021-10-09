import passport from "passport";
import passportLocal from "passport-local";
import { getIdByAccount, loginByAccountPasswd } from "../repositories/memberRepo";
import LineStrategy from "passport-line-auth";
const lineStrategy = LineStrategy.Strategy
import fbStrategy from "passport-facebook";
const FacebookStrategy = fbStrategy.Strategy;
import GoogleStrategy from "passport-google-oauth20";
const googleStrategy = GoogleStrategy.Strategy;
import jwt from 'jsonwebtoken';
import { envSetup } from "../envSetup";
import * as dotenv from 'dotenv'
dotenv.config({ path: envSetup() })

const LocalStrategy = passportLocal.Strategy;
passport.serializeUser((id: number, done) => {
    console.log('serializeUser:', id);
    //req.login 可以觸發 serializeUser
    // 只將用戶 id 序列化存到 session 中
    done(null, id)
})
passport.deserializeUser(async (id: number, done) => {
    // 使用者 id 會存在req.user
    done(null, id)
})

passport.use('login', new LocalStrategy({
    usernameField: "account",
    passwordField: 'password',
    passReqToCallback: true
},
    async (req, account, password, done) => {
        const result = await loginByAccountPasswd(account, password)
        if (result.status == 200) {
            const member = await getIdByAccount(account)
            req.login(member, (err) => { // I added req.login() here and now deserializeUser is being called and req.user is being set correctly.
                if (err) {
                    console.error('err:', err);
                }
            });

            return done(null, result)
        }
        return done(null, false)

    }
));

passport.use(new lineStrategy({
    channelID: process.env.LINE_LOGIN_CHANNEL_ID,
    channelSecret: process.env.LINE_LOGIN_CHANNEL_SECRET,
    callbackURL: process.env.LINE_LOGIN_CALLBACK_URL,
    scope: ['profile', 'openid', 'email'],
    botPrompt: 'normal'
},
    (accessToken, refreshToken, params, profile, cb) => {
        return cb(null, jwt.decode(params.id_token));
    })
);


passport.use(
    new FacebookStrategy(
        {
            clientID: process.env.FB_CLIENT_ID,
            clientSecret: process.env.FB_CLIENT_SECRET,
            callbackURL: process.env.FB_CALLBACK_URL,
            profileFields: ['id', 'displayName', 'photos', 'email', 'gender']
        },
        (accessToken, refreshToken, profile, done) => {
            done(null, {
                name: profile.displayName, email: profile.emails[0].value, picture: profile.photos[0].value
            });
        }
    )
);
passport.use(new googleStrategy({
    clientID: process.env.GOOGLE_KEY,
    clientSecret: process.env.GOOGLE_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL
},
    (token, tokenSecret, profile, done) => {
        console.log(profile);
        done(null, {
            name: profile.displayName, email: profile.emails[0].value, picture: profile.photos[0].value
        });
    }
));
export default passport