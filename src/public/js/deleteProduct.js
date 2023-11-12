document.addEventListener("DOMContentLoaded", () => {
    const deleteButtons = document.querySelectorAll(".delete-product-button");

    deleteButtons.forEach((button) => {
        button.addEventListener("click", async () => {
            const cartId = button.getAttribute("data-cart-id");
            const productId = button.getAttribute("data-product-id");
            try {
                const response = await fetch(`/api/cart/${cartId}/products/${productId}`, {
                    method: 'DELETE',
                });

                if (response.ok) {
                    // Recargar la página después de eliminar el producto
                    location.reload();
                } else {
                    // Mostrar un mensaje en caso de error
                    alert('Hubo un problema al eliminar el producto del carrito');
                }
            } catch (error) {
                console.error('Error al eliminar el producto del carrito:', error);
            }
        });
    });
});
