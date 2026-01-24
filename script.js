let isOpened = false;
let envelope, seal, invitationContent;

// Função global para abrir envelope
function openEnvelope() {
    if (isOpened) return;
    
    isOpened = true;
    if (envelope) envelope.classList.add('opened');
    
    // Faz scroll suave para o topo
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Aguarda a animação da carta antes de mostrar o conteúdo
    setTimeout(() => {
        if (invitationContent) invitationContent.classList.add('show');
    }, 400);
}

document.addEventListener('DOMContentLoaded', function() {
    envelope = document.getElementById('envelope');
    seal = document.getElementById('seal');
    invitationContent = document.getElementById('invitationContent');

    // Remove fundo branco da logo
    function removeWhiteBackground() {
        const logoImg = document.querySelector('.seal-logo');
        if (!logoImg) return;

        logoImg.onload = function() {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = logoImg.naturalWidth;
            canvas.height = logoImg.naturalHeight;

            ctx.drawImage(logoImg, 0, 0);
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const data = imageData.data;

            // Remove pixels brancos (ou muito claros) - algoritmo mais agressivo
            for (let i = 0; i < data.length; i += 4) {
                const r = data[i];
                const g = data[i + 1];
                const b = data[i + 2];
                const alpha = data[i + 3];
                
                // Calcula a média e a diferença entre os canais
                const avg = (r + g + b) / 3;
                const max = Math.max(r, g, b);
                const min = Math.min(r, g, b);
                const diff = max - min;
                
                // Remove pixels que são brancos ou muito claros
                // Condições mais abrangentes para capturar diferentes tons de branco
                if (avg > 180 || // Média alta indica branco
                    (r > 180 && g > 180 && b > 180) || // Todos os canais claros
                    (max > 200 && diff < 30)) { // Muito claro com pouca variação de cor
                    data[i + 3] = 0; // Transparente
                }
            }

            ctx.putImageData(imageData, 0, 0);
            logoImg.src = canvas.toDataURL();
        };

        // Se a imagem já estiver carregada
        if (logoImg.complete) {
            logoImg.onload();
        }
    }

    removeWhiteBackground();

    // Adiciona evento de clique no selo (backup)
    if (seal) {
        console.log('Selo encontrado, adicionando event listeners...');
        seal.addEventListener('click', function(e) {
            console.log('Clique no selo via addEventListener!');
            e.preventDefault();
            e.stopPropagation();
            openEnvelope();
        }, true); // Use capture phase
        
        seal.addEventListener('mousedown', function(e) {
            console.log('Mouse down no selo!');
            e.preventDefault();
            e.stopPropagation();
            openEnvelope();
        }, true);
        
        // Adiciona clique em todos os elementos filhos do selo
        seal.querySelectorAll('*').forEach(el => {
            el.addEventListener('click', function(e) {
                console.log('Clique em elemento do selo!');
                e.preventDefault();
                e.stopPropagation();
                openEnvelope();
            }, true);
        });
    } else {
        console.error('Selo não encontrado!');
    }
    
    // Event delegation como backup
    document.addEventListener('click', function(e) {
        // Verifica se o clique foi no selo ou em qualquer elemento dentro dele
        const clickedSeal = e.target.closest('#seal') || e.target.closest('.seal');
        if (clickedSeal) {
            console.log('Clique detectado via event delegation no selo!');
            e.preventDefault();
            e.stopPropagation();
            openEnvelope();
            return;
        }
        
        // Verifica se o clique foi no envelope (mas não no conteúdo do convite)
        if (e.target.closest('#envelope') && !e.target.closest('#invitationContent')) {
            // Só abre se clicar no envelope (não no conteúdo)
            if (e.target === envelope || 
                e.target.closest('.envelope-front') || 
                e.target.closest('.envelope-flap')) {
                openEnvelope();
            }
        }
    });

    // Adiciona animação de "brilho" no selo para chamar atenção
    seal.addEventListener('mouseenter', function() {
        // Sem sombreamento
    });

    seal.addEventListener('mouseleave', function() {
        // Sem sombreamento
    });
});
