var date = new Date();
date.setDate(date.getDate());

$('#default-datepicker').datepicker({
  format: 'yyyy-mm-dd'
});
$('.facility_datepicker').datepicker({
  format: 'yyyy-mm-dd',
  autoclose: true,
  todayHighlight: true,
  startDate: date,
});
$('#report-datepicker').datepicker({
  autoclose: true,
  todayHighlight: true,
  format: 'yyyy-mm-dd'
}).on('changeDate', function(e) {
  this.form.submit();
});
$('#autoclose-datepicker,#autoclose-datepicker1').datepicker({
  autoclose: true,
  todayHighlight: true,
  format: 'yyyy-mm-dd'
});

//IS_579
$('.expense-income-cls').datepicker({
  autoclose: true,
  todayHighlight: true,
  format: 'yyyy-mm-dd'
});
$('.expense-income-cls').datepicker('setEndDate', date);
//IS_579


$('#autoclose-datepicker,#autoclose-datepicker2').datepicker({
  autoclose: true,
  todayHighlight: true,
  startDate: date,
  format: 'yyyy-mm-dd'
});

$('#autoclose-datepicker-dob').datepicker({
  autoclose: true,
  todayHighlight: true,
  format: 'yyyy-mm-dd'
});




$('.valid-till').datepicker({
  autoclose: true,
  todayHighlight: true,
  startDate: date,
  format: 'yyyy-mm-dd'
});
//19march2020
var maxdate = new Date(); //get current date
maxdate.setDate(maxdate.getDate() + 30);
$('.valid-till').datepicker("setDate", maxdate);

$('#autoclose-datepickerFrom,#autoclose-datepickerTo').datepicker({
  autoclose: true,
  todayHighlight: true,
  format: 'yyyy-mm-dd',
  // endDate: '+365d',
});

$('#inline-datepicker').datepicker({
  todayHighlight: true
});

$('#dateragne-picker .input-daterange').datepicker({
  autoclose: true,
  /*startDate: date,*/
  format: 'yyyy-mm-dd',
  //IS_805 28fe2020
  todayHighlight: true,
});

$('#dateragne-pickerNew .input-daterange').datepicker({
  //IS_805 28feb2020
  todayHighlight: true,
  autoclose: true,
  endDate: date,
  format: 'yyyy-mm-dd',
  minDate: '-30d',
});

//11march2020 IS_1131
var mindate = new Date();
mindate.setDate(mindate.getDate() - 30);
$('#dateragne-pickerBill .input-daterange').datepicker({
  todayHighlight: true,
  format: 'yyyy-mm-dd',
  autoclose: true,

  startDate: mindate,
  maxDate: '0'

});
//11march2020 IS_1131





// Material Datekpicer code

var FromEndDate = new Date();

$('#event-start-date').bootstrapMaterialDatePicker({
  format: 'YYYY-MM-DD',
  minDate: FromEndDate,
  time: false,
});
$('#event-end-date').focus(function () {
  var startDate = $('#event-start-date').val();
  if (startDate == '') {
    swal("Please select Start Date first.!", {
      icon: "warning",
    });
  }
});

//28march2020
//replace this code with below code
$('#event-start-date').change(function () {
  var startDate = $('#event-start-date').val();
  var endDate = $('#event-end-date').val();
  if (endDate == '') {
    $('#event-end-date').bootstrapMaterialDatePicker({
      format: 'YYYY-MM-DD',
      minDate: startDate,
      time: false,
    });
  }
});

var eventStartDate = $('#event-start-date').val();
if (eventStartDate != '') {
  $('#event-end-date').bootstrapMaterialDatePicker({
    format: 'YYYY-MM-DD',
    minDate: eventStartDate,
    time: false,
  });
}



// $('#event-start-date').change(function() {
//   var startDate = $('#event-start-date').val();
//   // $('#event-end-date').val(startDate);
// });
//28march2020

// facility

$('.facility-start-date').bootstrapMaterialDatePicker({
  date: false,
  format: 'HH:mm',
});

$('.facility-end-date').focus(function () {
  var startDate = $('.facility-start-date').val();
  if (startDate == '') {
    swal("Please select Start Time first", {
      icon: "warning",
    });
  }
});
$('.facility-start-date').change(function () {
  var startDate = $('.facility-start-date').val();
  $('.facility-end-date').val(startDate);
  $('.facility-end-date').bootstrapMaterialDatePicker({
    date: false,
    format: 'HH:mm',
    minDate: startDate,
  });
});


// dat time picker
$('#date-time-picker').bootstrapMaterialDatePicker({
  format: 'YYYY-MM-DD HH:mm',
  maxDate: FromEndDate
});



// only date picker
$('#date-picker').bootstrapMaterialDatePicker({
  time: false
});

//19march2020
// only time picker
$('.time-picker').bootstrapMaterialDatePicker({
  date: false,
  format: 'hh:mm A'
});

$('.time-picker-session').bootstrapMaterialDatePicker({
  date: false,
  time: true,
  format: 'hh:mm A', 
  shortTime: true,  
  twelvehour: true   
});

$('.session-time-picker').bootstrapMaterialDatePicker({
  date: false,
  format: 'HH:mm:ss'
});

// only time picker
$('.time-picker1').bootstrapMaterialDatePicker({
  date: false,
  format: 'hh:mm A'
});

$('.time-picker-end').bootstrapMaterialDatePicker({
  date: false,
  format: 'hh:mm A',
});

$('#start-date').datepicker({
  weekStart: 1,
  /*startDate: firstDay,*/
  format: 'dd-mm-yyyy',
  autoclose: true,
  endDate: $('#end-date').val()
})
  .on('changeDate', function (selected) {
    startDate = new Date(selected.date.valueOf());
    startDate.setDate(startDate.getDate(new Date(selected.date.valueOf())));
    $('#end-date').val();
    $('#end-date').datepicker('setStartDate', startDate);
  });
$('#end-date')
  .datepicker({
    weekStart: 1,
    /*startDate: firstDay,*/
    format: 'dd-mm-yyyy',
    autoclose: true
  })
  .on('changeDate', function (selected) {
    FromEndDate = new Date(selected.date.valueOf());
    FromEndDate.setDate(FromEndDate.getDate(new Date(selected.date.valueOf())));
    $('#start-date').datepicker('setEndDate', FromEndDate);
  });


$('#start_date').datepicker({
  weekStart: 1,
  /*startDate: firstDay,*/
  format: 'yyyy-mm-dd',
  autoclose: true,
  endDate: $('#end-date').val()
})
  .on('changeDate', function (selected) {
    startDate = new Date(selected.date.valueOf());
    startDate.setDate(startDate.getDate(new Date(selected.date.valueOf())));
    $('#end_date').val();
    $('#end_date').datepicker('setStartDate', startDate);
  });
$('#end_date')
  .datepicker({
    weekStart: 1,
    /*startDate: firstDay,*/
    format: 'yyyy-mm-dd',
    autoclose: true
  })
  .on('changeDate', function (selected) {
    FromEndDate = new Date(selected.date.valueOf());
    FromEndDate.setDate(FromEndDate.getDate(new Date(selected.date.valueOf())));
    $('#start_date').datepicker('setEndDate', FromEndDate);
  });


$('#autoclose-datepicker-evt').datepicker({
  autoclose: true,
  todayHighlight: true,
  startDate: date,
  format: 'dd-mm-yyyy',
  minDate: date
});

$('#deadline_date').datepicker({
  autoclose: true,
  todayHighlight: true,
  startDate: date,
  format: 'yyyy-mm-dd',
  minDate: date
});



$('#requirement_gathering_date').datepicker({
  autoclose: true,
  todayHighlight: true,
  endDate: date,
  format: 'yyyy-mm-dd',
  minDate: date
});

$('#visitTime').bootstrapMaterialDatePicker({
  autoclose: true,
  todayHighlight: true,
  format: 'YYYY-MM-DD HH:mm:ss',
});


var maxdate = new Date(); //get current date
maxdate.setDate(maxdate.getDate() + 30);
$('.valid-till').datepicker("setDate", maxdate);
$('#autoclose-datepickerFrom').datepicker({
  autoclose: true,
  todayHighlight: true,
  format: 'yyyy-mm-dd',
  endDate: '+365d',
}).on("changeDate", function (e) {
  $('#autoclose-datepickerTo').val('');
  var dt = new Date(e.format())
  // console.log(dt);
  $('#autoclose-datepickerTo').datepicker('destroy').datepicker({
    autoclose: true,
    todayHighlight: true,
    format: 'yyyy-mm-dd',
    startDate: dt,
    endDate: '+365d',
  })
});
$('#autoclose-datepickerTo').datepicker({
  autoclose: true,
  todayHighlight: true,
  format: 'yyyy-mm-dd',
  endDate: '+365d',
})

$('#academicYearStartDate').datepicker({
  autoclose: true,
  todayHighlight: true,
  format: 'yyyy-mm-dd'
}).on("changeDate", function (e) {
  $('#academicYearEndDate').datepicker({
    autoclose: true,
    todayHighlight: true,
    startDate: e.date,
    format: 'yyyy-mm-dd'
  })
});

//start dharti 14-2-2025
$('.autoclose-datepicker').datepicker({
  autoclose: true,
  todayHighlight: true,
  format: 'yyyy-mm-dd'
});
//end dharti 14-2-2025

//dhruvi--17/03/2025
var today = new Date();
$('#autoclose-datepicker-futureDateRestricted').datepicker({
  autoclose: true,
  todayHighlight: true,
  format: 'yyyy-mm-dd',
  endDate: today
});


$(document).on('focus', '.autoclose-datepicker-date', function () {
  $(this).datepicker({
    autoclose: true,
    todayHighlight: true,
    format: 'yyyy-mm-dd',
    orientation: 'bottom auto',
    zIndexOffset: 9999
  }).datepicker('show');
});
