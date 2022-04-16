window.onload=function(){

    initialLoad();

    $('.sortBy').on('change',function(){
        localStorage.setItem("sortBy",$(this).val());
        getJSONdata(writeProducts,'products');
    });

    $('.searchFilter').on('input',function(e){
        getJSONdata(writeProducts,'products');
    });

    $('.aboutLink').on('click',function(){
        $(".about").toggle();
    });
    

    
}

function initialLoad(){
    $(".alert-success").hide();
    getJSONdata(writeCategories,'categories');
    getJSONdata(writeGallery,'gallery');
    getJSONdata(writeMenu,'menu');
    getJSONdata(writeProducts,'products');
}

function writeCategories(data){
    var ispis="";
    for(category of data)
    {
        ispis+=`<input type='checkbox' class='singleCategory' id='${category.id}' value='${category.id}'><label for='${category.id}'>${category.naziv}</label><br>`;
    }
    ispis+="</select>";
    $(".filterWrapper").html(ispis);
    let checkedValues=localStorage.getItem("filterByCategory");
    for(kategorija of $(".singleCategory")){
        if(checkedValues.includes(kategorija.value)){
            kategorija.checked=true;
        }
    }
    $('.singleCategory').on('click',function(){
        getJSONdata(writeProducts,'products');
    });
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


function sortProducts(products){
    var selectedValue=localStorage.getItem("sortBy");
    if(!selectedValue){
        selectedValue="PA";
        localStorage.setItem("sortBy",selectedValue);
    }
    $(`.sortBy option[value="${selectedValue}"]`).prop('selected', true)
    if(selectedValue[0]=='P'){
        if(selectedValue[1]=='D')
            products.sort(function(a,b){
                return b.price-a.price;
            });
        else products.sort(function(a,b){
            return a.price-b.price;
        });
    }
    else{
        if(selectedValue[1]=='D')
            products.sort(function(a,b){
                if(a.name>b.name)
                    return -1;
                else return 1;
            });
        else products.sort(function(a,b){
            if(a.name>b.name)
                    return 1;
                else return -1;
        });
    }
    return products;
}


function filterByCategory(products){
    var checkedValues=$(".filterWrapper input:checked").map(function(){
        return $(this).val();
    }).get();
    if(checkedValues.length>0) {
        products=products.filter(function(product){
            for(kategorija of product.kategorija){
                if(checkedValues.includes(kategorija))
                    return true;
            }
            return false;
        });
    }
    localStorage.setItem("filterByCategory",checkedValues);
    return products;
}


function searchFilter(products){
    var searchValue=$('.searchFilterInput').val().toLowerCase();
    if(searchValue!="")
    {
        products=products.filter(function(a){
            return a.name.toLowerCase().includes(searchValue);
        })
    }
    return products;
}


function writeProducts(products){
    products = sortProducts(products);
    products = filterByCategory(products);
    products = searchFilter(products);
    var ispis=``;

    if(products.length>=4)
        for(i=0;i<products.length;i++){
            if(i%4==0){
                ispis+=`<div class="productsRow justify-content-center row">`;
                ispis+=`<div class="singleProduct col-sm-10 col-md-7 col-lg-2">`
            }else{
                ispis+=`<div class="singleProduct offset-lg-1 col-sm-10 col-md-7 col-lg-2">`
            }
               ispis+=` <p>${products[i].name}</p>
                <img src="${products[i].productImage}"><br>
                <strong>${products[i].price}.00RSD</strong><br>
                <button class='addToCartBtn' value='${products[i].id}'>Add to cart</button>
                </div>`;
            if(i%4==3)
                ispis+=`</div>`;
        }
    else if(products.length>1)
        for(i=0;i<products.length;i++){
            if(i%2==0)
                ispis+=`<div class="productsRow justify-content-center row">`;
            ispis+=`<div class="singleProduct offset-2 col-sm-10 col-md-3">
            <p>${products[i].name}</p>
             <img src="${products[i].productImage}"><br>
            <strong>${products[i].price}.00RSD</strong><br>
            <button class='addToCartBtn' value='${products[i].id}'>Add to cart</button>
            </div>`;
            if(i%2==1)
                ispis+=`</div>`;
        }
    else if(products.length==1)
        for(i=0;i<products.length;i++){
            ispis+=`<div class="productsRow justify-content-center row ">`;
            ispis+=`<div class="singleProduct col-10 ">
            <p>${products[i].name}</p>
            <img src="${products[i].productImage}"><br>
            <strong>${products[i].price}.00RSD</strong><br>
            <button class='addToCartBtn' value='${products[i].id}'>Add to cart</button>
            </div>`;
            ispis+=`</div>`;
        }
    else ispis+="<div class='row' style='height:400px'><h3 class='col-12 align-self-center '>No products to display</h3></div>";


    $('.productsWrapper').html(ispis);
    
    $('.addToCartBtn').click(function(){
        addToCart($(this).val());
    });
}


function addToCart(productId){
    var currentCart=JSON.parse(localStorage.getItem("products"));


    if(!currentCart)
    {
        currentCart=[]
    }
    else
    {
        var productInCart=false;
        for(product of currentCart)
        {
            if(product.id==parseInt(productId))
            {
                   productInCart=true;
                   product.quantity++;
            }
        }
    }

    if(!productInCart)
        currentCart.push({"id": parseInt(productId),"quantity":1});
    $("#success-alert").fadeTo(2000, 500).slideUp(500, function() {
        $("#success-alert").slideUp(500);
    });
    
    localStorage.setItem("products",JSON.stringify(currentCart));
}

function writeGallery(data){
    let ispis=''
    data.forEach(function (value, i) {
        if(i%4==0 || i==0)
            ispis+='<div class="galleryRow justify-content-center row">'
        ispis+=
        `
        <a data-fancybox="gallery" class=" col-sm-12 col-md-6 col-lg-3" value='${value.id}' href="${value.src}">
            <img src="${value.src}">
        </a>
        `
        if(i%4==3)
            ispis+='</div>';

    });
    $('.gallery').html(ispis);
}