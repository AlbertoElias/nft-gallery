import * as web3 from '@solana/web3.js'
import { TOKEN_PROGRAM_ID } from '@solana/spl-token'
import { Metadata } from '@metaplex-foundation/mpl-token-metadata'
import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets'

const solanaConfig = {}

async function getSolanaWallet () {
  if (!solanaConfig.wallet) {
    const adapter = new PhantomWalletAdapter()
    await adapter.connect()
    solanaConfig.wallet = adapter
  }

  return solanaConfig.wallet
}

function getSolanaConnection (cluster = 'devnet') {
  if (!solanaConfig.connection) {
    solanaConfig.connection = new web3.Connection(
      web3.clusterApiUrl(cluster),
      'confirmed',
    )
  }

  return solanaConfig.connection
}

async function getAccountNfts (address) {
  const connection = getSolanaConnection()
  const owner = new web3.PublicKey(address)
  console.log(owner.toBase58())
  const tokens = await connection.getParsedTokenAccountsByOwner(owner, { programId: TOKEN_PROGRAM_ID })
  const nftTokens = tokens.value
    .filter((t) => {
      const amount = t.account.data.parsed.info.tokenAmount
      return amount.decimals === 0 && amount.uiAmount === 1
    })
    .map((t) => getNftData(t.account.data.parsed.info.mint))
  return Promise.all(nftTokens)
}

async function getNftData (mintAddress) {
  const connection = getSolanaConnection()
  const metadataPDA = await Metadata.getPDA(mintAddress)
  const onchainMetadata = (await Metadata.load(connection, metadataPDA)).data
  let externalMetadata
  if (onchainMetadata) {
    externalMetadata = await (await fetch(onchainMetadata.data.uri)).json()
  }
  return {
    onchainMetadata,
    externalMetadata,
  }
}

export {
  getSolanaWallet,
  getSolanaConnection,
  getAccountNfts
}