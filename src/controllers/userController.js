import jwt from "jsonwebtoken"
import bcrypt from "bcrypt";
import { validationResult } from "express-validator";

import UserModel from "../models/user.js"

export const registor = async (req, res) => {
    try {
      const errors = validationResult(req);
  
      if (!errors.isEmpty()) {
          return res.status(400).json(errors.array());
      }
  
      const { name, email, password} = req.body;

        const filterEmail = await UserModel.find({email:email})
      
        if (!filterEmail.length) {
            const salt = await bcrypt.genSalt(10);
            const passwordHash = await bcrypt.hash(password, salt);
            
            const doc = new UserModel({
                name: name,
                email: email,
                passwordHash: passwordHash
            })
            const user = await doc.save()
        
            const token = jwt.sign(
                {
                    _id: user._id,
                },
                    "secretno",
                {
                    expiresIn:"30d"
                }
            )
                
            res.send({user,token})
        } else {
            res.send({
                status: 404,
                message: "email is already authorized"
            })
        }

       
    } catch (error) {
        res.status(500).send({
            status: 500,
            message: "Registration failed "
        });
    }
}

export const login = async(req, res) => {
    try {
        const user = await UserModel.findOne({email: req.body.email})
        

        if (!user) {
            return res.status(404).send({
                status: 404,
                message: 'User is not found'
            });
        }
        const isValidpass =await bcrypt.compare(req.body.password, user.passwordHash)


        if (!isValidpass) {
            return res.status(400).json({
                message: "Invalid password or login"
            });
        }

        
        const token = jwt.sign(
            {
                _id: user._id,
            },
            "secretno",
            {
                expiresIn:"30d"
            }
        )

        res.send({user,token})

    } catch (error) {
        console.log(error)
        res.status(400).send({
            status: 400,
            message: "Not authention"
        });
    }
}

export const getUser  =  async(req, res) => {
    try {
        const user = await UserModel.find()
        
        if (!user) {
            return res.status(404).send({
               message:'User is not found'
           }) 
        }
      
        res.send( {user})
    } catch (error) {
        res.status(500).json({
            message:"No access"
        })
    }
}

export const getMe  =  async(req, res) => {
    try {
        const user = await UserModel.findById(req.userId) 
        
        if (!user) {
            return res.status(404).send({
               message:'User is not found'
           }) 
        }
      
        res.send( {user})
    } catch (error) {
        res.status(500).json({
            message:"No access"
        })
    }
}
export const updateUser = async (req, res) => {
    try {
        const userId = req.params.id
        
        await UserModel.findByIdAndUpdate(
            {
                _id:userId,
            }, {
                blocked: true
            }
        )
        res.json({
            success:true
        })

    } catch (error) {
        console.log(error)
        res.status(500).send({
            status: 500,
            message: "Failed to update"
        });
    }
};
export const ublockUser = async (req, res) => {
    try {
        const userId = req.params.id
        
        await UserModel.findByIdAndUpdate(
            {
                _id:userId,
            }, {
                blocked: false
            }
        )
        res.json({
            success:true
        })

    } catch (error) {
        console.log(error)
        res.status(500).send({
            status: 500,
            message: "Failed to update"
        });
    }
};

export const removePost = async (req, res) => {
    try {   
        const userId = req.params.id

        UserModel.findByIdAndRemove(
            {
                _id:userId,
            },
            (err, doc) => {
                if (err) {
                    console.log(error)
                    return res.status(500).send({
                        status: 500,
                        message: "Unable to remove article"
                    });
                }
                if(!doc){
                    return res.status(404).json({
                        message:"Article not found"
                    })
                }
                res.send({
                    seccess: true
                })
            }
        )

    } catch (error) {
        console.log(error)
        res.status(500).send({
            status: 500,
            message: "Failed to delete"
        });
    }
}
export const removeAll = async (req, res) => {
    try {   
      (await UserModel.find()).map(e => {
            if (e.id !== req.userId) {
                 UserModel.findByIdAndDelete({
                    _id:e.id,
                },
                (err, doc) => {
                    if (err) {
                        console.log(error)
                        return res.status(500).send({
                            status: 500,
                            message: "Unable to remove article"
                        });
                    }
                    if(!doc){
                        return res.status(404).json({
                            message:"Article not found"
                        })
                    }
                    res.send({
                        seccess: true
                    })
                })
            }
        })
    
    } catch (error) {

        res.status(500).send({
            status: 500,
            message: "Failed to delete"
        });
    }
}
export const BlockAll = async (req, res) => {
    try { 
        let idArr = [];
        (await UserModel.find()).forEach(e => {
          console.log(e.id,req.userId)
          if (e.id !== req.userId) {
                idArr.push(e.id)
          }
        })
        await UserModel.updateMany({_id: {$in: idArr}}, 
            {blocked: true}
        )
        res.json({
            success:true
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            status: 500,
            message: "Failed to Blocked"
        });
    }
}