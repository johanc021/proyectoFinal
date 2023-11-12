const forgotPasswordForm = document.getElementById('forgotPasswordForm');

forgotPasswordForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;

    // Envia el correo electrónico al servidor
    fetch('/api/sessions/sendEmailResetPassword', {
        method: 'POST',
        body: JSON.stringify({ email }),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(result => {
        if (result.status === 200) {
            Swal.fire('Éxito', 'Correo electrónico enviado exitosamente', 'success');
        } else {
            Swal.fire('Error', 'Error al enviar el correo electrónico', 'error');
        }
    }).catch(error => {
        console.error('Error al enviar la solicitud:', error);
        Swal.fire('Error', 'Hubo un error al enviar la solicitud.', 'error');
    });
});
