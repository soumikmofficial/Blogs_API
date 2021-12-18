const mongoose = require("mongoose");
const LikeSchema = new mongoose.Schema({
  blog: {
    type: mongoose.Schema.ObjectId,
    ref: "Blog",
    required: true,
  },
  user: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

LikeSchema.index({ blog: 1, user: 1 }, { unique: true });

LikeSchema.statics.calcNumOfLikes = async function (blogId) {
  const result = await this.aggregate([
    {
      $match: {
        blog: blogId,
      },
    },
    {
      $group: {
        _id: null,
        numOfLikes: {
          $sum: 1,
        },
      },
    },
  ]);
  console.log(result);

  try {
    await this.model("Blog").findOneAndUpdate(
      { _id: blogId },
      { numOfLikes: result[0]?.numOfLikes || 0 }
    );
  } catch (error) {
    console.log(error);
  }
};

LikeSchema.post("save", async function () {
  await this.constructor.calcNumOfLikes(this.blog);
});

LikeSchema.post("remove", async function () {
  await this.constructor.calcNumOfLikes(this.blog);
});

module.exports = mongoose.model("Like", LikeSchema);
