import { ChainGrpcGovApi, PaginationOption, ProposalStatusMap } from '@injectivelabs/sdk-ts'
import { getNetworkEndpoints, Network } from '@injectivelabs/networks'

export type ProposalSummary = {
    proposalId: number
    title: string
    summary: string
    proposer: string
    type: string
    status: string
    expedited: boolean
    submitTime: string
    votingStartTime: string
    votingEndTime: string
    finalTally: {
      yes: string
      no: string
      abstain: string
      noWithVeto: string
    }
  }

export const fetchLast10Proposals = async () => {
  try {
    const endpoints = getNetworkEndpoints(Network.Mainnet)
    const govApi = new ChainGrpcGovApi(endpoints.grpc)

    const pagination: PaginationOption = {
      limit: 10,
      reverse: true,
    }

    const { proposals } = await govApi.fetchProposals({
      status: ProposalStatusMap.PROPOSAL_STATUS_UNSPECIFIED, 
      pagination,
    })
    const summarizedProposals = summarizeProposals(proposals);
    return summarizedProposals
  } catch (error) {
    console.error('Error fetching proposals:', error)
    return []
  }
}

const summarizeProposals = (proposals: any[]): ProposalSummary[] => {
    return proposals.map(toProposalSummary)
  }

const getProposalStatusText = (status: number): string => {
    const statusMap: Record<number, string> = {
      0: 'Unspecified',
      1: 'Deposit Period',
      2: 'Voting Period',
      3: 'Passed',
      4: 'Rejected',
      5: 'Failed',
    }
  
    return statusMap[status] || 'Unknown'
  }
  

const toProposalSummary = (raw: any): ProposalSummary => ({
    proposalId: raw.proposalId,
    title: raw.title,
    summary: raw.summary,
    proposer: raw.proposer,
    type: raw.type,
    status: getProposalStatusText(raw.status),
    expedited: raw.expedited,
    submitTime: new Date(raw.submitTime * 1000).toISOString(),
    votingStartTime: new Date(raw.votingStartTime * 1000).toISOString(),
    votingEndTime: new Date(raw.votingEndTime * 1000).toISOString(),
    finalTally: {
      yes: raw.finalTallyResult.yesCount,
      no: raw.finalTallyResult.noCount,
      abstain: raw.finalTallyResult.abstainCount,
      noWithVeto: raw.finalTallyResult.noWithVetoCount,
    },
  })


