const formUpdateRole = document.getElementById('updateRoleForm');

formUpdateRole.addEventListener('submit', async (e) => {
    e.preventDefault();
    const selectedUserID = formUpdateRole.elements.user.value;
    const selectedUserRole = formUpdateRole.elements.role.value;

    try {
        const response = await fetch(`/api/user/premium/${selectedUserID}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ role: selectedUserRole }),
        });

        if (response.ok) {
            const data = await response.json();
            Swal.fire({
                icon: 'success',
                title: 'Operación exitosa',
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