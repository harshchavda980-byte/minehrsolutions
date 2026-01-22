$(document).ready(function() {
  $('select').on('change', function() {  // when the value changes
    $(this).valid(); // trigger validation on this element
});

$('.datepicker-simple,.datepicker-simple-end').on('change', function() {  // when the value changes
    $(this).valid(); // trigger validation on this element
});

$('.single-select').select2({
  placeholder: "-- Select-- "
});
$('.single-select-country').select2({
  placeholder: "-- Select Country-- "
});
$('.single-select-state').select2({
  placeholder: "-- Select State-- "
});

$('.multiple-select').select2({
  placeholder: "-- Select-- "
});

$('.multiple-select1').select2({
  placeholder: "-- Select-- "
});

$('.multiple-select2').select2({
  placeholder: "-- Select-- "
});

$('.multiple-select3').select2({
  placeholder: "-- Select-- "
});

$('.multiple-select-keyword').select2({
  placeholder: " Type Keyword ",
  tags: true
});

$('.multiple-select-map').select2({
  placeholder: " Type Midale City name ",
  tags: true
});

$('.select-map-from').select2({
  placeholder: "From City Name",
  tags: true
});

$('.select-map-to').select2({
  placeholder: "To City Name",
  tags: true
});

$('.complain-select').select2({
  placeholder: "--Select Category--",
});

//multiselect start
$('#my_multi_select1').multiSelect();

$('.single-select-new').select2({
  placeholder: "-- Select-- ",
  minimumInputLength: 3
});


$('#my_multi_select2').multiSelect({
selectableOptgroup: true
});
$('#my_multi_select3').multiSelect({
selectableHeader: "<input type='text' class='form-control search-input' autocomplete='off' placeholder='search...'>",
selectionHeader: "<input type='text' class='form-control search-input' autocomplete='off' placeholder='search...'>",
afterInit: function (ms) {
var that = this,
$selectableSearch = that.$selectableUl.prev(),
$selectionSearch = that.$selectionUl.prev(),
selectableSearchString = '#' + that.$container.attr('id') + ' .ms-elem-selectable:not(.ms-selected)',
selectionSearchString = '#' + that.$container.attr('id') + ' .ms-elem-selection.ms-selected';
that.qs1 = $selectableSearch.quicksearch(selectableSearchString)
.on('keydown', function (e) {
if (e.which === 40) {
that.$selectableUl.focus();
return false;
}
});
that.qs2 = $selectionSearch.quicksearch(selectionSearchString)
.on('keydown', function (e) {
if (e.which == 40) {
that.$selectionUl.focus();
return false;
}
});
},
afterSelect: function () {
this.qs1.cache();
this.qs2.cache();
},
afterDeselect: function () {
this.qs1.cache();
this.qs2.cache();
}
});
$('.custom-header').multiSelect({
selectableHeader: "<div class='custom-header'>Selectable items</div>",
selectionHeader: "<div class='custom-header'>Selection items</div>",
selectableFooter: "<div class='custom-header'>Selectable footer</div>",
selectionFooter: "<div class='custom-header'>Selection footer</div>"
});
$('#companyId').select2({
  placeholder: "--Select--",
  ajax: {
    url: 'controller/feedbackController.php',
    dataType: 'json',
    type: "post",
    data: function (params) {
      var query = {
        action: "getCompanyList",
        search: params.term,
        csrf: csrf,        
      }
      return query;
    },
    processResults: function (response) {
      if (response.length > 0) {
        return {
          results: response
        };
      } else {
        return "No results found";
      }
    },
    cache: true
  },
  minimumInputLength: 3,
});
});
