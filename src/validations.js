import {body} from "express-validator";


export const loginValidation = [
    body("email").isEmail(),
    body("password").isLength({ min: 1 }),
];
export const registerValidation = [
    body("email").isEmail(),
    body("name").isLength({ min: 1 }),
    body("password").isLength({ min: 1 })
];


