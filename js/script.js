const listaProdutos = document.getElementById("lista-produtos");

const quantidades = {};

let categoriasDisponiveis = [];

const botaoCarrinho = document.getElementById("botao-carrinho");
const fecharCarrinho = document.getElementById("fechar-carrinho");
const fundoCarrinho = document.getElementById("fundo-carrinho");

const itensCarrinho = document.getElementById("itens-carrinho");
const quantidadeCarrinho = document.getElementById("quantidade-carrinho");

const etapaCarrinho = document.getElementById("etapa-carrinho");
const etapaCheckout = document.getElementById("etapa-checkout");

const subtotalCarrinho = document.getElementById("subtotal-carrinho");
const continuarCheckout = document.getElementById("continuar-checkout");
const voltarCarrinho = document.getElementById("voltar-carrinho");

const bairro = document.getElementById("bairro");
const endereco = document.getElementById("endereco");
const observacoes = document.getElementById("observacoes");

const formaPagamento = document.getElementById("forma-pagamento");
const opcoesDinheiro = document.getElementById("opcoes-dinheiro");

const precisaTroco = document.getElementById("precisa-troco");
const campoTroco = document.getElementById("campo-troco");
const valorTroco = document.getElementById("valor-troco");

const resumoSubtotal = document.getElementById("resumo-subtotal");
const taxaEntrega = document.getElementById("taxa-entrega");
const resumoTotal = document.getElementById("resumo-total");

const finalizarPedido = document.getElementById("finalizar-pedido");

const taxasEntrega = {
    "Luzia": 3,
    "Ponto Novo": 3,
    "Farolândia": 6,
    "Jabotiana": 4,
    "Bairro América": 4,
    "Inácio Barbosa": 4,
    "São Conrado": 4,
    "Grageru": 4,
    "Jardins": 4,
    "Pereira Lobo": 4,
    "Centro": 5,
    "Siqueira Campos": 5
};

function formatarPreco(valor) {
    return valor.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
}

function obterSubtotal() {
    let subtotal = 0;

    produtos.forEach(function(produto) {
        const quantidade = quantidades[produto.id] || 0;
        subtotal += produto.preco * quantidade;
    });

    return subtotal;
}

function obterQuantidadeTotal() {
    let quantidadeTotal = 0;

    produtos.forEach(function(produto) {
        quantidadeTotal += quantidades[produto.id] || 0;
    });

    return quantidadeTotal;
}

function exibirProdutos() {
    listaProdutos.innerHTML = "";

    const categorias = [];

    produtos.forEach(function(produto) {
        if (!categorias.includes(produto.categoria)) {
            categorias.push(produto.categoria);
        }
    });

    categoriasDisponiveis = categorias;

    categorias.forEach(function(categoria) {
        const tituloCategoria = document.createElement("h2");

        tituloCategoria.textContent = categoria;
        tituloCategoria.id = `categoria-${categoria}`;

        const produtosCategoria = document.createElement("div");

        produtosCategoria.classList.add("produtos-categoria");

        produtos.forEach(function(produto) {
            if (produto.categoria === categoria) {
                const card = document.createElement("div");

                card.classList.add("card-produto");
                card.dataset.id = produto.id;

                card.innerHTML = `
                    <h3>${produto.nome}</h3>

                    <p>${formatarPreco(produto.preco)}</p>

                    <div class="controle-quantidade"></div>
                `;

                produtosCategoria.appendChild(card);
            }
        });

        listaProdutos.appendChild(tituloCategoria);
        listaProdutos.appendChild(produtosCategoria);
    });

    atualizarTodosControles();
}

function alterarQuantidade(id, valor) {
    if (!quantidades[id]) {
        quantidades[id] = 0;
    }

    quantidades[id] += valor;

    if (quantidades[id] < 0) {
        quantidades[id] = 0;
    }

    atualizarControle(id);
    atualizarCarrinho();
}

function atualizarControle(id) {
    const card = document.querySelector(
        `.card-produto[data-id="${id}"]`
    );

    if (!card) {
        return;
    }

    const controle = card.querySelector(".controle-quantidade");
    const quantidade = quantidades[id] || 0;

    if (quantidade === 0) {
        controle.innerHTML = `
            <button
                class="botao-adicionar"
                onclick="alterarQuantidade(${id}, 1)"
                aria-label="Adicionar produto">
                +
            </button>
        `;
    } else {
        controle.innerHTML = `
            <div class="contador">
                <button
                    class="botao-quantidade"
                    onclick="alterarQuantidade(${id}, -1)"
                    aria-label="Diminuir quantidade">
                    −
                </button>

                <span>${quantidade}</span>

                <button
                    class="botao-quantidade"
                    onclick="alterarQuantidade(${id}, 1)"
                    aria-label="Aumentar quantidade">
                    +
                </button>
            </div>
        `;
    }
}

function atualizarTodosControles() {
    produtos.forEach(function(produto) {
        atualizarControle(produto.id);
    });
}

function atualizarCarrinho() {
    itensCarrinho.innerHTML = "";

    let quantidadeTotal = 0;
    let possuiItens = false;

    produtos.forEach(function(produto) {
        const quantidade = quantidades[produto.id] || 0;

        if (quantidade > 0) {
            possuiItens = true;

            const subtotal = produto.preco * quantidade;

            quantidadeTotal += quantidade;

            const item = document.createElement("div");

            item.classList.add("item-carrinho");

            item.innerHTML = `
                <div class="informacoes-item">
                    <h3>${produto.nome}</h3>

                    <p>${formatarPreco(produto.preco)} cada</p>

                    <strong>${formatarPreco(subtotal)}</strong>
                </div>

                <div class="controle-item">
                    <button
                        onclick="alterarQuantidade(${produto.id}, -1)">
                        −
                    </button>

                    <span>${quantidade}</span>

                    <button
                        onclick="alterarQuantidade(${produto.id}, 1)">
                        +
                    </button>
                </div>
            `;

            itensCarrinho.appendChild(item);
        }
    });

    if (!possuiItens) {
        itensCarrinho.innerHTML = `
            <p class="carrinho-vazio">
                Seu carrinho está vazio.
            </p>
        `;
    }

    const subtotal = obterSubtotal();

    subtotalCarrinho.textContent = formatarPreco(subtotal);
    quantidadeCarrinho.textContent = quantidadeTotal;

    botaoCarrinho.classList.toggle(
        "carrinho-com-itens",
        quantidadeTotal > 0
    );

    atualizarResumoFinal();
}

function abrirCarrinho() {
    fundoCarrinho.classList.add("ativo");
    document.body.classList.add("bloqueado");
}

function fecharCarrinhoModal() {
    fundoCarrinho.classList.remove("ativo");
    document.body.classList.remove("bloqueado");
}

function abrirCheckout() {
    if (obterQuantidadeTotal() === 0) {
        alert("Adicione pelo menos um produto ao carrinho.");
        return;
    }

    etapaCarrinho.classList.add("escondido");
    etapaCheckout.classList.remove("escondido");
}

function voltarParaCarrinho() {
    etapaCheckout.classList.add("escondido");
    etapaCarrinho.classList.remove("escondido");
}

function atualizarResumoFinal() {
    const subtotal = obterSubtotal();
    const taxa = taxasEntrega[bairro.value] || 0;
    const total = subtotal + taxa;

    resumoSubtotal.textContent = formatarPreco(subtotal);
    taxaEntrega.textContent = formatarPreco(taxa);
    resumoTotal.textContent = formatarPreco(total);
}

function configurarPagamento() {
    formaPagamento.addEventListener("change", function() {
        if (formaPagamento.value === "Dinheiro") {
            opcoesDinheiro.classList.remove("escondido");
        } else {
            opcoesDinheiro.classList.add("escondido");
            campoTroco.classList.add("escondido");

            precisaTroco.value = "";
            valorTroco.value = "";
        }
    });

    precisaTroco.addEventListener("change", function() {
        if (precisaTroco.value === "Sim") {
            campoTroco.classList.remove("escondido");
        } else {
            campoTroco.classList.add("escondido");
            valorTroco.value = "";
        }
    });
}

function validarCheckout() {
    if (!bairro.value) {
        alert("Selecione o bairro de entrega.");
        bairro.focus();
        return false;
    }

    if (!endereco.value.trim()) {
        alert("Informe o endereço completo.");
        endereco.focus();
        return false;
    }

    if (!formaPagamento.value) {
        alert("Selecione a forma de pagamento.");
        formaPagamento.focus();
        return false;
    }

    if (
        formaPagamento.value === "Dinheiro" &&
        !precisaTroco.value
    ) {
        alert("Informe se precisa de troco.");
        precisaTroco.focus();
        return false;
    }

    if (
        formaPagamento.value === "Dinheiro" &&
        precisaTroco.value === "Sim"
    ) {
        const valorInformado = Number(valorTroco.value);
        const total = obterSubtotal() + (taxasEntrega[bairro.value] || 0);

        if (!valorTroco.value || valorInformado <= total) {
            alert(
                "Informe um valor para troco maior que o total do pedido."
            );

            valorTroco.focus();
            return false;
        }
    }

    return true;
}

function enviarPedidoWhatsApp() {
    if (!validarCheckout()) {
        return;
    }

    const itensPorCategoria = {};

    produtos.forEach(function(produto) {
        const quantidade = quantidades[produto.id] || 0;

        if (quantidade > 0) {
            const subtotalProduto = produto.preco * quantidade;
            const categoria = produto.categoria;

            if (!itensPorCategoria[categoria]) {
                itensPorCategoria[categoria] = [];
            }

            itensPorCategoria[categoria].push(
                `${quantidade}x ${produto.nome} - ${formatarPreco(subtotalProduto)}`
            );
        }
    });

    const itens = [];

    Object.keys(itensPorCategoria).forEach(function(categoria) {
        itens.push(`*${categoria}*`);
        itens.push(...itensPorCategoria[categoria]);
        itens.push("");
    });

    const subtotal = obterSubtotal();
    const taxa = taxasEntrega[bairro.value] || 0;
    const total = subtotal + taxa;

    let informacoesPagamento =
        `Forma de pagamento: ${formaPagamento.value}`;

    if (formaPagamento.value === "Dinheiro") {
        informacoesPagamento +=
            `\nPrecisa de troco: ${precisaTroco.value}`;

        if (precisaTroco.value === "Sim") {
            informacoesPagamento +=
                `\nTroco para: ${formatarPreco(Number(valorTroco.value))}`;
        }
    }

    const observacoesInformadas = observacoes.value.trim();

    const mensagem = [
        "*Olá, Esquina 79! Gostaria de fazer um pedido.*",
        "",
        "*Meu pedido:*",
        "",
        itens.join("\n"),
        "*Resumo dos valores:*",
        `Subtotal: ${formatarPreco(subtotal)}`,
        `Taxa de entrega: ${formatarPreco(taxa)}`,
        `*Total: ${formatarPreco(total)}*`,
        "",
        "*Dados da entrega:*",
        `Bairro: ${bairro.value}`,
        `Endereço: ${endereco.value.trim()}`,
        "",
        "*Pagamento:*",
        informacoesPagamento,
        "",
        "*Observações:*",
        observacoesInformadas || "Nenhuma observação.",
        "",
        "Aguardo a confirmação do pedido!"
    ].join("\n");

    const numeroWhatsApp = "5579996857121";

    const url =
        `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensagem)}`;

    window.open(url, "_blank");
}

function configurarCarrinho() {
    botaoCarrinho.addEventListener("click", abrirCarrinho);

    fecharCarrinho.addEventListener("click", fecharCarrinhoModal);

    fundoCarrinho.addEventListener("click", function(evento) {
        if (evento.target === fundoCarrinho) {
            fecharCarrinhoModal();
        }
    });

    continuarCheckout.addEventListener("click", abrirCheckout);

    voltarCarrinho.addEventListener("click", voltarParaCarrinho);

    finalizarPedido.addEventListener("click", enviarPedidoWhatsApp);

    bairro.addEventListener("change", atualizarResumoFinal);
}

function configurarAtalhos() {
    const botoesCategoria = document.querySelectorAll(
        "[data-categoria]"
    );

    botoesCategoria.forEach(function(botao) {
        botao.addEventListener("click", function() {
            const categoriaEscolhida = botao.dataset.categoria;

            const categoriaEncontrada = categoriasDisponiveis.find(
                function(categoria) {
                    return categoria.startsWith(categoriaEscolhida);
                }
            );

            if (categoriaEncontrada) {
                const elemento = document.getElementById(
                    `categoria-${categoriaEncontrada}`
                );

                if (elemento) {
                    elemento.scrollIntoView({
                        behavior: "smooth",
                        block: "start"
                    });
                }
            }
        });
    });
}

exibirProdutos();
configurarAtalhos();
configurarCarrinho();
configurarPagamento();
atualizarCarrinho();
