export const intents = {
    swap_token: {
        description: "Executes a token swap from Coinhall Routes.",
        examples: [
            "I want to trade INJ for USDT.",
            "Swap 50 INJ to BNB.",
            "Convert my INJ into ETH.",
            "Trade 10 USDT into INJ."
        ],
        keywords: [
            "swap", "exchange", "convert", "trade",
            "swap tokens", "exchange tokens", "convert tokens", "trade tokens",
            "swap INJ", "swap to USDT", "trade for", "convert my",
            "exchange my", "where can I swap", "how to swap"
        ]
    },
    stake_inj: {
        description: "Provides staking information for Injective (INJ).",
        examples: [
            "I want to stake my INJ tokens for rewards.",
            "How do I delegate INJ?",
            "Stake 100 INJ with a validator."
        ],
        keywords: [
            "stake", "staking", "earn rewards", "delegate", "validator",
            "stake INJ", "staking rewards", "staking pool"
        ]
    },
    place_bid: {
        description: "Allows users to place a bid in the latest Injective burn auction.",
        examples: [
            "I want to place a bid for the latest burn auction.",
            "Bid 100 INJ in the current burn auction.",
            "How do I participate in the Injective burn auction?",
            "Place a bid for me in the latest auction.",
            "I want to join the Injective auction and bid."
        ],
        keywords: [
            "bid", "place bid", "burn auction", "latest auction bid",
            "join auction", "participate auction", "Injective auction bid",
            "current auction bid", "bidding in auction", "auction entry"
        ]
    },
    send_token: {
        description: "Handles token transfers to another Injective address.",
        examples: [
            "Send 5 INJ to my friend.",
            "Transfer INJ to this wallet.",
            "Move 10 USDT to another account."
        ],
        keywords: [
            "send", "transfer", "move", "send INJ", "transfer USDT",
            "send funds", "move tokens", "send crypto", "send to address"
        ]
    },
    get_price: {
        description: "Fetches the estimated USDT price for a given token on Injective.",
        examples: [
            "What is the current price of INJ?",
            "How much is 1 INJ worth in USDT?"
        ],
        keywords: [
            "price", "current value", "worth", "token price", "how much is"
        ]
    },
    get_latest_auction: {
        description: "Fetches and displays the latest auction on Injective.",
        examples: [
            "I want to see the latest auction on Injective.",
            "Get me the most recent auction on Injective.",
            "Show me the newest Injective auction.",
            "What is the current auction happening on Injective?",
            "Fetch the latest Injective auction details."
        ],
        keywords: [
            "auction", "Injective auction", "latest auction", "current auction",
            "new auction", "Injective bidding", "auction event", "bidding round",
            "active auction", "auction update"
        ]
    },
    get_auction: {
        description: "Fetches and displays auction details for a specific auction round.",
        examples: [
            "I want to see the auction with number 2.",
            "Show me the auction info from round 5.",
            "Get auction details for round 10.",
            "Retrieve auction data from round 3.",
            "What happened in auction round 7?"
        ],
        keywords: [
            "auction round", "specific auction", "auction number", "auction details",
            "auction info", "bidding round", "round of auction", "auction at round"
        ]
    },
    tx_search: {
        description: "Searches for a transaction on Injective Explorer.",
        examples: [
            "Find this transaction hash on Injective.",
            "Check this transaction ID: 0x1234abcd."
        ],
        keywords: [
            "tx", "transaction", "hash", "explorer", "txid", "transaction ID"
        ]
    },
    unstake_inj: {
        description: "Handles the process of unstaking Injective (INJ) tokens from a validator.",
        examples: [
            "I want to unstake my INJ tokens.",
            "How do I undelegate my staked INJ?",
            "Unstake 50 INJ from my validator.",
            "Withdraw my INJ from staking.",
            "Stop staking my INJ."
        ],
        keywords: [
            "unstake", "unstaking", "undelegate", "withdraw stake",
            "unstake INJ", "remove stake", "stop staking", "withdraw staked INJ",
            "unstake my tokens", "how to unstake", "unstake from validator",
            "unstake rewards", "withdraw from staking", "exit staking"
        ]
    },
    fetch_my_portfolio: {
        description: "Retrieves the user's own wallet balances using their Injective address.",
        examples: [
            "Check my wallet balance.",
            "What is my current INJ balance?",
            "How much USDT do I have in my Injective wallet?",
            "Show me my token holdings.",
            "Fetch my Injective portfolio.",
            "What assets do I currently hold?",
            "List all tokens in my wallet."
        ],
        keywords: [
            "my balance", "my wallet balance", "my portfolio", "my funds",
            "check my balance", "how much INJ do I have", "show my holdings",
            "fetch my assets", "retrieve my portfolio", "my Injective tokens",
            "list my tokens", "my Injective wallet", "check my funds"
        ]
    },

    fetch_user_portfolio: {
        description: "Retrieves the full portfolio details of another user's Injective address, including token balances and asset distribution.",
        examples: [
            "Show me the portfolio of this user: inj1zgym77e6mzjqceqldk4purvjnuz5jwe5ckmymg",
            "Fetch the portfolio of inj1xyz...",
            "What assets does this Injective wallet hold?",
            "Retrieve the holdings of this Injective address.",
            "Show me the token distribution for this address.",
            "Can you analyze the portfolio of this Injective address?",
            "Tell me what tokens this user holds.",
            "Get the wallet assets of inj1abc..."
        ],
        keywords: [
            "portfolio", "holdings", "wallet assets", "token balances",
            "show portfolio", "fetch holdings", "Injective wallet details",
            "wallet portfolio", "asset overview", "retrieve portfolio",
            "this user", "this address", "full wallet details", "token distribution",
            "analyze holdings", "portfolio analysis", "fetch address portfolio",
            "another wallet", "Injective address assets", "wallet scan"
        ]
    },
    analyze_token: {
        description: "Provides an in-depth analysis of a given token, including price trends, market data, and liquidity information.",
        examples: [
            "Analyze INJ for me.",
            "Give me a detailed report on QUNT.",
            "What are the market trends for NONJA?",
            "Show me the liquidity and volume of NINJA."
        ],
        keywords: [
            "analyze", "analysis", "market trends", "token insights", "price analysis",
            "liquidity", "volume", "market cap", "supply", "token metrics",
            "INJ analysis", "BTC insights", "detailed report on", "what is happening with"
        ]
    },
    search_injective_news: {
        description: "Finds the latest Injective news on X (Twitter).",
        examples: [
            "What’s the latest news about Injective?",
            "Find Injective updates on Twitter."
        ],
        keywords: [
            "injective news", "latest injective updates", "injective twitter",
            "recent injective posts", "injective social media", "news", "updates"
        ]
    },
    forbidden_topics: {
        description: "Detects and restricts discussions on prohibited topics.",
        examples: [
            "How do I write a Python script?",
            "What are the latest updates in Bitcoin?",
            "Can you help me with stock market investments?",
            "Tell me about AI and machine learning."
        ],
        keywords: [
            "code", "programming", "script", "AI", "machine learning",
            "stock market", "finance", "Bitcoin", "Ethereum", "Solana",
            "crypto outside Injective", "trading bots", "automated trading",
            "smart contract outside Injective", "blockchain other than Injective",
            "ML", "chatbot development", "OpenAI", "Llama", "GPT"
        ]
    },
    talk_between_agents: {
        description: "Triggers a multi-turn conversation between Jecta and Sonia based on the user's request.",
        examples: [
            "Tell me a joke about Sonia.",
            "What does Jecta think about Sonia?",
            "Let Jecta and Sonia have a debate about Injective.",
            "I want Jecta and Sonia to talk to each other."
        ],
        keywords: [
            "talk", "discuss", "debate", "chat", "conversation",
            "between Jecta and Sonia", "Jecta and Sonia talk", "make Jecta talk to Sonia",
            "make Sonia reply","tell a joke about Sonia", "what does Jecta think of",
            "what does Sonia think of"
        ]
    }
    ,
    get_metrics: {
        description: "Fetches the Total Value Locked (TVL) details of the Injective Ecosystem, including top protocols and aggregated TVL.",
        examples: [
            "Give me the details of the TVLs of Injective Ecosystem.",
            "Show me the total TVL of Injective.",
            "List the top protocols on Injective by TVL.",
            "Fetch Injective's DeFi TVL rankings.",
            "What are the biggest protocols by TVL on Injective?"
        ],
        keywords: [
            "TVL", "Injective TVL", "total value locked", "protocol TVL",
            "top TVL protocols", "Injective ecosystem TVL", "defi TVL",
            "biggest protocols by TVL", "tvl details", "injective defi rankings"
        ]
    }
    , 
    get_governance_proposals: {
        description: "Fetches and displays recent governance proposals on the Injective blockchain.",
        examples: [
            "I want to see the proposals of Injective.",
            "Show me the Injective governance proposals.",
            "List current proposals.",
            "What are the latest governance proposals?",
            "Display active proposals on Injective.",
            "Get me the most recent Injective proposals.",
            "What’s happening in Injective governance?"
        ],
        keywords: [
            "proposal", "proposals", "governance", "injective governance",
            "latest proposals", "recent proposals", "active proposals",
            "governance update", "governance list", "injective proposals",
            "governance activity", "see proposals", "get proposals",
            "show proposals", "fetch proposals", "display proposals",
            "proposals of Injective", "current proposals", "governance overview"
        ]
    }
    ,       
    default: {
        description: "Handles general questions about Injective, greetings, and polite interactions.",
        examples: [
            "Who is Sonia ?",
            "Hey there!",
            "Hello!",
            "How’s it going?",
            "Tell me about Injective.",
            "Can you explain how Injective works?",
            "What makes Injective special?",
            "I’m new to Injective—where should I start?",
            "How does staking work on Injective?",
            "Is Injective good for trading?",
            "Thank you!",
            "Thanks for your help!",
            "I appreciate it!"
        ],
        keywords: [
            "Injective", "blockchain", "crypto basics", "how does Injective work",
            "explain Injective", "what is Injective", "learn about Injective",
            "getting started with Injective", "understanding Injective",
            "tell me about Injective", "why use Injective", "benefits of Injective",
            "hello", "hi", "hey", "good morning", "good evening", "what’s up",
            "thank you", "thanks", "appreciate it", "grateful", "cheers"
        ]
    }
    
};
