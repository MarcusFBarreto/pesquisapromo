import argparse
import json
import os
import shutil
from dataclasses import dataclass
from datetime import datetime
from pathlib import Path
from typing import Iterable

IGNORAR_PASTAS = {"node_modules", ".git", ".next", "dist", "build", ".turbo"}
CHAVES_RESUMO = ("export", "const", "function", "interface", "return (", "<button")
ACOES_SUPORTADAS = {"EDIT", "SCAN", "CREATE", "NEW"}


@dataclass
class Resultado:
    arquivos_alvo: int = 0
    aplicadas: int = 0
    ja_atualizado: int = 0
    nao_encontrado: int = 0
    ambiguidade: int = 0
    erros: int = 0
    criados: int = 0

    def as_dict(self) -> dict[str, int]:
        return {
            "arquivos_alvo": self.arquivos_alvo,
            "aplicadas": self.aplicadas,
            "ja_atualizado": self.ja_atualizado,
            "nao_encontrado": self.nao_encontrado,
            "ambiguidade": self.ambiguidade,
            "erros": self.erros,
            "criados": self.criados,
        }


def _norm_rel(path_str: str) -> str:
    return os.path.normpath(path_str.strip().lstrip("/"))


def _is_relative_to(path: Path, base: Path) -> bool:
    try:
        path.relative_to(base)
        return True
    except ValueError:
        return False


def _resolver_dentro_da_raiz(caminho: str, raiz: Path) -> Path:
    """Resolve caminho e bloqueia qualquer escape fora da raiz."""
    raiz = raiz.resolve()
    candidato = (raiz / caminho).resolve()
    if not _is_relative_to(candidato, raiz):
        raise ValueError(f"Caminho fora da raiz do projeto: {caminho}")
    return candidato


def _iter_arquivos(raiz: Path) -> Iterable[Path]:
    for atual, pastas, arquivos in os.walk(raiz):
        pastas[:] = [p for p in pastas if p not in IGNORAR_PASTAS]
        for arquivo in arquivos:
            yield Path(atual) / arquivo


def encontrar_arquivos_seguro(caminho_exigido: str, diretorio_raiz: str = ".") -> list[Path]:
    """Prioriza match exato e, em seguida, match por sufixo relativo."""
    alvo_rel = Path(_norm_rel(caminho_exigido))
    raiz = Path(diretorio_raiz).resolve()

    exato = _resolver_dentro_da_raiz(str(alvo_rel), raiz)
    if exato.is_file():
        return [exato]

    candidatos: list[Path] = []
    alvo_partes = alvo_rel.parts
    for caminho in _iter_arquivos(raiz):
        relativo = caminho.resolve().relative_to(raiz)
        if len(relativo.parts) >= len(alvo_partes) and relativo.parts[-len(alvo_partes) :] == alvo_partes:
            candidatos.append(caminho)
    return candidatos


def _parse_blocos(caminho_diff: Path) -> list[tuple[str, str]]:
    linhas = caminho_diff.read_text(encoding="utf-8").splitlines(keepends=True)

    blocos: list[tuple[str, str]] = []
    cabecalho_atual: str | None = None
    conteudo_atual: list[str] = []
    for linha in linhas:
        if linha.strip().startswith("//"):
            if cabecalho_atual is not None:
                blocos.append((cabecalho_atual, "".join(conteudo_atual)))
            cabecalho_atual = linha.strip()
            conteudo_atual = []
        else:
            conteudo_atual.append(linha)
    if cabecalho_atual is not None:
        blocos.append((cabecalho_atual, "".join(conteudo_atual)))
    return blocos


def _parse_substituicoes(diff_texto: str) -> list[tuple[str, str]]:
    blocos: list[tuple[str, str]] = []
    antigo_linhas: list[str] = []
    novo_linhas: list[str] = []
    for linha in diff_texto.splitlines():
        if linha.startswith("- "):
            antigo_linhas.append(linha[2:])
        elif linha.startswith("+ "):
            novo_linhas.append(linha[2:])
        elif not linha.strip():
            if antigo_linhas or novo_linhas:
                blocos.append(("\n".join(antigo_linhas), "\n".join(novo_linhas)))
                antigo_linhas, novo_linhas = [], []

    if antigo_linhas or novo_linhas:
        blocos.append(("\n".join(antigo_linhas), "\n".join(novo_linhas)))
    return blocos


def _escrever_atomicamente(alvo: Path, conteudo: str) -> None:
    tmp = alvo.with_suffix(alvo.suffix + ".tmp")
    tmp.write_text(conteudo, encoding="utf-8")
    tmp.replace(alvo)


def _gerar_backup(caminho_arquivo: Path, backup_root: Path, raiz: Path) -> Path:
    relativo = caminho_arquivo.resolve().relative_to(raiz.resolve())
    destino = backup_root / relativo
    destino.parent.mkdir(parents=True, exist_ok=True)
    shutil.copy2(caminho_arquivo, destino)
    return destino


def _mapa_projeto(raiz: Path) -> str:
    mapa = ["\n--- MAPA DO PROJETO ---"]
    for atual, pastas, arquivos in os.walk(raiz):
        pastas[:] = [p for p in pastas if p not in IGNORAR_PASTAS]
        nivel = len(Path(atual).relative_to(raiz).parts)
        indent = " " * 4 * nivel
        pasta_nome = Path(atual).name or "."
        mapa.append(f"{indent}📂 {pasta_nome}/")
        for nome_arquivo in arquivos:
            if nome_arquivo.endswith((".ts", ".tsx", ".py", ".css", ".md", ".json")):
                mapa.append(f"{indent}    📄 {nome_arquivo}")
    return "\n".join(mapa) + "\n"


def _extrair_acao_caminho(cabecalho: str) -> tuple[str, str]:
    bruto = cabecalho.replace("//", "", 1).strip()
    if ":" not in bruto:
        return "EDIT", bruto
    possivel_acao, possivel_caminho = bruto.split(":", 1)
    acao = possivel_acao.strip().upper()
    if acao in ACOES_SUPORTADAS:
        return acao, possivel_caminho.strip()
    return "EDIT", bruto


def _escrever_contexto_scan(candidatos: list[Path], caminho: str, raiz: Path) -> str:
    resumo_scan = _mapa_projeto(raiz)
    if len(candidatos) == 1:
        conteudo = candidatos[0].read_text(encoding="utf-8")
        resumo_scan += f"\n--- CONTEÚDO: {caminho} ---\n"
        resumo_scan += "\n".join(
            linha for linha in conteudo.splitlines() if any(chave in linha for chave in CHAVES_RESUMO)
        )
    elif len(candidatos) > 1:
        resumo_scan += f"\n⚠️ Ambíguo: {len(candidatos)} arquivos batem com '{caminho}'.\n"
        for cand in candidatos:
            resumo_scan += f" - {cand.relative_to(raiz)}\n"
    else:
        resumo_scan += f"\n⚠️ Arquivo '{caminho}' não encontrado para scan detalhado.\n"
    return resumo_scan


def _aplicar_substituicoes(codigo: str, substituicoes: list[tuple[str, str]], resumo: Resultado) -> tuple[str, bool]:
    alterou_arquivo = False
    for idx, (antigo, novo) in enumerate(substituicoes, start=1):
        if not antigo.strip():
            print(f"   ⚠️ Bloco {idx}: trecho antigo vazio, ignorado.")
            resumo.nao_encontrado += 1
            continue

        ocorrencias = codigo.count(antigo)
        if ocorrencias > 1:
            print(f"   ❌ Bloco {idx}: ambiguidade ({ocorrencias} ocorrências).")
            resumo.ambiguidade += 1
            continue

        if antigo in codigo:
            codigo = codigo.replace(antigo, novo, 1)
            alterou_arquivo = True
            resumo.aplicadas += 1
            print(f"   ✅ Bloco {idx}: alteração aplicada.")
            continue

        if novo and novo in codigo:
            resumo.ja_atualizado += 1
            print(f"   ✨ Bloco {idx}: já atualizado.")
            continue

        resumo.nao_encontrado += 1
        print(f"   ⚠️ Bloco {idx}: trecho antigo não encontrado.")

    return codigo, alterou_arquivo


def aplicar_diff_direto(
    caminho_diff: str,
    raiz_projeto: str = ".",
    dry_run: bool = False,
    strict: bool = False,
    backup: bool = True,
    contexto_file: str = "contexto_ia.txt",
    json_log: bool = False,
) -> int:
    raiz = Path(raiz_projeto).resolve()
    caminho_diff_path = _resolver_dentro_da_raiz(caminho_diff, raiz)

    if not caminho_diff_path.exists():
        print(f"❌ Erro: O arquivo '{caminho_diff_path}' não foi encontrado.")
        return 2

    blocos = _parse_blocos(caminho_diff_path)
    if not blocos:
        print("⚠️ Nenhum bloco encontrado no diff. Use cabeçalhos no formato '// caminho' ou '// AÇÃO: caminho'.")
        return 1

    resultado = Resultado(arquivos_alvo=len(blocos))
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    backup_root = raiz / ".mydif_backups" / timestamp
    backups_gerados: set[Path] = set()

    print(f"🚀 Iniciando automação em {len(blocos)} alvo(s)... {'[DRY-RUN]' if dry_run else ''}\n")

    for cabecalho, diff_texto in blocos:
        try:
            acao, caminho = _extrair_acao_caminho(cabecalho)

            if acao == "SCAN":
                print(f"👁️ SCAN: {caminho}")
                candidatos = encontrar_arquivos_seguro(caminho, str(raiz))
                resumo_scan = _escrever_contexto_scan(candidatos, caminho, raiz)
                if not dry_run:
                    contexto_path = _resolver_dentro_da_raiz(contexto_file, raiz)
                    _escrever_atomicamente(contexto_path, resumo_scan)
                print("   ✅ Mapa e Resumo preparados para contexto_ia.txt.\n")
                continue

            if acao in {"CREATE", "NEW"}:
                print(f"✨ CREATE: {caminho}")
                caminho_abs = _resolver_dentro_da_raiz(caminho, raiz)
                conteudo_novo = "\n".join(
                    linha[2:] if linha.startswith("+ ") else linha
                    for linha in diff_texto.splitlines()
                    if linha.startswith("+ ") or not linha.startswith("- ")
                ).strip()
                caminho_abs.parent.mkdir(parents=True, exist_ok=True)
                if caminho_abs.exists():
                    print("   ⚠️ Arquivo já existe. Use EDIT para alterar.")
                    resultado.erros += 1
                    continue
                if not dry_run:
                    _escrever_atomicamente(caminho_abs, conteudo_novo + "\n")
                print("   ✅ Criado com sucesso.\n")
                resultado.criados += 1
                continue

            print(f"⚙️ EDIT: {caminho}")
            candidatos = encontrar_arquivos_seguro(caminho, str(raiz))
            if len(candidatos) == 0:
                print("   ❌ Erro: Arquivo não localizado.")
                resultado.erros += 1
                continue
            if len(candidatos) > 1:
                print(f"   ❌ Erro: Ambiguidade de caminho ({len(candidatos)} candidatos).")
                for cand in candidatos:
                    print(f"      - {cand.relative_to(raiz)}")
                resultado.ambiguidade += 1
                continue

            alvo = candidatos[0]
            codigo = alvo.read_text(encoding="utf-8")
            substituicoes = _parse_substituicoes(diff_texto)
            if not substituicoes:
                print("   ⚠️ Nenhum bloco de substituição detectado.")
                resultado.erros += 1
                continue

            codigo, alterou_arquivo = _aplicar_substituicoes(codigo, substituicoes, resultado)

            if alterou_arquivo and not dry_run:
                if backup and alvo not in backups_gerados:
                    backup_destino = _gerar_backup(alvo, backup_root, raiz)
                    backups_gerados.add(alvo)
                    print(f"   🧷 Backup salvo em: {backup_destino}")
                _escrever_atomicamente(alvo, codigo)

            print("")
        except ValueError as exc:
            print(f"   ❌ Erro de segurança: {exc}")
            resultado.erros += 1

    print("--- RESUMO ---")
    for chave, valor in resultado.as_dict().items():
        print(f"{chave}: {valor}")
    if backup and backups_gerados and not dry_run:
        print(f"backups_dir: {backup_root}")
    if json_log:
        print("json_resumo:", json.dumps(resultado.as_dict(), ensure_ascii=False))

    houve_falha = resultado.erros > 0 or resultado.ambiguidade > 0
    return 1 if strict and houve_falha else 0


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Aplicador de diff textual por blocos //, com proteção de raiz para projetos Next.js."
    )
    parser.add_argument("diff_file", nargs="?", default="mudancas.txt", help="Arquivo de mudanças.")
    parser.add_argument("--root", default=".", help="Raiz do projeto onde o script pode atuar.")
    parser.add_argument("--dry-run", action="store_true", help="Simula sem escrever em arquivo.")
    parser.add_argument("--strict", action="store_true", help="Retorna erro se houver ambiguidade/erros.")
    parser.add_argument("--no-backup", action="store_true", help="Desativa backup antes de salvar alterações.")
    parser.add_argument("--context-file", default="contexto_ia.txt", help="Arquivo de saída para ação SCAN.")
    parser.add_argument("--json-log", action="store_true", help="Imprime resumo final em JSON.")
    args = parser.parse_args()

    return aplicar_diff_direto(
        caminho_diff=args.diff_file,
        raiz_projeto=args.root,
        dry_run=args.dry_run,
        strict=args.strict,
        backup=not args.no_backup,
        contexto_file=args.context_file,
        json_log=args.json_log,
    )


if __name__ == "__main__":
    raise SystemExit(main())
