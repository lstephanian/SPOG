import { createWeb3Modal, defaultWagmiConfig } from '@web3modal/wagmi'
import { getContract, prepareWriteContract, writeContract, disconnect, getAccount, signMessage } from '@wagmi/core'
import { mainnet, arbitrum, arbitrumSepolia, sepolia } from '@wagmi/core/chains'
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID
const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS

const metadata = {
  name: 'Web3Modal',
  description: 'Web3Modal Example',
  url: 'https://web3modal.com',
  icons: ['https://avatars.githubusercontent.com/u/37784886']
}

arbitrumSepolia.name = 'Arb Sepolia'

const defaultChain = arbitrumSepolia
const chains = [defaultChain, arbitrum]
const wagmiConfig = defaultWagmiConfig({ chains, projectId, metadata })

// 3. Create modal
const modal = createWeb3Modal({ wagmiConfig, projectId, chains, defaultChain, themeMode: "light" })

let links = document.getElementsByClassName('contract-vote')
for (let i = 0, iLength = links.length; i < iLength; i++) {
  links[i].addEventListener('click', async function(e) {
    e.preventDefault();

    var account = getAccount()
    if (account.isConnected) {
      try {
        await writeContract({
          address: contractAddress,
          account: account,
          abi: abi,
          functionName: 'vote',
          args: [e.target.getAttribute('data-vote')],
        })

        Swal.fire({
          title: 'Vote',
          text: 'Thank you for voting',
          icon: 'success',
        });
      } catch (error) {
        Swal.fire({
          title: 'Error Voting',
          text: error.shortMessage,
          icon: 'error',
        });
      }
    }
  });
}
