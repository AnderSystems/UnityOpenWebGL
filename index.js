#!/usr/bin/env node
const path = require('path');
const express = require('express');
const { exec } = require('child_process');
const readline = require('readline');

// Criação da aplicação express
const app = express();

// Configurações
const hostname = 'localhost';
let port = 1000; // Porta inicial
const enableCORS = true;
const enableWasmMultithreading = true;

// Caminho para os arquivos da build
const unityBuildPath = path.join(__dirname, 'app');

// Middleware para aplicar cabeçalhos apropriados
app.use((req, res, next) => {
    var requestedPath = req.url;

    // Definir cabeçalhos COOP, COEP e CORP para SharedArrayBuffer (multithreading)
    if (enableWasmMultithreading &&
        (
            requestedPath == '/' ||
            requestedPath.includes('.js') ||
            requestedPath.includes('.html') ||
            requestedPath.includes('.htm')
        )
    ) {
        res.set('Cross-Origin-Opener-Policy', 'same-origin');
        res.set('Cross-Origin-Embedder-Policy', 'require-corp');
        res.set('Cross-Origin-Resource-Policy', 'cross-origin');
    }

    // Configurar CORS
    if (enableCORS) {
        res.set('Access-Control-Allow-Origin', '*');
    }

    // Configuração de compressão
    if (requestedPath.endsWith('.br')) {
        res.set('Content-Encoding', 'br');
    } else if (requestedPath.endsWith('.gz')) {
        res.set('Content-Encoding', 'gzip');
    }

    // Definir o tipo de conteúdo correto com base na extensão do arquivo
    if (requestedPath.includes('.wasm')) {
        res.set('Content-Type', 'application/wasm');
    } else if (requestedPath.includes('.js')) {
        res.set('Content-Type', 'application/javascript');
    } else if (requestedPath.includes('.json')) {
        res.set('Content-Type', 'application/json');
    } else if (
        requestedPath.includes('.data') ||
        requestedPath.includes('.bundle') ||
        requestedPath.endsWith('.unityweb')
    ) {
        res.set('Content-Type', 'application/octet-stream');
    }

    // Ignorar cache-control: no-cache se if-modified-since ou if-none-match estiverem presentes
    if (req.headers['cache-control'] == 'no-cache' &&
    (
        req.headers['if-modified-since'] ||
        req.headers['if-none-match']
    )
    ) {       
        delete req.headers['cache-control'];
    }

    next();
});

// Servir os arquivos estáticos da build
app.use('/', express.static(unityBuildPath, { immutable: true }));

// Criando uma interface de readline para capturar a entrada do usuário
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Função para tentar iniciar o servidor em diferentes portas
function startServer(port) {
    const server = app.listen(port, hostname, () => {
        console.log(`Server started in: http://${hostname}:${port}`);
        // Comando para abrir o navegador (funciona no Windows)
        exec(`start http://localhost:${port}`);
    });

    server.on('error', (err) => {
        if (err.code === 'EADDRINUSE') {
            console.log(`Port ${port} is in use.`);

            // Perguntar ao usuário se ele deseja tentar outra porta ou sair
            rl.question('Port is in use. Do you want to try another port (y/n)? ', (answer) => {
                if (answer.toLowerCase() === 'y') {
                    startServer(port + 1);  // Tenta a próxima porta
                } else {
                    console.log('Closing the server...');
                    server.close();  // Fecha o servidor anterior
                    rl.close();  // Fecha a interface readline
                }
            });
        } else {
            console.error('Error starting server:', err);
        }
    });
}

// Iniciar o servidor na porta inicial
startServer(port);