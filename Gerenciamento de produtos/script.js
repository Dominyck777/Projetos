function cadastrar() {
    const nome_js = document.getElementById("nome").value;
    const desc_js = document.getElementById("desc").value;
    const preco_js = document.getElementById("preco").value;
    const qntd_js = document.getElementById("qntd").value;

    console.log(nome_js, desc_js, preco_js, qntd_js)

    if (nome_js === "" || desc_js === "" || preco_js === "" || qntd_js === "") {
        alert("Preencha todos os  campos.")
        return;
    }

    const produto = {
        nome: nome_js,
        descricao: desc_js,
        preco: parseFloat(preco_js),
        quantidade: parseInt(qntd_js)
    };

    fetch("https://diniz.dev.br/produtos/", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(produto)
    })
    .then(response => response.json())

    .then(result_convert => {
        console.log(result_convert)
        carregar_produtos()
    })
    .catch(error => {
        alert("Erro na requisição")
        console.log("Erro ao cadastrar produto: ", error)
    })
}

function carregar_produtos() {
    fetch("https://diniz.dev.br/produtos/")
        .then(response => response.json())
        .then(produtos => {
            const listaProdutosJs = document.getElementById("lista_produtos")   
            listaProdutosJs.innerHTML = "";

            produtos.forEach(produto => {
                const linha = document.createElement("tr");

                linha.innerHTML = `
                    <td>${produto.nome}</td>
                    <td>${produto.descricao}</td>
                    <td>${produto.preco}</td>
                    <td>${produto.quantidade}</td>
                `;
                
                listaProdutosJs.appendChild(linha);
        
            });

            
        })
        .catch(error => console.error("Erro ao carregar produtos: ", error));
}

function buscarproduto() {
    const nomeProcurado = document.getElementById("produtoNome").value;

    if (nomeProcurado === "") {
        alert("Por favor, digite o nome do produto.");
        return;
    }

    fetch("https://diniz.dev.br/produtos/")
        .then(response => response.json())
        .then(produtos => {
            let produtoEncontrado = null;

            for (let i = 0; i < produtos.length; i++) {
                if (produtos[i].nome === nomeProcurado) {
                    produtoEncontrado = produtos[i];
                    break;
                }
            }

            if (produtoEncontrado) {
                alert("----------Produto encontrado----------\n" +
                      "Nome: " + produtoEncontrado.nome + "\n" +
                      "Descrição: " + produtoEncontrado.descricao + "\n" +
                      "Preço: " + produtoEncontrado.preco + "\n" +
                      "Quantidade: " + produtoEncontrado.quantidade);
            } else {
                alert("O produto com nome \"" + nomeProcurado + "\" não foi encontrado.");
            }
        })
}

function somarProdutos() {
    fetch("https://diniz.dev.br/produtos/")
        .then(function(response) {
            return response.json();
        })
        .then(function(produtos) {
            var totalQuantidade = 0;

            for (var i = 0; i < produtos.length; i++) {
                totalQuantidade += produtos[i].quantidade;
            }

            alert("Total de produtos: " + produtos.length);
        })

}