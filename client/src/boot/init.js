import { clerkPlugin } from '@clerk/vue'
import apolloClient from '../apollo/apolloClient.js'
import { DefaultApolloClient } from "@vue/apollo-composable";
import {createPinia} from "pinia";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error('Add your Clerk Publishable Key to the .env file')
}

export default ({app}) => {
  const pinia = createPinia()
  app.use(pinia)
  app.use(clerkPlugin, { publishableKey: PUBLISHABLE_KEY })
  app.provide(DefaultApolloClient, apolloClient)
}
