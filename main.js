import { getSolanaConnection, getAccountNfts, getSolanaWallet } from './src/solana'

function addAssetToScene (texture, artObject) {
  console.log(artObject, texture)
  texture.rotation = Math.PI/2
  texture.center = new THREE.Vector2(0.5, 0.5)
  texture.needsUpdate = true
  const aspectRatio = texture.image.height / texture.image.width
  artObject.scale.x = artObject.scale.y
  artObject.scale.y *= aspectRatio
  artObject.children[1].material = new THREE.MeshBasicMaterial({ map: texture })
}

function addNftsToScene (nfts) {
  const artObjects = document.querySelector('a-gltf-model').object3D.getObjectByName('Arts').children
  console.log(nfts.length, artObjects.length, nfts.length < artObjects.length)
  const nftsToLoad = nfts.length < artObjects.length ? nfts.length : artObjects.length
  console.log(nftsToLoad)
  for (let i = 0; i < nftsToLoad; i++) {
    const nft = nfts[i]
    if (nft.externalMetadata) {
      const artObject = artObjects[i]

      const fileUrl = nft.externalMetadata.image
      // titleEl.textContent = nft.externalMetadata.name
      console.log(fileUrl)

      const textureLoader = new THREE.TextureLoader()
      textureLoader.load(fileUrl, (texture) => addAssetToScene(texture, artObject))
    }
  }
}

function setUpComponents () {
  console.log(document.querySelector('[raycaster]').components)
  document.querySelector('[raycaster]').components.raycaster.raycaster.params.Line.threshold = 0.0
}

function setupOnboarding () {
  const submitBtn = document.querySelector('.onboarding-account__submit')
  console.log(submitBtn)
  submitBtn.addEventListener('click', async (event) => {
    event.preventDefault()
    const wallet = await getSolanaWallet()
    const onboardingEl = document.querySelector('.onboarding')
    onboardingEl.style.display = 'none'
    const nfts = await getAccountNfts(wallet.publicKey)
    console.log(nfts)
    addNftsToScene(nfts)
  })
}

function init () {
  console.log('test')
  getSolanaConnection()
  setUpComponents()
  setupOnboarding()
}

window.addEventListener('load', () => {
  init()
})