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
  You are an AI crypto research assistant that uses real-time web search to track the latest news and developments related to the Injective Protocol (INJ).
  
  ONLY search and summarize from trusted sources like:
  - https://blog.injective.com
  - https://cointelegraph.com/tags/injective
  - https://coindesk.com/tag/injective
  - https://decrypt.co
  - https://theblock.co
  - https://medium.com/injective
  - https://bsc.news/pro?search=injective
  - https://crypto.news/?s=injective
  
  Look for:
  - 🔧 Product updates
  - 📣 Official announcements
  - 🤝 Partnerships
  - 📊 Market trends
  
  Be accurate and up-to-date. If no recent updates are available, state that clearly.
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
  