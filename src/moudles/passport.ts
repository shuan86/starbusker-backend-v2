import passport from "passport";
import passportLocal from "passport-local";
import { getIdByAccount, loginByAccountPasswd} from "../repositories/memberRepo";
const LocalStrategy = passportLocal.Strategy;
passport.serializeUser((id:number, done) => {
    console.log('serializeUser:',id);
    //req.login 可以觸發 serializeUser
    // 只將用戶 id 序列化存到 session 中
      done(null, id)
  })
  passport.deserializeUser(async(id:number, done) => {
    // 使用者 id 會存在req.user
    done(null,id)
  })

passport.use('login', new LocalStrategy({
    usernameField: "account",
    passwordField: 'password',
    passReqToCallback:true
},
    async (req,account, password, done) => {
        const result = await loginByAccountPasswd(account, password)
        if(result.status==200){
            const member=await getIdByAccount(account)
            req.login(member, (err)=> { // I added req.login() here and now deserializeUser is being called and req.user is being set correctly.
                if(err){
                    console.error('err:',err);
                }
            });
           
            return done(null, result)
        }
        return done(null, false)

    }
));
export default passport