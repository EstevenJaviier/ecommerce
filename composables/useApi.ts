export const useApiBase = () => {
  const config = useRuntimeConfig();
  const base = config.public.apiBase;

  return { base };
};

export const useProductsApi = () => {
  const { base } = useApiBase();

  const fetchProducts = async (): Promise<IProduct[]> => {
    const res = await $fetch<IProduct[]>(`${base}/products`);
    return res;
  };

  const fetchProductById = async (id: string | number): Promise<IProduct> => {
    const res = await $fetch<IProduct>(`${base}/products/${id}`);
    return res;
  };

  return { fetchProducts, fetchProductById };
};
