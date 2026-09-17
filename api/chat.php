<?php
// ============================================================
// BACKEND DO CHAT - API SEGURA
// ============================================================
// Este arquivo processa as mensagens do chat e se comunica
// com a API da DeepSeek. A chave da API NUNCA e enviada ao
// navegador.
// ============================================================

header('Content-Type: application/json');
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: DENY');

// ----------------------------------------------------------
// CARREGAR CONFIGURACOES
// ----------------------------------------------------------
$config = require __DIR__ . '/../config/chatbot.php';

// ----------------------------------------------------------
// CARREGAR BASE DE CONHECIMENTO (via PHP)
// ----------------------------------------------------------
$base_conhecimento = require __DIR__ . '/../data/empreendimento.php';

// ----------------------------------------------------------
// VALIDAR REQUISICAO
// ----------------------------------------------------------
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Metodo nao permitido']);
    exit;
}

// ----------------------------------------------------------
// LIMITE DE REQUISICOES POR IP
// ----------------------------------------------------------
// Este endpoint gasta creditos de uma API paga. Sem limite, um unico
// visitante (ou um script) consome a conta inteira em minutos.
if (!dentroDoLimite($config['limites']['max_requests_per_hour'])) {
    http_response_code(429);
    header('Retry-After: 600');
    echo json_encode(['error' => 'Muitas mensagens em pouco tempo. Tente novamente daqui a pouco.']);
    exit;
}

// ----------------------------------------------------------
// Ler entrada
// ----------------------------------------------------------
$raw = file_get_contents('php://input');

// Corpo maior que isto nao tem uso legitimo aqui: a mensagem cabe em 500 chars
// e o historico em 30 delas. Recusar antes de decodificar o JSON.
if (strlen($raw) > 64 * 1024) {
    http_response_code(413);
    echo json_encode(['error' => 'Requisicao muito grande']);
    exit;
}

$dados = json_decode($raw, true);

if (!$dados || !isset($dados['message'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Mensagem nao fornecida']);
    exit;
}

if (!is_string($dados['message'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Mensagem invalida']);
    exit;
}

$mensagem = trim($dados['message']);
// O campo 'normalized' vem do navegador e e ELE que segue para a API:
// precisa do mesmo limite da mensagem, senao a validacao abaixo nao vale nada.
$normalizada_bruta = $dados['normalized'] ?? null;
$mensagem_normalizada = is_string($normalizada_bruta) ? trim($normalizada_bruta) : $mensagem;
$historico = is_array($dados['history'] ?? null) ? $dados['history'] : [];

// ----------------------------------------------------------
// VALIDAR TAMANHO DA MENSAGEM
// ----------------------------------------------------------
$limite_msg = $config['limites']['max_message_length'];
if (strlen($mensagem) > $limite_msg || strlen($mensagem_normalizada) > $limite_msg) {
    http_response_code(400);
    echo json_encode([
        'error' => 'Mensagem muito longa. Maximo de ' . $config['limites']['max_message_length'] . ' caracteres.'
    ]);
    exit;
}

if (empty($mensagem)) {
    http_response_code(400);
    echo json_encode(['error' => 'Mensagem vazia']);
    exit;
}

// ----------------------------------------------------------
// OBTER CHAVE DA API
// ----------------------------------------------------------
$apiKey = getenv('DEEPSEEK_API_KEY');

if (!$apiKey) {
    // Fallback: API nao configurada
    $resposta = [
        'success'  => true,
        'response' => $config['fallback_mensagem'],
        'fallback' => true,
    ];
    $zap = buildWhatsAppLink($config, $mensagem);
    if ($zap !== '') {
        $resposta['whatsapp_url'] = $zap;
    }
    echo json_encode($resposta);
    exit;
}

// ----------------------------------------------------------
// MONTAR MENSAGENS PARA A API
// ----------------------------------------------------------
$mensagens = [];

// System prompt
$mensagens[] = [
    'role' => 'system',
    'content' => $config['system_prompt']
];

// Base de conhecimento
$mensagens[] = [
    'role' => 'system',
    'content' => "BASE DE CONHECIMENTO DO EMPREENDIMENTO:\n" . json_encode($base_conhecimento, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT)
];

// Historico da conversa (limitado)
$historico_limitado = array_slice(
    $historico,
    -$config['limites']['max_history_messages']
);

// O historico tambem chega do navegador: limitar o tamanho de cada item e do
// conjunto, senao da para inflar o custo da chamada mesmo respeitando a
// quantidade maxima de mensagens.
$total_historico = 0;
foreach ($historico_limitado as $msg) {
    if (!is_array($msg) || !isset($msg['content']) || !is_string($msg['content'])) {
        continue;
    }
    $conteudo = substr(trim($msg['content']), 0, $limite_msg);
    if ($conteudo === '') {
        continue;
    }
    $total_historico += strlen($conteudo);
    if ($total_historico > $limite_msg * $config['limites']['max_history_messages']) {
        break;
    }
    $papel = (isset($msg['role']) && $msg['role'] === 'user') ? 'user' : 'assistant';
    $mensagens[] = ['role' => $papel, 'content' => $conteudo];
}

// Mensagem atual do visitante (usar normalizada se disponivel)
$mensagens[] = [
    'role' => 'user',
    'content' => $mensagem_normalizada
];

// ----------------------------------------------------------
// CHAMAR API DEEPSEEK
// ----------------------------------------------------------
$respuesta = callDeepSeek($apiKey, $config['api'], $mensagens);

if ($respuesta === null) {
    // Erro na API - fallback
    $resposta = [
        'success'  => true,
        'response' => $config['fallback_mensagem'],
        'fallback' => true,
    ];
    $zap = buildWhatsAppLink($config, $mensagem);
    if ($zap !== '') {
        $resposta['whatsapp_url'] = $zap;
    }
    echo json_encode($resposta);
    exit;
}

// ----------------------------------------------------------
// RETORNAR RESPOSTA
// ----------------------------------------------------------
echo json_encode([
    'success'   => true,
    'response'  => $respuesta,
    'fallback'  => false
]);

// ============================================================
// FUNCOES
// ============================================================

/**
 * Limite simples por IP, em arquivo: janela deslizante de 1 hora.
 * Sem banco de dados de proposito, o site nao tem um.
 */
function dentroDoLimite(int $maxPorHora): bool
{
    $ip = $_SERVER['REMOTE_ADDR'] ?? 'desconhecido';
    $arquivo = sys_get_temp_dir() . '/aurora-chat-' . sha1($ip) . '.json';
    $agora = time();

    $registros = [];
    if (is_readable($arquivo)) {
        $lido = json_decode((string) @file_get_contents($arquivo), true);
        if (is_array($lido)) {
            $registros = $lido;
        }
    }

    // descarta o que ja saiu da janela
    $registros = array_values(array_filter(
        $registros,
        static fn($t) => is_int($t) && $t > $agora - 3600
    ));

    if (count($registros) >= $maxPorHora) {
        return false;
    }

    $registros[] = $agora;
    @file_put_contents($arquivo, json_encode($registros), LOCK_EX);
    return true;
}

/**
 * Chamar a API da DeepSeek
 */
function callDeepSeek(string $apiKey, array $apiConfig, array $messages): ?string
{
    $data = [
        'model'       => $apiConfig['model'],
        'messages'    => $messages,
        'temperature' => $apiConfig['temperature'],
        'max_tokens'  => $apiConfig['max_tokens'],
    ];

    $options = [
        'http' => [
            'header'  => "Content-Type: application/json\r\n" .
                         "Authorization: Bearer {$apiKey}\r\n",
            'method'  => 'POST',
            'content' => json_encode($data),
            'timeout' => 30,
        ],
    ];

    $context = stream_context_create($options);
    $response = @file_get_contents($apiConfig['url'], false, $context);

    if ($response === false) {
        error_log('[Chatbot] Erro ao chamar API DeepSeek');
        return null;
    }

    $result = json_decode($response, true);

    if (isset($result['choices'][0]['message']['content'])) {
        return $result['choices'][0]['message']['content'];
    }

    error_log('[Chatbot] Resposta inesperada da API: ' . $response);
    return null;
}

/**
 * Construir link do WhatsApp com mensagem pre-preenchida
 */
function buildWhatsAppLink(array $config, string $mensagem): string
{
    $numero = trim((string) ($config['whatsapp']['numero'] ?? ''));
    if ($numero === '') {
        return '';   // sem numero configurado, nenhum botao de WhatsApp
    }
    $msgBase = $config['whatsapp']['mensagem_padrao'];
    $mensagemCompleta = $msgBase . "\n\nMensagem do visitante: " . $mensagem;
    $encoded = urlencode($mensagemCompleta);

    return "https://wa.me/{$numero}?text={$encoded}";
}
