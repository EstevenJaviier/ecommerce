// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: true,
  runtimeConfig: {
    public: {
      apiBase: "https://api.escuelajs.co/api/v1",
    },
  },
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  modules: ["@nuxtjs/tailwindcss", "@pinia/nuxt", "@sidebase/nuxt-auth"],
  tailwindcss: {
    exposeConfig: true,
    viewer: true,
    // and more...
  },
  auth: {
    origin: process.env.ORIGIN || `http://localhost:3000`,
  },
});
