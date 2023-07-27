$('[class*=button][class*=massive]').on('click', function() {
  var buttonId = $(this).attr('id');
  const button = $(this);
  const inout = button.hasClass('red') ? "in" : "out";

  if (buttonId.charAt(buttonId.length - 1) == '@' && inout === "in") {
    buttonId = buttonId.slice(0, buttonId.length - 1);
    $('#clockingHeadAdmin').text("Clocking " + inout);
    $('#clockingTextAdmin').text("Are you " + buttonId + "? Enter clock in time manually, if different than current time:");
    $('#clockingInAdmin').val("");
    $('#clockingModalAdmin').modal({
      closable: false,
      onApprove: function() {
        var time = $('#clockingInAdmin').val().trim() ? $('#clockingInAdmin').val().trim() : '-1';
        console.log(time);
        $.ajax({
          url: '/time-tracking-admin-in',
          type: 'POST',
          data: JSON.stringify({ button: buttonId, lunch: -1, time: time }),
          contentType: 'application/json',
          success: function() {
            toggleButtonColor(button);
            console.log('Changing color');
          },
          error: function(xhr, status, error) {
            console.error('Error recording button press:', error);
          }
        });
      }
    }).modal('show');
  }
  else {
  // Update the clocking text in the modal
  if (buttonId.charAt(buttonId.length - 1) == '@') {buttonId = buttonId.slice(0, buttonId.length - 1)};
  $('#clockingHead').text("Clocking " + inout);
  $('#clockingText').text("Are you " + buttonId + "?");
  if (inout == 'out') {
    $('#forgotButton').show();
  }
  else {
    $('#forgotButton').hide();
  }
  $('#clockingModal').modal({
    closable: false,
    onDeny: function(e) {
      if (e.hasClass('out-after')) {
        $.ajax({
          url: '/time-tracking',
          type: 'POST',
          data: JSON.stringify({ button: buttonId, lunch: 0, erase: 1 }),
          contentType: 'application/json',
          success: function() {
            toggleButtonColor(button);
          },
          error: function(xhr, status, error) {
            console.error('Error recording button press:', error);
          }
        });
      }
    },
    onApprove: function() {
      if (inout === "in") {
        $.ajax({
          url: '/time-tracking',
          type: 'POST',
          data: JSON.stringify({ button: buttonId, lunch: -1 }),
          contentType: 'application/json',
          success: function() {
            toggleButtonColor(button);
          },
          error: function(xhr, status, error) {
            console.error('Error recording button press:', error);
          }
        });
      } else {
        $('#confirmationModal').modal({
          closable: false,
          onDeny: function() {
            $.ajax({
              url: '/time-tracking',
              type: 'POST',
              data: JSON.stringify({ button: buttonId, lunch: 0, erase: 0 }),
              contentType: 'application/json',
              success: function() {
                toggleButtonColor(button);
              },
              error: function(xhr, status, error) {
                console.error('Error recording button press:', error);
              }
            });
          },
          onApprove: function() {
            $.ajax({
              url: '/time-tracking',
              type: 'POST',
              data: JSON.stringify({ button: buttonId, lunch: 1 }),
              contentType: 'application/json',
              success: function() {
                toggleButtonColor(button);
              },
              error: function(xhr, status, error) {
                console.error('Error recording button press:', error);
              }
            });
          }
        }).modal('show');
      }
    }
  }).modal('show');
}
});


function toggleButtonColor(button) {
  if (button.hasClass('red')) {
    button.removeClass('red');
    button.addClass('green');
  } else {
    button.removeClass('green');
    button.addClass('red');
    button.addClass('pale-red');
  }
}

function clockOutUsers() {
  if (new Date().getHours() == 23) {
    $('[class*=button][class*=massive][class*=green]').each(function() {
      const buttonId = $(this).attr('id');
      const button = $(this);
      if (buttonId.charAt(buttonId.length - 1) == '@' && inout === "in") {
        buttonId = buttonId.slice(0, buttonId.length - 1);
      }
      $.ajax({
        url: '/time-tracking',
        type: 'POST',
        data: JSON.stringify({ button: buttonId, lunch: -2 }),
        contentType: 'application/json',
        success: function() {
          toggleButtonColor(button);
        },
        error: function(xhr, status, error) {
          console.error('Error recording button press:', error);
        }
      });
  });
  }
}

setInterval(clockOutUsers, 1000);
