(function() {

    function Init() {

        $('#playerName').keyup(function() {
            if ($('#playerName').val().length == 0) {
                $('#submit_button').attr('disabled', 'disabled');
            } else {
                $('#submit_button').removeAttr('disabled');
            }
        });
    }

    $(Init);


})()