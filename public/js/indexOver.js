$(document).ready(function() {        
    var socket = io.connect('http://10.17.1.80:3000', { 'forceNew': true });
    $(".searchBody").hide();
    $("#toggleFormFichaCuenta").click(function(){
        $( "#cntFormFichaCuenta" ).toggle("medium");
    });
    $("#toggleFormFichaNomen").click(function(){
        $( "#cntFormFichaNomen" ).toggle("medium");
    });
    $("#toggleFormPlanchetaNomen").click(function(){
        $( "#cntFormPlanchetaNomen" ).toggle("medium");
    });
    $(".dataPreview").hover(function(){
        console.log('Estas arriba de un dataPreview');        
    });

    $("#btnDownload").click(function(){
       window.alert("No implementado");
    });

    $("#btnPrint").click(function(){
       window.print();
    });
    
    socket.on('fichaData', function(data){    
        console.log(data);
        $( "#cntImg" ).empty();
            var img = $('<img />',{
            id:'imgID',
            src: 'data:image/png;base64,' + data
        });
        img.appendTo($('#cntImg'));
        console.log(img)
    });
});







