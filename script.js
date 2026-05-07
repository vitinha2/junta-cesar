const EMAIL_CORRETO = "junta.cesar@outlook.com";
const PASS_CODIFICADA = "NTUwMDE1SmYq";
let reservasAtivas = [];

function carregarDados() {
    const dadosSalvos = localStorage.getItem('reservasCesar2026');
    if (dadosSalvos) reservasAtivas = JSON.parse(dadosSalvos);
}

function salvarDados() {
    localStorage.setItem('reservasCesar2026', JSON.stringify(reservasAtivas));
}

carregarDados();

document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    if (document.getElementById('loginEmail').value === EMAIL_CORRETO && btoa(document.getElementById('loginPass').value) === PASS_CODIFICADA) {
        document.getElementById('loginSection').style.display = 'none';
        document.getElementById('reservaSection').style.display = 'block';
    } else {
        document.getElementById('loginErro').style.display = 'block';
    }
});

function alternarVista(vista) {
    const cont = document.getElementById('mainContainer');
    if (vista === 'agenda') {
        document.getElementById('vistaAgenda').style.display = 'block';
        document.getElementById('vistaHistorico').style.display = 'none';
        document.getElementById('btnAgenda').classList.add('active');
        document.getElementById('btnHistorico').classList.remove('active');
        cont.classList.remove('wide');
    } else {
        document.getElementById('vistaAgenda').style.display = 'none';
        document.getElementById('vistaHistorico').style.display = 'block';
        document.getElementById('btnAgenda').classList.remove('active');
        document.getElementById('btnHistorico').classList.add('active');
        cont.classList.add('wide');
        renderizarHistorico();
    }
}

function verificarDisponibilidade() {
    const data = document.getElementById('checkData').value;
    const equip = document.getElementById('checkEquipamento').value;
    const painel = document.getElementById('statusPainel');
    if (!data) return;

    const ocupado = reservasAtivas.find(r => r.data === data && r.equipamento === equip);

    if (ocupado) {
        painel.className = "status-box ocupado";
        painel.innerHTML = `❌ OCUPADO<br><small>Reservado para: ${ocupado.nome} (${ocupado.contacto})</small>`;
        document.getElementById('formularioReserva').style.display = 'none';
    } else {
        painel.className = "status-box disponivel";
        painel.innerHTML = `✅ LIVRE<br><button onclick="abrirForm('${data}', '${equip}')" style="background:var(--accent); color:white; border:none; padding:8px 15px; border-radius:8px; cursor:pointer; margin-top:10px;">Marcar Agora</button>`;
    }
}

function abrirForm(data, equip, index = -1) {
    const formDiv = document.getElementById('formularioReserva');
    formDiv.style.display = 'block';
    document.getElementById('finalData').value = data;
    document.getElementById('finalEquipamento').value = equip;
    document.getElementById('editIndex').value = index;

    if (index !== -1) {
        const res = reservasAtivas[index];
        document.getElementById('tituloForm').innerText = "Editar Marcação";
        document.getElementById('nome').value = res.nome;
        document.getElementById('contacto').value = res.contacto;
        document.getElementById('hora').value = res.hora;
        document.getElementById('obs').value = res.obs || "";
        document.getElementById('btnConfirmarForm').innerText = "Atualizar Dados";
    } else {
        document.getElementById('tituloForm').innerText = "Nova Reserva";
        document.getElementById('reservaForm').reset();
        document.getElementById('btnConfirmarForm').innerText = "Confirmar e Gravar";
    }
}

document.getElementById('reservaForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const index = parseInt(document.getElementById('editIndex').value);
    const dados = {
        nome: document.getElementById('nome').value,
        contacto: document.getElementById('contacto').value,
        equipamento: document.getElementById('finalEquipamento').value,
        data: document.getElementById('finalData').value,
        hora: document.getElementById('hora').value,
        obs: document.getElementById('obs').value 
    };

    if (index === -1) {
        reservasAtivas.push(dados);
    } else {
        reservasAtivas[index] = dados;
    }

    salvarDados();
    alert("Operação realizada com sucesso!");
    document.getElementById('formularioReserva').style.display = 'none';
    verificarDisponibilidade();
    if (index !== -1) alternarVista('historico');
});

function renderizarHistorico() {
    const corpo = document.getElementById('corpoTabela');
    corpo.innerHTML = "";
    reservasAtivas.forEach((res, i) => {
        // Se houver observação, cria uma linha pequena para ela
        const obsTexto = res.obs ? `<br><span style="font-size:12px; color:#a0aec0; font-style:italic;">Obs: ${res.obs}</span>` : "";
        
        corpo.innerHTML += `<tr>
            <td>${res.data}<br><small>${res.hora}</small></td>
            <td>${res.equipamento}</td>
            <td><strong>${res.nome}</strong><br><small>${res.contacto}</small>${obsTexto}</td>
            <td style="text-align:center">
                <button onclick="prepararEdicao(${i})" class="btn-edit">✎</button>
                <button onclick="apagar(${i})" class="btn-delete">🗑</button>
            </td>
        </tr>`;
    });
}

function prepararEdicao(i) {
    const res = reservasAtivas[i];
    alternarVista('agenda');
    document.getElementById('checkData').value = res.data;
    document.getElementById('checkEquipamento').value = res.equipamento;
    verificarDisponibilidade(); 
    abrirForm(res.data, res.equipamento, i); 
}

function apagar(i) {
    if(confirm("Deseja eliminar esta reserva permanentemente?")) { 
        reservasAtivas.splice(i, 1); 
        salvarDados();
        renderizarHistorico(); 
    }
}

function cancelarMarcacao() { document.getElementById('formularioReserva').style.display = 'none'; }
function logout() { window.location.reload(); }