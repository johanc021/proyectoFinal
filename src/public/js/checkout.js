document.addEventListener("DOMContentLoaded", () => {
    const buyButtons = document.querySelectorAll(".buy-button");

    buyButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const cartId = button.getAttribute("data-cart-id");

            Swal.fire({
                title: '¿Estás seguro de comprar este carrito?',
                text: 'Esta acción es irreversible.',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Sí, comprar',
                cancelButtonText: 'Cancelar',
            }).then(async (result) => {
                if (result.isConfirmed) {
                    try {
                        // Realiza un fetch POST para completar la compra
                        const response = await fetch(`/api/cart/${cartId}/purchase`, {
                            method: 'POST',
                        });

                        if (response.ok) {
                            Swal.fire({
                                title: '¡Compra exitosa!',
                                text: 'El carrito ha sido comprado exitosamente.',
                                icon: 'success',
                            }).then(() => {
                                // Redirige al usuario a la página de productos
                                window.location.href = '/products';
                            });
                        } else {
                            // Muestra un mensaje de error en caso de un problema
                            Swal.fire({
                                title: 'Error',
                                text: 'Hubo un problema al completar la compra.',
                                icon: 'error',
                            });
                        }
                    } catch (error) {
                        console.error('Error en la solicitud:', error);
                        // Maneja el error como desees
                    }
                }
            });
        });
    });
});

