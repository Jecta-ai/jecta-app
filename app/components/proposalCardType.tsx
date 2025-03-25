import React from 'react'

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

type Props = {
  proposals: ProposalSummary[]
}

const formatTally = (value: string) => {
  return (Number(value) / 1e18).toLocaleString(undefined, {
    maximumFractionDigits: 2
  }) + ' INJ'
}

const ProposalCard: React.FC<Props> = ({ proposals }) => {
  return (
    <div className="px-4 sm:px-6 lg:px-10 py-10  min-h-screen text-white">
      <h1 className="text-3xl font-bold  text-center mb-10">Latest Proposals</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {proposals.map((proposal) => (
          <div
            key={proposal.proposalId}
            className="bg-[#111827] border border-blue-900 rounded-xl p-5 shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <div className="flex justify-between items-start mb-2">
              <h2 className="text-lg font-semibold text-blue-300">
                #{proposal.proposalId} – {proposal.title}
              </h2>
              <span
                className={`text-xs font-bold px-2 py-1 rounded ${
                  proposal.status === 'Passed'
                    ? 'bg-green-600 text-white'
                    : proposal.status === 'Rejected'
                    ? 'bg-red-600'
                    : 'bg-gray-600 text-white'
                }`}
              >
                {proposal.status}
              </span>
            </div>

            <p className="text-sm text-blue-100 mb-4 line-clamp-4">
              {proposal.summary}
            </p>

            <div className="text-xs text-blue-400 mb-3 space-y-1 break-words">
                <p>
                    <span className="text-blue-300 font-medium">Proposer:</span>{' '}
                    <span className="break-all inline-block">{proposal.proposer}</span>
                </p>
                <p>
                    <span className="text-blue-300 font-medium">Type:</span>{' '}
                    <span className="break-all inline-block">{proposal.type}</span>
                </p>
                <p>
                    <span className="text-blue-300 font-medium">Expedited:</span>{' '}
                    {proposal.expedited ? 'Yes' : 'No'}
                </p>
                <p>
                    <span className="text-blue-300 font-medium">Submit:</span>{' '}
                    {new Date(proposal.submitTime).toLocaleString()}
                </p>
                <p>
                    <span className="text-blue-300 font-medium">Voting:</span>{' '}
                    {new Date(proposal.votingStartTime).toLocaleString()} →{' '}
                    {new Date(proposal.votingEndTime).toLocaleString()}
                </p>
            </div>


            <div className="grid grid-cols-2 gap-3 text-sm text-blue-200 mt-4 border-t border-blue-800 pt-3">
              <div><strong>✅ Yes:</strong> {formatTally(proposal.finalTally.yes)}</div>
              <div><strong>❌ No:</strong> {formatTally(proposal.finalTally.no)}</div>
              <div><strong>🤍 Abstain:</strong> {formatTally(proposal.finalTally.abstain)}</div>
              <div><strong>🛑 Veto:</strong> {formatTally(proposal.finalTally.noWithVeto)}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ProposalCard
