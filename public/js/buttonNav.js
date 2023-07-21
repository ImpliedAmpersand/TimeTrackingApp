$('[class*=button][class*=medium]').on('click', function() {
    window.location.href = $(this).attr('id');
});