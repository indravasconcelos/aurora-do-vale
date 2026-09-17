<?php
// Pagina de erro do Residencial Aurora do Vale.
// Standalone de proposito: quando o Apache serve isto por ErrorDocument, a URL
// do navegador continua sendo a que deu erro, entao qualquer CSS/JS externo com
// caminho relativo resolveria para a pasta errada. Tudo vai inline.

$status = (int) ($_SERVER['REDIRECT_STATUS'] ?? 0);
if ($status !== 403 && $status !== 404) {
    // O fallback por RewriteRule chega com REDIRECT_STATUS = 200; sem isto a
    // pagina responderia 200 e o Google indexaria um "soft 404".
    $status = 404;
}
http_response_code($status);

$titulo   = $status === 403 ? 'Acesso restrito' : 'Pagina nao encontrada';
$mensagem = $status === 403
    ? 'Esta area do site nao esta disponivel para visualizacao.'
    : 'O endereco que voce abriu nao existe ou foi movido.';

// Funciona na raiz do dominio e na subpasta do XAMPP.
$inicio = rtrim(dirname($_SERVER['SCRIPT_NAME']), '/') . '/';
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title><?= $status ?> · <?= htmlspecialchars($titulo, ENT_QUOTES) ?> · Residencial Aurora do Vale</title>
<style>
  *{box-sizing:border-box;margin:0;padding:0}
  body{min-height:100vh;display:grid;place-items:center;padding:32px;
       background:#fafafa;color:#1a1a1a;
       font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Arial,sans-serif;
       line-height:1.6;-webkit-font-smoothing:antialiased}
  .caixa{max-width:460px;text-align:center}
  .marca{display:inline-flex;align-items:center;gap:12px;margin-bottom:40px}
  .marca span{width:42px;height:42px;border-radius:10px;background:#1a1a1a;display:grid;place-items:center}
  .marca strong{font-size:14px;font-weight:700;letter-spacing:.14em}
  .codigo{font-family:Georgia,"Times New Roman",serif;font-size:72px;line-height:1;
          color:#15803d;letter-spacing:-.04em;margin-bottom:8px}
  h1{font-family:Georgia,"Times New Roman",serif;font-size:26px;font-weight:400;
     letter-spacing:-.02em;margin-bottom:12px}
  p{color:#6b6b6b;font-size:15px;margin-bottom:32px}
  a{display:inline-flex;align-items:center;justify-content:center;min-height:44px;
    padding:13px 28px;border-radius:999px;background:#15803d;color:#fff;
    text-decoration:none;font-size:13px;font-weight:700;letter-spacing:.08em;
    text-transform:uppercase;transition:background .2s ease}
  a:hover{background:#13713a}
  a:focus-visible{outline:2px solid #15803d;outline-offset:3px}
</style>
</head>
<body>
  <main class="caixa">
    <div class="marca">
      <span aria-hidden="true">
        <svg viewBox="0 0 40 40" width="30" height="30" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M13 13.5H20.2C22.8 13.5 24.6 15 24.6 17.3C24.6 19.6 22.8 21.1 20.2 21.1H13V28.5" stroke="#fff" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M20.8 21.1H27.2C28.9 21.1 30.2 22.2 30.2 24.1C30.2 26 28.9 27.1 27.2 27.1H20.8" stroke="#22c55e" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </span>
      <strong>AURORA DO VALE</strong>
    </div>
    <p class="codigo" aria-hidden="true"><?= $status ?></p>
    <h1><?= htmlspecialchars($titulo, ENT_QUOTES) ?></h1>
    <p><?= htmlspecialchars($mensagem, ENT_QUOTES) ?></p>
    <a href="<?= htmlspecialchars($inicio, ENT_QUOTES) ?>">Voltar para o início</a>
  </main>
</body>
</html>
