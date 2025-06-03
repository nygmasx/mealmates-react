import axiosConfig from "@/context/axiosConfig.js";

export const productService = {
    async createProduct(productData) {
        const formData = new FormData();

        if (productData.images && productData.images.length > 0) {
            productData.images.forEach((file) => {
                formData.append('images[]', file);
            });
        }

        Object.keys(productData).forEach(key => {
            if (key !== 'images') {
                const value = productData[key];
                if (key === 'pickupSchedule') {
                    formData.append('availabilities', typeof value === 'object' ? JSON.stringify(value) : value);
                } else if (typeof value === 'object') {
                    formData.append(key, JSON.stringify(value));
                } else {
                    formData.append(key, value.toString());
                }
            }
        });

        return await axiosConfig.post('/products', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
    },

    async getProducts(filters = {}) {
        const params = new URLSearchParams();
        Object.keys(filters).forEach(key => {
            if (filters[key] !== undefined && filters[key] !== '') {
                params.append(key, filters[key]);
            }
        });

        return await axiosConfig.get(`/products?${params.toString()}`);
    },

    async getProduct(id) {
        return await axiosConfig.get(`/products/${id}`);
    },

    async updateProduct(id, productData) {
        const formData = new FormData();

        Object.keys(productData).forEach(key => {
            const value = productData[key];
            if (key === 'images' && Array.isArray(value)) {
                value.forEach((file) => {
                    if (file instanceof File) {
                        formData.append('images[]', file);
                    }
                });
            } else if (typeof value === 'object') {
                formData.append(key, JSON.stringify(value));
            } else {
                formData.append(key, value.toString());
            }
        });

        return await axiosConfig.put(`/products/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
    },

    async deleteProduct(id) {
        return await axiosConfig.delete(`/products/${id}`);
    }
};
