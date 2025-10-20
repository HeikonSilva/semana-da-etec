import tkinter as tk
from tkinter import ttk, messagebox, filedialog
import json, os, csv
from matplotlib.backends.backend_tkagg import FigureCanvasTkAgg
import matplotlib.pyplot as plt
 
ARQUIVO_DADOS = "produtos.json"
 
# ---------- Funções de dados ----------
def carregar_produtos():
    if os.path.isfile(ARQUIVO_DADOS):
        try:
            with open(ARQUIVO_DADOS, "r", encoding="utf-8") as f:
                return json.load(f)
        except:
            return []
    return []
 
def salvar_produtos():
    with open(ARQUIVO_DADOS, "w", encoding="utf-8") as f:
        json.dump(lista_prod, f, ensure_ascii=False, indent=4)
 
lista_prod = carregar_produtos()
 
def obter_proximo_id():
    if not lista_prod:
        return 1
    ids = [int(p.get("id", 0)) for p in lista_prod if str(p.get("id", "")).isdigit()]
    return max(ids) + 1 if ids else 1
 
# ---------- Interface ----------
root = tk.Tk()
root.title("📦 Gestor de Estoque Avançado")
root.geometry("900x600")
root.configure(bg="#f5f5f5")
 
style = ttk.Style(root)
style.theme_use("clam")
style.configure("TButton", font=("Segoe UI", 10))
style.configure("Treeview", font=('Segoe UI', 11), rowheight=28)
style.configure("Treeview.Heading", font=('Segoe UI', 11, 'bold'), background="#003366", foreground="white")
 
# ---------- Navbar ----------
navbar = ttk.Frame(root, padding=10)
navbar.pack(fill="x")
 
btn_estoque = ttk.Button(navbar, text="🧾 Estoque", style="TButton")
btn_graficos = ttk.Button(navbar, text="📊 Gráficos", style="TButton")
btn_estoque.pack(side="left", padx=5)
btn_graficos.pack(side="left", padx=5)
 
container = ttk.Frame(root)
container.pack(expand=True, fill="both")
 
# ---------- Página de Estoque ----------
frame_estoque = ttk.Frame(container)
frame_estoque.pack(expand=True, fill="both")
 
# Filtro
frm_filtro = ttk.Frame(frame_estoque)
frm_filtro.pack(fill="x", pady=(10, 10))
ttk.Label(frm_filtro, text="🔍 Buscar:").pack(side="left", padx=(10, 5))
entry_filtro = ttk.Entry(frm_filtro, width=30)
entry_filtro.pack(side="left", padx=5)
ttk.Button(frm_filtro, text="OK", command=lambda: atualizar_tabela(entry_filtro.get())).pack(side="left", padx=5)
ttk.Button(frm_filtro, text="✖ Limpar", command=lambda: (entry_filtro.delete(0, tk.END), atualizar_tabela())).pack(side="left", padx=5)
 
# Tabela
tree = ttk.Treeview(frame_estoque, columns=("ID", "Nome", "Preço", "Qtd", "Total"), show="headings")
tree.heading("ID", text="ID")
tree.heading("Nome", text="Produto")
tree.heading("Preço", text="Preço")
tree.heading("Qtd", text="Qtd")
tree.heading("Total", text="Total")
tree.column("ID", width=60, anchor="center")
tree.column("Nome", width=300)
tree.column("Preço", width=100, anchor="center")
tree.column("Qtd", width=80, anchor="center")
tree.column("Total", width=120, anchor="center")
tree.pack(expand=True, fill="both", padx=10, pady=10)
 
lbl_total = ttk.Label(frame_estoque, text="💰 Valor total do estoque: R$ 0.00", font=("Segoe UI", 11, "bold"), foreground="#003366")
lbl_total.pack(pady=(0, 10))
 
# ---------- Funções ----------
def atualizar_tabela(filtro_text=""):
    filtro = filtro_text.strip().lower()
    for i in tree.get_children():
        tree.delete(i)
 
    total_estoque = 0
    for i, p in enumerate(lista_prod):
        nome = p["nome"]
        if filtro and filtro not in nome.lower():
            continue
        preco = float(p["preco"])
        qtd = int(p["quantidade"])
        total = preco * qtd
        total_estoque += total
        tree.insert("", "end", iid=i, values=(p["id"], nome, f"R$ {preco:.2f}", qtd, f"R$ {total:.2f}"))
    lbl_total.config(text=f"💰 Valor total do estoque: R$ {total_estoque:.2f}")
 
def abrir_form_produto(titulo, prod=None):
    janela = tk.Toplevel(root)
    janela.title(titulo)
    janela.geometry("400x320")
    janela.configure(bg="white")
    janela.grab_set()
 
    ttk.Label(janela, text=titulo, font=("Segoe UI", 14, "bold"), foreground="#003366").pack(pady=10)
    ttk.Label(janela, text="Nome:").pack(anchor="w", padx=20)
    entry_nome = ttk.Entry(janela, width=40)
    entry_nome.pack(pady=5)
    ttk.Label(janela, text="Preço (R$):").pack(anchor="w", padx=20)
    entry_preco = ttk.Entry(janela, width=40)
    entry_preco.pack(pady=5)
    ttk.Label(janela, text="Quantidade:").pack(anchor="w", padx=20)
    entry_qtd = ttk.Entry(janela, width=40)
    entry_qtd.pack(pady=5)
 
    if prod:
        entry_nome.insert(0, prod["nome"])
        entry_preco.insert(0, prod["preco"])
        entry_qtd.insert(0, prod["quantidade"])
 
    def salvar():
        nome = entry_nome.get().strip()
        try:
            preco = float(entry_preco.get())
            qtd = int(entry_qtd.get())
        except ValueError:
            messagebox.showerror("Erro", "Preço e quantidade devem ser numéricos.")
            return
 
        if prod:
            prod.update({"nome": nome, "preco": preco, "quantidade": qtd})
        else:
            lista_prod.append({
                "id": obter_proximo_id(),
                "nome": nome,
                "preco": preco,
                "quantidade": qtd
            })
 
        salvar_produtos()
        atualizar_tabela()
        messagebox.showinfo("Sucesso", "Produto salvo com sucesso.")
        janela.destroy()
 
    ttk.Button(janela, text="✅ Salvar", command=salvar).pack(pady=15)
 
def adicionar(): abrir_form_produto("Adicionar Produto")
def editar():
    sel = tree.selection()
    if not sel:
        messagebox.showinfo("Aviso", "Selecione um produto.")
        return
    abrir_form_produto("Editar Produto", lista_prod[int(sel[0])])
def remover():
    sel = tree.selection()
    if not sel: return
    i = int(sel[0])
    if messagebox.askyesno("Confirmar", f"Remover '{lista_prod[i]['nome']}'?"):
        lista_prod.pop(i)
        salvar_produtos()
        atualizar_tabela()
def limpar_estoque():
    if messagebox.askyesno("⚠️ Limpar Estoque", "Tem certeza que deseja apagar tudo?"):
        lista_prod.clear()
        salvar_produtos()
        atualizar_tabela()
 
# ---------- Botões ----------
frm_btns = ttk.Frame(frame_estoque)
frm_btns.pack(pady=10)
ttk.Button(frm_btns, text="➕ Adicionar", command=adicionar).grid(row=0, column=0, padx=10)
ttk.Button(frm_btns, text="✏️ Editar", command=editar).grid(row=0, column=1, padx=10)
ttk.Button(frm_btns, text="🗑️ Remover", command=remover).grid(row=0, column=2, padx=10)
ttk.Button(frm_btns, text="🧹 Limpar Estoque", command=limpar_estoque).grid(row=0, column=3, padx=10)
 
# ---------- Página de Gráficos ----------
frame_graficos = ttk.Frame(container)
 
def exibir_graficos():
    for widget in frame_graficos.winfo_children():
        widget.destroy()
 
    ttk.Label(frame_graficos, text="📊 Gráficos do Estoque", font=("Segoe UI", 18, "bold"), foreground="#003366").pack(pady=10)
 
    if not lista_prod:
        ttk.Label(frame_graficos, text="Nenhum produto para exibir.").pack(pady=20)
        return
 
    nomes = [p["nome"] for p in lista_prod]
    qtds = [int(p["quantidade"]) for p in lista_prod]
    valores = [float(p["preco"]) * int(p["quantidade"]) for p in lista_prod]
 
    fig, axs = plt.subplots(1, 2, figsize=(9, 4))
    fig.patch.set_facecolor('#f5f5f5')
 
    axs[0].bar(nomes, qtds, color="#356aff")
    axs[0].set_title("Quantidade por Produto")
    axs[0].tick_params(axis='x', rotation=45)
 
    axs[1].barh(nomes, valores, color="#2e8b57")
    axs[1].set_title("Valor Total por Produto")
 
    plt.tight_layout()
 
    canvas = FigureCanvasTkAgg(fig, master=frame_graficos)
    canvas.draw()
    canvas.get_tk_widget().pack(expand=True, fill="both")
 
# ---------- Navegação ----------
def mostrar_estoque():
    frame_graficos.pack_forget()
    frame_estoque.pack(expand=True, fill="both")
    atualizar_tabela()
 
def mostrar_graficos():
    frame_estoque.pack_forget()
    frame_graficos.pack(expand=True, fill="both")
    exibir_graficos()
 
btn_estoque.config(command=mostrar_estoque)
btn_graficos.config(command=mostrar_graficos)
 
# ---------- Inicialização ----------
mostrar_estoque()
atualizar_tabela()
root.mainloop()
