
	var url_dominio = window.location.href;
	url_dominio = url_dominio.split("/");
	
	//comentei pq estava aplicando 2 mascaras 
	window.document.write('<script language="javascript" src="'+url_dominio[0]+'//'+url_dominio[2]+'/kurole_include/js/jquery.maskedinput.min-1.3.1.js"></script>'); // esta mskedinput funciona com jquery 10
	window.document.write('<script language="javascript" src="'+url_dominio[0]+'//'+url_dominio[2]+'/kurole_include/biblioteca/jquery-mask-plugin/1.14.15/dist/jquery.mask.min.js"></script>');
	window.document.write('<script language="javascript" src="'+url_dominio[0]+'//'+url_dominio[2]+'/kurole_include/js/countUp.min.js"></script>'); // Contador de digitos
	window.document.write('<script language="javascript" src="'+url_dominio[0]+'//'+url_dominio[2]+'/kurole_include/js/jquery.maskMoney.min.js"></script>'); // Contador de digitos
	window.document.write('<script language="javascript" src="'+url_dominio[0]+'//'+url_dominio[2]+'/kurole_include/js/jquery-ui.min.1.13.2.js"></script>'); // Contador de digitos
	

	//alert
	window.document.write('<link rel="stylesheet" href="'+url_dominio[0]+'//'+url_dominio[2]+'/kurole_include/biblioteca/jquery-confirm/jquery-confirm-v3.3.4/dist/jquery-confirm.min.css">');
	window.document.write('<script src="'+url_dominio[0]+'//'+url_dominio[2]+'/kurole_include/biblioteca/jquery-confirm/jquery-confirm-v3.3.4/dist/jquery-confirm.min.js"></script>');
	
// ksi_cep
    window.document.write('<script language="javascript" src="'+url_dominio[0]+'//'+url_dominio[2]+'/kurole_include/biblioteca/ksi_componentes/ksi_cep/ksi_cep.js"></script>');
	/*******************************************/
	// Contador
	// Para implementar, é só informar o id no elemento entre o total de imóveis
		$(document).ready(function() {
	   
			if($('#total-imoveis').length > 0){
				
				var total_limpo = $('#total-imoveis').html().replace(/\D/g, '');
				
				if(total_limpo > '0'){
					
					var options = {
										useEasing : true, 
										useGrouping : false,
										separator : '', 
										decimal : '',
									}
									var useOnComplete = false;
									var useEasing = true;
									var useGrouping = true;
								
									var ksi_total = new countUp('total-imoveis', 24.02, total_limpo, 0, 4.5, options);
									ksi_total.start();
				}
						
			} // verifica se existe o id total-imoveis
			
		});
	/********************************************/
		
	function objXMLHttp(){
			if (window.XMLHttpRequest){ //monzila, chrome, opera, safari, ie7+
				var objetoXMLHttp = new XMLHttpRequest();
				return objetoXMLHttp;
			}else{ //ie
				//versoes antigas de ie
				var versoes = ["MSXML2.XMLHttp.6.0","MSXML2.XMLHttp.5.0","MSXML2.XMLHttp.4.0","MSXML2.XMLHttp.3.0","MSXML2.XMLHttp.2.0","Microsoft.XMLHttp"];
	
	
						for ( var i=0; i<versoes.length; i++){
	
								try{
	
								var objetoXMLHttp = new ActiveXObject(versoes[i]);
								return objetoXMLHttp;
								} catch(ex){
	
								//nada aqui //kuroleweb design
	
								}//end try
	
						}//end for	
	
			}			
			return false;	
	} // end objXMLHttp
	
	
	function getDados_todos(objForm, num){
		//alert(objForm.elements.length);
			var params = new Array();
				for (var ii=0; ii<objForm.elements.length; ii++){
					/*alert(objForm.elements[ii].type);*/
					if (objForm.elements[ii].type == 'checkbox'){
						if (objForm.elements[ii].checked){
							var parametro = encodeURIComponent(objForm.elements[ii].name);
								parametro += "=";
								parametro += encodeURIComponent(objForm.elements[ii].value);
								params.push(parametro);
						}else{
							var parametro = encodeURIComponent(objForm.elements[ii].name);
								parametro += "=";
								parametro += "";
								params.push(parametro);
						}
						
					}else if (objForm.elements[ii].type == 'radio'){
						if (objForm.elements[ii].checked){
							var parametro = encodeURIComponent(objForm.elements[ii].name);
								parametro += "=";
								parametro += encodeURIComponent(objForm.elements[ii].value);
								params.push(parametro);
						}					
					}else if(objForm.elements[ii].type == 'select-multiple'){
						 for(i=0; i<objForm.elements[ii].length; i++)	{
							 if(num == 1){
								var parametro = encodeURIComponent(objForm.elements[ii].name);
									parametro += "=";
									parametro += encodeURIComponent(objForm.elements[ii].options[i].value); /* é o id */
									params.push(parametro);
							 }else{
								 if (objForm.elements[ii].options[i].selected) { 
									var parametro = encodeURIComponent(objForm.elements[ii].name);
										parametro += "=";
										parametro += encodeURIComponent(objForm.elements[ii].options[i].value); /* é o id */
										params.push(parametro);
								 }
							 }
						 }
					}else{
								var parametro = encodeURIComponent(objForm.elements[ii].name);
									parametro += "=";
									parametro += encodeURIComponent(objForm.elements[ii].value);
									params.push(parametro);
					}
				}//end for
			return params.join("&");
		}// end get dados funcao	
	
	
function passa_parametros_retorna_resultado(valor_x1, valor_x2, valor_x3, valor_x4, valor_x5) {
		
		//MENSAGEM OU IMAGEMS PARA PRE-LOAD
		if (valor_x4 ==  'nada'){
			var pre_load = "";
		}else{
			if (valor_x4 ==  ''){
				var pre_load = '<font color=red>CARREGANDO....</font>'; 
			}else{
				var pre_load = '<img alt="Aguarde" title="Aguarde" src="'+valor_x4+'" border="0">'; 
			}
			//retorna o carregando no ie 6 ou anterior
			window.document.getElementById(valor_x3).innerHTML=pre_load;
		}
	
		/*PEGANDO TODOS OS DADOS PSSADOS KUROLE*/
		var dados_X = valor_x1;	
		
		var oXMLHttp = objXMLHttp();
				oXMLHttp.open("POST", valor_x2, true);		
				if (typeof dados_X != 'object') {
					oXMLHttp.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
				}
				oXMLHttp.onreadystatechange = function(){
					if (oXMLHttp.readyState != 4 && pre_load != ''){	
						//alert(pre_load);
						mensagem_retorno_G(pre_load, valor_x3, valor_x5);
						return false;
					}
					
					if (oXMLHttp.readyState == 4){
						if (oXMLHttp.status == 200){
							mensagem_retorno_G(oXMLHttp.responseText, valor_x3, valor_x5);					
							//para o lytebox funcionar com ajax
							if (typeof dados_X != 'object') {
								if(dados_X.indexOf('no_lytebox') == -1){
									if(typeof initLytebox == "function"){
										initLytebox();
									}
								}
							}
						}else{
							console.log('Erro ao carregar!');
							//mensagem("Ocorreu um erro: "+oXMLHttp.statusText);
							mensagem_retorno_G(oXMLHttp.statusText, valor_x3, valor_x5);
						}
					}
				};//end function onreadystatechange
				oXMLHttp.send(dados_X);
				return false;
		
	}//final da funcao passa e retorna
	
	/* forma encurtada */
	function pprr(valor_x1, valor_x2, valor_x3, valor_x4, valor_x5){
		return passa_parametros_retorna_resultado(valor_x1, valor_x2, valor_x3, valor_x4, valor_x5);
	}
	
	//mensagem_retorno_G
	function mensagem_retorno_G(msg_R, valor_x3, valor_x5){
		var funcao = window.parent.muda_frame;
		var funcao2 = window.parent.parent.muda_frame;
		
		if (valor_x5 != ""){
			if (window.document.getElementById(valor_x5).style.display == 'none'){
				window.document.getElementById(valor_x5).style.display = '';
			}
		}
		
		if(msg_R.indexOf("<js>") != -1){
			var rsScpt1 = msg_R.split('<js>');
			var rsScript = rsScpt1[1]; 
			eval(rsScript);
		}
			
	
		if (valor_x3 && valor_x3 != "")
			window.document.getElementById(valor_x3).innerHTML=msg_R;
					
	}
	
	function checkKeycode(e) {
		var keycode;
		
		if(!e){
			window.event;	
		}
		if(e.keyCode){
			keycode = e.keyCode;	
		}else if(e.which){
			keycode = e.which
		}
		return keycode;
	}

	$( document ).ready(function() {
		$('input[name*=tel]').mask('(99) 9999-9999');
		$('input[name*=fone]').mask('(99) 9999-9999');
		$('input[name*=cel]').mask('(99) 99999-9999');
		$('input[name*=data]').mask('99/99/9999');
		$('input[name*=cep]').mask('99999-999');
		$('input[name=cpf]').mask('999.999.999-99');
		$('input[name=cnpj]').mask('99.999.999/9999-99');
	});
	
	$(function() {
		$('input[name*=valor]').maskMoney({thousands:'.', decimal:','});
	})
	
	function valida_cpf(cpf){
	var numeros, digitos, soma, i, resultado, digitos_iguais;
    digitos_iguais = 1;
    if (cpf.length < 11)
          return false;
    for (i = 0; i < cpf.length - 1; i++)
          if (cpf.charAt(i) != cpf.charAt(i + 1))
                {
                digitos_iguais = 0;
                break;
                }
    if(!digitos_iguais){
    	numeros = cpf.substring(0,9);
    	digitos = cpf.substring(9);
    	soma = 0;
     	for (i = 10; i > 1; i--)
     		soma += numeros.charAt(10 - i) * i;
     	resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
        if (resultado != digitos.charAt(0))
          	return false;
        numeros = cpf.substring(0,10);
          soma = 0;
          for (i = 11; i > 1; i--)
          	soma += numeros.charAt(11 - i) * i;
          resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
          if (resultado != digitos.charAt(1))
          	return false;
          	return true;
    }else
        return false;
  	}
	
	function valida_cnpj(cnpj) {

		cnpj = cnpj.replace(/[^\d]+/g,'');
	
		if(cnpj == '') return false;
	
		if (cnpj.length != 14)
			return false;
	
		// LINHA 10 - Elimina CNPJs invalidos conhecidos
		if (cnpj == "00000000000000" || 
			cnpj == "11111111111111" || 
			cnpj == "22222222222222" || 
			cnpj == "33333333333333" || 
			cnpj == "44444444444444" || 
			cnpj == "55555555555555" || 
			cnpj == "66666666666666" || 
			cnpj == "77777777777777" || 
			cnpj == "88888888888888" || 
			cnpj == "99999999999999")
			return false; // LINHA 21
	
		// Valida DVs LINHA 23 -
		tamanho = cnpj.length - 2
		numeros = cnpj.substring(0,tamanho);
		digitos = cnpj.substring(tamanho);
		soma = 0;
		pos = tamanho - 7;
		for (i = tamanho; i >= 1; i--) {
		  soma += numeros.charAt(tamanho - i) * pos--;
		  if (pos < 2)
				pos = 9;
		}
		resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
		if (resultado != digitos.charAt(0))
			return false;
	
		tamanho = tamanho + 1;
		numeros = cnpj.substring(0,tamanho);
		soma = 0;
		pos = tamanho - 7;
		for (i = tamanho; i >= 1; i--) {
		  soma += numeros.charAt(tamanho - i) * pos--;
		  if (pos < 2)
				pos = 9;
		}
		resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
		if (resultado != digitos.charAt(1))
			  return false; // LINHA 49
	
		return true; // LINHA 51
	}
	
	function valida_cpf_cnpj(cpf_cnpj){
		cpf_cnpj = cpf_cnpj.replace('.', '').replace('-', '').replace('.', '').replace('-', '').replace('/', '').replace('.', '');
		
		if(cpf_cnpj.length == 11){
			if(!valida_cpf(cpf_cnpj)){
				return false;	
			}else{
				return true;	
			}
		}else{
			if(!valida_cnpj(cpf_cnpj)){
				return false;	
			}else{
				return true;	
			}
		}
		
	}


	// Alerta
	var ksiAlertaOpcoes = {
		title: "KSI",
		content: '',
		animation: 'zoom',
		closeAnimation: 'scale',
		typeAnimated: true,
		animateFromElement: false,
		theme: 'light',
		columnClass: 'medium',
		  scrollToPreviousElement: true,
		scrollToPreviousElementAnimate: true
	}

	function configuracoesKsiAlertaOpcoes(titulo, conteudo, tipo, opcoes) {
		var retorno = ksiAlertaOpcoes;
		if (titulo != null) {
			retorno.title = titulo;
		}
		retorno.content = conteudo;
		if (tipo != null) {
			switch(tipo) {
				case 'sucesso':
				case 'success':
					retorno.type = "green";
					retorno.icon = "fa fa-check-circle";
					retorno.theme = "modern";
					break;
				case 'erro':
				case 'danger':
					retorno.type = "red";
					retorno.icon = "fa fa-times";
					retorno.theme = "modern";
					break;
				case 'alerta':
				case 'warning':
					retorno.type = "orange";
					retorno.icon = "fa fa-exclamation-circle";
					retorno.theme = "modern";
					break;
				case 'info':
					retorno.type = "blue";
					retorno.icon = "fa fa-info-circle";
					retorno.theme = "modern";
					break;
				default:
			}
		}
		if (opcoes != null) {
			if (typeof opcoes == 'object') {
				retorno = Object.assign(retorno, opcoes);	
			} else {
				retorno = Object.assign(retorno, JSON.parse(opcoes));
			}		
		}
		return retorno;
	}

	var componente_ksi_alerta;
	var componente_ksi_confirmacao;

	function ksi_alerta(titulo, conteudo, tipo, opcoes) {
		opcoes = configuracoesKsiAlertaOpcoes(titulo, conteudo, tipo, opcoes);
		//console.log(opcoes);
		opcoes.buttons = {
			ok: {
				  text: 'Fechar'
				, keys: ['enter']
			}
		};	

		if (opcoes.noOverlap && componente_ksi_alerta != null) {
			componente_ksi_alerta.close();
			setTimeout(function() {
				componente_ksi_alerta = window.top.$.alert(opcoes);		
			}, 1000);
		} else {
			componente_ksi_alerta = window.top.$.alert(opcoes);	
		}	
	}

