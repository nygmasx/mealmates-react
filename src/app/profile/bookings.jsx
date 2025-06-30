import {useEffect, useState} from 'react';
import {useAuth} from "@/context/AuthContext.jsx";
import axiosConfig from "@/context/axiosConfig.js";
import Layout from '../Layout';
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {FiArrowLeft, FiSearch} from "react-icons/fi";
import {useNavigate} from "react-router";
import {showToast} from "@/utils/toast.js";

const BookingCard = ({booking, onStatusChange}) => {
    const getStatusBadge = (status) => {
        switch (status) {
            case 'pending':
                return <span className="px-2 py-1 bg-yellow-100 text-yellow-600 text-xs rounded-full">En attente</span>;
            case 'confirmed':
                return <span className="px-2 py-1 bg-green-100 text-green-600 text-xs rounded-full">Confirmée</span>;
            case 'cancelled':
                return <span className="px-2 py-1 bg-red-100 text-red-600 text-xs rounded-full">Annulée</span>;
            default:
                return <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">Inconnu</span>;
        }
    };

    const navigate = useNavigate();

    return (
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-4">
            <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-gray-900">{booking.product?.title || 'Produit inconnu'}</h3>
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-600 text-xs rounded-full">{booking.is_confirmed ? 'Confirmée' : 'En attente'}</span>
                </div>
                <div className="mb-3">
                    <p className="text-sm text-gray-600 mb-1">
                        <span className="font-medium">Client:</span> {booking.buyer?.name}
                    </p>
                    <p className="text-sm text-gray-600 mb-1">
                        <span className="font-medium">Email:</span> {booking.buyer?.email}
                    </p>
                    <p className="text-sm text-gray-600 mb-1">
                        <span className="font-medium">Prix:</span> {booking.total_price} €
                    </p>
                    <p className="text-xs text-gray-500">
                        Réservé le: {new Date(booking.created_at).toLocaleDateString('fr-FR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                    })}
                    </p>
                </div>

                {!booking.is_confirmed && (
                    <div className="flex gap-2 mt-3 justify-end">
                        <Button
                            size="sm"
                            onClick={() => navigate(`/messages/${booking.chat}/`)}
                            className="bg-green-600 hover:bg-green-700 text-white"
                        >
                            Accepter
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
};

export const Bookings = () => {
    const {user} = useAuth();
    const [bookings, setBookings] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    const fetchBookings = async () => {
        try {
            setIsLoading(true);
            setError(null);

            const response = await axiosConfig.get('/bookings/seller');

            console.log(response)

            let bookingsArray = [];
            if (Array.isArray(response.data)) {
                bookingsArray = response.data;
            } else if (response.data && typeof response.data === 'object') {
                if (response.data.bookings) {
                    bookingsArray = response.data.bookings;
                } else if (response.data.data) {
                    bookingsArray = response.data.data;
                } else {
                    bookingsArray = [response.data];
                }
            }

            setBookings(bookingsArray);
        } catch (error) {
            showToast.error("Erreur lors de la récupération des réservations:", error);
            if (error.response?.status === 401) {
                setError("Vous devez être connecté pour voir vos réservations");
            } else {
                setError("Impossible de charger vos réservations");
            }
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchBookings();
    }, []);

    const handleStatusChange = (bookingId, newStatus) => {
        setBookings(prev =>
            prev.map(booking =>
                booking.id === bookingId
                    ? {...booking, status: newStatus}
                    : booking
            )
        );
    };

    const filteredBookings = bookings.filter(booking => {
        const matchesSearch = booking.product?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            booking.user?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            booking.user?.lastName?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    const pendingCount = bookings.filter(b => b.status === 'pending').length;

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
                            <Button
                                onClick={fetchBookings}
                                className="bg-button-green text-white"
                            >
                                Réessayer
                            </Button>
                        </div>
                    </div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="flex flex-col h-full">
                <div className="sticky top-0 bg-white border-b z-10 p-4">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                            <button
                                onClick={() => window.history.back()}
                                className="mr-3 p-2 hover:bg-gray-100 rounded-full"
                            >
                                <FiArrowLeft size={20}/>
                            </button>
                            <h1 className="text-xl font-bold">
                                Mes réservations
                                {pendingCount > 0 && (
                                    <span className="ml-2 text-sm bg-yellow-100 text-yellow-600 px-2 py-1 rounded-full">
                                        {pendingCount} en attente
                                    </span>
                                )}
                            </h1>
                        </div>
                    </div>

                    <div className="flex flex-col gap-3">
                        <div className="relative">
                            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18}/>
                            <Input
                                type="text"
                                placeholder="Rechercher dans mes réservations..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 pr-4"
                            />
                        </div>

                        <div className="flex gap-2 overflow-x-auto">
                            <Button
                                variant={statusFilter === 'all' ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => setStatusFilter('all')}
                                className={statusFilter === 'all' ? 'bg-button-green' : ''}
                            >
                                Toutes ({bookings.length})
                            </Button>
                            <Button
                                variant={statusFilter === 'pending' ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => setStatusFilter('pending')}
                                className={statusFilter === 'pending' ? 'bg-yellow-500' : ''}
                            >
                                En attente ({bookings.filter(b => b.status === 'pending').length})
                            </Button>
                            <Button
                                variant={statusFilter === 'confirmed' ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => setStatusFilter('confirmed')}
                                className={statusFilter === 'confirmed' ? 'bg-green-500' : ''}
                            >
                                Confirmées ({bookings.filter(b => b.status === 'confirmed').length})
                            </Button>
                            <Button
                                variant={statusFilter === 'cancelled' ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => setStatusFilter('cancelled')}
                                className={statusFilter === 'cancelled' ? 'bg-red-500' : ''}
                            >
                                Annulées ({bookings.filter(b => b.status === 'cancelled').length})
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="flex-grow overflow-y-auto p-4">
                    {filteredBookings.length === 0 ? (
                        <div className="text-center py-8">
                            <p className="text-gray-500 mb-4">
                                {searchTerm || statusFilter !== 'all'
                                    ? 'Aucune réservation trouvée avec ces critêres'
                                    : 'Aucune réservation pour le moment'
                                }
                            </p>
                            {(searchTerm || statusFilter !== 'all') && (
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        setSearchTerm('');
                                        setStatusFilter('all');
                                    }}
                                >
                                    Réinitialiser les filtres
                                </Button>
                            )}
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {filteredBookings.map((booking) => (
                                <BookingCard
                                    key={booking.id}
                                    booking={booking}
                                    onStatusChange={handleStatusChange}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
};

export default Bookings;
