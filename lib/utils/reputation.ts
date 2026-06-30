import User from "@/database/user.model";

const REPUTATION_POINTS = {
  ASK_QUESTION: 5,
  ANSWER_QUESTION: 10,
  RECEIVE_UPVOTE: 10,
  RECEIVE_DOWNVOTE: -2,
  GIVE_UPVOTE: 1,
};

export async function adjustReputation(userId: string, points: number) {
  try {
    await User.findByIdAndUpdate(userId, {
      $inc: { reputation: points },
    });
  } catch (error) {
    console.error("Failed to adjust reputation:", error);
  }
}

export { REPUTATION_POINTS };