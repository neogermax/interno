﻿/*--------------- region de variables globales --------------------*/
var ArrayMenu = [];
var HtmlTree;
var HtmlTree_Interno = "";
var User;
var Json_Arbol_carpetas;
var Estructura = [];
var Link;
/*--------------- region de variables globales --------------------*/

//evento load del menu
$(document).ready(function () {
    carga_eventos("Dialog_Charge_M");
    //capturamos la url
    var URLPage = window.location.search.substring(1);
    var URLVariables = URLPage.split('&');

    if (URLVariables.length <= 1) {
        User = URLVariables[0].replace("User=", "");
    }
    else {
        User = URLVariables[0].replace("User=", "");
        Link = URLVariables[1].replace("LINK=", "");
    }

    $("#User").html(User.toUpperCase());

   
    //traemos los datos
    transacionAjax_menu("consulta");

});

function transacionAjax_menu(State) {
    $.ajax({
        url: "/Menu/menuAjax.aspx",
        type: "POST",
        //crear json
        data: { "action": State,
            "user": $("#User").html()
        },
       //Transaccion Ajax en proceso
        success: function (result) {
            if (result == "") {
                ArrayMenu = [];
            }
            else {
                ArrayMenu = JSON.parse(result);

                for (ItemArray in ArrayMenu) {
                    if (Link == ArrayMenu[ItemArray].IDlink) {
                        $("#Title_form").html(ArrayMenu[ItemArray].DescripcionLink);
                    }
                }
                arbol();
            }
        },
        error: function () {
            $("#dialog").dialog("option", "title", "Disculpenos :(");
            $("#Mensaje_alert").text("Se genero error al realizar la transacción Ajax!");
            $("#dialog").dialog("open");
            $("#DE").css("display", "block");
        }
    });
}


//hace el menu dinamico desde la consulta de la BD
function arbol() {


    //Raiz del arbol
    for (itemArray in ArrayMenu) {
        if (ArrayMenu[itemArray].Tipo == 1) {
            //creamos json para guardarlos en un array
            Json_Arbol_carpetas = { "Padre": ArrayMenu[itemArray].IDRol, "Hijo": ArrayMenu[itemArray].Sub_Rol };
            Estructura.push(Json_Arbol_carpetas);
        }
        //raiz del arbol
        if (ArrayMenu[itemArray].Usuario === User.toUpperCase()) {
            HtmlTree = "<ol class='tree'><li><span class='cssToolTip_ver'><label for='C_" + ArrayMenu[itemArray].Sigla + "' >" + ArrayMenu[itemArray].Sigla + "</label><span>" + ArrayMenu[itemArray].DescripcionRol + "</span></span><input type='checkbox' id='C_" + ArrayMenu[itemArray].Sigla + "'/><ol><li id='Container_" + ArrayMenu[itemArray].Sigla + "'></li></ol></li></ol>";
            $("#Name_User").html(ArrayMenu[itemArray].Nombre);
        }
    }
    //pintar Raiz
    $("#container_menu").html(HtmlTree);


    var contP = 0;
    var IDInicial = "";
    var IDFinal = "";
    var cont = 0;
    var SubInicial = "";
    var SubFinal = "";

    for (itemArray in ArrayMenu) {
        //construir Carpetas 
        if (ArrayMenu[itemArray].Tipo == 1) {

            if (contP == 0) {
                IDInicial = ArrayMenu[itemArray].IDRol;
                IDFinal = ArrayMenu[itemArray].IDRol;
            }
            else {
                IDFinal = ArrayMenu[itemArray].IDRol;
            }

            if (IDInicial != IDFinal) {
                contP = 0;
                IDInicial = ArrayMenu[itemArray].IDRol;
                IDFinal = ArrayMenu[itemArray].IDRol;
                HtmlTree_Interno = "";
            }
            HtmlTree_Interno += "<ol><li><span class='cssToolTip_ver'><label for='C_" + ArrayMenu[itemArray].Sub_Rol + "'>" + ArrayMenu[itemArray].Sub_Rol + "</label><span>" + ArrayMenu[itemArray].DescripcionLink + "</span></span><input type='checkbox' id='C_" + ArrayMenu[itemArray].Sub_Rol + "' /><ol><li id='Container_" + ArrayMenu[itemArray].Sub_Rol + "'></li></ol></li></ol>";
            contP = contP + 1;
            //pintar carpetas
            $("#Container_" + ArrayMenu[itemArray].IDRol).html(HtmlTree_Interno);
        }
        //construir links
        else {
            if (cont == 0) {
                SubInicial = ArrayMenu[itemArray].Sub_Rol;
                SubFinal = ArrayMenu[itemArray].Sub_Rol;
                HtmlTree_Interno = "";
            }
            else {
                SubFinal = ArrayMenu[itemArray].Sub_Rol;
            }

            if (SubInicial != SubFinal) {
                cont = 0;
                SubInicial = ArrayMenu[itemArray].Sub_Rol;
                SubFinal = ArrayMenu[itemArray].Sub_Rol;
                HtmlTree_Interno = "";
            }
            HtmlTree_Interno += "<li class='file'><span class='cssToolTip_ver'><a href='" + ArrayMenu[itemArray].Ruta + User + "&LINK=" + ArrayMenu[itemArray].IDlink + "'>" + ArrayMenu[itemArray].DescripcionLink + "</a><span>" + ArrayMenu[itemArray].DescripcionLink + "</span></span></li>";
            cont = cont + 1;
            //pintar links
            $("#Container_" + ArrayMenu[itemArray].Sub_Rol).html(HtmlTree_Interno);
        }
    }


}