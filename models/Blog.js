const mongoose = require("mongoose");
const BlogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxLength: [80, "Title must be less than 80 characters"],
    },
    content: {
      type: String,
      required: true,
    },
    author: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    numOfLikes: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

BlogSchema.pre("remove", async function () {
  await this.model("Like").deleteMany({ blog: this._id });
});

module.exports = mongoose.model("Blog", BlogSchema);
