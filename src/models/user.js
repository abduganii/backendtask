import mongoose from "mongoose"


const userSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        passwordHash: {
            type: String,
            required: true,
        },
        blocked: {
            type: Boolean,
            default:false
        }
    },
    {
        timestamps: true
    },
);
export default mongoose.model('Users', userSchema);