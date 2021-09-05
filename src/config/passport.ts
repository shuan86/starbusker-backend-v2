import passport from "passport";
import passportLocal from "passport-local";
import { login, loginByAccountPasswd } from "../repositories/memberRepo";
import { plainToClass, Expose } from "class-transformer";
import { validate } from "class-validator";
import { LoginType } from '../entities/Member'

const LocalStrategy = passportLocal.Strategy;
// passport.use('login', new LocalStrategy({
//     passReqToCallback: true
// },
//     async (req, username, password, done) => {
//         const encryptData = req.body.encryptData
//         console.log('data:', req.body.encryptData);
//         done(null, encryptData);

//     }))

passport.use('login', new LocalStrategy({
    usernameField: "account",
    passwordField: 'password',
},
    async (account, password, done) => {
        const result = await loginByAccountPasswd(account, password)
        return done(null, result, { message: '123' })
    }
));
// passport.use('login', new LocalStrategy({
//     usernameField: "account",
//     passwordField: 'password',
// },
//     async (account, password, done) => {
//         // const encryptData = req.body.encryptData

//         // const data = decrypt(encryptData)
//         // const member = plainToClass(LoginType, JSON.parse(data))
//         // const errors = await validate(member, { skipMissingProperties: true })
//         // if (errors.length > 0) {
//         //     return done(errors, '')
//         // } else {
//         //     console.log('member:', member);

//         //     const result = await login(member)
//         //     if (result.status == 200) {
//         //         return done(null, result)
//         //     }
//         //     else if (result.status == 401) {
//         //         return done(null, result)

//         //     }
//         //     else {

//         //     }
//         // }

//         // return done(undefined, true, { message: '123' });
//     }
// ));
// passport.use(new LocalStrategy({ usernameField: "account", passwordField: 'password' }, (account, password, done) => {

//     return done(undefined, true, { message: Email ${account} not found. });
// }));

export default passport