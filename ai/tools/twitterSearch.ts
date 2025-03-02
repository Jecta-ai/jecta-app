import axios from "axios";
import { queryOpenRouter } from "../ai";

const INJECTIVE_TWITTER_URL = process.env.INJECTIVE_TWITTER_URL;
const BEARER_TOKEN = process.env.BEARER_TOKEN;
const MAX_POSTS = process.env.MAX_POSTS;

export const fetchInjectiveTweets = async (): Promise<string> => {
  try {
    if (BEARER_TOKEN == null){
      return "You need to replace your X Bearer token to get news about Injective. No Bearer Token (API KEY) found !"
    }
    if (INJECTIVE_TWITTER_URL == null){
      return "No INJECTIVE_TWITTER_URL found !"
    }
    const userResponse = await axios.get(INJECTIVE_TWITTER_URL, {
      headers: { Authorization: `Bearer ${BEARER_TOKEN}` },
    });

    const userId = userResponse.data.data.id;
    if (!userId) throw new Error("Injective Twitter ID not found.");

    const tweetsResponse = await axios.get(
      `https://api.twitter.com/2/users/${userId}/tweets?max_results=${MAX_POSTS}&tweet.fields=created_at,text`,
      { headers: { Authorization: `Bearer ${BEARER_TOKEN}` } }
    );

    const tweets = tweetsResponse.data.data;
    if (!tweets || tweets.length === 0) return "No recent tweets found.";

    const tweetTexts = tweets.map((t: any) => `- ${t.text}`).join("\n");

    const aiSummary = await queryOpenRouter(
      `Summarize these latest tweets from Injective's official Twitter:\n${tweetTexts}`,
      []
    );
    if(!aiSummary){
      return "Couldn't load AI keys, Please ensure you correctly implemented correct keys on your .env file"
    }

    return `📢 **Latest Injective Updates:**<br>${aiSummary.replace(/\d+\.\s/g, "<br>")}`;

  } catch (error:any) {
    if (error.response?.status === 429) {
      return "⚠️ Unable to fetch Injective news at the moment. It seems your API key rate limit is exceeded. Please bear with me and wait for a little for your API cooldown.";
    }else{
    return "⚠️ Unable to fetch Injective news at the moment.";
    }
    
  }
};
