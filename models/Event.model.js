const { Schema, model } = require("mongoose");

const eventSchema = new Schema(
    {
        name: {
            type: String,
            required: [true, "Name is required."],
            trim: true,
        },
        owner: {
            ref: "user",
            type: Schema.Types.ObjectId,
        },
        description: {
            type: String,
            required: [true, "Description is required."],
            trim: true,
        },
        address: {
            type: String,
            required: [true, "Address is required."],
            trim: true,
        },
        country: {
            type: String,
            required: [true, "Country is required."],
            trim: true,
        },
        city: {
            type: String,
            required: [true, "City is required."],
            trim: true,
        },
        images: [
            {
                type: String,
                trim: true,
                required: [true, "Image is required."],
            },
        ],
        price: {
            type: Number,
            trim: true,
            required: [true, "Price is required."],
        },
        date: {
            type: Date,
            required: [true, "Date is required."],
            trim: true,
        },
        hosts: [
            {
                type: String,
                trim: true,
                required: [true, "At least one host is required."],
            },
        ],
    },
    {
        timestamps: true,
    }
);

const Event = model("event", eventSchema);

module.exports = Event;
