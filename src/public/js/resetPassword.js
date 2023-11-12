const formReset = document.getElementById('resetPasswordForm');

formReset.addEventListener('submit', e => {
    e.preventDefault();
    const data = new FormData(formReset);
    const obj = {};
    data.forEach((value, key) => obj[key] = value);
    fetch('/api/sessions/resetPassword', {
        method: 'POST',
        body: JSON.stringify(obj),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(result => {
        if (result.status === 200) {
            console.log("Contraseña restaurada")
        }
    })
})