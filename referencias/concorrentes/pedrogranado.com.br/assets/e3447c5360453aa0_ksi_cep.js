/*
	ksi_cep
	Ruan Campos
	26/07/2021
*/
    function ksi_cep(ids, options) {
        $('#' + ids.cep).keyup(function() {
            ksi_cep_consultar_cep(ids, options);
        });      
    }

    function ksi_cep_consultar_cep(ids, options) {
        var cep = $('#' + ids.cep).val();
        var cep_numbers = cep.replaceAll('-', '');
        
        if (cep_numbers.length == 8) {
            ksi_cep_star_loading(ids);
            var data = {
                cep: cep_numbers
            };
            
            $.ajax({
                url: location.origin + "/kurole_include/biblioteca/ksi_componentes/ksi_cep/ksi_cep_consultar.php",
                method: "GET",
                data: data
            })
                .done(function(retorno) {
                    ksi_cep_build_fields(ids, retorno);
                    ksi_cep_stop_loading();
                    if (options != null && options.finalizado != null) {
                        options.finalizado(retorno);
                    }
                })
                .fail(function(jqXHR, textStatus) {
                    ksi_cep_stop_loading();
                    if (options != null && options.finalizado != null) {
                        options.finalizado({erro: textStatus});
                    }
                });	
        } else {
            if (options != null && options.finalizado != null) {
                options.finalizado({});
            }
        }  
    }

    function ksi_cep_star_loading(ids) {
        $('#' + ids.cep).after('<img id="ksi-cep-loading" src="/kurole-sistema-imobiliario/img/carregando.gif">');
    }

    function ksi_cep_stop_loading() {
        $('#ksi-cep-loading').remove();
    }

    function ksi_cep_build_fields(ids, data) {
        $('#' + ids.logradouro).val(data.logradouro);
        $('#' + ids.complemento).val(data.complemento);
        $('#' + ids.bairro).val(data.bairro);
        $('#' + ids.cidade).val(data.cidade);
        $('#' + ids.estado).val(data.estado);
		
	
		if ("flag_cep_unico" in data){
			if (data.flag_cep_unico == 1){
				['logradouro', 'bairro'].forEach(function(campo) {
					$('#' + ids[campo]).prop('disabled', false);
					$('#' + ids[campo]).removeAttr('onblur onclick readonly');
				});
			}
		}
    }