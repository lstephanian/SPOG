import { createWeb3Modal, defaultWagmiConfig } from '@web3modal/wagmi'
import { getContract, prepareWriteContract, writeContract, disconnect, getAccount, signMessage } from '@wagmi/core'
import { mainnet, arbitrum } from '@wagmi/core/chains'

// 1. Define constants
const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID
const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS

// 2. Create wagmiConfig
const metadata = {
  name: 'Web3Modal',
  description: 'Web3Modal Example',
  url: 'https://web3modal.com',
  icons: ['https://avatars.githubusercontent.com/u/37784886']
}

const defaultChain = arbitrum
const chains = [mainnet, defaultChain]
const wagmiConfig = defaultWagmiConfig({ chains, projectId, metadata })

// 3. Create modal
const modal = createWeb3Modal({ wagmiConfig, projectId, chains, defaultChain, themeMode: "light" })
modal.subscribeState(newState => {
  if (newState.open) {
    disconnect()
  }
})

let links = document.getElementsByClassName('contract-vote')
for (let i = 0, iLength = links.length; i < iLength; i++) {
    links[i].addEventListener('click', function(e) {
      e.preventDefault();

      var _voteType = parseInt(e.target.getAttribute('data-vote'))
      var account = getAccount()
      if (account.isConnected) {
        writeContract({
          address: contractAddress,
          account: account,
          abi: {"name": "vote", "inputs": [{"indexed": true, "internalType": "uint", "name": "_voteType", "type": "uint"}], "outputs": [], "stateMutability": "nonpayable", "type": "function"},
          functionName: 'vote',
          args: [_voteType],
          // abi: [{"inputs":[],"name":"feed","outputs":[],"stateMutability":"nonpayable","type":"function"}],
          // functionName: 'feed',
        })
      }
    });
}
