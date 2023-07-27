$('[class*=button][class*=medium]').on('click', function() {
    window.location.href = $(this).attr('id');
});

$('[class*=button][class*=small][class*=password-submit]').on('click', function() {
    const passwordInput = $('#password').val();
    console.log(passwordInput);
    if (passwordInput == "goomba") {
        window.location.href = $(this).attr('id');
    }
});