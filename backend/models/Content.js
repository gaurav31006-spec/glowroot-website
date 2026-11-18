import mongoose from 'mongoose';

const TestimonialSchema = new mongoose.Schema({
  clientName: { type: String, required: true },
  eventType: { type: String, required: true },
  reviewText: { type: String, required: true },
  rating: { type: Number, default: 5 },
  date: { type: String, default: '' },
  avatar: { type: String, default: '' },
});

const ContentSchema = new mongoose.Schema(
  {
    heroHeading: {
      type: String,
      default: 'Where Every Bride Finds Her Glow',
    },
    heroSubtitle: {
      type: String,
      default: 'Bespoke luxury bridal makeup artistry crafted to celebrate your natural beauty, timeless radiance, and unforgettable moments.',
    },
    heroImage: {
      type: String,
      default: '',
    },
    aboutHeading: {
      type: String,
      default: 'The Artist Behind Your Glow',
    },
    aboutName: {
      type: String,
      default: 'Ishita',
    },
    aboutStory: {
      type: String,
      default: 'Hi, I am Ishita. For me, bridal makeup is never about masking who you are; it is about bringing forward your most luminous, confident, and breathtaking self. With a specialized focus on bespoke bridal transformations, contemporary fusion aesthetics, and editorial precision, I craft signature looks designed to photograph flawlessly while feeling weightless and natural in person.',
    },
    aboutPhilosophy: {
      type: String,
      default: 'Skin-first, dewy, and enduring. I believe in listening deeply to each bride’s personal aesthetic, outfit nuances, and jewelry styling to create an organic balance between traditional regal grandeur and modern effortless elegance.',
    },
    aboutExperience: {
      type: String,
      default: 'Over 6+ years of specialized bridal artistry with 450+ happy brides across premier wedding destinations in India and abroad. Trained under internationally celebrated master artists and certified in high-definition airbrush and bridal hair architecture.',
    },
    aboutWhyTrust: {
      type: String,
      default: '100% premium luxury kit (Dior, Charlotte Tilbury, NARS, Tom Ford, Chanel, MAC), obsessive hygiene protocols, personalized pre-bridal consultation, and an unflappable calming presence on your special wedding morning.',
    },
    aboutImage: {
      type: String,
      default: '',
    },
    phone: {
      type: String,
      default: '+91 98765 43210',
    },
    whatsapp: {
      type: String,
      default: '+919876543210',
    },
    email: {
      type: String,
      default: 'ishita@glowroot.in',
    },
    instagramHandle: {
      type: String,
      default: '@glowroot.by.ishita',
    },
    instagramUrl: {
      type: String,
      default: 'https://instagram.com/glowroot.by.ishita',
    },
    businessAddress: {
      type: String,
      default: 'Studio Glowroot, Suite 402, Rosewood Avenue, Greater Kailash II, New Delhi, India',
    },
    googleMapsEmbedUrl: {
      type: String,
      default: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14019.539276495537!2d77.23485!3d28.5432!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390ce3c4b1b369c7%3A0x8673a55e2e3895e7!2sGreater%20Kailash%20II%2C%20New%20Delhi%2C%20Delhi!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin',
    },
    availabilityNotice: {
      type: String,
      default: 'Now taking bridal bookings for the 2026 – 2027 Wedding Season. Limited wedding dates available per month to maintain bespoke quality.',
    },
    stats: {
      bridesStyled: { type: String, default: '450+' },
      yearsExperience: { type: String, default: '6+' },
      clientSatisfaction: { type: String, default: '100%' },
      destinationWeddings: { type: String, default: '35+' },
    },
    testimonials: [TestimonialSchema],
    instagramPosts: [
      {
        caption: { type: String, default: '' },
        image: { type: String, required: true },
        likes: { type: String, default: '1.2k' },
        link: { type: String, default: 'https://instagram.com/glowroot.by.ishita' },
      },
    ],
  },
  { timestamps: true }
);

const Content = mongoose.models.Content || mongoose.model('Content', ContentSchema);
export default Content;
