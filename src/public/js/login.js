const formLogin = document.getElementById('loginForm');

formLogin.addEventListener('submit', e => {
    e.preventDefault();

    const data = new FormData(formLogin);
    const obj = {};
    data.forEach((value, key) => (obj[key] = value));

    fetch('/api/sessions/login', {
        method: 'POST',
        body: JSON.stringify(obj),
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(result => {
            if (result.status === 200) {
                Swal.fire({
                    icon: 'success',
                    title: '¡Inicio de sesión exitoso!',
                    showConfirmButton: false,
                    timer: 1500
                }).then(() => {
                    window.location.replace('/products');
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error en el inicio de sesión',
                    text: 'Credenciales inválidas, inténtalo de nuevo',
                    showConfirmButton: false,
                    timer: 2500
                });
            }
        })
        .catch(error => {
            console.error('Error:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error en la solicitud',
                text: 'Por favor, inténtalo de nuevo más tarde',
                showConfirmButton: false,
                timer: 2500
            });
        });
});
