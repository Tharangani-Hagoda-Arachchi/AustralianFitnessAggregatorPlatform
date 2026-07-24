import mongoose from "mongoose";
//time table schema
const timeTableSlotSchema = new mongoose.Schema({
    day: {
        type: String,
        enum: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        require: true,
    },
    open: {
        type: String,
        require: true,
    },
    close: {
        type: String,
        require: true,
    },

},
    { _id: false }
);

//create user schema
const gymSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true,
        trim: true,
        minlength: 2,
        maxlength: 100,
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        require: true,

    },
    description: {
        type: String,
        maxlength: 2000,
    },
    location: {
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point',
        },
        coordinates: {
            type: [Number], // [longitude, latitude]
            required: true,
        },
    },
    address: {
        street: String,
        suburb: String,
        state: {
            type: String,
            enum: ['NSW', 'VIC', 'QLD', 'WA', 'SA', 'TAS', 'ACT', 'NT'],
        },
        postcode: String,
    },

    facilities: [{
        type: String,
        trim: true,
    }],

    images: [{
        url: { type: String, required: true },
        caption: String,
    },],

    timetable: [timeTableSlotSchema],

    capacity: {
        type: Number,
        default: 50,
        min: 1,
    },

    pricePerVisit: {
        type: Number,
        default: 0,
    },

    rating: {
        average: { type: Number, default: 0, min: 0, max: 5 },
        count: { type: Number, default: 0 },
    },

    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected', 'suspended'],
        default: 'pending', 
    },

    isActive: {
        type: Boolean,
        default: true,
    },

}, {
    timestamps: true,
}

);


export const Gym = mongoose.model("Gym", gymSchema);