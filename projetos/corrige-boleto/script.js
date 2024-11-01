document.addEventListener('DOMContentLoaded', function() {
    const boletoInput = document.getElementById('boleto');
    const corrigidoInput = document.getElementById('corrigido');
    const valorInput = document.getElementById('valor');
    const cpfInput = document.getElementById('cpf');
    const alertElement = document.getElementById('alert');
    const modal = document.getElementById('modal');
    const closeModal = document.querySelector('.close');
    const acordosList = document.getElementById('acordosList');

    const showAlert = (message, type) => {
        alertElement.textContent = message;
        alertElement.style.background = type;
        alertElement.style.visibility = 'visible';
        alertElement.style.opacity = '1';
        setTimeout(() => {
            alertElement.style.visibility = 'hidden';
            alertElement.style.opacity = '0';
        }, 1500);
    };

    const getCookie = (name) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
    };

    const setCookie = (name, value, days) => {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        const expires = `expires=${date.toUTCString()}`;
        document.cookie = `${name}=${value};${expires};path=/`;
    };

    const deleteCookie = (name) => {
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    };

    const updateStats = () => {
        const stats = JSON.parse(getCookie('stats') || '{}');
        const today = new Date().toISOString().split('T')[0];
        const todayStats = stats[today] || { count: 0, totalValue: 0 };
        document.getElementById('acordos').textContent = todayStats.count; 
        document.getElementById('valorTotal').textContent = todayStats.totalValue.toFixed(2);
    };

    boletoInput.addEventListener('input', function() {
        const boleto = boletoInput.value;
        const corrigidoReais = boleto.replace(/R\$ [^ ]* /g, '');
        const corrigidoFinal = corrigidoReais.replace(/[^0-9]/g, '');
        corrigidoInput.value = corrigidoFinal;
        const valorRetirado = boleto.match(/R\$ [^ ]* /g);
        if (valorRetirado) {
            valorInput.value = valorRetirado[0].trim();
        } else if (boleto === '') {
            valorInput.value = '';
        }
    });

    document.querySelectorAll('button[id^="copiar"]').forEach(button => {
        button.addEventListener('click', function() {
            const inputId = button.id === 'copiarvalor' ? 'valor' : 'corrigido';
            const inputValue = document.getElementById(inputId).value;
            navigator.clipboard.writeText(inputValue);
            showAlert('Copiado!', '#28a745');
        });
    });

    document.getElementById('save').addEventListener('click', function() {
        let cpf = cpfInput.value.replace(/[^\d]+/g, '');
        const valor = parseFloat(valorInput.value.replace('R$ ', '').replace('.', '').replace(',', '.'));
        const corrigido = corrigidoInput.value;
        const boleto = boletoInput.value;
    
        if (!boleto || !valor || !corrigido) {
            showAlert('Preencha os campos obrigatórios!', '#dc3545');
            return;
        }
    
        if (cpf && !validarCPF(cpf)) {
            showAlert('CPF inválido!', '#dc3545');
            return;
        }
    
        const registros = JSON.parse(getCookie('registros') || '[]');
        const registroExistente = registros.find(r => r.boleto === boleto || r.corrigido === corrigido);
    
        if (registroExistente) {
            showAlert('Registro duplicado!', '#dc3545');
            return;
        }
    
        const cpfDuplicado = registros.find(r => r.cpf === cpf && cpf !== '');
        if (cpfDuplicado) {
            const confirmar = confirm('O CPF já está salvo. Tem certeza que deseja salvar com o mesmo CPF?');
            if (!confirmar) {
                return;
            }
        }
    
        registros.push({ cpf, valor, corrigido, boleto });
        setCookie('registros', JSON.stringify(registros), 365);
    
        const stats = JSON.parse(getCookie('stats') || '{}');
        const today = new Date().toISOString().split('T')[0];
        const todayStats = stats[today] || { count: 0, totalValue: 0 };
    
        todayStats.count += 1;
        todayStats.totalValue += valor;
        stats[today] = todayStats;
    
        setCookie('stats', JSON.stringify(stats), 365);
        updateStats();
        showAlert('Registro salvo!', '#28a745');
    });

    const validarCPF = (cpf) => {
        cpf = cpf.replace(/[^\d]+/g, '');
        if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;
    
        let soma = 0;
        let resto;
    
        for (let i = 1; i <= 9; i++) soma += parseInt(cpf.substring(i - 1, i)) * (11 - i);
        resto = (soma * 10) % 11;
        if (resto === 10 || resto === 11) resto = 0;
        if (resto !== parseInt(cpf.substring(9, 10))) return false;
    
        soma = 0;
        for (let i = 1; i <= 10; i++) soma += parseInt(cpf.substring(i - 1, i)) * (12 - i);
        resto = (soma * 10) % 11;
        if (resto === 10 || resto === 11) resto = 0;
        if (resto !== parseInt(cpf.substring(10, 11))) return false;
    
        return true;
    };

    valorInput.addEventListener('input', function() {
        let value = valorInput.value.replace(/\D/g, '');
        value = (value / 100).toFixed(2).replace(".", ",").replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
        valorInput.value = 'R$ ' + value;
    });

    cpfInput.addEventListener('input', function(e) {
        var value = e.target.value;
        var cpfPattern = value.replace(/\D/g, '') // Remove qualquer coisa que não seja número
                              .replace(/(\d{3})(\d)/, '$1.$2') // Adiciona ponto após o terceiro dígito
                              .replace(/(\d{3})(\d)/, '$1.$2') // Adiciona ponto após o sexto dígito
                              .replace(/(\d{3})(\d)/, '$1-$2') // Adiciona traço após o nono dígito
                              .replace(/(-\d{2})\d+?$/, '$1'); // Impede entrada de mais de 11 dígitos
        e.target.value = cpfPattern;
      });

    document.getElementById('zerar').addEventListener('click', function() {
        deleteCookie('registros');
        deleteCookie('stats');
        updateStats();
        showAlert('Cookies apagados!', '#dc3545');
    });

    document.getElementById('verAcordos').addEventListener('click', function() {
        const registros = JSON.parse(getCookie('registros') || '[]');
        acordosList.innerHTML = '';
    
        const table = document.createElement('table');
        table.classList.add('acordos-table');
    
        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');
        ['#', 'CPF', 'Valor', 'Boleto'].forEach(text => {
            const th = document.createElement('th');
            th.textContent = text;
            headerRow.appendChild(th);
        });
        thead.appendChild(headerRow);
        table.appendChild(thead);
    
        const tbody = document.createElement('tbody');
        registros.forEach((registro, index) => {
            const row = document.createElement('tr');
    
            const cellIndex = document.createElement('td');
            cellIndex.textContent = index + 1;
            row.appendChild(cellIndex);
    
            const cellCpf = document.createElement('td');
            cellCpf.textContent = registro.cpf;
            row.appendChild(cellCpf);
    
            const cellValor = document.createElement('td');
            cellValor.textContent = `R$ ${registro.valor.toFixed(2)}`;
            row.appendChild(cellValor);
    
            const cellCorrigido = document.createElement('td');
            cellCorrigido.textContent = registro.corrigido;
            row.appendChild(cellCorrigido);
    
            tbody.appendChild(row);
        });
        table.appendChild(tbody);
    
        acordosList.appendChild(table);
        modal.style.display = 'block';
    });

    closeModal.addEventListener('click', function() {
        modal.style.display = 'none';
    });

    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });

    updateStats();
});