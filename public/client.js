$(document).ready(function(){
  /* Enable info circle hover document-wide */
  $('[data-toggle="tooltip"]').tooltip();

  /* Grey out unused table cells */
  $("td:empty").css("background-color", "lightgrey");

  /* Grey out & disable rows that are checked N/A, checklist background highligthing & row point addition for remainder */
  $(".form-check-input").change(function() {
    $(this).trigger("formatting");
  });

  $(".form-check-input").on("formatting", function(event) {
    let arr = [], i = 0, sum = 0;

    /* Highligthing & disabling */
    if (this.checked && $(this).parent().text() === "N/A for the community") {
      $(this).parents("tr").children("td").css("background-color", "lightgrey");
      $(this).parents("tr").find("input:gt(0)").prop("checked", false);
      $(this).parents("tr").find("input:gt(0)").prop("disabled", true);
      $(this).parents("tr").find("textarea").prop("disabled", true);
    } else if (!this.checked && $(this).parent().text() === "N/A for the community") {
      $(this).parents("tr").children("td").css("background-color", "#ffffff");
      $(this).parents("tr").find("input:gt(0)").prop("disabled", false);
      $(this).parents("tr").find("textarea").prop("disabled", false);
    } else if (!this.checked && this.type === "checkbox") {
      $(this).parents("td").css("background-color", "#ffffff");
    } else if (this.type === "radio") {
      $(this).parents("tr").children("td").css("background-color", "#ffffff");
    };
    if (this.checked) {
      $(this).parents("td").css("background-color", "#ffcd05");
    };

    /* Points addition */
    arr = $(this).parents("tr").find(".form-check-input");
    for (i = 0; i < arr.length; i++) {
      if (arr[i].checked) { sum += Number(arr[i].value) };
    };
    $(this).parents("tr").find("input").last().val(sum);
    sum = sum.toString()  + " points";
    $(this).parents("tr").find("output").html(sum);
    
    /* Re-grey out unused table cells */
    $("td:empty").css("background-color", "lightgrey");
    
  });

  /* Load scenario data (if any) */
  let url = "/db/data" + window.location.pathname;
  $.ajax({
    type: "GET",
    url: url,
    success: function(result) {
      $("#scenario").text("Scenario:  " + result.scen_name);
      $("#scen_carry").val(result.scen_name);
      
      /* Insert scenario data into form */
      let boundFormat;
      for (let key in result) {
        if (typeof(result[key]) === "string") { $("#" + key).val(result[key]) }
        else if (typeof(result[key]) === "number") {
          $("#" + key).prop("checked", true).trigger("formatting");
          $("#" + key + "_" + result[key]).prop("checked", true).trigger("formatting");
        };
      }
    }
  });
  
  /* Save scenario data */
  $("#form-data").on("submit", function(e) {
    $.ajax({
      type: "POST",
      url: url,
      data: $(this).serialize(),
      success: function(result) {
        alert(result);
      }
    });
    e.preventDefault();
  });

});