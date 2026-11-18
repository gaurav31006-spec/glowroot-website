import mongoose from 'mongoose';

const PortfolioSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      enum: ['Bridal', 'Engagement', 'Reception', 'Cocktail', 'Party'],
      default: 'Bridal',
    },
    image: {
      type: String,
      required: true,
    },
    caption: {
      type: String,
      trim: true,
      default: '',
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    clientName: {
      type: String,
      trim: true,
      default: '',
    },
    order: {
      type: Number,
      default: 0,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Portfolio = mongoose.models.Portfolio || mongoose.model('Portfolio', PortfolioSchema);
export default Portfolio;
