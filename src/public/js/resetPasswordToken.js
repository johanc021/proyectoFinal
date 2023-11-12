document.getElementById('resetPasswordForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const password = document.getElementById('password').value.trim();
    const confirmPassword = document.getElementById('confirmPassword').value.trim();

    // Verificar que las contraseñas coincidan
    if (password !== confirmPassword) {
        Swal.fire('Error', 'Las contraseñas no coinciden.', 'error');
        return;
    }

    const token = document.querySelector('input[name="token"]').value;
    const data = {
        password,
        token
    };

    try {
        const response = await fetch('/api/sessions/resetPassword', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            Swal.fire('Éxito', 'Contraseña restablecida con éxito.', 'success');
            window.location.replace('/login');
        } else {
            Swal.fire('Error', 'Hubo un error al restablecer la contraseña.', 'error');
        }
    } catch (error) {
        console.error('Error al enviar la solicitud:', error);
        Swal.fire('Error', 'Hubo un error al enviar la solicitud.', 'error');
    }
});
