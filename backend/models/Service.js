import mongoose from 'mongoose';

const ServiceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      trim: true,
    },
    category: {
      type: String,
      enum: ['Bridal', 'Engagement', 'Reception', 'Cocktail', 'Party', 'Other'],
      default: 'Bridal',
    },
    shortDescription: {
      type: String,
      required: true,
      trim: true,
    },
    fullDescription: {
      type: String,
      trim: true,
    },
    startingPrice: {
      type: Number,
      default: null,
    },
    priceNote: {
      type: String,
      default: 'Price on consultation / customizable based on venue and requirements',
    },
    duration: {
      type: String,
      default: '2.5 - 3.5 Hours',
    },
    includes: {
      type: [String],
      default: [],
    },
    image: {
      type: String,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const Service = mongoose.models.Service || mongoose.model('Service', ServiceSchema);
export default Service;
