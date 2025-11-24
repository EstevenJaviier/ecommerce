<template>
  <header class="p-4 shadow-sm bg-white border">
    <div class="max-w-6xl m-auto flex items-center justify-between">
      <NuxtLink to="/" class="relative">
        <h1 class="text-xl font-bold">Tienda Nuxt</h1>
      </NuxtLink>
      <div class="flex items-center gap-4">
        <div class="flex items-center gap-2">
          <!-- Si NO está autenticado -->
          <button v-if="!isAuthenticated" @click="login" class="py-1 px-3 rounded-md text-white bg-gray-800">
            Iniciar sesión
          </button>

          <!-- Si está autenticado -->
          <div v-else class="flex items-center gap-2">
            <span class="badge py-1 px-2 rounded-md text-white text-xs bg-green-500">Miembro</span>

            <img v-if="user?.image || user?.picture" :src="user?.image || user?.picture" alt="avatar"
              class="w-8 h-8 rounded-full" />

            <button @click="logout" class="py-1 px-3 rounded-md text-white bg-gray-800">
              Cerrar sesión
            </button>
          </div>

        </div>

        <!-- Carrito -->
        <NuxtLink to="/cart" class="relative">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke-width="1.7"
            stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round"
              d="M2.25 2.25h1.5l1.5 1.5h15l-2 8.25H7.5L5.25 3.75m0 0l.75 2.25m2.25 12.75a1.125 1.125 0 11-2.25 0 1.125 1.125 0 012.25 0zm10.5 0a1.125 1.125 0 11-2.25 0 1.125 1.125 0 012.25 0z" />
          </svg>

          <span v-if="totalUnits" class="absolute -top-2 -right-2 text-sm bg-red-500 rounded-full px-2 text-white">
            {{ totalUnits }}
          </span>
        </NuxtLink>

      </div>
    </div>

  </header>
</template>

<script setup lang="ts">
const { status, data, signIn, signOut } = useAuth()

// Estado de autenticación
const isAuthenticated = computed(() => status.value === "authenticated")

// Datos del usuario
const user = computed(() => data.value?.user ?? null)

// Métodos auth
const login = () => signIn("github")
const logout = () => signOut()

// Carrito
const cart = useCartStore()
const totalUnits = computed(() => cart.totalUnits)
</script>

<style scoped>

</style>
