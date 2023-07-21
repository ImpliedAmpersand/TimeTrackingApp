$('#tablebody').on('click', '.clockout-submit', function() {
    const buttonId = $(this).attr('id');
    console.log(buttonId);
    const clockoutInput = $('#clockoutInput' + buttonId);
    const newTime = clockoutInput.val().trim();
  
    // Parse the new time input
    const timeRegex = /^(\d{1,2}):(\d{2})(am|pm)$/i;
    const timeMatch = newTime.match(timeRegex);
  
    if (timeMatch) {
      const hour = parseInt(timeMatch[1]);
      const minute = parseInt(timeMatch[2]);
      const period = timeMatch[3].toLowerCase();
      let updatedHour = hour;
  
      if (hour < 12 && period === 'pm') {
        updatedHour += 12;
      }
  
      // Perform the database update using Ajax or any other method
      // Replace the following Ajax code with your actual implementation
      $.ajax({
        url: '/fix-clockout', // Replace with your server endpoint for updating clock out time
        type: 'POST',
        data: JSON.stringify({
          id: buttonId,
          hour: updatedHour,
          minute: minute
        }),
        contentType: 'application/json',
        success: function(response) {
          // Handle the success response, such as displaying a success message or refreshing the page
          console.log('Clock out time updated successfully');
          location.reload(); // Refresh the page after updating the clock out time
        },
        error: function(xhr, status, error) {
          // Handle the error response
          console.error('Error updating clock out time:', error);
        }
      });
    } else {
      // Handle invalid time input
      console.log('Invalid time format');
    }
  });
  