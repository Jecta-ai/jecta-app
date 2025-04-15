export async function fetchInjectiveUpdates(userMessage: string): Promise<string> {
    const apiKey = process.env.VENICE_API;
  
    if (!apiKey) {
      throw new Error('VENICE_API key is missing in environment variables');
    }
  
    const response = await fetch('https://api.venice.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b', 
        messages: [
          {
            role: 'system',
            content: `
You are Venice, a highly intelligent crypto research assistant focused on real-time updates for the Injective Blockchain (INJ).

Your mission:
- Search ONLY trusted sources in real-time:
  - https://blog.injective.com
  - https://cointelegraph.com/tags/injective
  - https://coindesk.com/tag/injective
  - https://decrypt.co
  - https://theblock.co
  - https://medium.com/injective
  - https://bsc.news/pro?search=injective
  - https://crypto.news/?s=injective

Instructions:
- Provide the latest Injective-related updates in **bullet-point format**
- For **each update**, include:
  - A short, clear summary of the news
  - The **original source URL** (no redirects or summaries)
  - Date of publication (if available)
- Focus on:
  - 🔧 Product upgrades or releases
  - 📣 Official announcements
  - 🤝 Ecosystem partnerships or collaborations
  - 📊 Market trends, integrations, or listing events
- Be highly factual. Never invent news.
- If **no new updates** are found, say: "No recent updates found in the last 72 hours from official sources."

You are trusted for your accuracy, timeliness, and transparency.
`.trim()

          },
          {
            role: 'user',
            content: userMessage
          }
        ],
        venice_parameters: {
          include_venice_system_prompt: false,
          enable_web_search: "on" 
        }
      })
    });
  
    const data = await response.json();
  
    if (!response.ok) {
      throw new Error(data.error || 'Failed to fetch data from Venice API');
    }
  
    return data.choices[0].message.content;
  }
  