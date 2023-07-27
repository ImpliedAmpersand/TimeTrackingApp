var $table = $('#tablebody');

const $total = $('#totalPayTime');
var total = 0;
var emp = "";

$('.ui.dropdown')
  .dropdown({
    clearable: true,
    onChange: function(value, text, $selectedItem) {
        sessionStorage.setItem('employeeName', value);
        updateDropdown(value);
    }
  })
;


function load() {
  sessionStorage.setItem('employeeName', "");
  updateDropdown("");
}

function reLoad() {
  $('.ui.dropdown').dropdown('set selected', sessionStorage.getItem('employeeName'));
  updateDropdown(sessionStorage.getItem('employeeName'));
}

function updateDropdown(value) {
emp = value;
total = 0;
$.ajax({
    url: '/update-table',
    type: 'GET',
    data: { employee: value },
    contentType: "application/json",
    success: function(response) {
                

var lastPressByPerson = {};

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

    if (buttonPress.erase == 1) {
      tableRows.push({
        inid: lastPress.id,
        outid: buttonPress.id,
        name: buttonPress.name,
        date: buttonPress.date,
        inTime: inTime,
        outTime: outTime,
        hoursWorked: 'N/A',
        lunch: buttonPress.lunch,
        hasClockoutInput: true,
        inedited: lastPress.edited,
        outedited: buttonPress.edited
      });
    } else {
      tableRows.push({
        inid: lastPress.id,
        outid: buttonPress.id,
        name: buttonPress.name,
        date: buttonPress.date,
        inTime: inTime,
        outTime: outTime,
        hoursWorked: hoursWorked.toFixed(2),
        lunch: buttonPress.lunch,
        hasClockoutInput: false,
        inedited: lastPress.edited,
        outedited: buttonPress.edited
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
    inid: lastPress.id,
    outid: -1,
    name: lastPress.name,
    date: lastPress.date,
    inTime: inTime,
    outTime: 'N/A',
    hoursWorked: 'N/A',
    lunch: lastPress.lunch,
    hasClockoutInput: false,
    inedited: lastPress.edited,
    outedited: 0
  });
});

// Reverse the table rows
tableRows.reverse();

// Render the table
tableRows.forEach(function(row) {
  var $tr = $('<tr>');
  var $td1 = $('<td class="two wide">').text(row.name);
  var $td2 = $('<td class="two wide">').text(row.date);
  var $td3 = $('<td class="five wide">');

  if (row.hasClockoutInput) {
    $td3.append(
      row.inTime + '-' +
      '<div class="ui input" style="width:100px;">' +
      '<input type="text" id="clockoutInput' + row.outid + '" class="clockout-input" placeholder="5:00pm">' +
      '</div>' +
      '<button class="ui tiny green button clockout-submit" id="' + row.outid + '">Set Out</button>'
    );
  } else {
    $td3.text(row.inTime + ' - ' + row.outTime);
  }

  var $td4 = $('<td class="one wide">').text(row.hoursWorked);

  var $td5 = $('<td>').text(row.editHours);
  $td5.append(
    '<div class="ui input" style="width:100px;">' +
    '<input type="text" id="editHoursInput' + row.outid + '"  class="edit-hours-input' + row.inid + '" placeholder="5:00pm">' +
    '</div>' +
    '<button class="ui tiny orange button edit-clockin-submit" id="' + row.inid + '">Set In</button>');
    if (row.outid != -1 && row.hasClockoutInput == false) {
      $td5.append(
    '<button class="ui tiny orange button edit-clockout-submit" id="' + row.outid + '">Set Out</button>'
    );}
    if (row.lunch == 0 && row.hasClockoutInput == false) {
      $td5.append('<button class="ui tiny pink button add-lunch" id="' + row.outid + '">+ Lunch</button>');
    }
    else if (row.lunch == 1 && row.hasClockoutInput == false) {
      $td5.append('<button class="ui tiny pink button sub-lunch" id="' + row.outid + '">- Lunch</button>');
    }

    if (row.lunch == -3) {
      $tr.addClass('edited-time');
    }

  if (row.outTime === 'N/A') {
    $tr.addClass('unmatched-row');
  }

  if (row.lunch == 0) {
    $td4.addClass('no-lunch');
  }

  $tr.append($td1, $td2, $td3, $td4, $td5);
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