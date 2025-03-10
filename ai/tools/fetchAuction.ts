import { ChainGrpcAuctionApi, IndexerGrpcAuctionApi } from '@injectivelabs/sdk-ts';
import { getNetworkEndpoints, Network } from '@injectivelabs/networks';
import { fetchTokenMetadata } from './fetchBalances';

const network = Network.Mainnet;

const endpoints = getNetworkEndpoints(network);

const chainGrpcAuctionApi = new ChainGrpcAuctionApi(endpoints.grpc);
const indexerGrpcAuctionApi = new IndexerGrpcAuctionApi(endpoints.indexer);

export async function fetchLatestAuction(auction_id:number|null) {
    try {
        
        let auction;
        if(auction_id == null){
            const moduleState = await chainGrpcAuctionApi.fetchModuleState();
            const latestRound = moduleState.auctionRound;
    
            auction = await indexerGrpcAuctionApi.fetchAuction(latestRound);
        }else{
            auction = await indexerGrpcAuctionApi.fetchAuction(auction_id);
            if(auction == undefined){
                return `No Valid Auction for ${auction_id}`
            }
        }

        

        return formatAuctionAsHTML(auction);
    } catch (error) {
        console.error('Error fetching auction data:', error);
        return null;
    }
}

async function formatAuctionAsHTML(auctionData: {
    auction: {
        winner: string;
        basketList: any[];
        winningBidAmount: string;
        round: number;
        endTimestamp: number;
        updatedAt: number;
    };
    bids: {
        bidder: string;
        bidAmount: string;
        bidTimestamp: number;
    }[];
}): Promise<string> {
    const { auction, bids } = auctionData;

    const formatTimestamp = (timestamp: number) =>
        new Date(timestamp).toLocaleString();

    
    const basketItemsPromises = auction.basketList.map(async (item, index) => {
            const result = await fetchTokenMetadata(item.denom);
            if (result != null){
                return `<strong>Item ${index + 1}:</strong> <br>
                <span>Token:</span> ${result.name||'N/A'} (${result.symbol})<br>
                <span>Amount:</span> ${(parseFloat(item.amount)/10**(result.decimals)).toLocaleString()} ${result.symbol}<br>`;
            }else{
                return `<strong>Item ${index + 1}:</strong> <br>
                    <span>Token:</span> ${'N/A'}<br>
                    <span>Amount:</span> ${'N/A'} ${'N/A'}<br>`;
            }
            
            
        });
    
        const basketItems = (await Promise.all(basketItemsPromises)).join('');
    
    const sortedBids = bids.sort((a, b) => Number(b.bidAmount) - Number(a.bidAmount));

    const bidsList = sortedBids.length
        ? bids
              .map(
                  (bid, index) =>
                      `<strong>Bid ${index + 1}:</strong><br>` +
                      `<span>Bidder:</span> ${bid.bidder}<br>` +
                      `<span>Bid Amount:</span> ${(parseFloat(bid.bidAmount)/10**18).toLocaleString()} INJ<br>` +
                      `<span>Bid Timestamp:</span> ${formatTimestamp(bid.bidTimestamp)}<br><br>`
              )
              .join('')
        : '<strong>No bids placed yet.</strong><br>';

    return `
        <h1>Latest Auction Details</h1><br>
        <strong>Auction Round:</strong> <span>${auction.round}</span><br>
        <strong>Winner:</strong> <span>${auction.winner || 'No winner yet'}</span><br>
        <strong>Winning Bid Amount:</strong> <span>${(Number(auction.winningBidAmount)/(10**18)).toLocaleString() || 'Ongoing'} INJ </span><br>
        <strong>End Time:</strong> <span>${formatTimestamp(auction.endTimestamp)}</span><br>
        <strong>Last Updated:</strong> <span>${formatTimestamp(auction.updatedAt)}</span><br><br>
        <h1>Basket Items</h1><br>
        ${basketItems || '<strong>No basket items available.</strong><br>'}
        <br>
        <h1>Bids</h1><br>
        ${bidsList}
    `;
}

