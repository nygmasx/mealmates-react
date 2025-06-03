import {useState, useEffect} from 'react';
import {productService} from '../services/productService';

export const useProducts = (filters = {}) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchProducts = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await productService.getProducts(filters);
            setProducts(response.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Erreur lors du chargement des produits');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, [JSON.stringify(filters)]);

    return {
        products,
        loading,
        error,
        refetch: fetchProducts
    };
};

export const useProduct = (id) => {
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!id) return;

        const fetchProduct = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await productService.getProduct(id);
                setProduct(response.data);
            } catch (err) {
                setError(err.response?.data?.message || 'Erreur lors du chargement du produit');
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    return {
        product,
        loading,
        error
    };
};
