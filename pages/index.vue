<template>
  <div class="max-w-6xl m-auto">
    <h2 class="text-2xl font-bold mb-4">Catálogo</h2>

    <div v-if="error" class="text-red-600">
      Error cargando productos: {{ error.message }}
    </div>

    <div v-if="pending">
      <LoadingSpinner />
    </div>

    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <ProductCard 
        v-for="p in products" 
        :key="p.id" 
        :product="p" 
      />
    </div>
  </div>
</template>

<script setup lang="ts">

// API composable
const { fetchProducts } = useProductsApi()

// Data fetch
const { data: products, pending, error } = await useAsyncData<IProduct[]>(
  'products',
  () => fetchProducts()
)
</script>
