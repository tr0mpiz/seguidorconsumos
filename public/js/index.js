
$(document).ready(function() {
    //console.log(consumos);
    var demoJson = {"data": [
                             {"motivo" : "carga sube", "importe" : "150", "mPago" : "efectivo", "fecha" : new Date()},  
                             {"motivo" : "mcdonalds", "importe" : "220", "mPago" : "debito", "fecha" : new Date()}, 
                             {"motivo" : "caramelos", "importe" : "23", "mPago" : "efectivo", "fecha" : new Date()}
                 ]};

    var table = null;
    
    table = $('#data-table').DataTable({
        //"ajax" : $('#data-table').data(demoJson),
        "aaData" : demoJson.data,
        "columns" : [
            {"data" : "motivo"},
            {"data" : "importe"},
            {"data" : "mPago"},
            {"data" : "fecha"}
        ]
    });
    $('#data-table').on( 'click', 'td', function () {
        alert( table.row( this ).data().tipo + "/" + table.row( this ).data().cuenta );
        //socket.emit('cuentaAFicha', {cuenta: table.row( this ).data().cuenta});        
    } );

});







