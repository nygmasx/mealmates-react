import React, {useEffect, useState} from 'react';
import axiosConfig from "@/context/axiosConfig.js";
import {FaRegClock, FaMapMarkerAlt, FaEdit, FaTrash, FaPlus, FaEye} from "react-icons/fa";
import {FiArrowLeft, FiMoreVertical} from "react-icons/fi";
import {Input} from "@/components/ui/input";
import {showToast} from "@/utils/toast.js";
import Layout from '../Layout';

// Modale de confirmation de suppression
const DeleteConfirmModal = ({product, isOpen, onClose, onConfirm, isLoading}) => {
    if (!isOpen || !product) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[999] flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-sm w-full p-6">
                <h3 className="text-xl font-bold mb-4 text-center">Supprimer le produit</h3>
                <p className="text-gray-600 text-center mb-6">
                    Êtes-vous sûr de vouloir supprimer "{product.title || product.name}" ?
                    Cette action est irréversible.
                </p>
                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        disabled={isLoading}
                        className="flex-1 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                    >
                        Annuler
                    </button>
                    <button
                        onClick={() => onConfirm(product.id)}
                        disabled={isLoading}
                        className="flex-1 py-3 bg-red-500 text-white font-medium rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 flex items-center justify-center"
                    >
                        {isLoading ? (
                            <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                        ) : (
                            'Supprimer'
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

// Menu d'actions pour chaque produit
const ProductActionMenu = ({product, onEdit, onDelete, onToggleStatus, isOpen, onToggle}) => {
    if (!isOpen) return null;

    return (
        <div className="absolute right-0 top-8 bg-white rounded-lg shadow-lg border z-20 min-w-48">
            <button
                onClick={() => {
                    onEdit(product);
                    onToggle();
                }}
                className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center border-b"
            >
                <FaEdit className="mr-3 text-blue-500" size={16}/>
                Modifier
            </button>
            <button
                onClick={() => {
                    onDelete(product);
                    onToggle();
                }}
                className="w-full px-4 py-3 text-left hover:bg-red-50 flex items-center text-red-600"
            >
                <FaTrash className="mr-3" size={16}/>
                Supprimer
            </button>
        </div>
    );
};

// Carte produit
const MyProductCard = ({product, onEdit, onDelete, onToggleStatus}) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const formatPrice = (price) => {
        if (!price && price !== 0) return '0.00';
        if (typeof price === 'string') {
            return parseFloat(price).toFixed(2);
        }
        return price.toFixed(2);
    };

    const getExpirationText = (expirationDate) => {
        if (!expirationDate) return null;

        const today = new Date();
        const expDate = new Date(expirationDate);
        const diffTime = expDate - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return "aujourd'hui";
        if (diffDays === 1) return "demain";
        if (diffDays > 1) return `dans ${diffDays} jours`;
        if (diffDays < 0) return "expiré";
        return "expiré";
    };

    const getImageUrl = (product) => {
        if (product.images && product.images.length > 0) {
            return `https://apimates.testingtest.fr/${product.images[0]}`;
        }
        const productName = product.title || product.name || 'Produit';
        return `https://placehold.co/400x200/e2e8f0/ffffff?text=${encodeURIComponent(productName.split(' ')[0])}`;
    };

    const getStatusBadge = () => {
        if (!product.isActive) {
            return <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">Masqué</span>;
        }
        if (product.expirationDate) {
            const today = new Date();
            const expDate = new Date(product.expirationDate);
            if (expDate < today) {
                return <span className="px-2 py-1 bg-red-100 text-red-600 text-xs rounded-full">Expiré</span>;
            }
        }
        return <span className="px-2 py-1 bg-green-100 text-green-600 text-xs rounded-full">Actif</span>;
    };

    return (
        <div className="bg-white rounded-xl shadow-md overflow-hidden relative">
            <div className="relative">
                <img
                    src={getImageUrl(product)}
                    alt={product.title || product.name}
                    className={`w-full h-40 object-cover ${!product.isActive ? 'opacity-50' : ''}`}
                    onError={(e) => {
                        e.target.src = `https://placehold.co/400x200/e2e8f0/ffffff?text=${encodeURIComponent((product.title || product.name || 'Produit').split(' ')[0])}`;
                    }}
                />
                {product.discount && (
                    <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-md">
                        -{product.discount}%
                    </div>
                )}

                {/* Menu d'actions */}
                <div className="absolute top-2 right-2">
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="bg-white p-2 rounded-full shadow-md hover:bg-gray-50"
                    >
                        <FiMoreVertical size={16}/>
                    </button>
                    <ProductActionMenu
                        product={product}
                        onEdit={onEdit}
                        onDelete={onDelete}
                        onToggleStatus={onToggleStatus}
                        isOpen={isMenuOpen}
                        onToggle={() => setIsMenuOpen(false)}
                    />
                </div>
            </div>

            <div className="p-3">
                <div className="flex items-start justify-between mb-2">
                    <h3 className={`font-semibold text-gray-900 truncate flex-1 ${!product.isActive ? 'opacity-50' : ''}`}>
                        {product.title || product.name}
                    </h3>
                    {getStatusBadge()}
                </div>

                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                        <span
                            className={`text-lg font-bold text-button-green ${!product.isActive ? 'opacity-50' : ''}`}>
                            {product.isDonation || product.price === '0' || product.price === 0
                                ? 'Gratuit'
                                : `${formatPrice(product.price)}€`}
                        </span>
                        {product.originalPrice && (
                            <span className="text-sm text-gray-400 line-through ml-2">
                                {formatPrice(product.originalPrice)}€
                            </span>
                        )}
                    </div>
                </div>

                {product.expirationDate && (
                    <div className={`flex items-center text-gray-500 mb-2 ${!product.isActive ? 'opacity-50' : ''}`}>
                        <FaRegClock className="mr-1" size={10}/>
                        <span className="text-xs">Expire {getExpirationText(product.expirationDate)}</span>
                    </div>
                )}

                {product.description && (
                    <p className={`text-sm text-gray-600 line-clamp-2 ${!product.isActive ? 'opacity-50' : ''}`}>
                        {product.description}
                    </p>
                )}
            </div>
        </div>
    );
};

// Composant principal
function ProfileProducts() {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('recent');
    const [filterStatus, setFilterStatus] = useState('all'); // all, active, inactive, expired
    const [deleteModal, setDeleteModal] = useState({isOpen: false, product: null});
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        fetchMyProducts();
    }, []);

    const fetchMyProducts = async () => {
        try {
            setIsLoading(true);
            setError(null);

            const response = await axiosConfig.get('/product/me');

            let productsArray = [];
            if (Array.isArray(response.data)) {
                productsArray = response.data;
            } else if (response.data && typeof response.data === 'object') {
                if (response.data.products) {
                    productsArray = response.data.products;
                } else if (response.data.data) {
                    productsArray = response.data.data;
                } else {
                    productsArray = [response.data];
                }
            }

            setProducts(productsArray);
            setFilteredProducts(productsArray);

        } catch (error) {
            console.error("Erreur lors de la récupération des produits:", error);
            if (error.response?.status === 401) {
                setError("Vous devez être connecté pour voir vos produits");
            } else {
                setError("Impossible de charger vos produits");
            }
            setProducts([]);
            setFilteredProducts([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        let filtered = [...products];

        // Recherche
        if (searchTerm) {
            filtered = filtered.filter(product =>
                (product.title && product.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (product.name && product.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase()))
            );
        }

        if (filterStatus !== 'all') {
            filtered = filtered.filter(product => {
                if (filterStatus === 'active') {
                    return product.isActive && (!product.expirationDate || new Date(product.expirationDate) >= new Date());
                }
                if (filterStatus === 'inactive') {
                    return !product.isActive;
                }
                if (filterStatus === 'expired') {
                    return product.expirationDate && new Date(product.expirationDate) < new Date();
                }
                return true;
            });
        }

        filtered.sort((a, b) => {
            switch (sortBy) {
                case 'price-low':
                    return parseFloat(a.price || 0) - parseFloat(b.price || 0);
                case 'price-high':
                    return parseFloat(b.price || 0) - parseFloat(a.price || 0);
                case 'expiration':
                    if (!a.expirationDate && !b.expirationDate) return 0;
                    if (!a.expirationDate) return 1;
                    if (!b.expirationDate) return -1;
                    return new Date(a.expirationDate) - new Date(b.expirationDate);
                case 'name':
                    return (a.title || a.name || '').localeCompare(b.title || b.name || '');
                case 'recent':
                default:
                    return 0;
            }
        });

        setFilteredProducts(filtered);
    }, [products, searchTerm, sortBy, filterStatus]);

    const handleEdit = (product) => {

    };

    const handleDelete = (product) => {
        setDeleteModal({isOpen: true, product});
    };

    const confirmDelete = async (productId) => {
        try {
            setIsDeleting(true);

            await axiosConfig.delete(`/product/${productId}`);

            setProducts(prev => prev.filter(p => p.id !== productId));
            setDeleteModal({isOpen: false, product: null});
            showToast.success('Produit supprimé avec succès');

        } catch (error) {
            console.error('Erreur lors de la suppression:', error);
            showToast.error('Erreur lors de la suppression du produit');
        } finally {
            setIsDeleting(false);
        }
    };

    const handleToggleStatus = async (product) => {
        try {
            const newStatus = !product.isActive;

            await axiosConfig.patch(`/product/${product.id}`, {
                isActive: newStatus
            });

            setProducts(prev => prev.map(p =>
                p.id === product.id ? {...p, isActive: newStatus} : p
            ));
            showToast.success(`Produit ${newStatus ? 'réactivé' : 'masqué'} avec succès`);

        } catch (error) {
            console.error('Erreur lors de la modification du statut:', error);
            showToast.error('Erreur lors de la modification du statut');
        }
    };

    const handleClearSearch = () => {
        setSearchTerm('');
    };

    const getFilterCount = (filter) => {
        if (filter === 'all') return products.length;
        if (filter === 'active') {
            return products.filter(p => p.isActive && (!p.expirationDate || new Date(p.expirationDate) >= new Date())).length;
        }
        if (filter === 'inactive') {
            return products.filter(p => !p.isActive).length;
        }
        if (filter === 'expired') {
            return products.filter(p => p.expirationDate && new Date(p.expirationDate) < new Date()).length;
        }
        return 0;
    };

    if (isLoading) {
        return (
            <Layout>
                <div className="flex flex-col h-screen">
                    <div className="flex-grow p-4 flex items-center justify-center">
                        <div
                            className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-button-green"></div>
                    </div>
                </div>
            </Layout>
        );
    }

    if (error) {
        return (
            <Layout>
                <div className="flex flex-col h-screen">
                    <div className="flex-grow p-4 flex items-center justify-center">
                        <div className="text-center">
                            <p className="text-red-500 mb-4">{error}</p>
                            <button
                                onClick={fetchMyProducts}
                                className="bg-button-green text-white px-4 py-2 rounded"
                            >
                                Réessayer
                            </button>
                        </div>
                    </div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="flex flex-col h-full mb-14">
                <div className="flex-grow overflow-y-auto">
                    <div className="sticky top-0 bg-white border-b z-10 p-4">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center">
                                <button
                                    onClick={() => window.history.back()}
                                    className="mr-3 p-2 hover:bg-gray-100 rounded-full"
                                >
                                    <FiArrowLeft size={20}/>
                                </button>
                                <h1 className="text-xl font-bold">Mes produits</h1>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="text-sm text-gray-500">
                                    {filteredProducts.length} produit{filteredProducts.length > 1 ? 's' : ''}
                                </span>
                                <a href="/offers/create"
                                   className="bg-button-green text-white p-2 rounded-full hover:bg-green-700 transition-colors"
                                >
                                    <FaPlus size={16}/>
                                </a>
                            </div>
                        </div>

                        <div className="relative mb-4">
                            <Input
                                type="text"
                                placeholder="Rechercher dans mes produits..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-4 pr-10"
                            />
                            {searchTerm && (
                                <button
                                    onClick={handleClearSearch}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                                >
                                    <IoMdClose className="text-gray-500" size={16}/>
                                </button>
                            )}
                        </div>

                        <div className="flex gap-2 overflow-x-auto pb-2 mb-4">
                            {[
                                {key: 'all', label: 'Tous', count: getFilterCount('all')},
                                {key: 'active', label: 'Actifs', count: getFilterCount('active')},
                                {key: 'inactive', label: 'Masqués', count: getFilterCount('inactive')},
                                {key: 'expired', label: 'Expirés', count: getFilterCount('expired')}
                            ].map(filter => (
                                <button
                                    key={filter.key}
                                    onClick={() => setFilterStatus(filter.key)}
                                    className={`px-4 py-2 rounded-full text-sm whitespace-nowrap ${
                                        filterStatus === filter.key
                                            ? 'bg-button-green text-white'
                                            : 'bg-gray-100 text-gray-700'
                                    }`}
                                >
                                    {filter.label} ({filter.count})
                                </button>
                            ))}
                        </div>

                        {/* Options de tri */}
                        <div className="flex gap-2 overflow-x-auto pb-2">
                            {[
                                {key: 'recent', label: 'Récents'},
                                {key: 'name', label: 'Nom'},
                                {key: 'price-low', label: 'Prix ↑'},
                                {key: 'price-high', label: 'Prix ↓'},
                                {key: 'expiration', label: 'Expiration'}
                            ].map(sort => (
                                <button
                                    key={sort.key}
                                    onClick={() => setSortBy(sort.key)}
                                    className={`px-3 py-1 rounded-full text-sm whitespace-nowrap ${
                                        sortBy === sort.key
                                            ? 'bg-gray-200 text-gray-800'
                                            : 'bg-gray-100 text-gray-600'
                                    }`}
                                >
                                    {sort.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="p-4">
                        {filteredProducts.length > 0 ? (
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                {filteredProducts.map((product, index) => (
                                    <MyProductCard
                                        key={product.id || index}
                                        product={product}
                                        onEdit={handleEdit}
                                        onDelete={handleDelete}
                                        onToggleStatus={handleToggleStatus}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <div className="text-gray-400 mb-4">
                                    <FaPlus size={48} className="mx-auto mb-4 opacity-50"/>
                                </div>
                                <p className="text-gray-500 mb-2">
                                    {searchTerm || filterStatus !== 'all'
                                        ? 'Aucun produit trouvé'
                                        : 'Vous n\'avez pas encore de produits'}
                                </p>
                                {!searchTerm && filterStatus === 'all' && (
                                    <a
                                        href="/offers/create"
                                        className="inline-block bg-button-green text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
                                    >
                                        Ajouter mon premier produit
                                    </a>
                                )}
                                {(searchTerm || filterStatus !== 'all') && (
                                    <button
                                        onClick={() => {
                                            setSearchTerm('');
                                            setFilterStatus('all');
                                        }}
                                        className="text-button-green text-sm"
                                    >
                                        Réinitialiser les filtres
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <DeleteConfirmModal
                product={deleteModal.product}
                isOpen={deleteModal.isOpen}
                onClose={() => setDeleteModal({isOpen: false, product: null})}
                onConfirm={confirmDelete}
                isLoading={isDeleting}
            />
        </Layout>
    );
}

export default ProfileProducts;
