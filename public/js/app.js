$("#btn_validate").click( function () {
  $("#warnings").html("");
  $("#errors").html("");
  $("#results").html("");
  
  validate($("#ta_turtle").val(), function (feedback) {
    $.each(feedback.warnings, function (index, warning) {
      $("#warnings").append('<p id="warning' + index + '">' + warning + '<br/>');
    });
    
    $.each(feedback.errors, function (index, error) {
      $("#errors").append('<p id="error' + index + '">' + error + '<br/>');
    });

    if (feedback.errors.length === 0 && feedback.warnings.length === 0) {
      $("#results").append("Congrats! We've validated your output and it contains 0 errors or warnings.");
    }
  });
});
