document.addEventListener("DOMContentLoaded", () => {
    const addToCartButtons = document.querySelectorAll("#btn-add-to-cart");
    const cartCheckboxes = document.querySelectorAll("#cart-checkbox");

    let selectedCart = null; // Cambiado a 'let' para permitir la reasignación

    // Escucha los cambios en los checkboxes
    cartCheckboxes.forEach((checkbox) => {
        checkbox.addEventListener("change", (event) => {
            const cartId = event.target.getAttribute("data-cart-id");
            if (event.target.checked) {
                // Almacena el cartId si el checkbox está marcado
                selectedCart = cartId;
            } else {
                // Si el checkbox está desmarcado, establece selectedCart en null
                selectedCart = null;
            }
        });
    });

    addToCartButtons.forEach((button) => {
        button.addEventListener("click", async (event) => {
            event.preventDefault();

            // Captura el valor de la cantidad del producto específico
            const productId = event.target.getAttribute("data-product-id");
            const quantityInput = document.getElementById(`quantity_${productId}`);
            const quantity = parseInt(quantityInput.value, 10);

            // Envía el producto al carrito seleccionado o a null si no se seleccionó ningún carrito
            try {
                const response = await fetch("/api/cart", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        idCart: selectedCart,
                        idProduct: productId,
                        quantity: quantity
                    })
                });

                if (response.ok) {
                    const data = await response.json();
                    Swal.fire({
                        icon: 'success',
                        title: 'Producto agregado al carrito!!',
                        text: data.message,
                    });
                    location.reload();
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
                // Maneja el error como desees
            }
        });
    });
});
