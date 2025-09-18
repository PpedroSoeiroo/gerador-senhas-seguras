#!/bin/bash

# Script para criar repositório no GitHub automaticamente
# Autor: Pedro
# Projeto: Gerador de Senhas Seguras

echo "🚀 CRIANDO REPOSITÓRIO NO GITHUB"
echo "================================"

# Configurações do repositório
REPO_NAME="gerador-senhas-seguras"
REPO_DESCRIPTION="Gerador de senhas moderno e seguro desenvolvido com HTML5, CSS3 e JavaScript"
REPO_USERNAME="PpedroSoeiroo"  # Substitua pelo seu username do GitHub

echo "📋 Configurações:"
echo "   Nome: $REPO_NAME"
echo "   Descrição: $REPO_DESCRIPTION"
echo "   Usuário: $REPO_USERNAME"
echo ""

# Verifica se já existe um remote
if git remote get-url origin >/dev/null 2>&1; then
    echo "⚠️  Remote 'origin' já existe!"
    echo "   URL atual: $(git remote get-url origin)"
    echo ""
    read -p "Deseja substituir? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        git remote remove origin
        echo "✅ Remote removido"
    else
        echo "❌ Operação cancelada"
        exit 1
    fi
fi

# Adiciona o remote
echo "🔗 Adicionando remote..."
git remote add origin "https://github.com/$REPO_USERNAME/$REPO_NAME.git"

if [ $? -eq 0 ]; then
    echo "✅ Remote adicionado com sucesso!"
else
    echo "❌ Erro ao adicionar remote"
    exit 1
fi

echo ""
echo "📤 Enviando código para o GitHub..."
git push -u origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "🎉 REPOSITÓRIO CRIADO COM SUCESSO!"
    echo "================================"
    echo "📁 Repositório: https://github.com/$REPO_USERNAME/$REPO_NAME"
    echo "🌐 GitHub Pages: https://$REPO_USERNAME.github.io/$REPO_NAME"
    echo ""
    echo "📋 Próximos passos:"
    echo "   1. Acesse: https://github.com/$REPO_USERNAME/$REPO_NAME"
    echo "   2. Configure GitHub Pages (Settings > Pages)"
    echo "   3. Compartilhe seu projeto!"
else
    echo ""
    echo "❌ ERRO AO ENVIAR PARA O GITHUB"
    echo "==============================="
    echo "Possíveis causas:"
    echo "   - Repositório não existe no GitHub"
    echo "   - Problemas de autenticação"
    echo "   - Conexão com internet"
    echo ""
    echo "🔧 Soluções:"
    echo "   1. Crie o repositório manualmente em: https://github.com/new"
    echo "   2. Configure a autenticação do Git"
    echo "   3. Execute novamente este script"
fi
