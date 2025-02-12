import { fetchInjectiveTweets } from "../tools/twitterSearch";



export async function searchInjectiveNews(intent: string,
    message: string,
    chatHistory: any[],
    addToChat: (msg: any) => void,
    address:string |null) {

        const addMessage = (msg: { sender: string; text: string; type: string; intent: string }) => {
            addToChat(msg);
        };    
        addMessage({
        sender: "ai",
        text: `🔍 Fetching the latest 5 tweets from Injective's official Twitter...`,
        type: "loading",
        intent: intent,
      });

      const summary = await fetchInjectiveTweets();
      
      addMessage({
        sender: "ai",
        text: summary,
        type: "success",
        intent: intent,
      });


    }