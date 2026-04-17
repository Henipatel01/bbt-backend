import bcrypt from 'bcrypt';
import mongoose, { Document } from 'mongoose';
import jwt from 'jsonwebtoken';
const Schema = mongoose.Schema;
interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    isAdmin: boolean;

    generateToken(): string;
    comparePassword(password: string): Promise<boolean>;

}
const userSchema = new Schema<IUser>({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        Unique: true
    },
    password: {
        type: String,
        required: true
    },
    isAdmin: {
        type: Boolean,
        default: false
    }
})

userSchema.pre('save', async function (this: IUser) {
    // console.log('pre',this)
    const user = this
    if (!user.isModified('password')) {
        return;
    }

    try {
        const saltRound = await bcrypt.genSalt(10);
        const hash_Password = await bcrypt.hash(user.password, saltRound)
        user.password = hash_Password

    } catch (error) {
        // return next(error)
        throw error;
    }
})

userSchema.methods.generateToken = function (this: IUser): string {

    try {
        return jwt.sign(
            {
                userId: this._id.toString(),
                email: this.email,
                isAdmin: this.isAdmin,
            },

            process.env.JWT_SECRET_KEY as string,

            {
                expiresIn: "30d"
            }
        )
    } catch (error) {
        console.error("Token Error: ", error);
        throw error;

    }

}

userSchema.methods.comparePassword = async function (this: IUser, password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
};
// {
//     return bcrypt.compare(password, this.password);
// };


const UserModel = mongoose.model('Users', userSchema)
export default UserModel;