import { createWeb3Modal, defaultWagmiConfig } from '@web3modal/wagmi'
import { watchAccount, disconnect, getAccount, signMessage } from '@wagmi/core'
import { mainnet, arbitrum } from '@wagmi/core/chains'

// 1. Define constants
const projectId = import.meta.env.VITE_PROJECT_ID

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
  } else {
    var account = getAccount()
    if (account.isConnected) {
      signMessage({message: 'gm wagmi frens'})
    }
  }
})

watchAccount(account => {
  console.log('watching');
  document.getElementById('user').innerText = account.address ?? 'Disconnected'
})
