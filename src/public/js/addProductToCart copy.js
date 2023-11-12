document.addEventListener("DOMContentLoaded", () => {
    const addToCartButtons = document.querySelectorAll("#btn-add-to-cart");

    addToCartButtons.forEach((button) => {
        button.addEventListener("click", async (event) => {
            event.preventDefault();

            // Captura el valor de la cantidad del producto específico
            const productId = event.target.getAttribute("data-product-id");
            const quantityInput = document.getElementById(`quantity_${productId}`);
            const quantity = parseInt(quantityInput.value, 10);
            console.log(quantity)
            console.log(productId)

            // Envia la cantidad y el código del producto al servidor
            try {
                const response = await fetch("/api/cart", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        idCart: "65240fecbe28a707f53c95ba",
                        idProduct: productId,
                        quantity: quantity
                    })
                })
                if (response.ok) {
                    const data = await response.json();
                    Swal.fire({
                        icon: 'success',
                        title: 'Producto agregado al carrito!!',
                        text: data.message,
                    });
                } else {
                    const errorData = await response.json();
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: errorData.error,
                    });
                }
            } catch (error) {
                console.error('Error en la solicitud:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error en la solicitud',
                    text: 'Hubo un problema al procesar la solicitud.',
                });
            }

        });
    });
});
