/*
 * 	Função que faz o carregamento dinamico dos selects
 
	Padrão do json retornado pelo script php, é retornado um para cada select
	id		: É o id do select
	name	: É o name do select
	title	: É o title do select
	opt		: retorna os options em objetos
		grupos: retorna um ou mais grupos de options
			grupo		: Se existir valor cria um optgroup para um grupo de options
			descricao	: Descrição do grupo de options
			valor		: value do grupos de options
			
	// json
	{
		busca:{
			'input_id': 'cidade',
			'input_name': 'cidade[]',
			'input_label': 'Cidades',
			'input_opt': {
				'grupos': [
					{
						'opt_grupo' 	: 'Nome do optgroup 1',
						'opt_label'		: ['descriao 1', 	'descricao 2', 	'descricao 3'],
						'opt_valor'		: ['valor 1', 		'valor 2', 		'valor 3'],
						'opt_total' 	: '',
						'query'			: ''
					},
					{
						'opt_grupo' 	: 'Nome do optgroup 2',
						'opt_label'		: ['descriao 1', 	'descricao 2', 	'descricao 3'],
						'opt_valor'		: ['valor 1', 		'valor 2', 		'valor 3'],
						'opt_total' 	: '',
						'query'			: ''					
					},
											{
						'opt_grupo' 	: 'Nome do optgroup 2',
						'opt_label'		: ['descriao 1', 	'descricao 2', 	'descricao 3'],
						'opt_valor'		: ['valor 1', 		'valor 2', 		'valor 3'],
						'opt_total' 	: '',
						'query'			: ''				
					}
				]
			}
		}
	}		 
 */
 
function fecha_select(){
	console.log('deu certo');
	$('.show-tick').removeClass('open');	
}


function atualiza_select(formulario, campos_valores, campos_retorno, classe_select, exibe_qtde){
	
	var url_dados 		= [];
	var url_monta 		= [];
	var url_pronta 		= '';
	var pesquisa 		= '';
	var order			= '';
	
	
	
	if(formulario == ""){
		console.log('Defina o id do formulario!');
		return false;
	}
	
	var url_dominio = window.location.href;
	url_dominio = url_dominio.split("/");
	url_dominio = url_dominio[0]+'//'+url_dominio[2]+'/';
	
	 
	
	if(campos_valores != ''){

		// Monta array com os nomes dos input's de onde pegaremos os valores para criarmos 
		// o select's que serão carregados
		$.each(campos_valores.split(','), function(key, value){
			if($('#'+value).length > 0){	
				url_dados.push(value);
			}else{
				console.log('O id #'+value+' informado não foi atribuido a nenhum select!');	
			}
		});
		
		
		
		// Monta o url com todos o parametros para atualização dos selects
		$.each(url_dados, function(index, value){
			// Se for select
			$('#'+formulario+' #'+value+' option').each(function(){
				if($(this).val() != ''){
					if(this.selected){
						url_monta.push(value +'[]='+ $(this).val());
					}
				}
			});
			
			// Se for input
			if ($('#' + formulario +' input#'+ value).length){
				if ($('#' + formulario +' input#'+ value).val() != '0') {
					url_monta.push(value +'='+ $('#' + formulario +' input#'+ value).val() +'');			
				}
			}
		});
		
		
				
		// Se foi passado ao menos um parametro continua a criação do select
		if(url_monta.length > 0){
			
			// Url com os parametros da busca, mas sem o parametro de entrada
			// Este paramentro de entrada será passado no loop dos campos novos
			// que serão carregados, isso porque é retornado um json para cada
			// select a ser carregado
			url_pronta = url_monta.join('&');
			
			if(campos_retorno != ''){
				
				// Loop dos campos a serem atualizado
				$.each(campos_retorno.split(','), function(idx, get_id_pesq){
					// Post da pesquisa completo
					pesquisa = get_id_pesq +'=true&'+ url_pronta;
					
					
					 //console.log(pesquisa);
					
					$.ajax({
						url: url_dominio+'kurole_include/site/sql_resultado_pesquisa/ajax_busca_selects.php',
						type: 'POST',
						dataType: 'json',
						data: pesquisa,
						success: function(dados){	

							 //console.log(dados.busca.input_label);

							// Elemento pai onde sera criado o select da busca
							var content_slct 	= $('#'+get_id_pesq);
							
							// Pega os dados do onchange de cada input
							var onchange_fucao 	= $('#'+dados.busca.input_id).attr('onchange');
							
							// classes do select
							var classes_slct_add = $('#'+dados.busca.input_id).attr('class');
							
							if(classes_slct_add == "undefined"){
								classes_slct_add = '';	
							}
							
							// Pega atributos style de cada select
							var style_css 	= $('#'+dados.busca.input_id).attr('style');
							
							if(style_css == "undefined"){
								style_css = '';	
							}
							
							// Atributos data
							var data_attr = '';	
							
							if(classe_select == 'selectpicker'){
								$.each($('#'+dados.busca.input_id).data(), function(data_key, data_val){
									if(data_key.toString() == 'selectedTextFormat'){										
										data_attr += ' data-selected-text-format="count" ';	
									}
									if(data_key.toString() == 'width'){
										data_attr += ' data-width="100%" ';
									}
									if(data_key.toString() == 'liveSearch'){
										data_attr += ' data-live-search="true" ';
									}
								});
							}
							
							// Verifica se o select possui o atributo multiplo	
							var multiplo_attr = $('#'+dados.busca.input_id).attr('multiple');
							var multiple_slct = "";	
							
							if(typeof multiplo_attr !== "undefined"){
								multiple_slct = "multiple";	
							}
							
							multiple_slct = "multiple";	
							
							//SOLICITADO PELO CLIENTE PEDROGRANADO
							if( /Android|webOS|iPhone|iPad|Mac|Macintosh|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
 								multiple_slct = "";	
							}
								
							// Inicio do select
							var slct = '<select name="'+dados.busca.input_name + "[]" +'" id="'+dados.busca.input_id+'" class="'+ classe_select +' '+ classes_slct_add +'" title="'+dados.busca.input_label+'" '+multiple_slct+' onchange="'+onchange_fucao+'" '+style_css+' '+data_attr+'>'
							
							// Caso a select nao seja multiplo adicionamo um option com valor '0' para simular o label
							if(multiple_slct == ''){
								slct += '<option value="0">'+ dados.busca.input_label +'</option>';
							}
							
							// Cria os options e optiongroup se hover
							$.each(dados.busca.input_opt.grupos, function(key, val){
								
								// Inicio do optgroup
								// val.grupo: Label que será exibido no optgroup
								if(val.opt_grupo != ''){
									slct += '<optgroup label="'+val.opt_grupo+'">';
								}
								
								// valor				: id do atributo
								// val.descricao[chave]	: É o que será exibido para o usuario
								$.each(val.opt_valor, function(chave, valor){
									var data_tokens = val.opt_label[chave] + ' ' + retira_acentos(val.opt_label[chave]);
									slct += 	'<option value="'+valor+'" data-tokens="' + data_tokens + '">' +
													val.opt_label[chave] +
													(exibe_qtde == 1 ? ' ('+val.opt_total[chave]+') ' : '')+
												'</option>';
									
									// console.log(val.opt_label[chave]+' = '+val.opt_total[chave]);
									
								});
								
								// Fim do optgroup
								if(val.opt_grupo != ''){
									slct += '</optgroup>';	
								}
							});

							// Fim do select	
							slct += '</select>';
							// console.log(slct);
							
							// Insere o elemento no html	
							$('#'+get_id_pesq).html(slct);
							
							
							// Verifica se o plugin existe antes de regarragá-lo
							// dropupAuto - determina se o select expande automatico para cima ou para baixo
							if($('.selectpicker').length > 0 && classe_select == 'selectpicker'){
								$('.selectpicker').selectpicker({
									countSelectedText: '{0} itens selecionados',
									noneResultsText: 'Nenhum resultado para: ',
									dropupAuto: false/*,
									mobile: ((/Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent))?true:false)*/
								});
							}
							
							if($('.chosen').length > 0 && classe_select == 'chosen'){
								$('.chosen').chosen({
									disable_search_threshold: 10
								});
							}
						}
					});
				}); // Loop dos campos a serem atualizado
				
			} // Campos retorno
		} // Parametros para busca criado
	} // Campos valores
}

function retira_acentos(str) 
{

    com_acento = "ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖØÙÚÛÜÝ?Þßàáâãäåæçèéêëìíîïðñòóôõöøùúûüýþÿ?";
    sem_acento = "AAAAAAACEEEEIIIIDNOOOOOOUUUUYRsBaaaaaaaceeeeiiiionoooooouuuuybyr";
    novastr="";
    for(i=0; i<str.length; i++) {
        troca=false;
        for (a=0; a<com_acento.length; a++) {
            if (str.substr(i,1)==com_acento.substr(a,1)) {
                novastr+=sem_acento.substr(a,1);
                troca=true;
                break;
            }
        }
        if (troca==false) {
            novastr+=str.substr(i,1);
        }
    }
    return novastr;
}       
