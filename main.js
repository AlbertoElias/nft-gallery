import { getSolanaConnection, getAccountNfts, getSolanaWallet } from './src/solana'

function addAssetToScene (texture, artObject) {
  texture.rotation = Math.PI/2
  texture.center = new THREE.Vector2(0.5, 0.5)
  texture.needsUpdate = true
  const aspectRatio = texture.image.height / texture.image.width
  artObject.scale.x = artObject.scale.y
  artObject.scale.y *= aspectRatio
  artObject.children[1].material = new THREE.MeshBasicMaterial({ map: texture })
}

function addNftsToScene (nfts) {
  console.log(nfts)
  const artObjects = document.querySelector('a-gltf-model').object3D.getObjectByName('Arts').children
  const nftsToLoad = nfts.length < artObjects.length ? nfts.length : artObjects.length
  for (let i = 0; i < nftsToLoad; i++) {
    const nft = nfts[i]
    if (nft.externalMetadata) {
      const artObject = artObjects[i]

      const fileUrl = nft.externalMetadata.image
      // titleEl.textContent = nft.externalMetadata.name

      const textureLoader = new THREE.TextureLoader()
      textureLoader.load(fileUrl, (texture) => addAssetToScene(texture, artObject))
    }
  }
}

function setUpComponents () {
  document.querySelector('[raycaster]').components.raycaster.raycaster.params.Line.threshold = 0.0
  document.querySelector('a-scene').renderer.physicallyCorrectLights = true
}

function setupOnboarding () {
  const submitBtn = document.querySelector('.signInPhantom')
  submitBtn.addEventListener('click', async (event) => {
    event.preventDefault()
    const wallet = await getSolanaWallet()
    const onboardingEl = document.querySelector('.onboarding')
    onboardingEl.setAttribute('visible', 'false')
    const nfts = await getAccountNfts(wallet.publicKey, 'mainnet-beta')
    addNftsToScene(nfts)
  })
}

function init () {
  getSolanaConnection()
  setUpComponents()
  setupOnboarding()
}

window.addEventListener('load', () => {
  init()
})