<template>
    <div class="max-w-6xl m-auto">
        <h1 class="text-2xl font-bold mb-4">Carrito de compras</h1>

        <!-- Carrito vacío -->
        <div v-if="!cartItems.length" class="py-6 text-gray-600">
            Tu carrito está vacío.
            <NuxtLink to="/" class="text-blue-600 underline">Volver a la tienda</NuxtLink>
        </div>

        <!-- Carrito con productos -->
        <div v-else class="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
            <div class="grid gap-4 bg-white">
                <div v-for="item in cartItems" :key="item?.productId"
                    class="flex items-center gap-4 border p-4 rounded-lg">
                    <!-- Imagen -->
                    <div class="w-24 h-24">
                        <img :src="item?.product?.images?.[0]" :alt="item?.product?.title"
                            class=" object-cover rounded-md" />

                    </div>

                    <!-- Info -->
                    <div class="flex-1">
                        <h2 class="font-semibold">{{ item?.product?.title ?? 'N/A' }}</h2>

                        <p class="text-lg mt-1">
                            <!-- Si es miembro, mostrar precios especiales -->
                            <template v-if="isMember">
                                <span class="text-green-600 font-semibold text-xl">
                                    {{ formatDiscountPrice(item?.product?.price ?? 0) }}
                                </span>

                                <span class="line-through text-gray-500 ml-2">
                                    {{ formatPrice(item?.product?.price ?? 0) }}
                                </span>

                                <span
                                    class="ml-2 inline-block px-2 py-1 text-xs font-semibold text-white bg-green-600 rounded-full">
                                    Ahorra {{ discountPercent }}%
                                </span>
                            </template>

                            <!-- Si NO es miembro -->
                            <template v-else>
                                {{ formatPrice(item.product?.price ?? 0) }}
                            </template>
                        </p>
                    </div>

                    <!-- Controles de cantidad -->
                    <div class="flex items-center gap-2">
                        <button class="bg-gray-800 text-white w-8 h-8 rounded-md flex items-center justify-center" @click="decrease(item.productId)">-</button>
                        <span>{{ item.quantity }}</span>
                        <button class="bg-gray-800 text-white w-8 h-8 rounded-md flex items-center justify-center" @click="increase(item.productId)">+</button>
                    </div>

                    <!-- Eliminar -->
                    <button class="text-red-600 font-semibold ml-4" @click="remove(item.productId)">
                        x
                    </button>
                </div>
            </div>

            <!-- Totales -->
            <div class="border p-4 rounded-lg bg-white">
                <h2 class="text-xl font-semibold mb-2">Resumen</h2>

                <p class="flex justify-between">
                    <span>Productos ({{ totalUnits ?? 0 }}):</span>
                    <span>{{ formatPrice(subtotal) }}</span>
                </p>

                <p v-if="isMember" class="flex justify-between text-green-600">
                    <span>Descuento (15%):</span>
                    <span>-{{ formatPrice(discountTotal) }}</span>
                </p>

                <p class="flex justify-between text-lg font-bold mt-2">
                    <span>Total:</span>
                    <span>{{ formatPrice(total) }}</span>
                </p>

                <button class="bg-green-600 text-white py-2 px-4 rounded-md w-full mt-4">
                    Continuar compra
                </button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
const cart = useCartStore();
const { fetchProductById } = useProductsApi();

// Autenticación
const { status } = useAuth()

// Usuario autenticado
const isMember = computed(() => status.value === "authenticated")

// Carga productos del carrito
const { data: products } = await useAsyncData(
    'cart-products',
    async () => {
        const result: Record<number, IProduct> = {};
        for (const item of cart.items) {
            result[item.productId] = await fetchProductById(item.productId);
        }
        return result;
    },
    { watch: [() => cart.items] } // Se recalcula automáticamente al cambiar el store
);

// Carrito con informacion de cada item
const cartItems = computed(() => {
    return cart.items.map((item) => {
        const product = products.value?.[item.productId];

        const basePrice = (product?.price ?? 0) * item.quantity || 0;
        const discountAmount = isMember.value ? basePrice * 0.15 : 0;
        const discountedPrice = basePrice - discountAmount;

        return {
            ...item,
            product,
            price: basePrice,
            discountedPrice,
            discountAmount,
        };
    });
});

// Acciones
const increase = (id: number) => cart.addProduct(id);
const decrease = (id: number) => {
    const current = cart.items.find((i) => i.productId === id);
    if (!current) return;
    cart.setQuantity(id, current.quantity - 1);
};

const remove = (id: number) => cart.removeProduct(id);

// Totales
const subtotal = computed(() =>
    cartItems.value.reduce((acc, i) => acc + i.price, 0)
);
const discountTotal = computed(() =>
    cartItems.value.reduce((acc, i) => acc + i.discountAmount, 0)
)
const totalUnits = computed(() => cart.totalUnits)

const total = computed(() => subtotal.value - discountTotal.value);

const formatPrice = (n: number) => `$${n.toFixed(2)}`;

// Precio con descuento
const formatDiscountPrice = (price: number) => computed(() => {
  return `$${(price * (1 - discountPercent / 100)).toFixed(2)}`
})

const discountPercent = 15;

</script>
