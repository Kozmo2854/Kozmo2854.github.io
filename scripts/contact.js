window.onload = function () {
    $(".alert-success").hide();

    getJSONdata(writeMenu,'menu');


    let inputs = ["Name", "Email", "Tel", "Radio", "Message"];
    $(".btnForm").click(function () {
        let errors = [];
        for (input of inputs) {
            errors.push(checkInputs(input));
        }
        if(!errors.includes(1)){
            $("#success-alert").fadeTo(2000, 500).slideUp(500, function() {
                $("#success-alert").slideUp(500);
            });
        }
    })

    function checkInputs(inputName) {
        if ($(`.${inputName}`).val() == "" || (inputName == "Radio" && $(`.${inputName}:checked`).length == 0)) {
            $(`.displayError${inputName}`).show();
            return 1;
        } else {
            $(`.displayError${inputName}`).hide();
        }
    }

    function writeMenu(data){
        ispis='<ul>';
        data.forEach(menuItem=>{
            ispis+=`
                <li>
                    <a href="${menuItem.href}">${menuItem.naziv}</a>
                </li>
        `
        })
        ispis+="</ul>"
        $('.menu').html(ispis);
    }

    function getJSONdata(callbackFunction, file){
        $.ajax({
            url:"assets/JSONfiles/" + file + ".json",
            type:"JSON",
            method:"GET",
            success:function (data) {
                callbackFunction(data);
            }
        })
    }
}