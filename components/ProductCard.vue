<template>
  <article class="bg-white shadow-sm border p-3 rounded-lg">
    <NuxtLink :to="`/productos/${product.id}`">
      <img 
        :src="product.images[0] ?? 'https://placehold.co/600x400'" 
        :alt="product?.title" 
        class="w-full h-44 object-cover"
        @error="handleImgError"
      />

      <h3 class="mt-2 font-semibold">
        {{ product?.title }}
      </h3>

      <p class="text-sm mt-1">
        <!-- Si es miembro, mostrar precios especiales -->
        <template v-if="isMember">
          <span class="text-green-600 font-semibold">
            {{ formattedPrice }}
          </span>

          <span class="line-through text-gray-500 ml-2">
            ${{ product.price.toFixed(2) }}
          </span>

          <span class="ml-2 inline-block px-2 py-1 text-xs font-semibold text-white bg-green-600 rounded-full">
            Ahorra {{ discountPercent }}%
          </span>
        </template>

        <!-- Si NO es miembro -->
        <template v-else>
          ${{ product.price.toFixed(2) }}
        </template>
      </p>
    </NuxtLink>
  </article>
</template>

<script setup lang="ts">
import { handleImgError } from '~/utils/handleImgError'

const props = defineProps<{ product: IProduct }>()

// Autenticación
const { status } = useAuth()

// Usuario autenticado
const isMember = computed(() => status.value === 'authenticated')

// Porcentaje de descuento
const discountPercent = 15

// Precio con descuento
const formattedPrice = computed(() => {
  const price = props.product.price
  return `$${(price * (1 - discountPercent / 100)).toFixed(2)}`
})
</script>

