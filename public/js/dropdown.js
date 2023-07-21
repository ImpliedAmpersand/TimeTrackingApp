var $table = $('#tablebody');

const $total = $('#totalPayTime');
var total = 0;
var emp = "";

$('.ui.dropdown')
  .dropdown({
    clearable: true,
    onChange: function(value, text, $selectedItem) {
        emp = value;
        total = 0;
        $.ajax({
            url: '/update-table',
            type: 'GET',
            data: { employee: value },
            contentType: "application/json",
            success: function(response) {
                

var lastPressByPerson = {};

// Empty the table
// Empty the table
$table.empty();

// Combine clock in and clock out rows
var tableRows = [];
response.forEach(function(buttonPress) {
  if (lastPressByPerson[buttonPress.name]) {
    var lastPress = lastPressByPerson[buttonPress.name];
    lastPress.timeout = buttonPress.hour + ":" + buttonPress.minute;

    var inTime = getTimeFormatted(lastPress.hour, lastPress.minute);
    var outTime = getTimeFormatted(buttonPress.hour, buttonPress.minute);

    var inTimeDecimal = lastPress.hour + (lastPress.minute / 60);
    var outTimeDecimal = buttonPress.hour + (buttonPress.minute / 60);
    var hoursWorked = outTimeDecimal - inTimeDecimal;
    if (buttonPress.lunch == 1) {
      hoursWorked -= 0.5;
    }

    if (buttonPress.hour === 23) {
      tableRows.push({
        id: buttonPress.id,
        name: buttonPress.name,
        date: buttonPress.date,
        inTime: inTime,
        outTime: outTime,
        hoursWorked: 'N/A',
        lunch: buttonPress.lunch,
        hasClockoutInput: true
      });
    } else {
      tableRows.push({
        id: buttonPress.id,
        name: buttonPress.name,
        date: buttonPress.date,
        inTime: inTime,
        outTime: outTime,
        hoursWorked: hoursWorked.toFixed(2),
        lunch: buttonPress.lunch,
        hasClockoutInput: false
      });
      console.log((new Date(buttonPress.date).getTime()) > (new Date($total.data('time')).getTime()));
      if (emp !== "" && (new Date(buttonPress.date).getTime()) > (new Date($total.data('time')).getTime())) {
        total += hoursWorked;
      }
    }

    // Clear the last press for the person
    delete lastPressByPerson[buttonPress.name];
  } else {
    lastPressByPerson[buttonPress.name] = buttonPress;
  }
});

// Add remaining unmatched rows to tableRows
Object.keys(lastPressByPerson).forEach(function(key) {
  var lastPress = lastPressByPerson[key];

  var inTime = getTimeFormatted(lastPress.hour, lastPress.minute);

  tableRows.push({
    id: lastPress.id,
    name: lastPress.name,
    date: lastPress.date,
    inTime: inTime,
    outTime: 'N/A',
    hoursWorked: 'N/A',
    lunch: lastPress.lunch,
    hasClockoutInput: false
  });
});

// Reverse the table rows
tableRows.reverse();

// Render the table
tableRows.forEach(function(row) {
  var $tr = $('<tr>');
  var $td1 = $('<td>').text(row.name);
  var $td2 = $('<td>').text(row.date);
  var $td3 = $('<td>');

  if (row.hasClockoutInput) {
    $td3.append(
      row.inTime + '-' +
      '<div class="ui input" style="width:80px;">' +
      '<input type="text" id="clockoutInput' + row.id + '" class="clockout-input" placeholder="5:00pm">' +
      '</div>' +
      '<button class="ui tiny green button clockout-submit" id="' + row.id + '">Submit</button>'
    );
  } else {
    $td3.text(row.inTime + ' - ' + row.outTime);
  }

  var $td4 = $('<td>').text(row.hoursWorked);

  if (row.outTime === 'N/A') {
    $tr.addClass('unmatched-row');
  }

  if (row.lunch == 0) {
    $td4.addClass('no-lunch');
  }

  $tr.append($td1, $td2, $td3, $td4);
  $table.append($tr);
});

if (emp !== "") {
  $total.text('Total time since ' + $total.data('time').toString().slice(0,15) + ": " + total.toFixed(2).toString() + " hours");
}
else {
  $total.text("");
}

// Function to format time (12-hour format with AM/PM)
function getTimeFormatted(hour, minute) {
  var hourFormatted = hour > 12 ? hour - 12 : hour;
  var period = hour >= 12 ? 'pm' : 'am';
  var minuteFormatted = minute.toString().padStart(2, '0');
  return hourFormatted + ':' + minuteFormatted + period;
}

      },
      error: function(xhr, status, error) {
          console.error('Error sending dropdown:', error);
      }
      });
    }
  })
;