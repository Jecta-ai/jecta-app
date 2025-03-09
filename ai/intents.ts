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
    fetch_balance: {
        description: "Retrieves wallet balances using an Injective address.",
        examples: [
            "Check my wallet balance.",
            "What is my current INJ balance?"
        ],
        keywords: [
            "balance", "balances", "portfolio", "wallet balance", "my funds"
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
    default: {
        description: "Handles general blockchain-related questions.",
        examples: [
            "Tell me about Injective.",
            "How does Injective staking work?"
        ],
        keywords: []
    }
};
