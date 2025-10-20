lista_prod = []
 
def addProd():
    nome = input('Digite o nome do produto que deseja adicionar: ')
    preco = input('Digite o preço do produto: ')
   
    try:
        preco = float(preco)
    except ValueError:
        print("Preço inválido! O produto não foi adicionado.")
        return
   
    produto = {'nome': nome, 'preco': preco}
    lista_prod.append(produto)
    print(f'Produto "{nome}" com preço R$ {preco:.2f} adicionado com sucesso!')
 
def mostrarProd():
    if lista_prod:
        print("\n--- Lista de Produtos ---")
        for idx, prod in enumerate(lista_prod, 1):
            print(f"{idx}. {prod['nome']} - R$ {prod['preco']:.2f}")
    else:
        print("Nenhum produto foi adicionado.")
 
def removeProd():
    mostrarProd()
    nome = input("Digite o nome do produto que deseja remover: ")
 
    for prod in lista_prod:
        if prod['nome'].lower() == nome.lower():
            lista_prod.remove(prod)
            print(f"Produto '{nome}' removido com sucesso.")
            return
    print(f"Produto '{nome}' não encontrado.")
 
def alterarProd():
    mostrarProd()
    nome = input("Digite o nome do produto que deseja alterar: ")
 
    for prod in lista_prod:
        if prod['nome'].lower() == nome.lower():
            novo_nome = input("Novo nome do produto (pressione Enter para manter o atual): ")
            novo_preco = input("Novo preço (pressione Enter para manter o atual): ")
 
            if novo_nome:
                prod['nome'] = novo_nome
            if novo_preco:
                try:
                    prod['preco'] = float(novo_preco)
                except ValueError:
                    print("Preço inválido! Mantido o preço anterior.")
 
            print("Produto atualizado com sucesso!")
            return
    print(f"Produto '{nome}' não encontrado.")
   
while True:
    print("\nO que você deseja fazer?")
    print("1 - Adicionar produto")
    print("2 - Mostrar produtos")
    print("3 - Remover produto")
    print("4 - Alterar produto")
    print("5 - Sair")
 
    opcao = input("Escolha uma opção (1-5): ")
 
    if opcao == '1':
        addProd()
    elif opcao == '2':
        mostrarProd()
    elif opcao == '3':
        removeProd()
    elif opcao == '4':
        alterarProd()
    elif opcao == '5':
        print("Encerrando o programa. Até a próxima!")
        break
    else:
        print("Opção inválida. Tente novamente.")