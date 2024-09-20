import mongoose, { Schema, Types } from "mongoose";

const orderSchema = new Schema({
    userId : {
        type: Types.ObjectId,
        ref: "User",
        required: true
    },
    address : {type : String , required : true},
    phoneNumber : {type : String , required : true},
    products : [{
        productId : {
            type : Types.ObjectId,
            ref : "Product",
            required : true
        },
        quantity : {type : Number , required : true},
        price : {type : Number , required : true},
        finalPrice : {type : Number , required : true}
    }],
    finalPrice : {type : Number , required : true},
    paymentMethod : {type : String ,default:'Card', enum:['Cash' , 'Card'] ,required : true},
    status : {type : String ,default:'Pending', enum:['Pending' , 'Accepted' ,'Delivered' , 'Cancelled'] ,required : true},
    couponId : {
        type : Types.ObjectId,
        ref : "Coupon"
    },
    createdBy : {
        type : Types.ObjectId,
        ref : "User"
    },
    updatedBy : {
        type : Types.ObjectId,
        ref : "User"
    },
    note : String,
})

const orderModel = mongoose.models.Order || mongoose.model("Order", orderSchema);
export default orderModel;