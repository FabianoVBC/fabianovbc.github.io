#!/bin/bash

# Carrega as variáveis do arquivo .env
if [ -f .env ]; then
    export $(cat .env | grep -v '#' | awk '/=/ {print $1}')
else
    echo "❌ Arquivo .env não encontrado."
    exit 1
fi

GITHUB_USER="FabianoVBC"
REPO_NAME="fabianocardoso"

if [ -z "$GITHUB_TOKEN" ] || [ "$GITHUB_TOKEN" == "cole_seu_token_aqui" ]; then
    echo "❌ Por favor, cole o seu token no arquivo .env"
    exit 1
fi

echo "=== Autenticador e Configurador do GitHub ==="
echo "Usuário: $GITHUB_USER"
echo "Repositório: $REPO_NAME"
echo ""

echo "✅ O repositório já existe no GitHub! Vamos continuar com o envio."

echo "⏳ Configurando o Git local e enviando os arquivos..."

git init

if ! git config user.name > /dev/null; then
    git config --local user.name "$GITHUB_USER"
    git config --local user.email "$GITHUB_USER@users.noreply.github.com"
fi

git add .
# Não enviar o .env para o GitHub!
git reset .env
git commit -m "Upload inicial do portfolio"

git branch -M main

git remote remove origin 2>/dev/null
git remote add origin "https://$GITHUB_USER:$GITHUB_TOKEN@github.com/$GITHUB_USER/$REPO_NAME.git"

echo "🚀 Enviando arquivos para o GitHub..."
git push -u origin main

if [ $? -eq 0 ]; then
    echo "🎉 Sucesso! Seus arquivos foram enviados."
    echo "Você pode ver seu repositório em: https://github.com/$GITHUB_USER/$REPO_NAME"
else
    echo "❌ Ocorreu um erro ao enviar os arquivos."
fi
