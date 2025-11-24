<template>
  <div class="max-w-6xl m-auto">
    <div v-if="pending">Cargando...</div>
    <div v-else-if="error">Error: {{ error.message }}</div>

    <div v-else>
      <h1 class="text-2xl font-bold">{{ product?.title }}</h1>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 items-start">
        <!-- Galería -->
        <div>
          <img v-for="img in product?.images" :key="img" :src="img" class="w-full h-60 object-cover mb-2"
            @error="handleImgError" />
        </div>

        <!-- Información -->
        <div>
          <!-- PRECIO -->
          <p class="text-lg mt-1">
            <!-- Si es miembro, mostrar precios especiales -->
            <template v-if="isMember">
              <span class="text-green-600 font-semibold text-xl">
                {{ formattedPrice }}
              </span>

              <span class="line-through text-gray-500 ml-2">
                ${{ product?.price.toFixed(2) }}
              </span>

              <span class="ml-2 inline-block px-2 py-1 text-xs font-semibold text-white bg-green-600 rounded-full">
                Ahorra {{ discountPercent }}%
              </span>
            </template>

            <!-- Si NO es miembro -->
            <template v-else>
              ${{ product?.price.toFixed(2) }}
            </template>
          </p>

          <p class="mb-2 mt-4">{{ product?.description }}</p>
          <p class="mb-2">Categoría: {{ product?.category?.name || "—" }}</p>

          <button @click="addToCart" type="button" class="btn mt-4 bg-green-600 py-2 px-3 rounded text-white">
            Agregar al carrito
          </button>

          <div v-if="isMember" class="mt-2 text-green-600">
            Como miembro ahorras ${{ saved }} en este producto.
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { handleImgError } from '~/utils/handleImgError'

const discountPercent = 15

// Datos del producto
const route = useRoute()
const id = route.params.id as string
const { fetchProductById } = useProductsApi()

const { data: product, pending, error } = await useAsyncData<IProduct>(
  `product-${id}`,
  () => fetchProductById(id)
)

// Carrito
const cart = useCartStore()
const addToCart = () => {
  if (product.value) cart.addProduct(product.value.id)
}

// Autenticación
const { status } = useAuth()

// Usuario autenticado
const isMember = computed(() => status.value === "authenticated")

// Precio con descuento
const formattedPrice = computed(() => {
  const price = product.value?.price ?? 0
  return `$${(price * (1 - discountPercent / 100)).toFixed(2)}`
})

// Ahorro
const saved = computed(() => {
  const price = product.value?.price ?? 0
  return isMember.value ? (price * discountPercent / 100).toFixed(2) : "0.00"
})
</script>
