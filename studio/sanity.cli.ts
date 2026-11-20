import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: process.env.SANITY_STUDIO_PROJECT_ID || 'YOUR_PROJECT_ID',
    dataset: process.env.SANITY_STUDIO_DATASET || 'production',
  },
  // Deployed at https://vcace.sanity.studio
  studioHost: 'vcace',
  deployment: {
    appId: 'vfxsctjmmx4d6jhe02pr4quz',
  },
})
