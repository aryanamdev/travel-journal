// Entry Schema
import mongoose, { Schema, Document } from "mongoose";

export interface ImageMeta {
url: string;
public_id?: string;
width?: number;
height?: number;
caption?: string;
}

export interface GeoPoint {
type: "Point";
coordinates: [number, number];
}

export interface IEntry extends Document {
title: string;
journalId: mongoose.Types.ObjectId;
authorId: mongoose.Types.ObjectId;
content: string;
mood?: string;
weather?: string;
location?: GeoPoint | null;
images: ImageMeta[];
isPublic: boolean;
tags?: string[];
createdAt: Date;
updatedAt: Date;
}

const ImageSchema = new Schema<ImageMeta>({
url: { type: String, required: true },
public_id: String,
width: Number,
height: Number,
caption: String,
});

const EntrySchema = new Schema<IEntry>(
{
    title: { type: String, required: true },
    journalId: { type: Schema.Types.ObjectId, ref: "Journal", required: true },
    authorId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, default: "" },
    mood: String,
    weather: String,
    location: {
        type: {
            type: String,
            enum: ["Point"],
            default: "Point",
        },
    coordinates: {
    type: [Number],
    validate: (v: number[]) => Array.isArray(v) && v.length === 2,
},
},
images: { type: [ImageSchema], default: [] },
isPublic: { type: Boolean, default: false },
tags: { type: [String], default: [] },
},
{ timestamps: true }
);


EntrySchema.index({ location: "2dsphere" });


export default mongoose.models.Entry || mongoose.model<IEntry>("Entry", EntrySchema);