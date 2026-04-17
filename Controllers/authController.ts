
import AppError from "../Model/AppError.js";
import UserModel from "../Model/users.js";
import type { Request, Response, NextFunction } from "express";

export const home = (req: Request, res: Response) => {
    // console.log(req.body)
    try {
        res.status(200).json({ msg: 'home page is working', data: req.body });
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: "Server error" });
    }
};

type SignupBody = {
    name: string;
    email: string;
    password: string;
};

export const signup = async (req: Request<{}, {}, SignupBody>, res: Response, next: NextFunction) => {

    try {
        // console.log(req.body)

        const { name, email, password } = req.body

        const userExist = await UserModel.findOne({ email })

        if (userExist) {
            return res.status(400).json({ msg: 'user already exist' })
        }


        // if (userExist) {
        //     return next(new AppError("User already exists", 400));
        // }

        const userCreated = await UserModel.create({ name, email, password })

        res.status(201).json({ msg: "SignUp Successful", token: await userCreated.generateToken(), userId: userCreated._id.toString() })
    } catch (error) {
        console.log(error)
        return next(new AppError("Internal Server Error", 500));
    }
}

type LoginBody = {
    email: string;
    password: string;
};
export const logIn = async (req: Request<{}, {}, LoginBody>, res: Response, next: NextFunction) => {

    try {
        const { email, password } = req.body;
        const userExist = await UserModel.findOne({ email })
        // if (!userExist) {
        //     return res.status(400).json({ message: "User does NOT exist" })
        // }

        if (!userExist) {
            return next(new AppError("User does NOT exist", 400));
        }
        const isPasswordValid = await userExist.comparePassword(password)

        // if (isPasswordValid) {
        //     res.status(201).json({ msg: "logIn Successful", token:userExist.generateToken(), userId: userExist._id.toString() })
        // } else {
        //     // res.status(400).json({ message: "Invalide Password and Email" })
        //      return next(new AppError("Invalid credentials", 400));
        // }

        if (!isPasswordValid) {
            return next(new AppError("Invalid credentials", 400));
        }

        res.status(200).json({
            msg: "logIn Successful",
            token: userExist.generateToken(),
            userId: userExist._id.toString(),
        });

    } catch (error) {
        console.log("ERROR 👉", error);
        // res.status(200).json({ message: "Internal server error" })
        return next(new AppError("Internal Server Error", 500));
    }


}


// module.exports = { home, signup, logIn }