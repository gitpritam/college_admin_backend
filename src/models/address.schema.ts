import mongoose from "mongoose";
import type { IAddress } from "../@types/interface/schema/address.interface";

const AddressSchema = new mongoose.Schema<IAddress>({
  address: {
    type: String,
    required: [true, "Address is required."],
    trim: true,
    minlength: [10, "Address must be at least 10 characters."],
    maxlength: [250, "Address must be at most 250 characters."],
  },
  district: {
    type: String,
    required: true,
    trim: true,
  },
  state: {
    type: String,
    required: true,
    trim: true,
  },
  country: {
    type: String,
    required: true,
    trim: true,
  },
  pincode: {
    type: String,
    required: true,
    minlength: [6, "Pincode should be 6 character long"],
    maxlength: [6, "Pincode should be 6 character long"],
  },
});

export default AddressSchema;
