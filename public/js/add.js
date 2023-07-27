$('[class*=button][class*=green][class*=small]').on('click', function() {
    const newName = $('#newUserName').val();

    $.ajax({
    url: '/new-user',
    type: 'POST',
    data: JSON.stringify({ newUser: newName }),
    contentType: "application/json",
    success: function() {
        alert('New Employee added successfully.');
        $('#newUserName').val("");
        },
    error: function(xhr, status, error) {
        console.error('Error adding new Employee:', error);
    }
    });
});