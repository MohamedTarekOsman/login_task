const mongoose=require('mongoose')
const validator=require('validator')
const bycryptjs=require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    trim: true,
    minlength: 8,
    validate(value){
      let password =new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])');
      if(!password.test(value)){
          throw new Error('password must include upper_case, lower_case, number, special_character');
      }
    }
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    unique: true,
    validate(val) {
      if (!validator.isEmail(val)) {
        throw new Error("Email is invalid!");
      }
    },
  },
  age: {
    type: Number,
    default: 18,
    validate(val) {
      if (val <= 0) {
        throw new Error("age must be positive!");
      }
    },
  },
  city: {
    type: String,
  },
});

userSchema.pre("save",async function(){
    const user=await this;
    console.log(user);
    if(user.isModified("password")){
        user.password=await bycryptjs.hash(user.password,8);
    }
})
///////////////////////////////////////////////////////////////
////////////////////////login//////////////////////////////////

userSchema.statics.findByCredentials=async (em,pass)=>{
  const user= await User.findOne({email:em});
  console.log(user);
  if(!user){
    throw new Error('Unable to Login');
  }
  console.log(user);
  const isMatch = await bycryptjs.compare(pass, user.password);

  if(!isMatch){
    throw new Error("Unable to Login");
  }
  return user;

}




/////////////////////////////////////////////////////////////
const User = mongoose.model("User", userSchema);

module.exports=User