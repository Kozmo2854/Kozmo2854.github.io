window.onload = function () {
    let inputs = ["Name", "Email", "Tel", "Radio", "Message"];
    $(".btnForm").click(function () {
        let errors=[];
        for (input of inputs) {
            errors.push(checkInputs(input));
        }
        console.log(errors.length)
    })

    function checkInputs(inputName) {
        console.log($(`.${inputName}`).val());
        if (!$(`.${inputName}`).val() || (!$(`.${inputName}:checked`).length)) {
            $(`.displayError${inputName}`).show();
            return 1;
        } else {
            $(`.displayError${inputName}`).hide();
        }
    }
}