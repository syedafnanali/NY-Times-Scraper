$(document).ready(function() {
  $(".scrape").click(function(e) {
    e.preventDefault();

    $.get("/api/get").then(function(data) {
      $(".articles").remove();

      $.get("/").then(function() {
        bootbox.alert(
          "<h3 class='text-center m-top-80'>" + "Added new articles" + "<h3>",
          function(result) {
            location.reload();
          }
        );
      });
    });
  });

  $(".save-article").click(function() {
    var article = {};
    article.id = $(this).data("id");
    article.saved = true;
    
    $.ajax({
      method: "POST",
      url: "/api/articles",
      data: article
    }).then(function(data) {
      location.reload();
    });
  });

  $(".removeSaved").click(function() {
    var remove_saved = {};
    remove_saved.id = $(this).data("id");
    remove_saved.saved = false;

    $.ajax({
      method: "POST",
      url: "/api/articles",
      data: remove_saved
    }).then(function(data) {
      location.reload();
    });
  });

  $(".saved-buttons").on("click", function() {
    var art_id = $(this).attr("data-value");
    $("#saveButton").attr({ "data-value": art_id });

    $.get("/notes/" + art_id, function(data) {
      console.log(data);
      $("#noteModalLabel").empty();
      $("#notesBody").empty();
      $("#notestext").val("");
      $("#noteModalLabel").append(" " + art_id);

      for (var i = 0; i < data.note.length; i++) {
        var button =
          " <a href=/delete/" +
          data.note[i]._id +
          '><i class="pull-right fa fa-times fa-2x deletex" aria-hidden="true"></i></a>';
        $("#notesBody").append(
          '<div class="panel panel-default"><div class="noteText panel-body">' +
            data.note[i].body +
            "  " +
            button +
            "</div></div>"
        );
      }
    });
  });

  $(".savenote").click(function() {
    var thisId = $(this).attr("data-value");
    $.ajax({
      method: "POST",
      url: "/notes/" + thisId,
      data: {
        body: $("#notestext")
          .val()
          .trim()
      }
    }).done(function(data) {
      $("#noteModal").modal("hide");
    });
  });
});
