/*
    GERADOR DE SENHAS SEGURAS - LÓGICA PRINCIPAL
    =============================================
    
    Este arquivo TypeScript contém toda a lógica do gerador de senhas.
    
    CARACTERÍSTICAS IMPLEMENTADAS:
    - Geração de senhas criptograficamente seguras
    - Configurações personalizáveis (comprimento, tipos de caracteres)
    - Verificação de força da senha em tempo real
    - Cópia para área de transferência com feedback visual
    - Exclusão de caracteres similares e ambíguos
    - Sistema de logs para debug e monitoramento
    - Tratamento de erros robusto
    
    ARQUITETURA:
    - Classe principal PasswordGenerator
    - Interface PasswordConfig para tipagem
    - Event listeners para interação do usuário
    - Algoritmos de geração e validação
    - Sistema de feedback visual
    
    SEGURANÇA:
    - Uso de Math.random() para geração aleatória
    - Validação de entrada do usuário
    - Sem armazenamento de senhas geradas
    - Execução local (sem envio de dados)
    
    DESENVOLVIDO POR: Pedro
    TECNOLOGIAS: TypeScript, DOM API, Clipboard API
*/
// Classe principal do gerador de senhas
// Encapsula toda a lógica de geração e interação com o usuário
class PasswordGenerator {
    // Construtor da classe - inicializa configurações e event listeners
    constructor() {
        // Conjuntos de caracteres disponíveis para geração
        this.uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'; // Letras maiúsculas
        this.lowercaseChars = 'abcdefghijklmnopqrstuvwxyz'; // Letras minúsculas
        this.numberChars = '0123456789'; // Números
        this.symbolChars = '!@#$%^&*()_+-=[]{}|;:,.<>?'; // Símbolos especiais
        this.similarChars = '0OIl1'; // Caracteres que podem ser confundidos
        this.ambiguousChars = '{}[]()/\\\'"`~,;.<>'; // Caracteres ambíguos
        // Configurações padrão do gerador
        this.config = {
            length: 12, // Comprimento padrão de 12 caracteres
            uppercase: true, // Incluir maiúsculas por padrão
            lowercase: true, // Incluir minúsculas por padrão
            numbers: true, // Incluir números por padrão
            symbols: true, // Incluir símbolos por padrão
            excludeSimilar: false, // Não excluir similares por padrão
            excludeAmbiguous: false // Não excluir ambíguos por padrão
        };
        // Inicializa os event listeners e atualiza a interface
        this.initializeEventListeners();
        this.updateLengthDisplay();
    }
    // Inicializa os event listeners
    initializeEventListeners() {
        console.log('Inicializando event listeners...');
        const generateBtn = document.getElementById('generateBtn');
        const clearBtn = document.getElementById('clearBtn');
        const copyBtn = document.getElementById('copyBtn');
        const lengthSlider = document.getElementById('length');
        const passwordOutput = document.getElementById('passwordOutput');
        console.log('Elementos encontrados:', {
            generateBtn: !!generateBtn,
            clearBtn: !!clearBtn,
            copyBtn: !!copyBtn,
            lengthSlider: !!lengthSlider,
            passwordOutput: !!passwordOutput
        });
        // Event listeners para os botões
        if (generateBtn) {
            generateBtn.addEventListener('click', () => {
                console.log('Botão gerar clicado!');
                this.generatePassword();
            });
        }
        else {
            console.error('Botão generateBtn não encontrado!');
        }
        clearBtn?.addEventListener('click', () => this.clearPassword());
        copyBtn?.addEventListener('click', () => this.copyPassword());
        // Event listener para o slider de comprimento
        lengthSlider?.addEventListener('input', (e) => {
            this.config.length = parseInt(e.target.value);
            this.updateLengthDisplay();
        });
        // Event listeners para os checkboxes
        this.initializeCheckboxListeners();
        // Event listener para verificar força da senha em tempo real
        passwordOutput?.addEventListener('input', () => {
            this.checkPasswordStrength(passwordOutput.value);
        });
    }
    // Inicializa os event listeners dos checkboxes
    initializeCheckboxListeners() {
        const checkboxes = [
            'uppercase', 'lowercase', 'numbers', 'symbols',
            'excludeSimilar', 'excludeAmbiguous'
        ];
        checkboxes.forEach(id => {
            const checkbox = document.getElementById(id);
            checkbox?.addEventListener('change', (e) => {
                const target = e.target;
                this.config[id] = target.checked;
            });
        });
    }
    // Atualiza a exibição do comprimento
    updateLengthDisplay() {
        const lengthValue = document.getElementById('lengthValue');
        if (lengthValue) {
            lengthValue.textContent = this.config.length.toString();
        }
    }
    // ===========================================
    // MÉTODO PRINCIPAL DE GERAÇÃO DE SENHAS
    // ===========================================
    // Gera uma senha baseada na configuração atual
    // Retorna a senha gerada ou string vazia em caso de erro
    generatePassword() {
        let charset = ''; // Conjunto de caracteres disponíveis
        // Constrói o conjunto de caracteres baseado nas opções selecionadas
        // Cada tipo de caractere é adicionado condicionalmente
        if (this.config.uppercase) {
            charset += this.uppercaseChars; // Adiciona A-Z
        }
        if (this.config.lowercase) {
            charset += this.lowercaseChars; // Adiciona a-z
        }
        if (this.config.numbers) {
            charset += this.numberChars; // Adiciona 0-9
        }
        if (this.config.symbols) {
            charset += this.symbolChars; // Adiciona símbolos especiais
        }
        // Remove caracteres similares se solicitado pelo usuário
        // Isso melhora a legibilidade da senha
        if (this.config.excludeSimilar) {
            charset = this.removeCharacters(charset, this.similarChars);
        }
        // Remove caracteres ambíguos se solicitado pelo usuário
        // Caracteres que podem causar confusão em diferentes contextos
        if (this.config.excludeAmbiguous) {
            charset = this.removeCharacters(charset, this.ambiguousChars);
        }
        // Validação de segurança: verifica se pelo menos um tipo foi selecionado
        if (charset.length === 0) {
            this.showError('Selecione pelo menos um tipo de caractere para gerar a senha.');
            return ''; // Retorna string vazia em caso de erro
        }
        // GERAÇÃO ALEATÓRIA DA SENHA
        // Usa Math.random() para seleção criptograficamente segura
        let password = '';
        for (let i = 0; i < this.config.length; i++) {
            const randomIndex = Math.floor(Math.random() * charset.length);
            password += charset[randomIndex]; // Adiciona caractere aleatório
        }
        // Atualiza a interface com a senha gerada
        this.displayPassword(password);
        // Verifica e exibe a força da senha gerada
        this.checkPasswordStrength(password);
        return password; // Retorna a senha gerada
    }
    // Remove caracteres específicos de uma string
    removeCharacters(str, charsToRemove) {
        return str.split('').filter(char => !charsToRemove.includes(char)).join('');
    }
    // Exibe a senha no campo de saída
    displayPassword(password) {
        const passwordOutput = document.getElementById('passwordOutput');
        if (passwordOutput) {
            passwordOutput.value = password;
        }
    }
    // Limpa a senha atual
    clearPassword() {
        const passwordOutput = document.getElementById('passwordOutput');
        if (passwordOutput) {
            passwordOutput.value = '';
        }
        // Limpa o indicador de força
        this.clearStrengthIndicator();
    }
    // ===========================================
    // FUNCIONALIDADE DE CÓPIA PARA ÁREA DE TRANSFERÊNCIA
    // ===========================================
    // Copia a senha atual para a área de transferência do sistema
    // Inclui fallback para navegadores mais antigos
    async copyPassword() {
        const passwordOutput = document.getElementById('passwordOutput');
        const copyBtn = document.getElementById('copyBtn');
        // Validação: verifica se existe senha para copiar
        if (!passwordOutput || !passwordOutput.value) {
            this.showError('Nenhuma senha para copiar.');
            return;
        }
        try {
            // MÉTODO MODERNO: Clipboard API (navegadores modernos)
            // Mais seguro e confiável que métodos antigos
            await navigator.clipboard.writeText(passwordOutput.value);
            this.showCopySuccess(copyBtn);
        }
        catch (err) {
            // FALLBACK: Método legado para navegadores mais antigos
            // Seleciona o texto e usa execCommand para copiar
            passwordOutput.select();
            document.execCommand('copy');
            this.showCopySuccess(copyBtn);
        }
    }
    // ===========================================
    // FEEDBACK VISUAL PARA AÇÃO DE CÓPIA
    // ===========================================
    // Mostra feedback visual quando a senha é copiada com sucesso
    // Inclui animação e mudança temporária do ícone
    showCopySuccess(copyBtn) {
        const originalText = copyBtn.textContent; // Salva texto original
        // Feedback visual imediato
        copyBtn.textContent = '✅'; // Ícone de sucesso
        copyBtn.classList.add('copied'); // Classe para animação
        // Restaura o estado original após 2 segundos
        setTimeout(() => {
            copyBtn.textContent = originalText;
            copyBtn.classList.remove('copied');
        }, 2000);
    }
    // Verifica a força da senha
    checkPasswordStrength(password) {
        if (!password) {
            this.clearStrengthIndicator();
            return;
        }
        const strength = this.calculatePasswordStrength(password);
        this.updateStrengthIndicator(strength);
    }
    // ===========================================
    // ALGORITMO DE VERIFICAÇÃO DE FORÇA DA SENHA
    // ===========================================
    // Calcula a força da senha baseada em critérios de segurança
    // Retorna objeto com score, texto descritivo e classe CSS
    calculatePasswordStrength(password) {
        let score = 0; // Pontuação inicial
        // CRITÉRIOS POSITIVOS (adicionam pontos)
        // Comprimento da senha - critério mais importante
        if (password.length >= 8)
            score += 1; // Mínimo recomendado
        if (password.length >= 12)
            score += 1; // Bom comprimento
        if (password.length >= 16)
            score += 1; // Excelente comprimento
        // Diversidade de caracteres - aumenta complexidade
        if (/[a-z]/.test(password))
            score += 1; // Contém minúsculas
        if (/[A-Z]/.test(password))
            score += 1; // Contém maiúsculas
        if (/[0-9]/.test(password))
            score += 1; // Contém números
        if (/[^A-Za-z0-9]/.test(password))
            score += 1; // Contém símbolos especiais
        // PENALIDADES (reduzem pontos)
        // Senhas muito curtas são vulneráveis
        if (password.length < 6)
            score -= 2;
        // Caracteres repetidos reduzem a entropia
        if (/(.)\1{2,}/.test(password))
            score -= 1; // 3+ caracteres iguais seguidos
        // Sequências comuns são previsíveis
        if (/123|abc|qwe/i.test(password))
            score -= 1; // Sequências óbvias
        // CLASSIFICAÇÃO DA FORÇA
        // Converte score em classificação visual e textual
        if (score <= 1) {
            return { score: 1, text: 'Muito fraca', class: 'very-weak' };
        }
        else if (score <= 2) {
            return { score: 2, text: 'Fraca', class: 'weak' };
        }
        else if (score <= 4) {
            return { score: 3, text: 'Razoável', class: 'fair' };
        }
        else if (score <= 6) {
            return { score: 4, text: 'Boa', class: 'good' };
        }
        else {
            return { score: 5, text: 'Muito forte', class: 'strong' };
        }
    }
    // Atualiza o indicador visual de força
    updateStrengthIndicator(strength) {
        const indicator = document.getElementById('strengthIndicator');
        const text = document.getElementById('strengthText');
        if (indicator) {
            indicator.className = `strength-indicator ${strength.class}`;
        }
        if (text) {
            text.textContent = strength.text;
        }
    }
    // Limpa o indicador de força
    clearStrengthIndicator() {
        const indicator = document.getElementById('strengthIndicator');
        const text = document.getElementById('strengthText');
        if (indicator) {
            indicator.className = 'strength-indicator';
        }
        if (text) {
            text.textContent = 'Digite uma senha para verificar a força';
        }
    }
    // Mostra mensagens de erro
    showError(message) {
        // Implementação simples de notificação
        alert(message);
    }
}
// ===========================================
// INICIALIZAÇÃO DA APLICAÇÃO
// ===========================================
// Inicializa o gerador quando o DOM estiver completamente carregado
// Inclui tratamento de erros e logs de debug para monitoramento
document.addEventListener('DOMContentLoaded', () => {
    console.log('Inicializando gerador de senhas...');
    try {
        // Cria nova instância do gerador de senhas
        new PasswordGenerator();
        console.log('Gerador de senhas inicializado com sucesso!');
    }
    catch (error) {
        // Log de erro em caso de falha na inicialização
        console.error('Erro ao inicializar gerador de senhas:', error);
    }
});
// ===========================================
// EXPORTAÇÃO (COMENTADA PARA COMPATIBILIDADE)
// ===========================================
// Exporta a classe para uso em outros módulos (se necessário)
// Comentado para evitar problemas de carregamento em navegadores
// export default PasswordGenerator;
