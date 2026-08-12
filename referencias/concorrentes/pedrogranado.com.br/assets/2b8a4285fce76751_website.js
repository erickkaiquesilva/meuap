$(document).ready(function () {

    // Habilita o scroll speed
    // $(function () {
    //     $.scrollSpeed(100, 800);
    // });

    // Configura a exibição do video da página inicial
    // if ($(window).width() < 1024) {
    //     $('video').remove();
    // }
    // $(window).resize(function() {
    //     if ($(window).width() < 1024) {
    //         $('video').remove();
    //     }
    //     else {
    //         $('#container_video_site').html(
    //             '<video class="d-none d-lg-block" muted autoplay loop>'+
    //                 '<source src="videos/institucional.mp4" type="video/mp4">'+
    //                 'Seu navegador n&atilde;o suporta v&iacute;deos incorporados'+
    //             '</video>'
    //         );
    //     }
    // });

    // Habilita os popovers do buscador principal
    $(function () {
        $("#busca_free")
            .popover({
                placement: 'top',
                title: 'Como uso este campo?',
                content: 'Exemplos de palavras-chave: Maringá, Centro, Apartamentos 2 Dormitórios'
            })
            .blur(function () {
                $(this).popover('hide');
            });
    });
    $(function () {
        $("#codigo")
            .popover({
                placement: 'top',
                title: 'Como uso este campo?',
                content: 'Exemplos de referência: 12232, 24456, 32248, 68792, 48756'
            })
            .blur(function () {
                $(this).popover('hide');
            });
    });
    
    // Habilita o elemento tooltip
    $('[data-toggle="tooltip"]').tooltip({trigger: 'hover'});

    /**
     * **************************************************************************************
     * SIMULADOR DE ESCRITURAS
     * **************************************************************************************
     */

    // Máscara dos campos monetários - Cálculo da escritura
    $('#valor').mask('000.000.000.000.000,00', {reverse: true});
	
	//Mascara para CPF ou CNPJ
	var options = {
		onKeyPress: function (cpf, ev, el, op) {
			var masks = ['000.000.000-000', '00.000.000/0000-00'];
			$('.cpfOuCnpj').mask((cpf.length > 14) ? masks[1] : masks[0], op);
		}
	}

	$('.cpfOuCnpj').length > 11 ? $('.cpfOuCnpj').mask('00.000.000/0000-00', options) : $('.cpfOuCnpj').mask('000.000.000-00#', options);
    
    // Cálculo da escritura
    $('#btn_escritura').click(function () {
        if ($('#valor').val() == '') {
            alert('Informe o valor do imóvel antes de realizar o cálculo da escritura');
            return false;
        }
    });
        
    // Verifica se o valor do imóvel foi informado
    $('#valor').change(function () {
        var valor = $(this).val();
        valor = valor.split('.').join('');
        valor = valor.replace(',', '.');
        console.log('Valor: ' + valor);

        // Calcula o ITBI
        var itbi = parseFloat(valor * 2 / 100).toFixed(2);
        $('#itbi').val(somatorio).unmask();
        $('#itbi').val(itbi).mask('000.000.000.000.000,00', {reverse: true});
        console.log('ITBI: ' + itbi);
        
        // Calcula o FUNREJUS
        var funrejus = parseFloat(valor * 0.2 / 100).toFixed(2);
        $('#funrejus').val(somatorio).unmask();
        $('#funrejus').val(funrejus).mask('000.000.000.000.000,00', {reverse: true});
        console.log('FUNREJUS: ' + funrejus);

        // Calcula o valor da escritura
        var certidao = $('#certidao').val();
        certidao = certidao.split('.').join('');
        certidao = certidao.replace(',', '.');
        certidao = parseFloat(certidao).toFixed(2);
        console.log('Certidão: ' + certidao);

        var escritura = $('#escritura').val();
        escritura = escritura.split('.').join('');
        escritura = escritura.replace(',', '.');
        escritura = parseFloat(escritura).toFixed(2);
        console.log('Escritura: ' + escritura);
        
        var registro = $('#registro').val();
        registro = parseFloat(registro).toFixed(2);
        console.log('Registro: ' + registro);

        // Calcula a escritura
        var somatorio = (parseFloat(itbi) + parseFloat(funrejus) + parseFloat(certidao) + parseFloat(escritura) + parseFloat(registro)).toFixed(2);
        console.log('Somatório: ' + somatorio);

        // Exibe o valor da escritura
        $('#btn_escritura').click(function () {
            $('#soma_valor').val(somatorio).unmask();
            $('#soma_valor').val(somatorio).mask('000.000.000.000.000,00', {reverse: true});
            $('#vl_escritura').html('R$ ' + $('#soma_valor').val());
            $('#vl_escritura').css('fontSize', '1.5rem').css('fontWeight', 'bold');
        });
    });
});



$('#cpf_usuario').on('keyup',function(e) {
	console.log('key cpf');
});

function redefinirSenha(id_input_cpfCnpj,passo,metodo){
	
	
	switch(passo){
			
		case 1:
			
			//Busca informacoes do usuario 
			let cpf_cnpj = $(`#${id_input_cpfCnpj}`).val().replace(/[^\d]/g, "");;
			
			if(cpf_cnpj.length == 11 || cpf_cnpj.length == 14){
				$('#feedback_login').html('')
				
				$.ajax({
					url: '/resources/redefinir_senha.php',
					method: 'POST',
					dataType: 'json',
					data: {
						l_usuario: cpf_cnpj,
						passo : 1						
					},
					error:(e)=>{
						console.log('Erro para redefinir senha', e)
						$('#feedback_login').html('<div class="alert alert-danger">Não foi possivel redefinir sua senha, Tente novamente</div>')
					},
					success:(r)=>{
						
						if(r.sucesso){
							
							
								
							if(r.sucesso.metodos.length > 1){
								//mostra ao usuario metodos que tem disponivel
								
								//Muda area visivel 
								$('#rp_step1').hide();
								$('#rp_step2').show();
								$('#rp_step3').hide();
								
								
								
								let html = '<ul class="list-group list-group-flush ist-group-item-action">';
								
								
								if(r.sucesso.celular.length > 2){
									
									
									let arr_celular = r.sucesso.celular.split(',')
									
									
									html += `
											  <li class="list-group-item list-group-item-action" >
													<a href="javascript:void(0)" class="row" onClick="redefinirSenha('cpf_usuario',2,'sms')" >
														<div class="col-2 text-center text-primary">
															<i class="fas fa-mobile-alt fa-3x"></i>
															<small>SMS</small>
														</div>
														<div class="col-10 d-flex align-items-center justify-content-center flex-column">
															<p class="mb-0 pb-0 text-muted">Enviar nova senha por sms para</p>
															<p class="mb-0 pb-0 text-primary"><strong>${arr_celular.join('<br>')}</strong></p>
														</div>
													</a>
											  </li>
											`;
									
								}
								
								if(r.sucesso.email.length > 2){
									
									
									let arr_email = r.sucesso.email.split(',')
									
								
								html += `
											  <li class="list-group-item list-group-item-action">
													<a href="javascript:void(0)" class="row" onClick="redefinirSenha('cpf_usuario',2,'email')" >
														<div class="col-2 text-center text-primary">
															<i class="far fa-envelope fa-3x"></i>
															<small>E-mail</small>
														</div>
														<div class="col-10 d-flex align-items-center justify-content-center flex-column">
															<p class="mb-0 pb-0 text-muted">Enviar nova senha por e-mail para</p>
															<p class="mb-0 pb-0 text-primary text-center"><strong>${arr_email.join('<br>')}</strong></p>
														</div>
													</a>
											  </li>
									   `;
									
								}
								
								html += '</ul>';
								
								
								$('#rp_step2').html(html);
								
								
								//Troca botoes de ações do modal
								$("#btn_proximo_redefinir_senha").hide();
								$("#btn_anterior_redefinir_senha").show();
							}else{
								//caso exista um metodo só já envie direto 
								
								if(r.sucesso.metodos[0] === 'email'){
									
									//Muda area visivel 
									$('#rp_step1').hide();
									$('#rp_step2').show();
									$('#rp_step3').hide();
									
									redefinirSenha('cpf_usuario',2,'email')
								}else if(r.sucesso.metodos[0] === 'celular'){
									
									//Muda area visivel 
									$('#rp_step1').hide();
									$('#rp_step2').show();
									$('#rp_step3').hide();
									
									redefinirSenha('cpf_usuario',2,'sms')
								}else{
									
									$('#feedback_login').html('<div class="alert alert-danger">Não encontramos nenhum email ou celular cadastrado para enviarmos sua nova senha, entre em contato com a imobiliária para atualizar seu cadastro.</div>');
								}
								
							}
							
						}else{
							$('#feedback_login').html('<div class="alert alert-danger">'+r.erro+'</div>');
						}
						
					}
				});
				
			}else{
				$('#feedback_login').html('<div class="alert alert-warning">O CPF/CNPJ é inválido</div>')
			}
			
			
		break;
			
		case 2:
			
			//Busca informacoes do usuario 
			
				let loading = `<li class="list-group-item" >
										<a href="javascript:void(0)" class="row">
											<div class="col-2 text-center text-primary">
												<img src="webroot/img/carregando.gif" class="img img-fluid">
												<small>Enviando...</small>
											</div>
											<div class="col-10 d-flex align-items-center justify-content-center flex-column">
												<p class="mb-0 pb-0 text-muted">ENVIANDO SUA NOVA SENHA</p>
												<p class="mb-0 pb-0 text-primary text-center"><strong>Aguarde...</strong></p>
											</div>
										</a>
								   </li>`;
				//loading
				$('#rp_step2').html(loading);
				
			
		
				$.ajax({
					url: '/resources/redefinir_senha.php',
					method: 'POST',
					dataType: 'json',
					data: {
						l_usuario: $(`#${id_input_cpfCnpj}`).val().replace(/[^\d]/g, ""),
						passo : 2,
						metodo : metodo
					},
					error:(e)=>{
						console.log('Erro para redefinir senha', e)
						$('#feedback_login').html('<div class="alert alert-danger">Não foi possivel redefinir sua senha, Tente novamente</div>')
						voltarStep(1)
					},
					success:(r)=>{
						
						if(r.sucesso){
							
							
							//Muda area visivel 
							$('#rp_step1').hide();
							$('#rp_step2').hide();
							$('#rp_step3').show();
								
							
							
							html = `<li class="list-group-item" >
										<a href="javascript:void(0)" class="row" onClick="redefinirSenha('cpf_usuario',2,'sms')" >
											<div class="col-2 text-center text-primary">
												<i class="far fa-paper-plane fa-3x"></i>
												<small>${metodo == 'sms' ? 'SMS': 'E-mail'}</small>
											</div>
											<div class="col-10 d-flex align-items-center justify-content-center flex-column">
												<p class="mb-0 pb-0 text-muted">SENHA ENVIADA</p>
												<p class="mb-0 pb-0 text-primary text-center"><strong>
												${
													metodo == 'sms' ? 
													'Um sms foi enviado para <br>'+r.cel.replace(',','<br>')+'<br> com sua nova senha': 
													'Um email foi enviado para <br>'+r.email.replace(',','<br>')+'<br> com sua nova senha'
												}
												</strong></p>
											</div>
										</a>
								   </li>`;
							
							
							$('#rp_step3').html(html);
								
								
							//Troca botoes de ações do modal
							$("#btn_proximo_redefinir_senha").hide();
							$("#btn_cancelar_redefinir_senha").hide();
							$("#btn_fechar_redefinir_senha").show();
							$("#btn_anterior_redefinir_senha").hide();
							
							
							
							
						}else{
							$('#feedback_login').html('<div class="alert alert-danger">'+r.erro+'</div>');
							
							voltarStep(1)
						}
						
					}
				})
			
		break;
	}
	

}


function voltarStep(step){
		 
	switch(step){
		case 1:
			
			console.log('voltar ao inicio')
			
			//Muda area visivel 
			$('#rp_step1').show();
			$('#rp_step2').hide();
			$('#rp_step3').hide();
			
			
			$('#rp_step2').html('');
			$('#rp_step3').html('');


			//Troca botoes de ações do modal			
			$("#btn_proximo_redefinir_senha").show();
			$("#btn_cancelar_redefinir_senha").show();
			$("#btn_fechar_redefinir_senha").hide();
			$("#btn_anterior_redefinir_senha").hide();

		break;
			
		
			
		case 'cancelar': 
			
			//Muda area visivel 
			$('#rp_step1').show();
			$('#rp_step2').hide();
			$('#rp_step3').hide();
			
			$('#rp_step2').html('');
			$('#rp_step3').html('');

			//Troca botoes de ações do modal
			$("#btn_proximo_redefinir_senha").show();
			$("#btn_cancelar_redefinir_senha").show();
			$("#btn_fechar_redefinir_senha").hide();
			$("#btn_anterior_redefinir_senha").hide();
			
			$('#cpf_usuario').val('')
			
		break;
	}

}
	
