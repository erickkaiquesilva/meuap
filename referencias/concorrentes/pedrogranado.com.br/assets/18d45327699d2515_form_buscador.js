$(document).ready(function () {

    
    // Configuração de exibição dos buscadores ao inicializar
    if ($(window).width() >= 1024) {
        $('.selectpicker').selectpicker('render');
        $('#btn_busca_avancada').hide();
        $('#btn_busca_rapida').hide();
    }
    else {
        if (/Android|webOS|iPod|BlackBerry/i.test(navigator.userAgent)) {
            $('.selectpicker').selectpicker('mobile');
        } else {
            $('.selectpicker').removeAttr('multiple');
        }
        $('#form_busca_avancada').hide();
        $('#btn_busca_rapida').hide();
    }

    // Configurações da exibição dos buscadores ao redimensionar a tela
    $(window).resize(function () {
        if ($(window).width() >= 1024) {
            $('#form_busca_rapida').show();
            $('#form_busca_avancada').show();
            $('#btn_busca_avancada').hide();
            $('#btn_busca_rapida').hide();
        }
        else {
            $('#form_busca_rapida').show();
            $('#btn_busca_avancada').show();
            $('#btn_busca_rapida').hide();
        }
    });
    
    // Validação dos campos dos formulários de busca
    $('#btn_free').click(function () {
        if ($('#busca_free').val() == '') {
            alert('Informe a(s) palavras(s)-chave(s)');
            return false;
        }
    });
    $('#btn_codigo').click(function () {
        if ($('#codigo').val() == '') {
            alert('Informe a(s) referência(s)');
            return false;
        }
    });

    // Configuração da exibição dos buscadores ao clicar nos botões especificados
    $('#btn_busca_avancada').click(function () {
        $('#btn_busca_rapida').show();
        $('#form_busca_avancada').show();
        $('#form_busca_rapida').hide();
    });
    $('#btn_busca_rapida').click(function () {
        $('#btn_busca_avancada').show();
        $('#form_busca_rapida').show();
        $('#form_busca_avancada').hide();
    });
});