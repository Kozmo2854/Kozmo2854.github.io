window.onload = function(){
    getJSONdata(checkForKart,'products');
    getJSONdata(writeMenu,'menu');

    $('.shoppingCart').on('change','.productQuantity',function(){
        quanitityInCartChanged($(this).attr('data-id'),$(this).val());
    })

    $('.shoppingCart').on('click','.trash',function(){
        deleteitem($(this).val());
    })


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




function checkForKart(products){

    var currentCart = JSON.parse(localStorage.getItem("products"));

    if (currentCart==null){
        displayCart([]);
        return 0;
    }


    products = products.filter(product =>
        {
            let inCart=false;
            currentCart.forEach(productInCart =>
            {
                if(product.id==productInCart.id)
                {
                    inCart=true
                    product.quantity=productInCart.quantity
                }
            })
            return inCart;

        }
    )

    displayCart(products)
}



function deleteitem(itemId){

    var currentCart = JSON.parse(localStorage.getItem("products"));

    currentCart = currentCart.filter(product => {


        if(product.id==itemId)
            return false;
        return true;
    })


    localStorage.setItem('products',JSON.stringify(currentCart));

    getProducts(checkForKart);
}


function displayCart(productsTodisplay)
{
    var ispis=
    `
    <section class="jumbotron text-center">
        <div class="container">
            <h1 class="jumbotron-heading">Your Cart</h1>
        </div>
    </section>

        <div class="container mb-4">
            <div class="row">
                <div class="col-12">
                    <div class="table-responsive">
                        <table class="table table-striped">
                            <thead>
                                <tr class='tableNavigation'>
                                    <th scope="col"> </th>
                                    <th scope="col">Product</th>
                                    <th scope="col">Available</th>
                                    <th scope="col" class="text-center">Quantity</th>
                                    <th scope="col" class="text-right">Price</th>
                                </tr>
                            </thead>
                            <tbody>
    `;
    if(!productsTodisplay.length || productsTodisplay==null){

        ispis = displayCartEmpty(productsTodisplay,ispis);

    }
    else{

        ispis = displayCartFull(productsTodisplay,ispis);

    }

    

    $('.shoppingCart').html(ispis);
}

function displayCartFull(productsTodisplay,ispis){

    let total=0;

    productsTodisplay.forEach(product => {

        total+=product.quantity * product.price

        ispis+=
            `
                <tr class='productInCart'>
                    <td><img src=${product.productImage} /> </td>
                    <td>${product.name}</td>
                    <td></td>
                    <td><input class="form-control productQuantity" data-id=${product.id} type="text" value=${product.quantity} /></td>
                    <td class="text-right">${product.quantity * product.price} &euro;</td>
                    <td class="text-right"><button class="btn btn-sm btn-danger trash" value=${product.id}><i class="fa fa-trash"></i> </button> </td>
                </tr>
            `
    });



    ispis+=
        `
        <tr>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td><strong>Total</strong></td>
            <td class="text-right"><strong>${total} &euro;</strong></td>
        </tr>
        `
    ispis+=
        `
    </tbody>
                    </table>
                </div>
            </div>
            <div class="col mb-12 checkout">
                <div class="row">
                    <div class="col-sm-12  col-md-6">
                        <a href="index.html"><button class="btn btn-block btn-light">Continue Shopping</button></a>
                    </div>
                    <div class="col-sm-12 col-md-6 text-right">
                        <button class="btn btn-lg btn-block btn-success text-uppercase">Checkout</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `
    return ispis;
}

function displayCartEmpty(productsTodispay, ispis){
    ispis+=
        `
        </tbody>
                    </table>
                    </div>
                    <h3 class='col-12 align-self-center text-center'>No products to display</h3>
            </div>
            <div class="col mb-2">
                <div class="row">
                    <div class="col-md-12">
                        <a href="index.html"><button class="btn btn-block btn-success">Continue Shopping</button></a>
                    </div>
        `
    return ispis;
}


function quanitityInCartChanged(itemInCartId,quantityFromCart){
    var productsInCart = JSON.parse(localStorage.getItem('products'))   ;

    productsInCart.forEach(product => {
        if(product.id==itemInCartId)
            product.quantity=quantityFromCart
    })

    localStorage.setItem('products',JSON.stringify(productsInCart));
    getProducts(checkForKart)
}


function getProducts(callbackFunction){
    $.ajax({
        url:"assets/JSONfiles/products.json",
        type:"JSON",
        method:"GET",
        success:function (data) {
            callbackFunction(data);
        }
    })
}